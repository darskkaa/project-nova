import { NextResponse } from 'next/server';
import { fetchTopCryptocurrencies } from '@/lib/coinmarketcap';

// Type for the transformed cryptocurrency data
export interface CryptocurrencyData {
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

export async function GET() {
  // Check if API key is configured
  if (!process.env.NEXT_PUBLIC_COINMARKETCAP_API_KEY) {
    console.error('CoinMarketCap API key is not configured');
    return NextResponse.json(
      { 
        success: false,
        error: 'Server configuration error: API key not found' 
      },
      { status: 500 }
    );
  }

  try {
    console.log('Fetching market data from CoinMarketCap...');
    const response = await fetchTopCryptocurrencies(100);
    
    // Validate the response
    if (!response || !response.data || !Array.isArray(response.data)) {
      console.error('Invalid response format from CoinMarketCap:', response);
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid data format received from API' 
        },
        { status: 500 }
      );
    }
    
    // Filter out any invalid or incomplete data
    const validCryptos = response.data.filter(
      (crypto) => 
        crypto.id &&
        crypto.name &&
        crypto.symbol &&
        crypto.quote?.USD?.price !== undefined &&
        crypto.quote?.USD?.percent_change_24h !== undefined &&
        crypto.quote?.USD?.market_cap !== undefined &&
        crypto.quote?.USD?.volume_24h !== undefined &&
        crypto.circulating_supply !== undefined
    );
    
    if (validCryptos.length === 0) {
      console.error('No valid cryptocurrency data found');
      return NextResponse.json(
        { 
          success: false,
          error: 'No valid cryptocurrency data available' 
        },
        { status: 500 }
      );
    }
    
    // Transform the data to match our frontend needs
    const transformCrypto = (crypto: any): CryptocurrencyData => {
      // Generate a simple 7-day price trend based on the 24h change
      const generateSparkline = (): number[] => {
        const basePrice = (crypto.quote?.USD?.price || 0) / 
                        (1 + ((crypto.quote?.USD?.percent_change_24h || 0) / 100));
        
        return Array(7).fill(0).map((_, i) => {
          const daysAgo = 6 - i; // 6 days ago to now
          const priceChange = ((crypto.quote?.USD?.percent_change_24h || 0) / 24) * 
                            (24 - (daysAgo * 24 / 7));
          return basePrice * (1 + (priceChange / 100));
        });
      };
      
      return {
        id: crypto.id?.toString() || '',
        name: crypto.name || 'Unknown',
        symbol: crypto.symbol || '?',
        current_price: crypto.quote?.USD?.price || 0,
        price_change_percentage_24h: crypto.quote?.USD?.percent_change_24h || 0,
        market_cap: crypto.quote?.USD?.market_cap || 0,
        total_volume: crypto.quote?.USD?.volume_24h || 0,
        circulating_supply: crypto.circulating_supply || 0,
        image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${crypto.id}.png`,
        sparkline_in_7d: {
          price: generateSparkline()
        }
      };
    };
    
    const transformedData = validCryptos.map(transformCrypto);
    
    console.log(`Successfully transformed data for ${transformedData.length} cryptocurrencies`);
    
    return NextResponse.json({
      success: true,
      data: transformedData
    });
    
  } catch (error: any) {
    console.error('API Error in /api/cryptocurrencies/market-data:', error);
    
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.status?.error_message || 
                        error.message || 
                        'Failed to fetch cryptocurrency data';
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: statusCode }
    );
  }
}

export const dynamic = 'force-dynamic'; // Ensure fresh data on each request
