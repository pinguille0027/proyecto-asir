export const prerender = false;
import { getCollection } from "astro:content";
import { supabase } from "../lib/supabase";
import type { APIRoute } from "astro";
export const GET: APIRoute = async ({ request, params, props }) => {
  const { data, error } = await supabase
    .from("comentarios")
    .select()
    .eq("id_post", `${params.slug}`);

  if (error || !data) {
    return new Response(error.message, { status: 500 });
  }

  const comentariosAgrupados:any = {};
  // Recorremos el array de comentarios para agruparlos
  data.forEach(comentario => {
    if (comentario.id_ref) {
      // Si el comentario tiene una referencia, lo agregamos como respuesta a su respectivo comentario padre
      const comentarioPadre = comentariosAgrupados[comentario.id_ref];
      if (comentarioPadre) {
        // Si encontramos el comentario padre, agregamos esta respuesta a su arreglo de respuestas
        if (!comentarioPadre.respuestas) {
          comentarioPadre.respuestas = [];
        }
        comentarioPadre.respuestas.push(comentario);
      } else {
        // Si no encontramos el comentario padre, creamos un objeto para él y lo agregamos a comentariosAgrupados
        comentariosAgrupados[comentario.id_ref] = { respuestas: [comentario] };
      }
    } else {
      // Si el comentario no tiene una referencia, lo agregamos directamente a comentariosAgrupados
      comentariosAgrupados[comentario.id] = comentario;
    }
  });
  
  const comentariosReestructurados = Object.values(comentariosAgrupados);
  
  console.log(comentariosReestructurados);

  return new Response(JSON.stringify(comentariosReestructurados), { status: 200 });
};
