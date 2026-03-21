self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Keep a fetch handler to satisfy installability checks without altering network behavior.
self.addEventListener("fetch", () => {});
