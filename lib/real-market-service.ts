'use client'

import { IMarketService, MarketData, OrderBook } from '@/types/market.types'
import { MarketService } from './market-service'
import ccxt from 'ccxt'

// Supported exchange instances
const exchanges = {
  binance: new ccxt.binance(),
  kraken: new ccxt.kraken(),
  kucoin: new ccxt.kucoin(),
}

// Market type to exchange mapping 
const marketToExchange: Record<string, keyof typeof exchanges> = {
  crypto: 'binance',
  forex: 'kraken', 
  stocks: 'kucoin',
  futures: 'binance',
  commodities: 'kraken',
  indices: 'kucoin', 
  options: 'binance',
  bonds: 'kraken',
  etf: 'kucoin'
}

export class RealMarketService extends MarketService {
  private static instance: RealMarketService | null = null
  private marketData: Map<string, MarketData> = new Map()

  private constructor() {
    super()
    this.initializeExchanges()
  }

  static getInstance(): RealMarketService {
    if (!RealMarketService.instance) {
      RealMarketService.instance = new RealMarketService()
    }
    return RealMarketService.instance
  }

  private async initializeExchanges() {
    try {
      await Promise.all(
        Object.values(exchanges).map(exchange => exchange.loadMarkets())
      )
    } catch (error) {
      console.error('Error initializing exchanges:', error)
    }
  }

  async getMarketData(symbol: string, marketType: string): Promise<MarketData> {
    const key = `${marketType}:${symbol}`
    let data = this.marketData.get(key)

    if (!data || Date.now() - data.timestamp > 10000) { // Refresh every 10 seconds
      try {
        const exchange = this.getExchangeForMarket(marketType)
        const ticker = await exchange.fetchTicker(symbol)
        const newData: MarketData = {
          symbol,
          price: ticker.last || 0,
          change: ticker.change || 0,
          changePercent: ticker.percentage || 0,
          volume: ticker.baseVolume || 0,
          high24h: ticker.high || 0,
          low24h: ticker.low || 0,
          timestamp: Date.now(),
          marketType
        }
        this.marketData.set(key, newData)
        data = newData
      } catch (error) {
        console.error(`Error fetching market data for ${symbol}:`, error)
        throw error
      }
    }

    return data
  }

  async getOrderBook(symbol: string, marketType: string): Promise<OrderBook> {
    try {
      const exchange = this.getExchangeForMarket(marketType)
      const orderbook = await exchange.fetchOrderBook(symbol)
      return {
        symbol,
        bids: orderbook.bids,
        asks: orderbook.asks,
        timestamp: orderbook.timestamp || Date.now()
      }
    } catch (error) {
      console.error(`Error fetching order book for ${symbol}:`, error)
      throw error
    }
  }

  private getExchangeForMarket(marketType: string): ccxt.Exchange {
    const exchangeId = marketToExchange[marketType] || 'binance'
    const exchange = exchanges[exchangeId]

    if (!exchange) {
      throw new Error(`No exchange configured for market type: ${marketType}`)
    }

    return exchange
  }

  // Market-specific methods
  async getForexRates(): Promise<MarketData[]> {
    const symbols = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF']
    return Promise.all(symbols.map(symbol => this.getMarketData(symbol, 'forex')))
  }

  async getCryptoMarkets(): Promise<MarketData[]> {
    const symbols = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'XRP/USDT']
    return Promise.all(symbols.map(symbol => this.getMarketData(symbol, 'crypto')))
  }

  async getStockMarkets(): Promise<MarketData[]> {
    const symbols = ['AAPL/USD', 'GOOGL/USD', 'MSFT/USD', 'AMZN/USD']
    return Promise.all(symbols.map(symbol => this.getMarketData(symbol, 'stocks')))
  }

  async getFuturesMarkets(): Promise<MarketData[]> {
    const symbols = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'XRP/USDT']
    return Promise.all(symbols.map(symbol => this.getMarketData(symbol, 'futures')))
  }

  async getCommoditiesMarkets(): Promise<MarketData[]> {
    const symbols = ['XAU/USD', 'XAG/USD', 'WTIUSD', 'BRENT/USD']
    return Promise.all(symbols.map(symbol => this.getMarketData(symbol, 'commodities')))
  }

  async getIndicesMarkets(): Promise<MarketData[]> {
    const symbols = ['US30/USD', 'US500/USD', 'USTEC/USD', 'UK100/USD']
    return Promise.all(symbols.map(symbol => this.getMarketData(symbol, 'indices')))
  }

  async getOptionsMarkets(): Promise<MarketData[]> {
    const symbols = ['BTCUSDT-C', 'ETHUSDT-C', 'BNBUSDT-C']
    return Promise.all(symbols.map(symbol => this.getMarketData(symbol, 'options')))
  }

  async getBondsMarkets(): Promise<MarketData[]> {
    const symbols = ['US10Y/USD', 'US30Y/USD', 'DE10Y/EUR', 'UK10Y/GBP']
    return Promise.all(symbols.map(symbol => this.getMarketData(symbol, 'bonds')))
  }

  async getETFMarkets(): Promise<MarketData[]> {
    const symbols = ['SPY/USD', 'QQQ/USD', 'IWM/USD', 'EFA/USD']
    return Promise.all(symbols.map(symbol => this.getMarketData(symbol, 'etf')))
  }
}

// Helper function to get markets by type
export async function getMarketsByType(type: string): Promise<MarketData[]> {
  const service = RealMarketService.getInstance()
  
  switch (type.toLowerCase()) {
    case 'spot':
    case 'crypto':
      return service.getCryptoMarkets()
    case 'futures':
      return service.getFuturesMarkets()
    case 'stocks':
      return service.getStockMarkets()
    case 'forex':
      return service.getForexRates()
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
      console.error(`Unsupported market type: ${type}`)
      return []
  }
}