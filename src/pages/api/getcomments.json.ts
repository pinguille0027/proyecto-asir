export const prerender = false;
import { PrismaClient } from "@prisma/client";
import type { APIRoute } from "astro";

function agruparComentarios(comentarios: any[]) {
  const comentariosAgrupados: any[] = [];
  comentarios.sort((a, b) => b.id - a.id);
  const respuestasProcesadas: any[] = [];

  comentarios.forEach((comentario) => {
    if (
      respuestasProcesadas.find(
        (resp: any) => resp.id_ref === comentario.id
      )
    ) {
      const respuestas = respuestasProcesadas.filter(
        (respuesta: any) => respuesta.id_ref === comentario.id
      );
      if (respuestas.length > 0) {
        if (!comentario.respuestas) {
          comentario.respuestas = [];
        }
        comentario.respuestas.push(respuestas);
        comentario.respuestas = comentario.respuestas.flat();
        if (comentario.id_ref) {
          respuestasProcesadas.push(comentario);
        } else {
          comentariosAgrupados.push(comentario);
        }
      }
    } else {
      const respuestas = comentarios.filter(
        (respuesta) => respuesta.id_ref === comentario.id
      );
      if (respuestas.length > 0) {
        if (!comentario.respuestas) {
          comentario.respuestas = [];
        }
        comentario.respuestas.push(respuestas);
        comentario.respuestas = comentario.respuestas.flat();
        respuestasProcesadas.push(comentario);
      }
    }
  });

  return comentariosAgrupados;
}

export const GET: APIRoute = async ({ request }) => {
  const prisma = new PrismaClient();
  console.log(prisma)
  const url = new URL(request.url);
  const queryParams = url.searchParams;
  const postParam = queryParams.get("post");

  try {
    const data = await prisma.comentarios.findMany({
      where: { id_post: postParam },
    });
    const comentariosAgrupados = agruparComentarios(data);
    console.log(comentariosAgrupados)
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