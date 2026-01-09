
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ToastProvider } from '@/hooks/use-toast'
import { ThemeProvider } from "./contexts/ThemeContext";

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Ignore registration errors for now
    });
  });
}

createRoot(document.getElementById("root")!).render(
  <ToastProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </ToastProvider>
);
