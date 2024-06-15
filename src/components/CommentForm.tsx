import { useState } from "react";
import type { FormEvent } from "react";

export default function CommentForm(slug:any) {
  console.log(slug)
  const [responseMessage, setResponseMessage] = useState("Enviar");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResponseMessage("Enviando")
    const formData = new FormData(e.target as HTMLFormElement);
    const response = await fetch(`/api/postcomment?post=${slug.slug}&ref=${slug.id ? slug.id : "null"}`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (data.message) {
      setResponseMessage(data.message);
    }
    window.location.reload()
  }

  return (
    <form onSubmit={submit}>
      <h4>Deja tu {slug.id ?  "respuesta":"comentario"}</h4>
      <label htmlFor="nombre">Tu nombre:</label>
      <input id="nombre" type="text" name="nombre" required/>
      <label htmlFor="comentario"
        >comentario:
      </label>
      <textarea name="comentario" id="comentario" required
      ></textarea>
      <button>{responseMessage}</button>
    </form>
  );
}