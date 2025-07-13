'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import MarketOverview from '@/components/market/MarketOverview';

// Import other components with dynamic imports for better performance
const TopPerformers = dynamic(() => import('@/components/TopPerformers'), { ssr: false });
const MarketTable = dynamic(() => import('@/components/MarketTable'), { ssr: false });

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Page header */}
      <header className="text-center space-y-2">
        <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
          Project Nova
        </div>
        <p className="text-muted-foreground">Your gateway to crypto intelligence</p>
      </header>

      {/* Market Overview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Market Overview</h2>
        <Suspense fallback={<MarketOverviewSkeleton />}>
          <MarketOverview />
        </Suspense>
      </section>

      {/* Top Performers */}
      <Suspense fallback={<TopPerformersSkeleton />}>
        <TopPerformers />
      </Suspense>

      {/* Market Table */}
      <Suspense fallback={<MarketTableSkeleton />}>
        <MarketTable />
      </Suspense>
    </div>
  );
}

// Skeleton loaders
function MarketOverviewSkeleton() {
  return (
    <div className="glass-effect rounded-2xl p-6 animate-pulse">
      <h2 className="text-xl font-semibold mb-4 h-7 w-48 bg-dark-700 rounded"></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 rounded-xl bg-dark-800/50 h-28"></div>
        ))}
      </div>
    </div>
  );
}

function TopPerformersSkeleton() {
  return (
    <div className="glass-effect rounded-2xl p-6 animate-pulse">
      <h2 className="text-xl font-semibold mb-4 h-7 w-48 bg-dark-700 rounded"></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="p-4 rounded-xl bg-dark-800/50 h-48"></div>
        ))}
      </div>
    </div>
  );
}

function MarketTableSkeleton() {
  return (
    <div className="glass-effect rounded-2xl p-6 animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold h-7 w-48 bg-dark-700 rounded"></h2>
        <div className="h-10 w-48 bg-dark-700 rounded"></div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-dark-700">
            {['#', 'Asset', 'Price', '24h %', 'Market Cap', 'Volume (24h)', 'Supply'].map((_, i) => (
              <div key={i} className="h-5 bg-dark-700 rounded"></div>
            ))}
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 p-4 border-b border-dark-700">
              {[...Array(7)].map((_, j) => (
                <div key={j} className="h-5 bg-dark-700 rounded"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
