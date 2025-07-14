/**
 * Client-side entry point for the React Router application.
 * Handles hydration, error boundaries, and client-specific initialization.
 */

import { HydratedRouter } from 'react-router/dom';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

// Client-side error boundary component
function ClientErrorBoundary({ children }: { children: React.ReactNode }) {
  return <StrictMode>{children}</StrictMode>;
}

// Performance monitoring and client-side initialization
function initializeClient() {
  // Log hydration start for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('🔄 Starting client-side hydration...');
  }

  // Register service worker if available
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.warn('Service Worker registration failed:', error);
      });
    });
  }

  // Add client-side performance monitoring
  if (typeof window !== 'undefined' && window.performance) {
    window.addEventListener('load', () => {
      const navigationTiming = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      if (navigationTiming && process.env.NODE_ENV === 'development') {
        const loadTime =
          navigationTiming.loadEventEnd - navigationTiming.loadEventStart;
        console.log(`⚡ Page load time: ${loadTime}ms`);
      }
    });
  }
}

// Enhanced hydration with error handling
function hydrateApp() {
  try {
    const rootElement = document;

    if (!rootElement) {
      throw new Error('Root element not found');
    }

    // Initialize client-side features
    initializeClient();

    // Start hydration in a transition for better UX
    startTransition(() => {
      hydrateRoot(
        rootElement,
        <ClientErrorBoundary>
          <HydratedRouter />
        </ClientErrorBoundary>,
        {
          onRecoverableError: (error) => {
            // Log recoverable hydration errors
            console.warn('Recoverable hydration error:', error);
          },
        }
      );
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Client-side hydration completed successfully');
    }
  } catch (error) {
    console.error('❌ Fatal hydration error:', error);

    // Fallback: render a basic error message
    document.body.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        text-align: center;
        padding: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      ">
        <h1>⚠️ Application Error</h1>
        <p>The application failed to load properly. Please refresh the page.</p>
        <button onclick="window.location.reload()" style="
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 10px;
        ">
          Refresh Page
        </button>
      </div>
    `;
  }
}

// Wait for DOM to be ready, then hydrate
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', hydrateApp);
} else {
  hydrateApp();
}
