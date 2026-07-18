/* Horse Selector — Service Worker
   Bump CACHE_VERSION (matches APP_VERSION in app.js) with every release.
   The page detects the new SW installing and shows the update banner.
*/
const CACHE_VERSION='horse-selector-v2.0.3';
const ASSETS=[
  './',
  './index.html',
  './manifest.webmanifest',
  './styles.css',
  './design.css',
  './assets/field-note-hero.jpg',
  './assets/favicon-32.png',
  './assets/apple-touch-icon.png',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './app.js',
  './presets.js',
  './sales-data.js'
];

// Install: cache all assets
self.addEventListener('install',e => {
  e.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(ASSETS))
  );
  // Don't self.skipWaiting() — wait for user to click "Update Now"
});

// Activate: delete old caches
self.addEventListener('activate',e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(k => k!==CACHE_VERSION)
        .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch',e => {
  // Only handle same-origin GET requests
  if(e.request.method!=='GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => cached||fetch(e.request))
  );
});

// Message from page: "Update Now" button clicked
self.addEventListener('message',e => {
  if(e.data&&e.data.type==='SKIP_WAITING') self.skipWaiting();
});
