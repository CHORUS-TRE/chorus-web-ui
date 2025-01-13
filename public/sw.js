/// <reference lib="webworker" />

const CACHE_NAME = 'your-app-cache-v1'

self.addEventListener('install', (event) => {
  const e = /** @type {ExtendableEvent} */ (event)
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['/', '/offline.html'])
    })
  )
})

self.addEventListener('fetch', (event) => {
  const e = /** @type {FetchEvent} */ (event)
  e.respondWith(
    caches
      .match(e.request)
      .then((response) => response || fetch(e.request))
      .catch(() =>
        caches
          .match('/offline.html')
          .then((response) => response || new Response('Offline'))
      )
  )
})
