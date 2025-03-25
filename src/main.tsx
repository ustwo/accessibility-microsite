import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';

// Debug environment variables
console.log('Environment mode:', import.meta.env.MODE);
console.log('VITE_GOOGLE_TOOLS_SHEET_ID available:', Boolean(import.meta.env.VITE_GOOGLE_TOOLS_SHEET_ID));
console.log('VITE_GOOGLE_PATTERNS_SHEET_ID available:', Boolean(import.meta.env.VITE_GOOGLE_PATTERNS_SHEET_ID));
console.log('VITE_GOOGLE_SERVICE_ACCOUNT_CREDENTIALS available:', Boolean(import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_CREDENTIALS));

// Debug log
console.log('Main.tsx executing, routes:', routes);

// Create a browser router with our route configuration
const router = createBrowserRouter(routes);

// Render the app
console.log('About to render React app');
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
); 