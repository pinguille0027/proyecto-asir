import { PrismaClient } from '@prisma/client';
import type { APIRoute } from "astro";
export const prerender = false;
export const POST: APIRoute = async ({ request }) => {
  const prisma = new PrismaClient();
  try {
    const data = await request.formData();
    const nombre = data.get("nombre");
    const email = data.get("email");
    const empresa = data.get("empresa");
    const descripcion = data.get("descripcion");
    let telefono = data.get("telefono");

    // Verifica si el teléfono es una cadena vacía y conviértelo en null
    if (!telefono) {
      telefono = null;
    }

    // Inserta la nueva cita en la base de datos utilizando Prisma
    const nuevaCita = await prisma.citas.create({
      data: {
        empresa: empresa as string,
        nombre: nombre as string,
        email: email as string,
        telefono: telefono ? parseInt(telefono as string) : null,
        descripcion: descripcion as string,
      },
    });

    console.log("Cita creada:", nuevaCita);

    // Retorna una respuesta con un mensaje de éxito
    return new Response(
      JSON.stringify({
        message: "¡Éxito!",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al crear la cita:", error);

    // Retorna una respuesta con un mensaje de error
    return new Response(
      JSON.stringify({
        error: "Ha ocurrido un error al procesar la solicitud.",
      }),
      { status: 500 }
    );
  }finally {
    await prisma.$disconnect();
  }
};
