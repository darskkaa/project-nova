'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Error boundary component
function MarketError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
      <h2 className="text-lg font-medium text-red-800 dark:text-red-200">Something went wrong!</h2>
      <p className="mt-2 text-sm text-red-700 dark:text-red-300">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Try again
      </button>
    </div>
  );
}

// Loading component
function MarketLoading() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}

// Dynamically import MarketOverview with SSR disabled to avoid hydration issues
const MarketOverview = dynamic(
  () => import('@/components/market/MarketOverview'),
  { 
    ssr: false, 
    loading: () => <MarketLoading />
  }
);

export default function MarketsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Markets</h1>
        <p className="text-muted-foreground mt-1">Global cryptocurrency market overview</p>
      </header>
      
      <Suspense fallback={<MarketLoading />}>
        <MarketOverview />
      </Suspense>
    </div>
  );
}
