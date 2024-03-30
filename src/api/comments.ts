export const prerender = false;

import { supabase } from "../lib/supabase";
import type { APIRoute } from "astro";
export const GET: APIRoute = async({request, params, props}) => {
  const { data, error } = await supabase
  .from('comentarios')
  .select()
  .eq("id_post", `${params.slug}`)
  console.log(params.slug)
  console.log(data)
  if (error || !data) {
    return new Response(error.message, { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 200 });
};
