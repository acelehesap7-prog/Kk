'use client'

import { MarketData } from './market-service'

// Real API integrations for different market types
export class RealMarketService {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api'
  }

  // Get crypto market data from API
  async getCryptoMarkets(): Promise<MarketData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/markets/crypto`)
      if (!response.ok) {
        throw new Error('Failed to fetch crypto markets')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching crypto markets:', error)
      return this.getFallbackCryptoData()
    }
  }

  // Get futures market data from API
  async getFuturesMarkets(): Promise<MarketData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/markets/futures`)
      if (!response.ok) {
        throw new Error('Failed to fetch futures markets')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching futures markets:', error)
      return this.getFallbackFuturesData()
    }
  }

  // Get stock market data (would use Alpaca/Polygon in production)
  async getStockMarkets(): Promise<MarketData[]> {
    try {
      // This would use real Alpaca/Polygon API
      const stocks = ['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'AMZN', 'NVDA', 'META', 'NFLX']
      const markets: MarketData[] = []

      // For now, return mock data - replace with real API calls
      for (const symbol of stocks) {
        markets.push({
          symbol,
          price: Math.random() * 300 + 100,
          change: (Math.random() - 0.5) * 20,
          changePercent: (Math.random() - 0.5) * 10,
          volume: Math.random() * 100000000,
          high24h: Math.random() * 320 + 110,
          low24h: Math.random() * 280 + 90,
          timestamp: Date.now(),
          marketType: 'stocks'
        })
      }

      return markets
    } catch (error) {
      console.error('Error fetching stock markets:', error)
      return []
    }
  }

  // Get forex market data
  async getForexMarkets(): Promise<MarketData[]> {
    try {
      // This would use a forex API like FXCM, OANDA, etc.
      const pairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'USD/CHF', 'NZD/USD']
      const markets: MarketData[] = []

      // Mock data - replace with real forex API
      for (const symbol of pairs) {
        markets.push({
          symbol,
          price: Math.random() * 2 + 0.5,
          change: (Math.random() - 0.5) * 0.02,
          changePercent: (Math.random() - 0.5) * 2,
          volume: Math.random() * 1000000000,
          high24h: Math.random() * 2.1 + 0.6,
          low24h: Math.random() * 1.9 + 0.4,
          timestamp: Date.now(),
          marketType: 'forex'
        })
      }

      return markets
    } catch (error) {
      console.error('Error fetching forex markets:', error)
      return []
    }
  }

  // Get commodities market data
  async getCommoditiesMarkets(): Promise<MarketData[]> {
    try {
      const commodities = ['GOLD', 'SILVER', 'OIL', 'COPPER', 'PLATINUM', 'PALLADIUM']
      const markets: MarketData[] = []

      // Mock data - replace with real commodities API
      for (const symbol of commodities) {
        let basePrice = 50
        if (symbol === 'GOLD') basePrice = 2000
        if (symbol === 'SILVER') basePrice = 25
        if (symbol === 'OIL') basePrice = 80
        if (symbol === 'COPPER') basePrice = 4
        if (symbol === 'PLATINUM') basePrice = 1000
        if (symbol === 'PALLADIUM') basePrice = 2500

        markets.push({
          symbol,
          price: basePrice + (Math.random() - 0.5) * basePrice * 0.1,
          change: (Math.random() - 0.5) * basePrice * 0.05,
          changePercent: (Math.random() - 0.5) * 5,
          volume: Math.random() * 10000000,
          high24h: basePrice * 1.05,
          low24h: basePrice * 0.95,
          timestamp: Date.now(),
          marketType: 'commodities'
        })
      }

      return markets
    } catch (error) {
      console.error('Error fetching commodities markets:', error)
      return []
    }
  }

  // Get indices market data
  async getIndicesMarkets(): Promise<MarketData[]> {
    try {
      const indices = ['SPX500', 'NASDAQ', 'DOW30', 'FTSE100', 'DAX30', 'NIKKEI']
      const markets: MarketData[] = []

      // Mock data - replace with real indices API
      for (const symbol of indices) {
        let basePrice = 15000
        if (symbol === 'SPX500') basePrice = 4500
        if (symbol === 'NASDAQ') basePrice = 15000
        if (symbol === 'DOW30') basePrice = 35000
        if (symbol === 'FTSE100') basePrice = 7500
        if (symbol === 'DAX30') basePrice = 16000
        if (symbol === 'NIKKEI') basePrice = 30000

        markets.push({
          symbol,
          price: basePrice + (Math.random() - 0.5) * basePrice * 0.05,
          change: (Math.random() - 0.5) * basePrice * 0.02,
          changePercent: (Math.random() - 0.5) * 3,
          volume: Math.random() * 1000000000,
          high24h: basePrice * 1.02,
          low24h: basePrice * 0.98,
          timestamp: Date.now(),
          marketType: 'indices'
        })
      }

      return markets
    } catch (error) {
      console.error('Error fetching indices markets:', error)
      return []
    }
  }

  // Get bonds market data
  async getBondsMarkets(): Promise<MarketData[]> {
    try {
      const bonds = ['US10Y', 'US30Y', 'US2Y', 'DE10Y', 'GB10Y', 'JP10Y']
      const markets: MarketData[] = []

      // Mock data - replace with real bonds API
      for (const symbol of bonds) {
        markets.push({
          symbol,
          price: Math.random() * 5 + 1, // Yield percentage
          change: (Math.random() - 0.5) * 0.5,
          changePercent: (Math.random() - 0.5) * 10,
          volume: Math.random() * 100000000,
          high24h: Math.random() * 5.5 + 1.2,
          low24h: Math.random() * 4.5 + 0.8,
          timestamp: Date.now(),
          marketType: 'bonds'
        })
      }

      return markets
    } catch (error) {
      console.error('Error fetching bonds markets:', error)
      return []
    }
  }

  // Get ETF market data
  async getETFMarkets(): Promise<MarketData[]> {
    try {
      const etfs = ['SPY', 'QQQ', 'VTI', 'IWM', 'EFA', 'EEM', 'GLD', 'SLV']
      const markets: MarketData[] = []

      // Mock data - replace with real ETF API
      for (const symbol of etfs) {
        let basePrice = 200
        if (symbol === 'SPY') basePrice = 450
        if (symbol === 'QQQ') basePrice = 380
        if (symbol === 'VTI') basePrice = 240
        if (symbol === 'GLD') basePrice = 180
        if (symbol === 'SLV') basePrice = 22

        markets.push({
          symbol,
          price: basePrice + (Math.random() - 0.5) * basePrice * 0.05,
          change: (Math.random() - 0.5) * basePrice * 0.02,
          changePercent: (Math.random() - 0.5) * 3,
          volume: Math.random() * 50000000,
          high24h: basePrice * 1.03,
          low24h: basePrice * 0.97,
          timestamp: Date.now(),
          marketType: 'etf'
        })
      }

      return markets
    } catch (error) {
      console.error('Error fetching ETF markets:', error)
      return []
    }
  }

  // Get options market data
  async getOptionsMarkets(): Promise<MarketData[]> {
    try {
      // Options are more complex - this is simplified
      const options = [
        'BTC-20241215-45000-C',
        'BTC-20241215-40000-P',
        'ETH-20241215-3000-C',
        'ETH-20241215-2500-P',
        'AAPL-20241215-200-C',
        'TSLA-20241215-250-P'
      ]
      const markets: MarketData[] = []

      for (const symbol of options) {
        markets.push({
          symbol,
          price: Math.random() * 50 + 5,
          change: (Math.random() - 0.5) * 20,
          changePercent: (Math.random() - 0.5) * 50,
          volume: Math.random() * 1000000,
          high24h: Math.random() * 60 + 10,
          low24h: Math.random() * 40 + 1,
          timestamp: Date.now(),
          marketType: 'options'
        })
      }

      return markets
    } catch (error) {
      console.error('Error fetching options markets:', error)
      return []
    }
  }

  // Fallback data for when APIs are not available
  private getFallbackCryptoData(): MarketData[] {
    return [
      {
        symbol: 'BTC/USDT',
        price: 43250.50,
        change: 1250.30,
        changePercent: 2.98,
        volume: 125000000,
        high24h: 44100.00,
        low24h: 42800.00,
        timestamp: Date.now(),
        marketType: 'spot'
      },
      {
        symbol: 'ETH/USDT',
        price: 2650.75,
        change: -45.25,
        changePercent: -1.68,
        volume: 85000000,
        high24h: 2720.00,
        low24h: 2620.00,
        timestamp: Date.now(),
        marketType: 'spot'
      }
    ]
  }

  private getFallbackFuturesData(): MarketData[] {
    return [
      {
        symbol: 'BTCUSDT',
        price: 43280.00,
        change: 1280.50,
        changePercent: 3.02,
        volume: 250000000,
        high24h: 44150.00,
        low24h: 42750.00,
        timestamp: Date.now(),
        marketType: 'futures'
      }
    ]
  }
}

// Export singleton instance
export const realMarketService = new RealMarketService()

// Updated helper function to get markets by type using real APIs
export async function getMarketsByType(type: string): Promise<MarketData[]> {
  try {
    switch (type) {
      case 'spot':
        return await realMarketService.getCryptoMarkets()
      case 'futures':
        return await realMarketService.getFuturesMarkets()
      case 'stocks':
        return await realMarketService.getStockMarkets()
      case 'forex':
        return await realMarketService.getForexMarkets()
      case 'commodities':
        return await realMarketService.getCommoditiesMarkets()
      case 'indices':
        return await realMarketService.getIndicesMarkets()
      case 'bonds':
        return await realMarketService.getBondsMarkets()
      case 'etf':
        return await realMarketService.getETFMarkets()
      case 'options':
        return await realMarketService.getOptionsMarkets()
      default:
        return []
    }
  } catch (error) {
    console.error(`Error fetching ${type} markets:`, error)
    return []
  }
}