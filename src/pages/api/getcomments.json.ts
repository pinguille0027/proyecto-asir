export const prerender = false;
import { PrismaClient } from "@prisma/client";
import type { APIRoute } from "astro";


interface Comment {
  id: number;
  created_at: Date;
  autor: string | null;
  contenido: string | null;
  id_post: string | null;
  id_ref: number | null;
}

type PopulatedComment = Comment & { respuestas: Array<PopulatedComment> }

function sortRespuestas(populatedComment: PopulatedComment): void {
  if (populatedComment.respuestas.length === 0) { return; }

  populatedComment.respuestas.forEach((respuesta) => {
    sortRespuestas(respuesta);
  });

  populatedComment.respuestas.sort((a, b) => Number(a.id) - Number(b.id));
}

function aggregateComments(comments: Array<Comment>): Array<PopulatedComment> {
  const hashSet = new Map<number, PopulatedComment>();

  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];

    hashSet.set(comment.id, {...comment, respuestas: []});
  }

  for (let i = 0; i < comments.length; i++) {
    const stepComment = comments[i];

    const hashItem = hashSet.get(stepComment.id);

    if (!hashItem) {
      throw new Error("Found incorrect");
    }

    if (hashItem.id_ref === null) {
      continue;
    }

    const parent = hashSet.get(hashItem.id_ref);
    if (!parent) {
      throw new Error("Found incorrect");
    }

    parent.respuestas.push(hashItem)
  }

  const rootComments = Array
    .from(hashSet, ([key, val]) => val)
    .filter((comment) => !comment.id_ref);

  rootComments.forEach((comment) => {
    sortRespuestas(comment);
  });

  return rootComments;
}


export const GET: APIRoute = async ({ request }) => {
  const prisma = new PrismaClient();
  const url = new URL(request.url);
  const queryParams = url.searchParams;
  const postParam = queryParams.get("post");
  try {
    const data = await prisma.comentarios.findMany({
      where: { id_post: postParam },
    });

    const comentariosAgrupados = aggregateComments(data);
    return new Response(JSON.stringify(comentariosAgrupados), {
      status: 200,
    });
  } catch (error) {
    if (error instanceof Error){
    return new Response(error?.message, { status: 500 });}
    return new Response("internal server guarra", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};