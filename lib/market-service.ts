'use client'

import { z } from 'zod'
import ccxt from 'ccxt'

// Market data types
export interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  high24h: number
  low24h: number
  timestamp: number
  marketType: string
}

export interface OrderBookEntry {
  price: number
  quantity: number
}

export interface OrderBook {
  bids: OrderBookEntry[]
  asks: OrderBookEntry[]
  timestamp: number
}

export interface Trade {
  id: string
  symbol: string
  price: number
  quantity: number
  side: 'buy' | 'sell'
  timestamp: number
}

// Market service class
export class MarketService {
  private ws: WebSocket | null = null
  private subscribers: Map<string, Set<(data: any) => void>> = new Map()

  constructor(private baseUrl: string) {}

  // Subscribe to market data updates
  subscribe(symbol: string, callback: (data: MarketData) => void) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set())
    }
    this.subscribers.get(symbol)?.add(callback)

    // Connect WebSocket if not already connected
    if (!this.ws) {
      this.connectWebSocket()
    }
  }

  // Unsubscribe from market data updates
  unsubscribe(symbol: string, callback: (data: MarketData) => void) {
    const symbolSubscribers = this.subscribers.get(symbol)
    if (symbolSubscribers) {
      symbolSubscribers.delete(callback)
      if (symbolSubscribers.size === 0) {
        this.subscribers.delete(symbol)
      }
    }
  }

  // Get market data for a symbol
  async getMarketData(symbol: string): Promise<MarketData> {
    const response = await fetch(`${this.baseUrl}/api/market/${symbol}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch market data for ${symbol}`)
    }
    return response.json()
  }

  // Get order book for a symbol
  async getOrderBook(symbol: string): Promise<OrderBook> {
    const response = await fetch(`${this.baseUrl}/api/orderbook/${symbol}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch order book for ${symbol}`)
    }
    return response.json()
  }

  // Get recent trades for a symbol
  async getTrades(symbol: string, limit = 50): Promise<Trade[]> {
    const response = await fetch(`${this.baseUrl}/api/trades/${symbol}?limit=${limit}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch trades for ${symbol}`)
    }
    return response.json()
  }

  // Connect to WebSocket for real-time updates
  private connectWebSocket() {
    if (typeof window === 'undefined') return // Server-side rendering check

    try {
      const wsUrl = this.baseUrl.replace('http', 'ws') + '/ws'
      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = () => {
        console.log('WebSocket connected')
        // Subscribe to all symbols we're interested in
        for (const symbol of this.subscribers.keys()) {
          this.ws?.send(JSON.stringify({ type: 'subscribe', symbol }))
        }
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          const subscribers = this.subscribers.get(data.symbol)
          if (subscribers) {
            subscribers.forEach(callback => callback(data))
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      this.ws.onclose = () => {
        console.log('WebSocket disconnected')
        this.ws = null
        // Attempt to reconnect after 5 seconds
        setTimeout(() => this.connectWebSocket(), 5000)
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
    }
  }

  // Disconnect WebSocket
  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.subscribers.clear()
  }
}

// Create market service instances for different exchanges
export const binanceService = new MarketService('https://api.binance.com')
export const kucoinService = new MarketService('https://api.kucoin.com')
export const okxService = new MarketService('https://www.okx.com')
export const bybitService = new MarketService('https://api.bybit.com')

// Default market service
export const marketService = binanceService

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
        timestamp: Date.now()
      },
      {
        symbol: 'ETH/USDT',
        price: 2650.75,
        change: -45.25,
        changePercent: -1.68,
        volume: 85000000,
        high24h: 2720.00,
        low24h: 2620.00,
        timestamp: Date.now()
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
        timestamp: Date.now()
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
        timestamp: Date.now()
      }
    ]
  }

  return mockData[type] || []
}