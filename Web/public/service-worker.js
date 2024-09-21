// public/service-worker.js

self.addEventListener('install', (event) => {
    console.log('Service worker installing...');
    // You can cache assets here
  });
  
  self.addEventListener('activate', (event) => {
    console.log('Service worker activating...');
  });
  
  // Fetch event for caching
  self.addEventListener('fetch', (event) => {
    console.log('Fetch event for ', event.request.url);
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  