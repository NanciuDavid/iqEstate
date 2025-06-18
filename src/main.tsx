/**
 * Main Entry Point for EstateIQ React Application
 * 
 * This file bootstraps the React application and renders it to the DOM.
 * It sets up:
 * - React 18's createRoot API for better performance
 * - StrictMode for development warnings and checks
 * - Hot Module Replacement (HMR) for faster development
 */

// React imports
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Styles and components
import './index.css'
import App from './App.tsx'

// Get the root DOM element where React will render the app
// The '!' tells TypeScript that we're sure this element exists
const root = createRoot(document.getElementById('root')!)

// Render the application
// StrictMode enables additional checks and warnings for development
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Enable Hot Module Replacement (HMR) for faster development
// This allows code changes to be reflected immediately without full page refresh
if (import.meta.hot) {
  import.meta.hot.accept()
}
