export const prerender = false;
import { getCollection } from 'astro:content';
import { supabase } from "../lib/supabase";
import type { APIRoute } from "astro";
export const GET: APIRoute = async({request, params, props}) => {
  const posts = await getCollection("proyecto");
  console.log(posts)
  const { data, error } = await supabase
  .from('comentarios')
  .select()
  .eq("id_post", `${params.slug}`)
  console.log(params.slug)
  if (error || !data) {
    return new Response(error.message, { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 200 });
};
