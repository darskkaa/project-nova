'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/solid';

interface Cryptocurrency {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
  market_cap: number;
}

export default function TopPerformers() {
  const [activeTab, setActiveTab] = useState<'gainers' | 'losers'>('gainers');
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopPerformers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/cryptocurrencies/top-performers');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch top performers');
        }
        const { data } = await response.json();
        if (!data) {
          throw new Error('No data received from the server');
        }
        setCryptos(activeTab === 'gainers' ? data.top_gainers : data.top_losers);
      } catch (err) {
        console.error('Error fetching top performers:', err);
        setError('Failed to load top performers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopPerformers();
    const interval = setInterval(fetchTopPerformers, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [activeTab]);

  const handleTabChange = (tab: 'gainers' | 'losers') => {
    setActiveTab(tab);
  };

  if (isLoading) return null; // Skeleton is handled by the parent
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-effect rounded-2xl p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Top Performers</h2>
        <div className="flex space-x-2 bg-dark-800/50 p-1 rounded-lg">
          <button
            onClick={() => handleTabChange('gainers')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              activeTab === 'gainers' 
                ? 'bg-primary-600 text-white' 
                : 'text-dark-300 hover:text-white'
            }`}
          >
            Gainers
          </button>
          <button
            onClick={() => handleTabChange('losers')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              activeTab === 'losers' 
                ? 'bg-red-600 text-white' 
                : 'text-dark-300 hover:text-white'
            }`}
          >
            Losers
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {cryptos.map((crypto, index) => {
            const isPositive = crypto.price_change_percentage_24h >= 0;
            const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
            const bgColor = isPositive ? 'bg-green-900/20' : 'bg-red-900/20';
            
            return (
              <motion.div
                key={`${crypto.id}-${activeTab}`}
                whileHover={{ y: -5 }}
                className={`${bgColor} p-4 rounded-xl border border-white/5 card-hover`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <img 
                      src={crypto.image} 
                      alt={crypto.name} 
                      className="w-8 h-8 rounded-full mr-2"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://cryptologos.cc/logos/${crypto.id.toLowerCase()}-${crypto.symbol.toLowerCase()}-logo.png`;
                      }}
                    />
                    <div>
                      <div className="font-medium">{crypto.symbol.toUpperCase()}</div>
                      <div className="text-xs text-dark-400">{crypto.name}</div>
                    </div>
                  </div>
                  <div className={`flex items-center ${changeColor}`}>
                    {isPositive ? (
                      <ArrowUpIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(crypto.price_change_percentage_24h).toFixed(1)}%
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-bold">
                    ${crypto.current_price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </div>
                  <div className="text-xs text-dark-400 mt-1">
                    MCap: ${(crypto.market_cap / 1000000000).toFixed(2)}B
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
