import { NextResponse } from 'next/server';
import { fetchTopCryptocurrencies } from '@/lib/coinmarketcap';

export async function GET() {
  // Check if API key is configured
  if (!process.env.NEXT_PUBLIC_COINMARKETCAP_API_KEY) {
    console.error('CoinMarketCap API key is not configured');
    return NextResponse.json(
      { error: 'Server configuration error: API key not found' },
      { status: 500 }
    );
  }

  try {
    console.log('Fetching top cryptocurrencies from CoinMarketCap...');
    const response = await fetchTopCryptocurrencies(100);
    
    if (!response || !response.data || !Array.isArray(response.data)) {
      console.error('Invalid response format from CoinMarketCap:', response);
      return NextResponse.json(
        { error: 'Invalid data format received from API' },
        { status: 500 }
      );
    }
    
    // Filter out any invalid or incomplete data
    const validCryptos = response.data.filter(
      (crypto) => 
        crypto.quote?.USD?.percent_change_24h !== undefined &&
        crypto.quote?.USD?.price !== undefined
    );
    
    if (validCryptos.length === 0) {
      console.error('No valid cryptocurrency data found');
      return NextResponse.json(
        { error: 'No valid cryptocurrency data available' },
        { status: 500 }
      );
    }
    
    // Sort by 24h percentage change to get top gainers and losers
    const sortedByGain = [...validCryptos].sort(
      (a, b) => (b.quote?.USD?.percent_change_24h || 0) - (a.quote?.USD?.percent_change_24h || 0)
    );
    
    const sortedByLoss = [...validCryptos].sort(
      (a, b) => (a.quote?.USD?.percent_change_24h || 0) - (b.quote?.USD?.percent_change_24h || 0)
    );
    
    // Transform the data to match our frontend needs
    const transformCrypto = (crypto: any) => ({
      id: crypto.id?.toString() || '',
      name: crypto.name || 'Unknown',
      symbol: crypto.symbol || '?',
      current_price: crypto.quote?.USD?.price || 0,
      price_change_percentage_24h: crypto.quote?.USD?.percent_change_24h || 0,
      image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${crypto.id}.png`,
      market_cap: crypto.quote?.USD?.market_cap || 0,
    });
    
    const topGainers = sortedByGain.slice(0, 5).map(transformCrypto);
    const topLosers = sortedByLoss.slice(0, 5).map(transformCrypto);
    
    console.log(`Successfully fetched ${topGainers.length} gainers and ${topLosers.length} losers`);
    
    return NextResponse.json({
      success: true,
      data: {
        top_gainers: topGainers,
        top_losers: topLosers,
      }
    });
  } catch (error: any) {
    console.error('API Error in /api/cryptocurrencies/top-performers:', error);
    
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.status?.error_message || 
                        error.message || 
                        'Failed to fetch top performers data';
    
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
