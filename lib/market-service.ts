'use client'

import { z } from 'zod'
import ccxt from 'ccxt'
import { IMarketService, MarketData, OrderBook } from '../types/market.types'

export interface OrderBookEntry {
  price: number
  quantity: number
}

export interface Trade {
  id: string
  symbol: string
  price: number
  quantity: number
  side: 'buy' | 'sell'
  timestamp: number
}

export abstract class MarketService implements IMarketService {
  abstract getMarketData(symbol: string, marketType: string): Promise<MarketData>
  abstract getOrderBook(symbol: string, marketType: string): Promise<OrderBook>
  abstract getCryptoMarkets(): Promise<MarketData[]>
  abstract getForexRates(): Promise<MarketData[]>
  abstract getStockMarkets(): Promise<MarketData[]>
  abstract getFuturesMarkets(): Promise<MarketData[]>
  abstract getCommoditiesMarkets(): Promise<MarketData[]>
  abstract getIndicesMarkets(): Promise<MarketData[]>
  abstract getOptionsMarkets(): Promise<MarketData[]>
  abstract getBondsMarkets(): Promise<MarketData[]>
  abstract getETFMarkets(): Promise<MarketData[]>
}

// Helper function to get markets by type
export async function getMarketsByType(type: string): Promise<MarketData[]> {
  // Mock data for different market types
  const mockData: Record<string, MarketData[]> = {
    spot: [
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
    ],
    futures: [
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
    ],
    options: [
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
      }
    ]
  }

  return mockData[type] || []
}