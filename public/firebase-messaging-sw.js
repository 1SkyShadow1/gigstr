// Give the service worker access to Firebase Messaging (compat for SW context).
importScripts('https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBON9YXVjpfLGf6gaucVDJfMPZ8cD9SJVg",
  authDomain: "gigstr-4c14d.firebaseapp.com",
  projectId: "gigstr-4c14d",
  storageBucket: "gigstr-4c14d.appspot.com",
  messagingSenderId: "525883483001",
  appId: "1:525883483001:web:422a159437245c6aea05a8",
  measurementId: "G-Y4JSB6KNZM"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  const title = payload?.notification?.title || 'Notification';
  const options = {
    body: payload?.notification?.body || '',
    icon: '/icon.png',
    data: payload?.data || {},
  };
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const url = event.notification?.data?.url || '/notifications';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (const client of windowClients) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
