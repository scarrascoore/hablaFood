document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const localId = urlParams.get("id");

  if (!localId) {
    alert("No se encontró el ID del local.");
    return;
  }

  // Obtener datos del local
  try {
    const res = await fetch(`../../controller/detalleLocalController.php?id=${localId}`);
    const data = await res.json();

    document.getElementById("imagen-local").src = `http://localhost/hablafood/${data.imagen_path}`;
    document.getElementById("nombre-local").textContent = data.nombre_local;
    document.getElementById("valoracion-promedio").textContent = `★ ${data.valoracion.toFixed(1)}`;

    // Mostrar mapa
    const map = L.map("map").setView([data.latitud, data.longitud], 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    L.marker([data.latitud, data.longitud]).addTo(map).bindPopup(data.nombre_local).openPopup();

  } catch (err) {
    console.error("Error al cargar datos del local:", err);
  }

  // Mostrar caja de comentario al hacer clic
  document.getElementById("comentario-link").addEventListener("click", () => {
    document.getElementById("comentario-box").style.display = "block";
  });

  // Guardar comentario
  const textarea = document.querySelector("#comentario-box textarea");
  textarea.addEventListener("keydown", async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      const comentario = textarea.value.trim();
      if (comentario === "") return;

      const usuarioId = localStorage.getItem("usuario_id");
      if (!usuarioId) {
        alert("Debes iniciar sesión para comentar.");
        window.location.href = "login.html";
        return;
      }

      try {
        const res = await fetch("../../controller/guardarComentario.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ local_id: localId, usuario_id: usuarioId, comentario }),
        });

        const result = await res.json();
        if (result.success) {
          alert("¡Comentario enviado!");
          textarea.value = "";
          document.getElementById("comentario-box").style.display = "none";
        } else {
          alert(result.error || "Hubo un problema al guardar el comentario.");
        }
      } catch (err) {
        console.error("Error al enviar comentario:", err);
      }
    }
  });
});
