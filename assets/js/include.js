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


// Funcion para estrellas

document.addEventListener('DOMContentLoaded', () => {
  const estrellas = document.querySelectorAll('.estrella');
  const inputValoracion = document.getElementById('valoracion');

  estrellas.forEach(estrella => {
    estrella.addEventListener('click', () => {
      const valor = parseInt(estrella.getAttribute('data-valor'));

      // Actualizar clases visuales
      estrellas.forEach(e => {
        const estrellaValor = parseInt(e.getAttribute('data-valor'));
        if (estrellaValor <= valor) {
          e.classList.add('seleccionada');
        } else {
          e.classList.remove('seleccionada');
        }
      });

      // Guardar el valor
      inputValoracion.value = valor;
    });
  });
});


// AUTOCOMPLETAR JSON DISTRITOS

document.addEventListener('DOMContentLoaded', () => {
  const inputDistrito = document.getElementById('input-distrito');
  const sugerencias = document.getElementById('sugerencias-distrito');
  let distritos = [];

  fetch('../assets/json/distritos_lima.json')
    .then(response => response.json())
    .then(data => distritos = data);

  inputDistrito.addEventListener('input', () => {
    const valor = inputDistrito.value.toLowerCase();
    sugerencias.innerHTML = '';

    if (valor.length > 0) {
      const filtrados = distritos.filter(d => d.toLowerCase().includes(valor));
      filtrados.forEach(d => {
        const li = document.createElement('li');
        li.textContent = d;
        li.addEventListener('click', () => {
          inputDistrito.value = d;
          sugerencias.innerHTML = '';
        });
        sugerencias.appendChild(li);
      });
    }
  });

  document.addEventListener('click', (e) => {
    if (!sugerencias.contains(e.target) && e.target !== inputDistrito) {
      sugerencias.innerHTML = '';
    }
  });
});



/*POP UP*/
document.addEventListener("DOMContentLoaded", () => {
      const form = document.getElementById("popup-recuperar-form");
      const popup = document.getElementById("popup-overlay");
      const message = document.getElementById("popup-message");
      const contador = document.getElementById("popup-contador");
      const tiempoSpan = document.getElementById("popup-tiempo");
      const reenviar = document.getElementById("popup-reenviar");
      const codigoInput = document.getElementById("popup-codigo-input");
      const correoInput = document.getElementById("popup-correo");
      const errorCorreo = document.getElementById("popup-error-correo");

      correoInput.addEventListener("input", () => {
        errorCorreo.textContent = "";
      });
      
      let segundos = 30;
      let intervalo;

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const correo = correoInput.value;

        const response = await fetch("../../controller/RecuperarContrasenaController.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ correo })
        });

        const result = await response.json();

        if (result.status === "success") {
          errorCorreo.textContent = ""; 
          message.innerHTML = "Te hemos enviado un código de verificación a tu correo.<br>Ingresa el código a continuación:";
          popup.style.display = "flex";
          iniciarContador();
        } else {
          errorCorreo.textContent = result.message;
        }
      });

      function iniciarContador() {
        segundos = 30;
        tiempoSpan.textContent = segundos;
        contador.style.display = "block";
        reenviar.style.display = "none";

        intervalo = setInterval(() => {
          segundos--;
          tiempoSpan.textContent = segundos;

          if (segundos <= 0) {
            clearInterval(intervalo);
            contador.style.display = "none";
            reenviar.style.display = "block";
          }
        }, 1000);
      }

      window.reenviarCodigo = async () => {
        const correo = correoInput.value;
        await fetch("../../controller/RecuperarContrasenaController.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ correo })
        });
        iniciarContador();
      };

      window.cerrarPopup = () => {
        popup.style.display = "none";
        clearInterval(intervalo);
      };

      window.validarCodigo = () => {
        const codigo = codigoInput.value.trim().toUpperCase();
        if (codigo.length === 5) {
          
          sessionStorage.setItem("token", codigo);
          window.location.href = "cambioContrasena.html";

        } else {
          alert("El código debe tener 5 caracteres.");
        }
      };


      
    });


/* INICIO DE SESION */

document.addEventListener("DOMContentLoaded", () => {
  const headerPlaceholder = document.getElementById("header-placeholder");

  // 🔵 Cargar dinámicamente el header y personalizarlo
  if (headerPlaceholder) {
    fetch("../components/header.html")
      .then((response) => response.text())
      .then((html) => {
        headerPlaceholder.innerHTML = html;

        // Esperar a que el HTML inyectado esté cargado
        setTimeout(() => {
          const nombre = localStorage.getItem("nombre_usuario");
          const userSection = document.getElementById("user-section");

          if (userSection) {
            if (nombre) {
              userSection.innerHTML = `
                <div class="hf-user-dropdown">
                  <span class="hf-user-name">Hola, ${nombre} ▾</span>
                  <div class="hf-user-dropdown-content">
                    <a href="../view/perfil_usuario.html">Perfil</a>
                    <a href="#" id="cerrar-sesion" class="text-danger">Cerrar sesión</a>
                  </div>
                </div>
              `;

              // Botón "Cerrar sesión"
              const cerrarSesionBtn = document.getElementById("cerrar-sesion");
              if (cerrarSesionBtn) {
                cerrarSesionBtn.addEventListener("click", (e) => {
                  e.preventDefault();
                  localStorage.removeItem("nombre_usuario");
                  window.location.href = "../view/login.html";
                });
              }
            } else {
              userSection.innerHTML = `
                <a href="../view/login.html" class="hf-btn-login-unico">Iniciar sesión</a>
              `;
            }
          }
        }, 100);
      });
  }

  // 🟡 Lógica exclusiva para login.html
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const correo = document.getElementById("correo").value;
      const contrasena = document.getElementById("contrasena").value;
      const loginError = document.getElementById("login-error");

      try {
        const respuesta = await fetch("../../controller/LoginController.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ correo, contrasena }),
        });

        const result = await respuesta.json();

        if (result.success) {
          localStorage.setItem("nombre_usuario", result.nombre);
          localStorage.setItem("id_usuario", result.id);

          // ✅ Mostrar el popup de bienvenida
          const popup = document.getElementById("popup-login");
          const saludoNombre = document.getElementById("nombre-usuario-popup");

          if (popup && saludoNombre) {
            saludoNombre.innerHTML = `¡Hola <strong>${result.nombre}</strong>! Qué gusto tenerte aquí.`;
            popup.style.display = "flex";
          } else {
            window.location.href = "../index.html";
          }
        } else {
          loginError.textContent = result.error;
        }
      } catch (err) {
        loginError.textContent = "Error de conexión con el servidor.";
      }
    });

    // Ocultar error al escribir
    ["correo", "contrasena"].forEach((id) => {
      const input = document.getElementById(id);
      input.addEventListener("input", () => {
        const loginError = document.getElementById("login-error");
        if (loginError) loginError.textContent = "";
      });
    });

    // ✅ Botón del popup: "Ir al inicio"
    const botonInicio = document.getElementById("ir-al-inicio");
    if (botonInicio) {
      botonInicio.addEventListener("click", () => {
        window.location.href = "../index.html";
      });
    }
  }
});



  document.addEventListener("DOMContentLoaded", () => {
    // Limpia todos los inputs al cargar la página
    const formulario = document.querySelector("form");
    if (formulario) formulario.reset();

  });








