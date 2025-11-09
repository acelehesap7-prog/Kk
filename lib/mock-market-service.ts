import { IMarketService, MarketData, OrderBook } from '@/types/market.types'
import { MarketService } from './market-service'

export class MockMarketService extends MarketService {
  async getOrderBook(symbol: string, marketType: string): Promise<OrderBook> {
    return {
      symbol,
      bids: [
        [43200.50, 1.5],
        [43150.25, 2.8],
        [43100.00, 5.0]
      ],
      asks: [
        [43300.75, 1.2],
        [43350.50, 3.5],
        [43400.25, 4.0]
      ],
      timestamp: Date.now()
    }
  }

  async getMarketData(symbol: string, marketType: string): Promise<MarketData> {
    return {
      symbol,
      price: 43250.50,
      change: 1250.30,
      changePercent: 2.98,
      volume: 125000000,
      high24h: 44100.00,
      low24h: 42800.00,
      timestamp: Date.now(),
      marketType
    }
  }

  async getCryptoMarkets(): Promise<MarketData[]> {
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

  async getForexRates(): Promise<MarketData[]> {
    return [
      {
        symbol: 'EUR/USD',
        price: 1.0925,
        change: 0.0015,
        changePercent: 0.14,
        volume: 125000000,
        high24h: 1.0950,
        low24h: 1.0900,
        timestamp: Date.now(),
        marketType: 'forex'
      },
      {
        symbol: 'GBP/USD',
        price: 1.2650,
        change: -0.0025,
        changePercent: -0.20,
        volume: 85000000,
        high24h: 1.2700,
        low24h: 1.2600,
        timestamp: Date.now(),
        marketType: 'forex'
      }
    ]
  }

  async getStockMarkets(): Promise<MarketData[]> {
    return [
      {
        symbol: 'AAPL',
        price: 175.50,
        change: 2.30,
        changePercent: 1.33,
        volume: 55000000,
        high24h: 176.00,
        low24h: 173.50,
        timestamp: Date.now(),
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