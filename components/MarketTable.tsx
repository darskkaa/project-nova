'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface Cryptocurrency {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  circulating_supply: number;
  image: string;
  sparkline_in_7d: {
    price: number[];
  };
}

type SortField = 'market_cap' | 'name' | 'current_price' | 'price_change_percentage_24h' | 'total_volume';
type SortDirection = 'asc' | 'desc';

export default function MarketTable() {
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('market_cap');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/cryptocurrencies/market-data');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch cryptocurrency data');
        }
        const { data } = await response.json();
        if (!data || !Array.isArray(data)) {
          throw new Error('Invalid data format received from API');
        }
        setCryptos(data);
      } catch (err) {
        console.error('Error fetching cryptocurrency data:', err);
        setError('Failed to load cryptocurrency data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCryptos();
    const interval = setInterval(fetchCryptos, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatSupply = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toString();
  };

  const filteredCryptos = cryptos.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCryptos = [...filteredCryptos].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'name') {
      comparison = a[sortField].localeCompare(b[sortField]);
    } else {
      comparison = (a[sortField] || 0) > (b[sortField] || 0) ? 1 : -1;
    }
    
    return sortDirection === 'desc' ? -comparison : comparison;
  });

  const paginatedCryptos = sortedCryptos.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCryptos.length / itemsPerPage);

  if (isLoading) return null; // Skeleton is handled by the parent
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-effect rounded-2xl p-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold">Cryptocurrency Market</h2>
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-dark-400" />
          </div>
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            className="w-full bg-dark-800/50 border border-dark-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-dark-700 text-sm font-medium text-dark-300">
            <div 
              className="col-span-1 flex items-center cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('market_cap')}
            >
              #
              {sortField === 'market_cap' && (
                <span className="ml-1">
                  {sortDirection === 'desc' ? '▼' : '▲'}
                </span>
              )}
            </div>
            <div 
              className="col-span-3 md:col-span-2 flex items-center cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('name')}
            >
              Name
              {sortField === 'name' && (
                <span className="ml-1">
                  {sortDirection === 'desc' ? '▼' : '▲'}
                </span>
              )}
            </div>
            <div 
              className="col-span-4 md:col-span-2 text-right flex justify-end items-center cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('current_price')}
            >
              Price
              {sortField === 'current_price' && (
                <span className="ml-1">
                  {sortDirection === 'desc' ? '▼' : '▲'}
                </span>
              )}
            </div>
            <div 
              className="col-span-3 md:col-span-2 text-right flex justify-end items-center cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('price_change_percentage_24h')}
            >
              24h %
              {sortField === 'price_change_percentage_24h' && (
                <span className="ml-1">
                  {sortDirection === 'desc' ? '▼' : '▲'}
                </span>
              )}
            </div>
            <div 
              className="hidden md:block md:col-span-2 text-right cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('market_cap')}
            >
              Market Cap
              {sortField === 'market_cap' && (
                <span className="ml-1">
                  {sortDirection === 'desc' ? '▼' : '▲'}
                </span>
              )}
            </div>
            <div 
              className="hidden md:block md:col-span-2 text-right cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('total_volume')}
            >
              Volume (24h)
              {sortField === 'total_volume' && (
                <span className="ml-1">
                  {sortDirection === 'desc' ? '▼' : '▲'}
                </span>
              )}
            </div>
            <div className="hidden md:block md:col-span-1 text-right">
              Supply
            </div>
          </div>

          <AnimatePresence initial={false}>
            {paginatedCryptos.map((crypto, index) => (
              <motion.div
                key={crypto.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-12 gap-4 p-4 border-b border-dark-700/50 hover:bg-dark-800/30 transition-colors"
              >
                <div className="col-span-1 text-dark-400">
                  {crypto.market_cap ? (page - 1) * itemsPerPage + index + 1 : '-'}
                </div>
                <div className="col-span-3 md:col-span-2 flex items-center">
                  <img 
                    src={crypto.image} 
                    alt={crypto.name} 
                    className="w-6 h-6 rounded-full mr-2"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://cryptologos.cc/logos/${crypto.id.toLowerCase()}-${crypto.symbol.toLowerCase()}-logo.png`;
                    }}
                  />
                  <div>
                    <div className="font-medium">{crypto.name}</div>
                    <div className="text-xs text-dark-400">{crypto.symbol.toUpperCase()}</div>
                  </div>
                </div>
                <div className="col-span-4 md:col-span-2 text-right">
                  <div className="font-medium">
                    {formatCurrency(crypto.current_price)}
                  </div>
                </div>
                <div className="col-span-3 md:col-span-2 text-right">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    crypto.price_change_percentage_24h >= 0 
                      ? 'bg-green-900/20 text-green-400' 
                      : 'bg-red-900/20 text-red-400'
                  }`}>
                    {crypto.price_change_percentage_24h >= 0 ? (
                      <ArrowUpIcon className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                  </div>
                </div>
                <div className="hidden md:block md:col-span-2 text-right">
                  {formatLargeNumber(crypto.market_cap)}
                </div>
                <div className="hidden md:block md:col-span-2 text-right">
                  {formatLargeNumber(crypto.total_volume)}
                </div>
                <div className="hidden md:block md:col-span-1 text-right text-dark-400">
                  {crypto.circulating_supply ? formatSupply(crypto.circulating_supply) : 'N/A'}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-md bg-dark-800/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="px-4 py-1 text-sm">
              Page {page} of {totalPages}
            </div>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-md bg-dark-800/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
