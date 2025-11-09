export interface IMarketService {
  getMarketData(symbol: string, marketType: string): Promise<MarketData>
  getOrderBook(symbol: string, marketType: string): Promise<OrderBook>
  getForexRates(): Promise<MarketData[]>
  getCryptoMarkets(): Promise<MarketData[]>
  getStockMarkets(): Promise<MarketData[]>
  getFuturesMarkets(): Promise<MarketData[]>
  getCommoditiesMarkets(): Promise<MarketData[]>
  getIndicesMarkets(): Promise<MarketData[]>
  getOptionsMarkets(): Promise<MarketData[]>
  getBondsMarkets(): Promise<MarketData[]>
  getETFMarkets(): Promise<MarketData[]>
}

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

export interface OrderBook {
  symbol: string
  bids: [number, number][] // [price, amount]
  asks: [number, number][] // [price, amount]
  timestamp: number
}

export type MarketType = 'crypto' | 'forex' | 'stocks' | 'futures' | 'commodities' | 'indices' | 'options' | 'bonds' | 'etf'