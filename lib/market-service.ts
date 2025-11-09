'use client'

import { IMarketService, MarketData, OrderBook } from '@/types/market.types'

export abstract class MarketService implements IMarketService {
  abstract getMarketData(symbol: string, marketType: string): Promise<MarketData>
  abstract getOrderBook(symbol: string, marketType: string): Promise<OrderBook>

  // Market data methods for different market types
  async getCryptoMarkets(): Promise<MarketData[]> {
    const symbols = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'XRP/USDT']
    return Promise.all(symbols.map(symbol => this.getMarketData(symbol, 'crypto')))
  }

  async getForexRates(): Promise<MarketData[]> {
    const symbols = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF']
    return Promise.all(symbols.map(symbol => this.getMarketData(symbol, 'forex')))
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