// NOME DELLA CACHE (Cambialo se aggiorni l'app pesantemente per forzare l'aggiornamento)
const CACHE_NAME = 'infinity-tactical-v1';

// File da salvare subito in memoria per funzionare offline
const urlsToCache = [
  './',
  './database.js',
  './nomadi_attivo.html',
  './panoceania_attivo.html',
  './calcolatore_hub.html'
];

// Installazione del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercetta le richieste (Se non c'è internet, usa la memoria cache)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Trova il file in cache
        }
        return fetch(event.request); // Scarica da internet
      })
  );
});
