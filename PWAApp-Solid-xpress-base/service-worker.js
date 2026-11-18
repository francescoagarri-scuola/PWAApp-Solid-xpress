// Service worker di Solid Xpress.
// Strategia: i file dell'app vengono messi in cache all'installazione
// e serviti dalla cache (cache first); se un file non e' in cache si usa la rete.
// Quando cambi un file dell'app, aumenta il numero di CACHE_VERSION.

const CACHE_VERSION = "v1";
const CACHE_NAME = `solid-xpress-${CACHE_VERSION}`;

// Percorsi relativi alla posizione di questo file, cosi' funzionano
// anche su GitHub Pages (/PWAApp-Solid-xpress/).
const FILE_DA_SALVARE = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png"
];

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILE_DA_SALVARE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (evento) => {
  // Elimina le cache delle versioni precedenti.
  evento.waitUntil(
    caches.keys().then((nomi) =>
      Promise.all(
        nomi
          .filter((nome) => nome.startsWith("solid-xpress-") && nome !== CACHE_NAME)
          .map((nome) => caches.delete(nome))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (evento) => {
  const richiesta = evento.request;
  if (richiesta.method !== "GET") return;
  if (new URL(richiesta.url).origin !== self.location.origin) return;

  evento.respondWith(
    caches.match(richiesta).then((inCache) => {
      if (inCache) return inCache;
      return fetch(richiesta)
        .then((risposta) => {
          if (risposta.ok) {
            const copia = risposta.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(richiesta, copia));
          }
          return risposta;
        })
        .catch(() => {
          // Offline e file non in cache: per le pagine si torna all'indice.
          if (richiesta.mode === "navigate") return caches.match("./index.html");
        });
    })
  );
});
