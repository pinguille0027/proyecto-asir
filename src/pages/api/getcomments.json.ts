export const prerender = false;

import { supabase } from "../../lib/supabase";
import type { APIRoute } from "astro";
export const GET: APIRoute = async ({ request, params, props }) => {
  const url = new URL(request.url);

  // Obtener los parámetros de la query
  const queryParams = url.searchParams;

  // Obtener el valor del parámetro 'post'
  const postParam = queryParams.get('post');
  const { data, error } = await supabase
    .from("comentarios")
    .select(
      `
    id, created_at, perfiles ( nombre ), contenido, id_ref
    `
    )
    .eq("id_post", `${postParam}`);

  if (error || !data) {
    return new Response(error.message, { status: 500 });
  }

  const comentariosAgrupados: any = [];
  function agruparComentarios(comentarios: any[]) {
    comentarios.sort((a, b) => b.id - a.id);
    const respuestasProcesadas: any = [];
    comentarios.forEach((comentario) => {
      if (respuestasProcesadas.find((resp:any) => resp.id_ref === comentario.id)) {
        const respuestas = respuestasProcesadas.filter(
          (respuesta:any) => respuesta.id_ref === comentario.id
        );
        if (respuestas.length > 0) {
          if (!comentario.respuestas) {
            comentario.respuestas = [];
          }
          comentario.respuestas.push(respuestas);
          comentario.respuestas = comentario.respuestas.flat()
          if (comentario.id_ref){
            respuestasProcesadas.push(comentario)
          } else{
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
          comentario.respuestas = comentario.respuestas.flat()
          respuestasProcesadas.push(comentario);
        }
      }
    });
  }
  agruparComentarios(data);
  return new Response(JSON.stringify(comentariosAgrupados), {
    status: 200,
  });
  
};