// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// Import messaging for push notifications
import { getMessaging, onMessage, getToken } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBON9YXVjpfLGf6gaucVDJfMPZ8cD9SJVg",
  authDomain: "gigstr-4c14d.firebaseapp.com",
  projectId: "gigstr-4c14d",
  storageBucket: "gigstr-4c14d.appspot.com",
  messagingSenderId: "525883483001",
  appId: "1:525883483001:web:422a159437245c6aea05a8",
  measurementId: "G-Y4JSB6KNZM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

export { app, analytics, messaging, onMessage, getToken }; 