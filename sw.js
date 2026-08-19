// ============================================================
// AI Briefing — Service Worker (Network First)
// Siempre busca la versión más nueva en la red.
// Si no hay conexión, usa la versión en caché.
// ============================================================

const CACHE_NAME = 'ai-briefing-cache-v3';

// Al instalar: activar inmediatamente sin esperar
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll([
        './',
        './index.html',
        './manifest.json',
        './icon-192-v2.png',
        './icon-512-v2.png',
        './latest.json'
      ])
    )
  );
});

// Al activar: eliminar cachés viejos y tomar control de todos los clientes
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Borrar cualquier caché anterior
      caches.keys().then(keys =>
        Promise.all(
          keys.filter(key => key !== CACHE_NAME).map(key => {
            console.log('[SW] Eliminando caché viejo:', key);
            return caches.delete(key);
          })
        )
      ),
      // Tomar control inmediato de todas las pestañas abiertas
      clients.claim()
    ])
  );
});

// Estrategia: Network First
// 1. Intenta la red → si hay respuesta, actualiza caché y devuelve
// 2. Si la red falla → devuelve desde caché (modo offline)
self.addEventListener('fetch', (event) => {
  // Solo interceptar peticiones GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Respuesta válida de la red
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Sin red: usar caché
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) return cachedResponse;
          // Si no hay caché, devolver página offline básica
          return new Response(
            '<html><body style="font-family:sans-serif;text-align:center;padding:40px;background:#1E3932;color:white"><h2>☕ Sin conexión</h2><p>Abrí cuando tengas internet para ver el último briefing.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        });
      })
  );
});
