// Interface for UI display (subset of CoinGecko API response)
export interface CryptoCurrency {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
  market_cap: number;
}

// Full CoinGecko API response interface
export interface CoinGeckoApiResponse {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: any;
  last_updated: string;
}

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

// Simple test to see if API is accessible
export async function testCoinGeckoAPI(): Promise<boolean> {
  try {
    const testUrl = `${COINGECKO_BASE_URL}/ping`;
    console.log('Testing CoinGecko API connectivity...');
    const response = await fetch(testUrl);
    console.log('CoinGecko ping response:', response.status);
    return response.ok;
  } catch (error) {
    console.error('CoinGecko API test failed:', error);
    return false;
  }
}

// Popular cryptocurrencies to fetch (top 20 by market cap)
const POPULAR_COINS = [
  'bitcoin',
  'ethereum',
  'binancecoin',
  'cardano',
  'solana',
  'polkadot',
  'avalanche-2',
  'polygon',
  'chainlink',
  'litecoin',
  'stellar',
  'uniswap',
  'algorand',
  'cosmos',
  'vechain',
  'internet-computer',
  'filecoin',
  'the-graph',
  'aave',
  'compound'
];

export async function fetchCryptoPrices(): Promise<CryptoCurrency[]> {
  try {
    const coinIds = POPULAR_COINS.join(',');
    const url = `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h`;

    console.log('Fetching crypto prices from CoinGecko...');
    console.log('URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('API Response Status:', response.status, response.statusText);

    if (!response.ok) {
      // If the specific coins endpoint fails, try a simpler approach
      if (response.status === 429 || response.status === 403) {
        console.log('Rate limited or access denied, trying simpler endpoint...');
        return await fetchSimplePrices();
      }
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }

    const data: CoinGeckoApiResponse[] = await response.json();

    console.log('API Response:', data.length, 'coins received');
    console.log('First coin sample:', data[0]);

    // Transform the data to match our UI expectations
    return data.map((coin): CryptoCurrency => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      total_volume: coin.total_volume,
      market_cap: coin.market_cap,
    }));
  } catch (error) {
    console.error('Error fetching cryptocurrency data:', error);
    throw error;
  }
}

// Fallback function for simpler price data
async function fetchSimplePrices(): Promise<CryptoCurrency[]> {
  try {
    const url = `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h`;
    console.log('Trying simpler API endpoint:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Fallback API also failed: ${response.status}`);
    }
    
    const data: CoinGeckoApiResponse[] = await response.json();
    
    return data.map((coin): CryptoCurrency => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      total_volume: coin.total_volume,
      market_cap: coin.market_cap,
    }));
  } catch (error) {
    console.error('Fallback API also failed:', error);
    throw error;
  }
}

// Fallback function that returns mock data if API fails
export function getMockCryptoData(): CryptoCurrency[] {
  return [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      current_price: 43250.75,
      price_change_percentage_24h: 2.34,
      total_volume: 28470000000,
      market_cap: 847000000000,
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      current_price: 2650.32,
      price_change_percentage_24h: -1.23,
      total_volume: 15200000000,
      market_cap: 318000000000,
    },
    {
      id: "binancecoin",
      name: "BNB",
      symbol: "BNB",
      current_price: 315.87,
      price_change_percentage_24h: 0.89,
      total_volume: 1840000000,
      market_cap: 47200000000,
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ADA",
      current_price: 0.4823,
      price_change_percentage_24h: -3.45,
      total_volume: 890000000,
      market_cap: 16900000000,
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      current_price: 98.76,
      price_change_percentage_24h: 5.67,
      total_volume: 2340000000,
      market_cap: 44100000000,
    },
    {
      id: "polkadot",
      name: "Polkadot",
      symbol: "DOT",
      current_price: 7.23,
      price_change_percentage_24h: 1.45,
      total_volume: 450000000,
      market_cap: 9500000000,
    },
    {
      id: "avalanche-2",
      name: "Avalanche",
      symbol: "AVAX",
      current_price: 21.45,
      price_change_percentage_24h: -2.34,
      total_volume: 320000000,
      market_cap: 8200000000,
    },
    {
      id: "polygon",
      name: "Polygon",
      symbol: "MATIC",
      current_price: 0.89,
      price_change_percentage_24h: 3.21,
      total_volume: 280000000,
      market_cap: 8700000000,
    },
    {
      id: "chainlink",
      name: "Chainlink",
      symbol: "LINK",
      current_price: 15.67,
      price_change_percentage_24h: -1.89,
      total_volume: 340000000,
      market_cap: 9200000000,
    },
    {
      id: "litecoin",
      name: "Litecoin",
      symbol: "LTC",
      current_price: 89.34,
      price_change_percentage_24h: 2.12,
      total_volume: 560000000,
      market_cap: 6600000000,
    },
    {
      id: "stellar",
      name: "Stellar",
      symbol: "XLM",
      current_price: 0.1234,
      price_change_percentage_24h: -0.87,
      total_volume: 120000000,
      market_cap: 3600000000,
    },
    {
      id: "uniswap",
      name: "Uniswap",
      symbol: "UNI",
      current_price: 6.78,
      price_change_percentage_24h: 1.56,
      total_volume: 89000000,
      market_cap: 5100000000,
    },
    {
      id: "algorand",
      name: "Algorand",
      symbol: "ALGO",
      current_price: 0.2456,
      price_change_percentage_24h: -2.34,
      total_volume: 67000000,
      market_cap: 2000000000,
    },
    {
      id: "cosmos",
      name: "Cosmos",
      symbol: "ATOM",
      current_price: 9.87,
      price_change_percentage_24h: 0.98,
      total_volume: 145000000,
      market_cap: 3800000000,
    },
    {
      id: "vechain",
      name: "VeChain",
      symbol: "VET",
      current_price: 0.0345,
      price_change_percentage_24h: 4.23,
      total_volume: 78000000,
      market_cap: 2500000000,
    },
    {
      id: "internet-computer",
      name: "Internet Computer",
      symbol: "ICP",
      current_price: 12.34,
      price_change_percentage_24h: -3.45,
      total_volume: 123000000,
      market_cap: 5700000000,
    },
    {
      id: "filecoin",
      name: "Filecoin",
      symbol: "FIL",
      current_price: 5.67,
      price_change_percentage_24h: 2.89,
      total_volume: 234000000,
      market_cap: 2600000000,
    },
    {
      id: "the-graph",
      name: "The Graph",
      symbol: "GRT",
      current_price: 0.2345,
      price_change_percentage_24h: -1.23,
      total_volume: 89000000,
      market_cap: 2200000000,
    },
    {
      id: "aave",
      name: "Aave",
      symbol: "AAVE",
      current_price: 98.76,
      price_change_percentage_24h: 1.45,
      total_volume: 145000000,
      market_cap: 1450000000,
    },
    {
      id: "compound",
      name: "Compound",
      symbol: "COMP",
      current_price: 67.89,
      price_change_percentage_24h: -2.34,
      total_volume: 56000000,
      market_cap: 890000000,
    },
  ];
}
