'use client'

import { MarketData, OrderBookEntry } from './market-service'
import ccxt from 'ccxt'

// Supported exchange instances
const exchanges = {
  binance: new ccxt.binance(),
  kraken: new ccxt.kraken(),
  kucoin: new ccxt.kucoin(),
}

export class RealMarketService {
  private static instance: RealMarketService
  private marketData: Map<string, MarketData> = new Map()

  private constructor() {
    this.initializeExchanges()
  }

  static getInstance(): RealMarketService {
    if (!RealMarketService.instance) {
      RealMarketService.instance = new RealMarketService()
    }
    return RealMarketService.instance
  }

  private async initializeExchanges() {
    // Load markets for each exchange
    for (const exchange of Object.values(exchanges)) {
      await exchange.loadMarkets()
    }
  }

  async getMarketData(symbol: string, marketType: string): Promise<MarketData> {
    const key = `${marketType}:${symbol}`
    let data = this.marketData.get(key)

    if (!data || Date.now() - data.timestamp > 10000) { // Refresh every 10 seconds
      data = await this.fetchMarketData(symbol, marketType)
      this.marketData.set(key, data)
    }

    return data
  }

  private async fetchMarketData(symbol: string, marketType: string): Promise<MarketData> {
    try {
      // Select appropriate exchange based on market type
      const exchange = this.getExchangeForMarket(marketType)
      
      const ticker = await exchange.fetchTicker(symbol)
      
      return {
        symbol,
        price: ticker.last,
        change: ticker.change || 0,
        changePercent: ticker.percentage || 0,
        volume: ticker.baseVolume || 0,
        high24h: ticker.high || 0,
        low24h: ticker.low || 0,
        timestamp: Date.now(),
        marketType
      }
    } catch (error) {
      console.error(`Error fetching market data for ${symbol}:`, error)
      throw error
    }
  }

  async getOrderBook(symbol: string, marketType: string): Promise<{ bids: OrderBookEntry[], asks: OrderBookEntry[] }> {
    try {
      const exchange = this.getExchangeForMarket(marketType)
      const orderbook = await exchange.fetchOrderBook(symbol)

      return {
        bids: orderbook.bids.map(([price, amount]) => ({ price, amount })),
        asks: orderbook.asks.map(([price, amount]) => ({ price, amount }))
      }
    } catch (error) {
      console.error(`Error fetching order book for ${symbol}:`, error)
      throw error
    }
  }

  private getExchangeForMarket(marketType: string): ccxt.Exchange {
    switch (marketType.toLowerCase()) {
      case 'spot':
      case 'stocks':
        return exchanges.binance
      case 'forex':
        return exchanges.kraken
      case 'crypto':
        return exchanges.kucoin
      default:
        throw new Error(`Unsupported market type: ${marketType}`)
    }
  }

  // Additional methods for specific market types
  async getForexRates(): Promise<MarketData[]> {
    const exchange = exchanges.kraken
    const symbols = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF']
    return Promise.all(symbols.map(symbol => this.getMarketData(symbol, 'forex')))
  }

  async getCryptoMarkets(): Promise<MarketData[]> {
    const exchange = exchanges.kucoin
    const symbols = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'XRP/USDT']
    return Promise.all(symbols.map(symbol => this.getMarketData(symbol, 'crypto')))
  }

  async getStockMarkets(): Promise<MarketData[]> {
    // Note: Will need to integrate with a stock market API
    // For now using sample stock symbols from supported exchanges
    const symbols = ['AAPL/USD', 'GOOGL/USD', 'MSFT/USD', 'AMZN/USD']
    return Promise.all(symbols.map(symbol => this.getMarketData(symbol, 'stocks')))
  }
}
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

  // Get stock market data from API
  async getStockMarkets(): Promise<MarketData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/markets/stocks`)
      if (!response.ok) {
        throw new Error('Failed to fetch stock markets')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching stock markets:', error)
      return this.getFallbackStockData()
    }
  }

  // Get forex market data from API
  async getForexMarkets(): Promise<MarketData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/markets/forex`)
      if (!response.ok) {
        throw new Error('Failed to fetch forex markets')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching forex markets:', error)
      return this.getFallbackForexData()
    }
  }

  // Get commodities market data from API
  async getCommoditiesMarkets(): Promise<MarketData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/markets/commodities`)
      if (!response.ok) {
        throw new Error('Failed to fetch commodities markets')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching commodities markets:', error)
      return this.getFallbackCommoditiesData()
    }
  }

  // Get indices market data from API
  async getIndicesMarkets(): Promise<MarketData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/markets/indices`)
      if (!response.ok) {
        throw new Error('Failed to fetch indices markets')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching indices markets:', error)
      return this.getFallbackIndicesData()
    }
  }

  // Get options market data from API
  async getOptionsMarkets(): Promise<MarketData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/markets/options`)
      if (!response.ok) {
        throw new Error('Failed to fetch options markets')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching options markets:', error)
      return this.getFallbackOptionsData()
    }
  }

  // Get bonds market data from API
  async getBondsMarkets(): Promise<MarketData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/markets/bonds`)
      if (!response.ok) {
        throw new Error('Failed to fetch bonds markets')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching bonds markets:', error)
      return this.getFallbackBondsData()
    }
  }

  // Get ETF market data from API
  async getETFMarkets(): Promise<MarketData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/markets/etf`)
      if (!response.ok) {
        throw new Error('Failed to fetch ETF markets')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching ETF markets:', error)
      return this.getFallbackETFData()
    }
  }

  // Fallback data methods
  private getFallbackCryptoData(): MarketData[] {
    return [
      {
        symbol: 'BTC/USDT',
        price: 43250.50,
        change: 1250.30,
        changePercent: 2.98,
        volume: 28500000000,
        high24h: 44100.00,
        low24h: 42800.00,
        timestamp: Date.now(),
        marketType: 'spot'
      },
      {
        symbol: 'ETH/USDT',
        price: 2650.75,
        change: -85.25,
        changePercent: -3.11,
        volume: 15200000000,
        high24h: 2750.00,
        low24h: 2620.00,
        timestamp: Date.now(),
        marketType: 'spot'
      },
      {
        symbol: 'BNB/USDT',
        price: 315.80,
        change: 12.45,
        changePercent: 4.10,
        volume: 850000000,
        high24h: 320.00,
        low24h: 305.00,
        timestamp: Date.now(),
        marketType: 'spot'
      }
    ]
  }

  private getFallbackFuturesData(): MarketData[] {
    return [
      {
        symbol: 'BTCUSDT',
        price: 43180.25,
        change: 1180.50,
        changePercent: 2.81,
        volume: 45000000000,
        high24h: 44050.00,
        low24h: 42750.00,
        timestamp: Date.now(),
        marketType: 'futures'
      },
      {
        symbol: 'ETHUSDT',
        price: 2645.30,
        change: -92.15,
        changePercent: -3.37,
        volume: 22000000000,
        high24h: 2740.00,
        low24h: 2615.00,
        timestamp: Date.now(),
        marketType: 'futures'
      }
    ]
  }

  private getFallbackStockData(): MarketData[] {
    return [
      {
        symbol: 'AAPL',
        price: 185.25,
        change: 2.15,
        changePercent: 1.17,
        volume: 45000000,
        high24h: 186.50,
        low24h: 182.80,
        timestamp: Date.now(),
        marketType: 'stocks'
      },
      {
        symbol: 'TSLA',
        price: 248.75,
        change: -8.25,
        changePercent: -3.21,
        volume: 85000000,
        high24h: 258.00,
        low24h: 245.50,
        timestamp: Date.now(),
        marketType: 'stocks'
      }
    ]
  }

  private getFallbackForexData(): MarketData[] {
    return [
      {
        symbol: 'EUR/USD',
        price: 1.0875,
        change: 0.0025,
        changePercent: 0.23,
        volume: 1500000000,
        high24h: 1.0895,
        low24h: 1.0845,
        timestamp: Date.now(),
        marketType: 'forex'
      },
      {
        symbol: 'GBP/USD',
        price: 1.2650,
        change: -0.0085,
        changePercent: -0.67,
        volume: 850000000,
        high24h: 1.2745,
        low24h: 1.2635,
        timestamp: Date.now(),
        marketType: 'forex'
      }
    ]
  }

  private getFallbackCommoditiesData(): MarketData[] {
    return [
      {
        symbol: 'GOLD',
        price: 2045.50,
        change: 15.25,
        changePercent: 0.75,
        volume: 125000000,
        high24h: 2055.00,
        low24h: 2025.00,
        timestamp: Date.now(),
        marketType: 'commodities'
      },
      {
        symbol: 'OIL',
        price: 78.45,
        change: -2.15,
        changePercent: -2.67,
        volume: 85000000,
        high24h: 81.25,
        low24h: 77.80,
        timestamp: Date.now(),
        marketType: 'commodities'
      }
    ]
  }

  private getFallbackIndicesData(): MarketData[] {
    return [
      {
        symbol: 'S&P500',
        price: 4485.25,
        change: 25.80,
        changePercent: 0.58,
        volume: 2500000000,
        high24h: 4495.00,
        low24h: 4465.00,
        timestamp: Date.now(),
        marketType: 'indices'
      },
      {
        symbol: 'NASDAQ',
        price: 13875.50,
        change: -85.25,
        changePercent: -0.61,
        volume: 1800000000,
        high24h: 13950.00,
        low24h: 13825.00,
        timestamp: Date.now(),
        marketType: 'indices'
      }
    ]
  }

  private getFallbackOptionsData(): MarketData[] {
    return [
      {
        symbol: 'AAPL-C-190',
        price: 8.50,
        change: 1.25,
        changePercent: 17.24,
        volume: 15000,
        high24h: 9.00,
        low24h: 7.25,
        timestamp: Date.now(),
        marketType: 'options'
      },
      {
        symbol: 'TSLA-P-250',
        price: 12.75,
        change: 3.50,
        changePercent: 37.84,
        volume: 8500,
        high24h: 13.25,
        low24h: 9.25,
        timestamp: Date.now(),
        marketType: 'options'
      }
    ]
  }

  private getFallbackBondsData(): MarketData[] {
    return [
      {
        symbol: 'US10Y',
        price: 4.25,
        change: 0.05,
        changePercent: 1.19,
        volume: 850000000,
        high24h: 4.28,
        low24h: 4.18,
        timestamp: Date.now(),
        marketType: 'bonds'
      },
      {
        symbol: 'US30Y',
        price: 4.45,
        change: 0.08,
        changePercent: 1.83,
        volume: 450000000,
        high24h: 4.48,
        low24h: 4.35,
        timestamp: Date.now(),
        marketType: 'bonds'
      }
    ]
  }

  private getFallbackETFData(): MarketData[] {
    return [
      {
        symbol: 'SPY',
        price: 448.75,
        change: 2.85,
        changePercent: 0.64,
        volume: 85000000,
        high24h: 450.25,
        low24h: 446.50,
        timestamp: Date.now(),
        marketType: 'etf'
      },
      {
        symbol: 'QQQ',
        price: 375.50,
        change: -3.25,
        changePercent: -0.86,
        volume: 65000000,
        high24h: 379.00,
        low24h: 374.25,
        timestamp: Date.now(),
        marketType: 'etf'
      }
    ]
  }
}

// Helper function to get markets by type
export async function getMarketsByType(type: string): Promise<MarketData[]> {
  const service = new RealMarketService()
  
  switch (type) {
    case 'spot':
    case 'crypto':
      return service.getCryptoMarkets()
    case 'futures':
      return service.getFuturesMarkets()
    case 'stocks':
      return service.getStockMarkets()
    case 'forex':
      return service.getForexMarkets()
    case 'commodities':
      return service.getCommoditiesMarkets()
    case 'indices':
      return service.getIndicesMarkets()
    case 'options':
      return service.getOptionsMarkets()
    case 'bonds':
      return service.getBondsMarkets()
    case 'etf':
      return service.getETFMarkets()
    default:
      return []
  }
}

// Export singleton instance
export const realMarketService = new RealMarketService()