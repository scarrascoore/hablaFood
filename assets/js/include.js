document.addEventListener("DOMContentLoaded", () => {
  fetch("../components/header.html")
    .then((res) => res.text())
    .then(
      (data) => (document.getElementById("header-placeholder").innerHTML = data)
    );

  fetch("../components/footer.html")
    .then((res) => res.text())
    .then(
      (data) => (document.getElementById("footer-placeholder").innerHTML = data)
    );



  });

//
document.addEventListener("DOMContentLoaded", () => {
  // Activar campos de contraseña solo si los campos anteriores están completos
  const nombres = document.getElementById("nombres");
  const apellidos = document.getElementById("apellidos");
  const correo = document.getElementById("correo");
  const contrasena = document.getElementById("contrasena");
  const repetirContrasena = document.getElementById("repetir-contrasena");

  [nombres, apellidos, correo].forEach((input) => {
    input.addEventListener("input", () => {
      if (nombres.value && apellidos.value && correo.value) {
        contrasena.removeAttribute("disabled");
        repetirContrasena.removeAttribute("disabled");
      } else {
        contrasena.setAttribute("disabled", true);
        repetirContrasena.setAttribute("disabled", true);
      }
    });
  });


//
document.addEventListener("DOMContentLoaded", () => {
  const saludo = document.getElementById("saludo-usuario");
  const nombre = sessionStorage.getItem("nombreUsuario");

  if (saludo && nombre) {
    saludo.textContent = `Hola, ${decodeURIComponent(nombre)}`;
  }
});

//

  // Mostrar/ocultar contraseña
  document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      const icon = btn.querySelector("i");

      if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("bi-eye");
        icon.classList.add("bi-eye-slash");
      } else {
        input.type = "password";
        icon.classList.remove("bi-eye-slash");
        icon.classList.add("bi-eye");
      }
    });
  });
});


//Ayuda a que se autocompleten los datos de Google Gmail
document.addEventListener("DOMContentLoaded", () => {
  const nombre = sessionStorage.getItem("nombre");
  const apellido = sessionStorage.getItem("apellido");
  const correo = sessionStorage.getItem("correo");

  if (nombre && apellido && correo) {
    document.getElementById("nombres").value = nombre;
    document.getElementById("apellidos").value = apellido;
    document.getElementById("correo").value = correo;

    // Activar campos de contraseña automáticamente
    document.getElementById("contrasena").removeAttribute("disabled");
    document.getElementById("repetir-contrasena").removeAttribute("disabled");
  }
});


//ESTO ES PARA EL BOTON GOOGLE
function handleCredentialResponse(response) {
  const data = parseJwt(response.credential);

  const fullName = data.name || "";
  const email = data.email || "";
  const [firstName, ...lastName] = fullName.split(" ");

  // Guardar en localStorage o sessionStorage para usar en registro_correo.html
  sessionStorage.setItem("nombre", firstName);
  sessionStorage.setItem("apellido", lastName.join(" "));
  sessionStorage.setItem("correo", email);

  // Redireccionar a registro_correo.html
  window.location.href = "registro_correo.html";
}


// Función para decodificar el token JWT
function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
}
