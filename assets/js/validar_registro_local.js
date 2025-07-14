document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form-local");
  const valoracionInput = document.getElementById("valoracion");

  // Estrellas interactivas
  const estrellas = document.querySelectorAll(".estrella");
  estrellas.forEach(estrella => {
    estrella.addEventListener("click", () => {
      const valor = estrella.getAttribute("data-valor");
      valoracionInput.value = valor;

      estrellas.forEach(e => {
        e.style.color = e.getAttribute("data-valor") <= valor ? "gold" : "#ccc";
      });
    });
  }
);

  function contieneInyeccionSQL(texto) {
  const patronesPeligrosos = [
    /(\b(SELECT|INSERT|DELETE|UPDATE|DROP|UNION|OR|AND)\b)/i,  // Palabras clave
    /['";=]/g,        // Caracteres comunes en inyecciones
    /--|\/\*/g        // Comentarios SQL
  ];
  return patronesPeligrosos.some(p => p.test(texto));
}



  // Validación del formulario
  form.addEventListener("submit", (e) => {
    const errores = [];

    const nombre = form.nombre_local.value.trim();
    const direccion = form.direccion.value.trim();
    const distrito = form.distrito.value.trim();
    const referencia = form.referencia.value.trim();
    const precioSeleccionado = form.querySelector("input[name='precio']:checked");
    const imagenInput = form.imagen_local;
    const valoracion = parseInt(valoracionInput.value);
    const resena = form.resena.value.trim();
    const latitud = form.latitud.value;
    const longitud = form.longitud.value;

    if (nombre === "") errores.push("El nombre del local es obligatorio.");
    if (direccion === "") errores.push("La dirección es obligatoria.");
    if (distrito === "") errores.push("El distrito es obligatorio.");
    if (referencia === "") errores.push("La referencia es obligatoria.");
    if (!precioSeleccionado) errores.push("Debes seleccionar un rango de precios.");
    if (!imagenInput.files || imagenInput.files.length === 0) errores.push("Debes subir una imagen.");
    if (isNaN(valoracion) || valoracion < 1 || valoracion > 5) errores.push("Debes seleccionar una calificación entre 1 y 5 estrellas.");
    if (resena === "") errores.push("La reseña no puede estar vacía.");
    if (resena.length > 300) errores.push("La reseña no puede superar los 300 caracteres.");
    if (!latitud || !longitud) errores.push("No se detectó la ubicación del local.");

    if (contieneInyeccionSQL(nombre)) errores.push("Nombre contiene caracteres o palabras no permitidas.");
    if (contieneInyeccionSQL(direccion)) errores.push("Dirección contiene caracteres o palabras no permitidas.");
    if (contieneInyeccionSQL(referencia)) errores.push("Referencia contiene caracteres o palabras no permitidas.");
    if (contieneInyeccionSQL(resena)) errores.push("Reseña contiene caracteres o palabras no permitidas.");







    if (errores.length > 0) {
      e.preventDefault();
      alert("Corrige los siguientes errores:\n\n" + errores.join("\n"));
    }
  });
});
