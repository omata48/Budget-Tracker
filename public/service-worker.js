var FILES_TO_CACHE = [
  "/", 
  "/db.js",
  "/assets/css/styles.css",
  
  "/dist/app.bundle.js",
  "/dist/manifest.json",
  
  "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"

];

const STATIC_CACHE = "static-cache-v1";
const RUNTIME_CACHE = "runtime-cache";

// install
self.addEventListener("install", evt => {
  evt.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// activate
self.addEventListener("activate", evt => {
  const currentCaches = [STATIC_CACHE, RUNTIME_CACHE];
  evt.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return cacheNames.filter(
          cacheName => !currentCaches.includes(cacheName)
        );
      })
      .then(cachesToDelete => {
        return Promise.all(
          cachesToDelete.map(cachesToDelete => {
            return caches.delete(cachesToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// fetch
self.addEventListener("fetch", evt => {
  if (
    evt.request.method !== "GET" ||
    !evt.request.url.startsWith(self.location.origin)
    ) {
      evt.respondWith(fetch(evt.request));
    }

  else if (evt.request.url.includes("/api/")) {
    evt.respondWith(
      caches.open(RUNTIME_CACHE).then(cache => {
        return fetch(evt.request)
          .then(response => {
            cache.put(evt.request, response.clone());
            return response;
          })
          .catch(() => caches.match(evt.request));
      })
    );
    return;
  }
});
