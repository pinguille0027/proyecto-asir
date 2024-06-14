import { supabase } from "../../lib/supabase";
import type { APIRoute } from "astro";
export const prerender = false;
export const POST: APIRoute = async ({ request }) => {
    const data = await request.formData();
    const nombre = data.get("nombre");
    console.log(nombre)
    const email = data.get("email");
    const empresa = data.get("empresa");
    const descripcion = data.get("descripcion");
    let telefono = data.get("telefono");
    if (telefono === ""){
      telefono= null
    }
    const { error } = await supabase
      .from("citas")
      .insert({
        empresa: empresa,
        nombre: nombre,
        email: email,
        telefono: telefono,
        descripcion: descripcion,
      });
    console.log(error)
    console.log(data);
  return new Response(
    JSON.stringify({
      message: "¡Éxito!"
    }),
    { status: 200 }
  );
}