const CACHE = 'anata-no-shiranai-nihon-v17';
const ASSETS = [
  './', './index.html', './app.js?v=16', './style.css?v=14', './impact-fix.css?v=7', './reward.css?v=2', './manifest.webmanifest',
  './data/japan-prefectures.v1.json?v=2', './vendor/d3.min.js',
  './assets/story/01-alert.webp', './assets/story/02-trajectory.webp', './assets/story/03-intercept.webp'
];
self.addEventListener('install', (event) => event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS))));
self.addEventListener('activate', (event) => event.waitUntil(
  Promise.all([
    self.clients.claim(),
    caches.keys().then((keys) => Promise.all(
      keys
        .filter((key) => key.startsWith('anata-no-shiranai-nihon-') && key !== CACHE)
        .map((key) => caches.delete(key))
    ))
  ])
));
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
