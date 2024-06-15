import { PrismaClient } from '@prisma/client';
import type { APIRoute } from "astro";
export const prerender = false;
export const POST: APIRoute = async ({ request }) => {
  const prisma = new PrismaClient();
  
  try {
    const url = new URL(request.url);
    const queryParams = url.searchParams;
    const postParam = queryParams.get("post");
    const refParam = queryParams.get("ref");
    const data = await request.formData();
    const nombre = data.get("nombre");
    const contenido = data.get("comentario");

    // Inserta la nueva cita en la base de datos utilizando Prisma
    const newComment = await prisma.comentarios.create({
      data: {
        autor: nombre as string,
        contenido: contenido as string,
        id_post: postParam as string,
        id_ref: refParam ? parseInt(refParam as string) : null,
      },
    });

    console.log("Cita creada:", newComment);

    // Retorna una respuesta con un mensaje de éxito
    return new Response(
      JSON.stringify({
        message: "¡Éxito!",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error", error);

    // Retorna una respuesta con un mensaje de error
    return new Response(
      JSON.stringify({
        error: "Ha ocurrido un error al procesar la solicitud.",
        message: "error"
      }),
      { status: 500 }
    );
  }finally {
    await prisma.$disconnect();
  }
};
