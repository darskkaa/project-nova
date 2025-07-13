import { NextResponse } from 'next/server';
import { fetchGlobalMetrics } from '@/lib/coinmarketcap';

export async function GET() {
  try {
    const data = await fetchGlobalMetrics();
    
    // Transform the data to match our frontend needs
    const transformedData = {
      total_market_cap: data.data.quote.USD.total_market_cap,
      total_volume_24h: data.data.quote.USD.total_volume_24h,
      market_cap_change_percentage_24h_usd: data.data.quote.USD.total_market_cap_yesterday_percentage_change,
      active_cryptocurrencies: data.data.active_cryptocurrencies,
      market_cap_percentage: {
        btc: data.data.btc_dominance,
        eth: data.data.eth_dominance,
      },
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch global market data' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; // Ensure fresh data on each request
