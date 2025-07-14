document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("id_usuario");

  if (!userId) {
    alert("Debes iniciar sesión primero.");
    window.location.href = "login.html";
    return;
  }

  fetch(`../controller/obtenerUsuario.php?id=${userId}`)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        document.getElementById("nombres").value = data.usuario.nombres;
        document.getElementById("apellidos").value = data.usuario.apellidos;
        document.getElementById("correo").value = data.usuario.correo;
        document.getElementById("celular").value = data.usuario.celular;
      } else {
        alert(data.message);
      }
    });

  document.getElementById("form-perfil").addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      id: userId,
      nombres: document.getElementById("nombres").value,
      apellidos: document.getElementById("apellidos").value,
      correo: document.getElementById("correo").value,
      celular: document.getElementById("celular").value,
    };

    try {
      const res = await fetch("../controller/actualizarUsuario.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await res.json();

      if (result.success) {
          const popup = document.getElementById("popup-exito");
          const resumen = document.getElementById("resumen-datos");
          resumen.innerHTML = `
          <strong>Nombre:</strong> ${payload.nombres}<br>
          <strong>Apellidos:</strong> ${payload.apellidos}<br>
          <strong>Correo:</strong> ${payload.correo}<br>
          <strong>Celular:</strong> ${payload.celular}
        `;
        popup.style.display = "flex";
        // Botón para redirigir a inicio
        document.getElementById("btn-ir-inicio").addEventListener("click", () => {
        window.location.href = "toplocales.html";
        });

      } else {
        alert("Error al actualizar: " + result.message);
      }
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al actualizar.");
    }
  });
});

