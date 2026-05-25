// public/sw.js — Rapid Photo Service Worker
// Network-first strategy with offline fallback

const CACHE_NAME = "rapid-photo-v1";

// Core app shell resources to pre-cache on install
const PRECACHE_URLS = ["/", "/editor", "/formats", "/how-it-works"];

// ──────────────────────────────────────────────
// Install: pre-cache the app shell
// ──────────────────────────────────────────────
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  // Activate new SW immediately without waiting for old one to be discarded
  self.skipWaiting();
});

// ──────────────────────────────────────────────
// Activate: clean up old caches
// ──────────────────────────────────────────────
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (name) {
            return name !== CACHE_NAME;
          })
          .map(function (name) {
            return caches.delete(name);
          })
      );
    })
  );
  // Take control of all clients immediately
  self.clients.claim();
});

// ──────────────────────────────────────────────
// Fetch: Network-first, fall back to cache
// API requests and cross-origin resources bypass the cache entirely
// ──────────────────────────────────────────────
self.addEventListener("fetch", function (event) {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and cross-origin requests
  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // Skip Next.js HMR, API routes and _next/data to always hit the network
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_next/") ||
    url.pathname.includes("__nextjs")
  ) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then(function (networkResponse) {
        // Cache a clone of successful responses for pages/assets
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(function () {
        // Network failed — try to serve from cache
        return caches.match(request).then(function (cachedResponse) {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If neither network nor cache can serve the request,
          // fall back to the cached home page for navigation requests
          if (request.mode === "navigate") {
            return caches.match("/");
          }
          return new Response("Offline", { status: 503 });
        });
      })
  );
});

// ──────────────────────────────────────────────
// Push Notifications
// ──────────────────────────────────────────────
self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/icon-192x192.png",
      badge: "/icon-192x192.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        url: data.url || "/",
      },
    };
    event.waitUntil(
      self.registration.showNotification(data.title || "Rapid Photo", options)
    );
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    clients.matchAll({ type: "window" }).then(function (clientList) {
      for (const client of clientList) {
        if (client.url === targetUrl && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
