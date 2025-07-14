
document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('locales-container');
    const res = await fetch('../controller/toplocalesController.php');
    const locales = await res.json();

    locales.forEach(local => {
        const card = document.createElement('div');
        card.className = 'card-local';

        const liked = sessionStorage.getItem(`liked_${local.id}`) === 'true';

        const heartSVG = liked
            ? `<svg xmlns="http://www.w3.org/2000/svg" class="heart filled" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9 9 0 0 0 8 15m0-9.007c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132"/>
              </svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" class="heart outline" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                <path fill-rule="evenodd" d="M2.965 12.695a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2m-.8 3.108.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125M8 5.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132"/>
              </svg>`;

        card.innerHTML = `
            <img src="http://localhost/hablafood/${local.imagen_path}" alt="${local.nombre_local}" class="local-img">
            
            <div class="local-info">
                <div class="local-text">
                    <h2>${local.nombre_local}</h2>
                    <p>${local.reviews || 64} Reviews / ${local.valoracion.toFixed(1)} ★</p>
                    <a class="local-comment" href="detalle_local.html?id=${local.id}">Deja un comentario..!</a>
                </div>

                <div class="local-actions">
                    <div class="likes" data-id="${local.id}">
                        ${heartSVG}
                        <span class="like-count">${local.likes}</span>
                    </div>
                    <div class="location-btn" onclick="verDetalle(${local.id})">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-pin-map-fill" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M3.1 11.2a.5.5 0 0 1 .4-.2H6a.5.5 0 0 1 0 1H3.75L1.5 15h13l-2.25-3H10a.5.5 0 0 1 0-1h2.5a.5.5 0 0 1 .4.2l3 4a.5.5 0 0 1-.4.8H.5a.5.5 0 0 1-.4-.8z"/>
                            <path fill-rule="evenodd" d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999z"/>
                        </svg>
                        <small>Ubicación</small>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(card);
    });

    // Evento like/dislike
    document.querySelectorAll('.likes').forEach(likeBtn => {
        likeBtn.addEventListener('click', async () => {
            const id = likeBtn.dataset.id;
            let heart = likeBtn.querySelector('.heart');
            const count = likeBtn.querySelector('.like-count');
            const liked = sessionStorage.getItem(`liked_${id}`) === 'true';
            const method = liked ? 'DELETE' : 'POST';

            const res = await fetch(`../controller/toplocalesController.php?like=${id}`, { method });

            if (res.ok) {
                const data = await res.json();
                count.textContent = data.likes;

                // Cambiar el ícono SVG dinámicamente
                if (liked) {
                    heart.outerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="heart outline" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                        <path fill-rule="evenodd" d="M2.965 12.695a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2m-.8 3.108.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125M8 5.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132"/>
                    </svg>`;
                    sessionStorage.setItem(`liked_${id}`, 'false');
                } else {
                    heart.outerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="heart filled" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                        <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9 9 0 0 0 8 15m0-9.007c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132"/>
                    </svg>`;
                    sessionStorage.setItem(`liked_${id}`, 'true');
                }
            }
        });
    });
});


function verDetalle(id) {
    window.location.href = `detalle_local.html?id=${id}`;
}



document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('top-locales-container');
  if (!container) return;

  try {
    const res = await fetch('../controller/toplocalesController.php');
    const locales = await res.json();
    const top3 = locales.slice(0, 3); // Solo los 3 primeros locales

    top3.forEach(local => {
      const card = document.createElement('div');
      card.className = 'cr-tarjeta';

      card.innerHTML = `
        <img src="http://localhost/hablafood/${local.imagen_path}" alt="${local.nombre_local}">
        <div class="cr-tarjeta-cuerpo">
          <p>❤️ ${local.likes}</p>
          <h5>${local.nombre_local}</h5>
          <p>${local.reviews || 64} Reviews / ${local.valoracion.toFixed(1)} ⭐</p>
          <a href="detalle_local.html?id=${local.id}">Deja un comentario...!</a>
          <div class="cr-ubicacion" onclick="verDetalle(${local.id})">📍 Ubicación</div>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar los locales top:", error);
  }
});

function verDetalle(id) {
  window.location.href = `detalle_local.html?id=${id}`;
}

