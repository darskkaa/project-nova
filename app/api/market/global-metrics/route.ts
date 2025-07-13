import { NextResponse } from 'next/server';

// Force dynamic route behavior - no caching
export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('=== Global Metrics API Route Called ===');
  const apiKey = process.env.NEXT_PUBLIC_COINMARKETCAP_API_KEY;
  
  if (!apiKey) {
    console.error('API key is not configured');
    return NextResponse.json(
      { 
        success: false,
        error: 'Server configuration error: CoinMarketCap API key not found' 
      },
      { status: 500 }
    );
  }

  try {
    console.log('Making request to CoinMarketCap API...');
    const response = await fetch('https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest', {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
        'Accept': 'application/json',
      },
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CoinMarketCap API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`API request failed with status ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Received data from CoinMarketCap API');
    
    // Validate the response data structure
    if (!responseData.data || !responseData.data.quote || !responseData.data.quote.USD) {
      console.error('Invalid API response format:', responseData);
      throw new Error('Invalid API response format');
    }

    // Return the data in a consistent format
    return NextResponse.json({
      success: true,
      data: {
        active_cryptocurrencies: responseData.data.active_cryptocurrencies || 0,
        btc_dominance: responseData.data.btc_dominance || 0,
        eth_dominance: responseData.data.eth_dominance || 0,
        quote: {
          USD: {
            total_market_cap: responseData.data.quote.USD.total_market_cap || 0,
            total_volume_24h: responseData.data.quote.USD.total_volume_24h || 0,
            market_cap_change_24h: responseData.data.quote.USD.market_cap_change_24h || 0,
          },
        },
      },
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in global metrics API route:', {
      message: errorMessage,
      error: error,
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch global metrics',
        ...(process.env.NODE_ENV === 'development' && { details: errorMessage })
      },
      { status: 500 }
    );
  }
}
