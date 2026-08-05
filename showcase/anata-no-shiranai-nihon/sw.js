const CACHE = 'anata-no-shiranai-nihon-v10';
const ASSETS = [
  './', './index.html', './app.js?v=10', './style.css?v=10', './impact-fix.css?v=5', './manifest.webmanifest',
  './data/japan-prefectures.v1.json?v=2', './vendor/d3.min.js',
  './assets/story/01-alert.png', './assets/story/02-trajectory.png', './assets/story/03-intercept.png'
];
self.addEventListener('install', (event) => event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS))));
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
