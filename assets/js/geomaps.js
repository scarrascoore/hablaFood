document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form-local");
  const inputDireccion = document.querySelector("input[name='direccion']");
  const inputDistrito = document.querySelector("input[name='distrito']");
  const sugerencias = document.getElementById("sugerencias-direccion");
  const latInput = document.getElementById("latitud");
  const lngInput = document.getElementById("longitud");

  // 1. Intentar obtener geolocalización del navegador (opcional)
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        latInput.value = position.coords.latitude;
        lngInput.value = position.coords.longitude;
      },
      error => {
        console.warn("No se pudo obtener la ubicación del navegador:", error.message);
      }
    );
  }

  // 2. Autocompletado al escribir en la dirección
  inputDireccion.addEventListener("input", async () => {
    const direccion = inputDireccion.value.trim();
    const distrito = inputDistrito.value.trim();
    if (direccion.length < 3) {
      sugerencias.innerHTML = "";
      return;
    }

    try {
      const consulta = `${direccion}, ${distrito}, Lima, Perú`;
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(consulta)}&limit=5`);
      const data = await res.json();

      sugerencias.innerHTML = "";
      data.forEach(lugar => {
        const li = document.createElement("li");
        li.textContent = lugar.display_name;
        li.addEventListener("click", () => {
          inputDireccion.value = lugar.display_name;
          sugerencias.innerHTML = "";
          latInput.value = lugar.lat;
          lngInput.value = lugar.lon;
        });
        sugerencias.appendChild(li);
      });
    } catch (error) {
      console.error("Error en el autocompletado de dirección:", error);
    }
  });

  // Ocultar sugerencias si el usuario hace clic fuera
  document.addEventListener("click", (e) => {
    if (!sugerencias.contains(e.target) && e.target !== inputDireccion) {
      sugerencias.innerHTML = "";
    }
  });

  // 3. Interceptar el envío del formulario para obtener lat/lng
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const direccion = inputDireccion.value.trim();
    const distrito = inputDistrito.value.trim();
    const direccionCompleta = `${direccion}, ${distrito}, Lima, Perú`;

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccionCompleta)}&limit=1`);
      const data = await res.json();

      if (data.length > 0) {
        latInput.value = data[0].lat;
        lngInput.value = data[0].lon;
        form.submit(); // Ahora sí enviar
      } else {
        alert("No se pudo encontrar la ubicación. Verifica la dirección y el distrito.");
      }
    } catch (error) {
      console.error("Error al buscar coordenadas antes de enviar:", error);
      alert("Ocurrió un error al buscar la ubicación.");
    }
  });
});
