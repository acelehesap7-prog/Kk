export interface IMarketService {
  getMarketData(symbol: string, marketType: string): Promise<MarketData>
  getOrderBook(symbol: string, marketType: string): Promise<OrderBook>
  getCryptoMarkets(): Promise<MarketData[]>
  getForexRates(): Promise<MarketData[]>
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
  bids: [number, number][] // [fiyat, miktar]
  asks: [number, number][] // [fiyat, miktar]
  timestamp: number
}