/*
 * Service Worker pro São Miguel PWA
 * Strategie: cache-first pro statické zdroje, network-first pro externí data.
 */
const VERSION = 'sm-v2.0.0-react';
const CACHE = `sao-miguel-${VERSION}`;

const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg',
  './icon-192.png',
  './icon-512.png'
];

// Install — předcache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

// Activate — odstraň staré cache verze
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — network-first s fallback na cache pro maximální flexibilitu u Vite buildu
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Chrome extension a podobné neřešíme
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        // Uložit do cache pokud je to úspěšné
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => {
        return caches.match(req).then((cached) => {
          return cached || caches.match('./index.html');
        });
      })
  );
});
