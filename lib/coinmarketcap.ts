import axios from 'axios';

// This should be set as an environment variable in production
const API_KEY = process.env.NEXT_PUBLIC_COINMARKETCAP_API_KEY;
const API_BASE_URL = 'https://pro-api.coinmarketcap.com/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'X-CMC_PRO_API_KEY': API_KEY,
    'Accept': 'application/json',
    'Accept-Encoding': 'deflate, gzip',
  },
  // Add proxy configuration if needed
  // proxy: {
  //   host: 'your-proxy-host',
  //   port: 8080,
  // },
});

export interface GlobalMetricsData {
  data: {
    active_cryptocurrencies: number;
    total_cryptocurrencies: number;
    active_market_pairs: number;
    active_exchanges: number;
    eth_dominance: number;
    btc_dominance: number;
    eth_dominance_24h_percentage_change: number;
    btc_dominance_24h_percentage_change: number;
    defi_volume_24h: number;
    defi_volume_24h_reported: number;
    defi_market_cap: number;
    defi_24h_percentage_change: number;
    stablecoin_volume_24h: number;
    stablecoin_volume_24h_reported: number;
    stablecoin_market_cap: number;
    stablecoin_24h_percentage_change: number;
    derivatives_volume_24h: number;
    derivatives_volume_24h_reported: number;
    derivatives_24h_percentage_change: number;
    quote: {
      USD: {
        total_market_cap: number;
        total_volume_24h: number;
        total_volume_24h_reported: number;
        altcoin_volume_24h: number;
        altcoin_volume_24h_reported: number;
        altcoin_market_cap: number;
        altcoin_market_cap_24h_percentage_change: number;
        defi_volume_24h: number;
        defi_volume_24h_reported: number;
        defi_24h_percentage_change: number;
        defi_market_cap: number;
        defi_24h_percentage_change_market_cap: number;
        stablecoin_volume_24h: number;
        stablecoin_volume_24h_reported: number;
        stablecoin_24h_percentage_change: number;
        stablecoin_market_cap: number;
        stablecoin_24h_percentage_change_market_cap: number;
        derivatives_volume_24h: number;
        derivatives_volume_24h_reported: number;
        derivatives_24h_percentage_change: number;
        last_updated: string;
        total_market_cap_yesterday_percentage_change: number;
        total_volume_24h_yesterday_percentage_change: number;
      };
    };
  };
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
    elapsed: number;
    credit_count: number;
    notice: string | null;
  };
}

export interface CryptocurrencyListing {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  cmc_rank: number;
  num_market_pairs: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  infinite_supply: boolean;
  last_updated: string;
  date_added: string;
  tags: string[];
  platform: any;
  self_reported_circulating_supply: number | null;
  self_reported_market_cap: number | null;
  quote: {
    USD: {
      price: number;
      volume_24h: number;
      volume_change_24h: number;
      percent_change_1h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      percent_change_30d: number;
      percent_change_60d: number;
      percent_change_90d: number;
      market_cap: number;
      market_cap_dominance: number;
      fully_diluted_market_cap: number;
      last_updated: string;
    };
  };
}

export interface CryptocurrencyListingsResponse {
  data: CryptocurrencyListing[];
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
    elapsed: number;
    credit_count: number;
    notice: string | null;
  };
}

export const fetchGlobalMetrics = async (): Promise<GlobalMetricsData> => {
  try {
    const response = await api.get<GlobalMetricsData>('/global-metrics/quotes/latest');
    return response.data;
  } catch (error) {
    console.error('Error fetching global metrics:', error);
    throw new Error('Failed to fetch global metrics');
  }
};

export const fetchTopCryptocurrencies = async (limit: number = 100): Promise<CryptocurrencyListingsResponse> => {
  try {
    const response = await api.get<CryptocurrencyListingsResponse>('/cryptocurrency/listings/latest', {
      params: {
        start: 1,
        limit,
        convert: 'USD',
        sort: 'market_cap',
        sort_dir: 'desc',
        cryptocurrency_type: 'all',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top cryptocurrencies:', error);
    throw new Error('Failed to fetch top cryptocurrencies');
  }
};

export const fetchCryptocurrencyInfo = async (ids: string) => {
  try {
    const response = await api.get('/cryptocurrency/info', {
      params: {
        id: ids,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching cryptocurrency info:', error);
    throw new Error('Failed to fetch cryptocurrency info');
  }
};
