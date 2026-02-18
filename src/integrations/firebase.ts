import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, type Analytics } from "firebase/analytics";
import { getMessaging, onMessage, getToken, type Messaging } from "firebase/messaging";

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
} as const;

let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;
let messaging: Messaging | null = null;

const hasAllConfig = Object.values(cfg).every((v) => typeof v === "string" && v.length > 0);

if (hasAllConfig) {
  app = initializeApp(cfg as Record<string, string>);
  // Analytics requires a browser environment and user consent in some regions
  try {
    analytics = getAnalytics(app);
  } catch {
    analytics = null;
  }
  try {
    messaging = getMessaging(app);
  } catch {
    messaging = null;
  }
} else {
  // Degrade gracefully if Firebase is not configured
  app = null;
  analytics = null;
  messaging = null;
}

export { app, analytics, messaging, onMessage, getToken };
