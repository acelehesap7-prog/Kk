import { IMarketService, MarketData, OrderBook } from '@/types/market.types'
import { MarketService } from './market-service'

// Generate random price change
function randomPriceChange(basePrice: number): {price: number, change: number, changePercent: number} {
  const change = (Math.random() - 0.5) * basePrice * 0.1
  const price = basePrice + change
  const changePercent = (change / basePrice) * 100

  return {
    price: Number(price.toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2))
  }
}

// Generate random market data
function generateMarketData(symbol: string, basePrice: number, marketType: string): MarketData {
  const { price, change, changePercent } = randomPriceChange(basePrice)
  const volume = Math.floor(Math.random() * 1000000) + 100000
  const high24h = price * (1 + Math.random() * 0.1)
  const low24h = price * (1 - Math.random() * 0.1)

  return {
    symbol,
    price,
    change,
    changePercent,
    volume,
    high24h: Number(high24h.toFixed(2)),
    low24h: Number(low24h.toFixed(2)),
    timestamp: Date.now(),
    marketType
  }
}

export class MockMarketService extends MarketService {
  private marketCache: Map<string, MarketData> = new Map()

  async getMarketData(symbol: string, marketType: string): Promise<MarketData> {
    const key = `${marketType}:${symbol}`
    let data = this.marketCache.get(key)

    if (!data || Date.now() - data.timestamp > 5000) {
      const basePrice = data?.price || this.getBasePrice(symbol)
      data = generateMarketData(symbol, basePrice, marketType)
      this.marketCache.set(key, data)
    }

    return data
  }

  async getOrderBook(symbol: string, marketType: string): Promise<OrderBook> {
    const marketData = await this.getMarketData(symbol, marketType)
    const price = marketData.price

    const bids: [number, number][] = Array(10).fill(0).map((_, i) => [
      Number((price * (1 - 0.001 * (i + 1))).toFixed(2)),
      Number((Math.random() * 10).toFixed(2))
    ])

    const asks: [number, number][] = Array(10).fill(0).map((_, i) => [
      Number((price * (1 + 0.001 * (i + 1))).toFixed(2)),
      Number((Math.random() * 10).toFixed(2))
    ])

    return {
      symbol,
      bids,
      asks,
      timestamp: Date.now()
    }
  }

  private getBasePrice(symbol: string): number {
    const prices: Record<string, number> = {
      'BTC/USDT': 43000,
      'ETH/USDT': 2200,
      'BNB/USDT': 300,
      'XRP/USDT': 0.5,
      'EUR/USD': 1.09,
      'GBP/USD': 1.26,
      'USD/JPY': 149.5,
      'USD/CHF': 0.89,
      'XAU/USD': 2000,
      'XAG/USD': 23,
      'WTIUSD': 75,
      'BRENT/USD': 80,
      'US30/USD': 38000,
      'US500/USD': 4800,
      'USTEC/USD': 16800,
      'UK100/USD': 7700,
      'US10Y/USD': 4.2,
      'US30Y/USD': 4.4,
      'DE10Y/EUR': 2.3,
      'UK10Y/GBP': 4.0,
      'SPY/USD': 480,
      'QQQ/USD': 420,
      'IWM/USD': 200,
      'EFA/USD': 75,
      'AAPL/USD': 180,
      'GOOGL/USD': 140,
      'MSFT/USD': 370,
      'AMZN/USD': 150
    }

    return prices[symbol] || 100 // Default price if symbol not found
  }
        marketType: 'stocks'
      },
      {
        symbol: 'MSFT',
        price: 380.75,
        change: 5.25,
        changePercent: 1.40,
        volume: 25000000,
        high24h: 382.00,
        low24h: 376.50,
        timestamp: Date.now(),
        marketType: 'stocks'
      }
    ]
  }

  async getFuturesMarkets(): Promise<MarketData[]> {
    return [
      {
        symbol: 'BTC-PERP',
        price: 43280.00,
        change: 1280.50,
        changePercent: 3.02,
        volume: 250000000,
        high24h: 44150.00,
        low24h: 42750.00,
        timestamp: Date.now(),
        marketType: 'futures'
      },
      {
        symbol: 'ETH-PERP',
        price: 2660.00,
        change: 35.50,
        changePercent: 1.35,
        volume: 150000000,
        high24h: 2680.00,
        low24h: 2620.00,
        timestamp: Date.now(),
        marketType: 'futures'
      }
    ]
  }

  async getCommoditiesMarkets(): Promise<MarketData[]> {
    return [
      {
        symbol: 'XAUUSD',
        price: 2025.50,
        change: 15.30,
        changePercent: 0.76,
        volume: 125000000,
        high24h: 2030.00,
        low24h: 2010.00,
        timestamp: Date.now(),
        marketType: 'commodities'
      },
      {
        symbol: 'XAGUSD',
        price: 23.75,
        change: 0.45,
        changePercent: 1.93,
        volume: 85000000,
        high24h: 24.00,
        low24h: 23.30,
        timestamp: Date.now(),
        marketType: 'commodities'
      }
    ]
  }

  async getIndicesMarkets(): Promise<MarketData[]> {
    return [
      {
        symbol: 'US500',
        price: 4850.75,
        change: 25.50,
        changePercent: 0.53,
        volume: 2500000000,
        high24h: 4860.00,
        low24h: 4825.00,
        timestamp: Date.now(),
        marketType: 'indices'
      },
      {
        symbol: 'US100',
        price: 17250.25,
        change: 150.75,
        changePercent: 0.88,
        volume: 1800000000,
        high24h: 17300.00,
        low24h: 17100.00,
        timestamp: Date.now(),
        marketType: 'indices'
      }
    ]
  }

  async getOptionsMarkets(): Promise<MarketData[]> {
    return [
      {
        symbol: 'BTC-20241215-45000-C',
        price: 1250.00,
        change: 125.50,
        changePercent: 11.16,
        volume: 5000000,
        high24h: 1300.00,
        low24h: 1100.00,
        timestamp: Date.now(),
        marketType: 'options'
      },
      {
        symbol: 'ETH-20241215-3000-P',
        price: 250.00,
        change: -15.50,
        changePercent: -5.84,
        volume: 2500000,
        high24h: 275.00,
        low24h: 245.00,
        timestamp: Date.now(),
        marketType: 'options'
      }
    ]
  }

  async getBondsMarkets(): Promise<MarketData[]> {
    return [
      {
        symbol: 'US10Y',
        price: 4.15,
        change: 0.05,
        changePercent: 1.22,
        volume: 500000000,
        high24h: 4.18,
        low24h: 4.10,
        timestamp: Date.now(),
        marketType: 'bonds'
      },
      {
        symbol: 'US30Y',
        price: 4.35,
        change: 0.03,
        changePercent: 0.69,
        volume: 300000000,
        high24h: 4.38,
        low24h: 4.32,
        timestamp: Date.now(),
        marketType: 'bonds'
      }
    ]
  }

  async getETFMarkets(): Promise<MarketData[]> {
    return [
      {
        symbol: 'SPY',
        price: 485.75,
        change: 2.50,
        changePercent: 0.52,
        volume: 75000000,
        high24h: 486.50,
        low24h: 483.00,
        timestamp: Date.now(),
        marketType: 'etf'
      },
      {
        symbol: 'QQQ',
        price: 420.25,
        change: 3.75,
        changePercent: 0.90,
        volume: 45000000,
        high24h: 421.00,
        low24h: 416.50,
        timestamp: Date.now(),
        marketType: 'etf'
      }
    ]
  }
}