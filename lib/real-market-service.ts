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

export class RealMarketService extends MarketService {
  private static instance: RealMarketService
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

  async getOrderBook(symbol: string, marketType: string): Promise<OrderBook> {
    try {
      const exchange = this.getExchangeForMarket(marketType)
      const orderbook = await exchange.fetchOrderBook(symbol)

      return {
        symbol,
        bids: orderbook.bids,
        asks: orderbook.asks,
        timestamp: Date.now()
      }
    } catch (error) {
      console.error(`Error fetching order book for ${symbol}:`, error)
      throw error
    }
  }

  private getExchangeForMarket(marketType: string): any {
    switch (marketType.toLowerCase()) {
      case 'spot':
      case 'crypto':
        return exchanges.binance
      case 'forex':
        return exchanges.kraken
      case 'commodities':
      case 'indices':
        return exchanges.kucoin
      case 'stocks':
      case 'options':
      case 'bonds':
      case 'etf':
        return exchanges.binance // Fallback to binance for now
      default:
        throw new Error(`Unsupported market type: ${marketType}`)
    }
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