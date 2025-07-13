'use client';

import { useEffect, useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

interface MarketData {
  total_market_cap: number;
  total_volume_24h: number;
  market_cap_change_percentage_24h_usd: number;
  active_cryptocurrencies: number;
  market_cap_percentage: {
    btc: number;
    eth: number;
  };
}

export default function MarketOverview() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/market/global');
        if (!response.ok) {
          throw new Error('Failed to fetch market data');
        }
        const data = await response.json();
        setMarketData(data);
      } catch (err) {
        console.error('Error fetching market data:', err);
        setError('Failed to load market data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  if (isLoading) return null; // Skeleton is handled by the parent
  if (error) return <div className="text-red-400">{error}</div>;
  if (!marketData) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const marketCapChange = marketData.market_cap_change_percentage_24h_usd;
  const isPositive = marketCapChange >= 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-effect rounded-2xl p-6"
    >
      <h2 className="text-xl font-semibold mb-6">Market Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Market Cap */}
        <div className="bg-dark-800/50 p-4 rounded-xl">
          <div className="text-sm text-dark-300 mb-1">Total Market Cap</div>
          <div className="text-2xl font-bold">{formatCurrency(marketData.total_market_cap)}</div>
          <div className={`flex items-center mt-1 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? (
              <ArrowUpIcon className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 mr-1" />
            )}
            {Math.abs(marketCapChange).toFixed(2)}% (24h)
          </div>
        </div>

        {/* 24h Volume */}
        <div className="bg-dark-800/50 p-4 rounded-xl">
          <div className="text-sm text-dark-300 mb-1">24h Trading Volume</div>
          <div className="text-2xl font-bold">{formatCurrency(marketData.total_volume_24h)}</div>
          <div className="text-xs text-dark-400 mt-1">Across all markets</div>
        </div>

        {/* BTC Dominance */}
        <div className="bg-dark-800/50 p-4 rounded-xl">
          <div className="text-sm text-dark-300 mb-1">BTC Dominance</div>
          <div className="text-2xl font-bold">{marketData.market_cap_percentage.btc.toFixed(1)}%</div>
          <div className="text-xs text-dark-400 mt-1">Ethereum: {marketData.market_cap_percentage.eth.toFixed(1)}%</div>
        </div>

        {/* Active Cryptocurrencies */}
        <div className="bg-dark-800/50 p-4 rounded-xl">
          <div className="text-sm text-dark-300 mb-1">Active Cryptocurrencies</div>
          <div className="text-2xl font-bold">{marketData.active_cryptocurrencies.toLocaleString()}</div>
          <div className="text-xs text-dark-400 mt-1">Tracked on CoinMarketCap</div>
        </div>
      </div>
    </motion.div>
  );
}
