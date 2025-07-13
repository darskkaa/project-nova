'use client';

import { useState, useEffect } from 'react';
import { GlobalMarketData } from '@/types/market';

// Client-side only component
export default function MarketOverview() {
  const [marketData, setMarketData] = useState<GlobalMarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyStatus, setApiKeyStatus] = useState<string>('Checking API configuration...');
  const [isMounted, setIsMounted] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Check API key and set initial state
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_COINMARKETCAP_API_KEY;
    if (!apiKey) {
      setApiKeyStatus('❌ API Key: Not configured. Please check your environment variables');
      setError('API key is not configured');
      setIsLoading(false);
      return;
    }
    setApiKeyStatus('✅ API: Ready');
    setIsMounted(true);
  }, []);

  const fetchMarketData = async () => {
    if (!isMounted) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/market/global-metrics');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result || !result.data) {
        throw new Error('Invalid response format from API');
      }
      
      const { data } = result;
      
      // Transform the API response to match the GlobalMarketData interface
      const transformedData: GlobalMarketData = {
        active_cryptocurrencies: data.active_cryptocurrencies || 0,
        total_market_cap: { 
          usd: data.quote?.USD?.total_market_cap || 0 
        },
        total_volume: { 
          usd: data.quote?.USD?.total_volume_24h || 0 
        },
        market_cap_percentage: {
          btc: data.btc_dominance || 0,
          eth: data.eth_dominance || 0,
        },
        market_cap_change_percentage_24h_usd: data.quote?.USD?.market_cap_change_24h || 0,
        updated_at: new Date().toISOString(),
      };
      
      setMarketData(transformedData);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error in fetchMarketData:', errorMessage);
      setError(`Failed to load market data: ${errorMessage}`);
      
      // Auto-retry up to 3 times
      if (retryCount < 3) {
        const timeout = Math.min(1000 * 2 ** retryCount, 10000); // Exponential backoff with max 10s
        console.log(`Retrying in ${timeout}ms... (attempt ${retryCount + 1}/3)`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchMarketData();
        }, timeout);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when component mounts or retry count changes
  useEffect(() => {
    if (isMounted) {
      fetchMarketData();
    }
    
    // Cleanup function to prevent memory leaks
    return () => {
      // Any cleanup if needed
    };
  }, [isMounted, retryCount]);

  // Show loading state while checking mount status or fetching data
  if (!isMounted || isLoading) {
    return (
      <div className="space-y-4 p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
        <h2 className="text-xl font-semibold">Market Overview</h2>
        <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200">
          <p>Loading market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
      <h2 className="text-xl font-semibold">Market Overview</h2>
      
      {/* API Key Status */}
      <div className={`p-3 rounded-md ${
        apiKeyStatus.includes('Not configured') 
          ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' 
          : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
      }`}>
        <p className="font-medium">{apiKeyStatus}</p>
        {!process.env.NEXT_PUBLIC_COINMARKETCAP_API_KEY && (
          <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-md text-sm">
            <p className="font-medium mb-1">API Configuration Required</p>
            <p className="text-xs opacity-80 mb-2">Please set up your environment variables in the deployment settings.</p>
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-md">
          <h3 className="font-medium text-red-800 dark:text-red-200">Error</h3>
          <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
          <button
            onClick={fetchMarketData}
            className="mt-2 px-3 py-1 text-sm bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-800/70 rounded-md text-red-800 dark:text-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      )}
      
      {/* Loading State */}
      {isLoading && !error && (
        <div className="space-y-4">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      )}
      
      {/* Data Display */}
      {!isLoading && !error && marketData && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Cryptocurrencies</p>
              <p className="text-2xl font-semibold">{marketData.active_cryptocurrencies.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Market Cap</p>
              <p className="text-2xl font-semibold">
                ${(marketData.total_market_cap.usd / 1e12).toFixed(2)}T
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">24h Volume</p>
              <p className="text-2xl font-semibold">
                ${(marketData.total_volume.usd / 1e9).toFixed(2)}B
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">24h Change</p>
              <p className={`text-2xl font-semibold ${
                marketData.market_cap_change_percentage_24h_usd >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {marketData.market_cap_change_percentage_24h_usd >= 0 ? '▲' : '▼'} 
                {Math.abs(marketData.market_cap_change_percentage_24h_usd).toFixed(2)}%
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Market Dominance</p>
              <div className="space-y-2">
                {Object.entries(marketData.market_cap_percentage).map(([coin, percentage]) => (
                  <div key={coin} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{coin.toUpperCase()}</span>
                      <span>{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
              <p className="text-sm mt-1">
                {new Date(marketData.updated_at).toLocaleString()}
              </p>
              <button
                onClick={fetchMarketData}
                className="mt-4 px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-800/70 rounded-md text-blue-800 dark:text-blue-200 transition-colors"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ArrowUp({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  );
}
