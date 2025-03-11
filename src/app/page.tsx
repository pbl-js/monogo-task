'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import SentimentAnalyzer from '@/components/SentimentAnalyzer';
import '@/styles/main.scss';

// Error fallback component
function ErrorFallback() {
  return (
    <div className="error-container">
      <h2>Something went wrong</h2>
      <p>
        We&apos;re sorry, but there was an error loading the application. Please try refreshing the
        page.
      </p>
    </div>
  );
}

// Loading component
function Loading() {
  return <div className="loading">Loading application...</div>;
}

export default function Home() {
  return (
    <main className="container">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<Loading />}>
          <SentimentAnalyzer />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
