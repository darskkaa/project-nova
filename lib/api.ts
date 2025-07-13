const API_BASE_URL = 'https://pro-api.coinmarketcap.com/v1';

interface ApiResponse<T> {
  data: T;
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
    elapsed: number;
    credit_count: number;
  };
}

interface Quote {
  USD: {
    total_market_cap: number;
    total_volume_24h: number;
    market_cap_change_24h: number;
  };
}

interface GlobalMetricsResponse {
  active_cryptocurrencies: number;
  btc_dominance: number;
  eth_dominance: number;
  quote: Quote;
}

export async function fetchGlobalMetrics(): Promise<GlobalMetricsResponse> {
  console.log('Fetching global metrics from our API route...');
  
  try {
    const response = await fetch('/api/market/global-metrics', {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const responseData = await response.json();
    
    // The API route already returns the data in the correct format
    if (!responseData || !responseData.data) {
      console.error('Unexpected API response format:', responseData);
      throw new Error('Invalid API response format');
    }
    
    // Transform the response to match our GlobalMetricsResponse type
    const quote = responseData.data.quote.USD;
    const metrics = responseData.data;
    
    const result: GlobalMetricsResponse = {
      active_cryptocurrencies: metrics.active_cryptocurrencies || 0,
      btc_dominance: metrics.btc_dominance || 0,
      eth_dominance: metrics.eth_dominance || 0,
      quote: {
        USD: {
          total_market_cap: quote.total_market_cap || 0,
          total_volume_24h: quote.total_volume_24h || 0,
          market_cap_change_24h: quote.market_cap_change_24h || 0,
        },
      },
    };
    
    console.log('Transformed API Response:', result);
    return result;
    
  } catch (error) {
    console.error('Error in fetchGlobalMetrics:', error);
    throw error; // Re-throw to be handled by the caller
  }
}

// Add more API functions as needed for different endpoints
