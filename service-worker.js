// service-worker.js (Placeholder)

console.log('Service Worker placeholder loaded.');

self.addEventListener('install', (event) => {
  console.log('[SW] Event: install');
  // A placeholder doesn't need to do anything during install.
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Event: activate');
  // A placeholder doesn't need to do anything during activate.
});

self.addEventListener('push', (event) => {
  console.log('[SW] Event: push received');
  
  const data = event.data.json();
  const title = data.title || "Test Push";
  const body = {
    body: data.body || "Test Body"
  }

  event.waitUntil(self.registration.showNotification(title, body));
});

self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Event: notificationclick');
  // A placeholder for handling notification clicks.
});