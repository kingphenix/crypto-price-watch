"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, TrendingDown, DollarSign, BarChart3, RefreshCw, AlertCircle } from "lucide-react";
import { fetchCryptoPrices, getMockCryptoData, testCoinGeckoAPI, type CryptoCurrency } from "@/lib/crypto-api";

// Transform API data to match UI expectations
const transformCryptoData = (apiData: CryptoCurrency[]): any[] => {
  return apiData.map((coin) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    current_price: coin.current_price,
    price_change_percentage_24h: coin.price_change_percentage_24h,
    total_volume: coin.total_volume,
    market_cap: coin.market_cap,
  }));
};

export default function CryptoDashboard() {
  const [cryptoData, setCryptoData] = useState<any[]>(getMockCryptoData());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadCryptoData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Starting to load crypto data...');
      
      // Test API connectivity first
      const apiAvailable = await testCoinGeckoAPI();
      console.log('CoinGecko API available:', apiAvailable);
      
      if (!apiAvailable) {
        throw new Error('CoinGecko API is not accessible');
      }
      
      const data = await fetchCryptoPrices();
      const transformedData = transformCryptoData(data);
      console.log('Transformed data length:', transformedData.length);
      setCryptoData(transformedData);
      setLastUpdated(new Date());
      console.log('Successfully loaded data for', data.length, 'cryptocurrencies');
    } catch (err) {
      console.error('Failed to fetch crypto data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to load cryptocurrency data: ${errorMessage}. Using mock data.`);
      // Fallback to mock data if API fails
      const mockData = getMockCryptoData();
      console.log('Falling back to mock data, length:', mockData.length);
      setCryptoData(mockData);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCryptoData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      console.log('Auto-refreshing crypto data...');
      loadCryptoData();
    }, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const filteredData = cryptoData.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('Filtered data length:', filteredData.length);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: price < 1 ? 4 : 2,
      maximumFractionDigits: price < 1 ? 4 : 2,
    }).format(price);
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `$${marketCap.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cryptocurrency data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Crypto Price Watch</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search cryptocurrencies..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10"
                />
              </div>
              <Button
                onClick={loadCryptoData}
                disabled={loading}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
                title={loading ? "Refreshing prices..." : "Click to refresh prices"}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? "Refreshing..." : "Refresh"}</span>
              </Button>
            </div>
          </div>
          {lastUpdated && (
            <div className="mt-2 text-sm text-gray-500 flex items-center">
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${loading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></span>
              Last updated: {lastUpdated.toLocaleTimeString()}
              {loading && <span className="ml-2 text-blue-600">Updating...</span>}
            </div>
          )}
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-4 mt-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
            <div className="flex-1">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
            <Button
              onClick={loadCryptoData}
              variant="outline"
              size="sm"
              className="ml-4"
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cryptocurrencies</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredData.length}</div>
              <p className="text-xs text-muted-foreground">Tracked coins</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${formatMarketCap(filteredData.reduce((sum, crypto) => sum + crypto.total_volume, 0))}
              </div>
              <p className="text-xs text-muted-foreground">Total trading volume</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${formatMarketCap(filteredData.reduce((sum, crypto) => sum + crypto.market_cap, 0))}
              </div>
              <p className="text-xs text-muted-foreground">Total market cap</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Change</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredData.length > 0
                  ? `${(filteredData.reduce((sum, crypto) => sum + crypto.price_change_percentage_24h, 0) / filteredData.length).toFixed(2)}%`
                  : "0%"
                }
              </div>
              <p className="text-xs text-muted-foreground">24h average change</p>
            </CardContent>
          </Card>
        </div>

        {/* Cryptocurrency Table */}
        <Card>
          <CardHeader>
            <CardTitle>Cryptocurrency Prices</CardTitle>
            <CardDescription>
              Real-time prices and market data for top cryptocurrencies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium">#</th>
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Price</th>
                    <th className="pb-3 font-medium hidden sm:table-cell">24h Change</th>
                    <th className="pb-3 font-medium hidden md:table-cell">Volume</th>
                    <th className="pb-3 font-medium hidden lg:table-cell">Market Cap</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((crypto, index) => (
                    <tr key={crypto.id} className="border-b last:border-0">
                      <td className="py-3 font-medium text-gray-500">
                        #{index + 1}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center space-x-3">
                          <div>
                            <div className="font-medium">{crypto.name}</div>
                            <div className="text-sm text-gray-500 uppercase">{crypto.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 font-mono font-medium">
                        {formatPrice(crypto.current_price)}
                      </td>
                      <td className="py-3 hidden sm:table-cell">
                        <Badge
                          variant={crypto.price_change_percentage_24h >= 0 ? "default" : "destructive"}
                          className={`${
                            crypto.price_change_percentage_24h >= 0
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                          }`}
                        >
                          {crypto.price_change_percentage_24h >= 0 ? "+" : ""}
                          {crypto.price_change_percentage_24h?.toFixed(2) || 0}%
                        </Badge>
                      </td>
                      <td className="py-3 hidden md:table-cell font-mono text-sm text-gray-600">
                        ${crypto.total_volume?.toLocaleString() || 0}
                      </td>
                      <td className="py-3 hidden lg:table-cell font-mono text-sm text-gray-600">
                        {formatMarketCap(crypto.market_cap || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="mt-6 space-y-4 sm:hidden">
              {filteredData.map((crypto, index) => (
                <Card key={crypto.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="font-medium text-gray-500 text-sm">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{crypto.name}</div>
                        <div className="text-sm text-gray-500 uppercase">{crypto.symbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-medium">{formatPrice(crypto.current_price)}</div>
                      <Badge
                        variant={crypto.price_change_percentage_24h >= 0 ? "default" : "destructive"}
                        className={`mt-1 text-xs ${
                          crypto.price_change_percentage_24h >= 0
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                        }`}
                      >
                        {crypto.price_change_percentage_24h >= 0 ? "+" : ""}
                        {crypto.price_change_percentage_24h?.toFixed(2) || 0}%
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Volume</div>
                      <div className="font-mono">${crypto.total_volume?.toLocaleString() || 0}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Market Cap</div>
                      <div className="font-mono">{formatMarketCap(crypto.market_cap || 0)}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
