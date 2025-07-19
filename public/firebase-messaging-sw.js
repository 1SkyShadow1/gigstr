// Give the service worker access to Firebase Messaging.
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

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
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
}); 