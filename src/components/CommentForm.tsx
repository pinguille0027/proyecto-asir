import { useState } from "react";
import type { FormEvent } from "react";

export default function CommentForm() {
  const [responseMessage, setResponseMessage] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const response = await fetch("/api/contacto", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    console.log(data)
    if (data.message) {
      setResponseMessage(data.message);
    }
  }

  return (
    <form onSubmit={submit}>
      <section>
      <h2>Cuentanos quien eres</h2>
      <label htmlFor="nombre">Tu nombre:</label>
      <input id="nombre" type="text" name="nombre" required/>
    </section>
    <section>
      <h2>Háblanos de tu proyecto</h2>
      <label htmlFor="descripcion"
        >cuéntanos a grandes rasgos como es tu stack, cual es tu situación
        actual, cuales son tus necesidades...
      </label>
      <textarea name="descripcion" id="descripcion" required
      ></textarea>
    </section>
    <section>
      <h2>¿Cómo nos podemos poner en contacto contigo?</h2>
      <label htmlFor="email">email</label>
      <input type="email" name="email" id="email" required/>
      <label htmlFor="telefono">teléfono</label>
      <input
        type="text"
        pattern="[0-9]{9}"
        id="telefono"
        name="telefono"
      />
    </section>
      <button>Enviar</button>
      {responseMessage && <p>{responseMessage}</p>}
    </form>
  );
}