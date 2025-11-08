'use client'import { WebSocket } from 'ws'import { WebSocket } from 'ws'import { WebSocket } from 'ws'



import { z } from 'zod'import { z } from 'zod'

import { WebSocket } from 'ws'

import axios from 'axios'import { z } from 'zod'import { z } from 'zod'

const MarketSchema = z.object({

  type: z.enum(['crypto', 'crypto-futures', 'crypto-options', 'forex', 'stocks', 'bonds', 'etf', 'commodities', 'indices']),import ccxt from 'ccxt'

  symbol: z.string(),

  name: z.string(),import * as dotenv from 'dotenv'import axios from 'axios'import axios from 'axios'

  lastPrice: z.number(),

  priceChange: z.number(),

  priceChangePercent: z.number(),

  volume: z.number().optional(),dotenv.config()import ccxt from 'ccxt'import ccxt from 'ccxt'

  high24h: z.number(),

  low24h: z.number(),

  open24h: z.number(),

  exchange: z.string().optional(),// Market Typesimport * as dotenv from 'dotenv'import Finnhub from 'finnhub'

  category: z.string().optional()

})export type MarketType = 



export type Market = z.infer<typeof MarketSchema>  | 'crypto' import * as dotenv from 'dotenv'



interface WSMessage {  | 'crypto-futures'

  type: 'ticker' | 'trade'

  symbol: string  | 'crypto-options'dotenv.config()

  data: any 

}  | 'forex'



class WSManager {  | 'stocks'dotenv.config()

  private connections: Map<string, WebSocket> = new Map()

  private messageHandlers: ((msg: WSMessage) => void)[] = []  | 'bonds'



  constructor() {}  | 'etf'// Market Tipleri



  connectBinance(symbols: string[]) {  | 'commodities'

    const streams = symbols.map(s => `${s.toLowerCase()}@ticker`).join('/')

    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streams}`)  | 'indices'export type MarketType = // API İstemcileri



    ws.on('message', (data: string) => {

      try {

        const raw = JSON.parse(data)// WebSocket Message Types    | 'crypto' const binance = new ccxt.binance({

        const msg: WSMessage = {

          type: 'ticker',interface WSMessage {

          symbol: raw.s,

          data: {  type: 'ticker' | 'trade'  | 'crypto-futures'  apiKey: process.env.BINANCE_API_KEY,

            lastPrice: parseFloat(raw.c),

            priceChange: parseFloat(raw.p),  symbol: string 

            priceChangePercent: parseFloat(raw.P),

            volume: parseFloat(raw.v),  data: any  | 'crypto-options'  secret: process.env.BINANCE_API_SECRET

            high24h: parseFloat(raw.h),

            low24h: parseFloat(raw.l),}

            open24h: parseFloat(raw.o)

          }  | 'forex'})

        }

        this.messageHandlers.forEach(handler => handler(msg))// WebSocket Manager

      } catch (err) {

        console.error('Binance WebSocket error:', err)class WSManager {  | 'stocks'

      }

    })  private connections: Map<string, WebSocket> = new Map()



    this.connections.set('binance', ws)  private messageHandlers: ((msg: WSMessage) => void)[] = []  | 'bonds'const deribit = new ccxt.deribit({

  }



  onMessage(handler: (msg: WSMessage) => void) {

    this.messageHandlers.push(handler)  constructor() {}  | 'etf'  apiKey: process.env.DERIBIT_API_KEY,

  }



  close() {

    this.connections.forEach(ws => ws.close())  connectBinance(symbols: string[]) {  | 'commodities'  secret: process.env.DERIBIT_API_SECRET

    this.connections.clear()

  }    const streams = symbols.map(s => `${s.toLowerCase()}@ticker`).join('/')

}

    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streams}`)  | 'indices'})

export class MarketDataManager {

  private wsManager: WSManager

  private marketData: Map<string, Market> = new Map()

  private updateCallbacks: ((markets: Market[]) => void)[] = []    ws.on('message', (data: string) => {



  constructor() {      try {

    this.wsManager = new WSManager()

        const raw = JSON.parse(data)// WebSocket Mesaj Tiplericonst finnhubClient = Finnhub.ApiClient.instance

    this.wsManager.onMessage((msg) => {

      switch (msg.type) {        const msg: WSMessage = {

        case 'ticker':

        case 'trade':          type: 'ticker',interface WSMessage {const finnhubApi = new Finnhub.DefaultApi()

          this.updateMarketData(msg.symbol, msg.data)

          break          symbol: raw.s,

      }

    })          data: {  type: 'ticker' | 'trade'finnhubClient.authentications['api_key'].apiKey = process.env.FINNHUB_API_KEY

  }

            lastPrice: parseFloat(raw.c),

  private updateMarketData(symbol: string, data: any) {

    const existing = this.marketData.get(symbol)            priceChange: parseFloat(raw.p),  symbol: string

    if (existing) {

      this.marketData.set(symbol, { ...existing, ...data })            priceChangePercent: parseFloat(raw.P),

      this.notifyUpdateCallbacks()

    }            volume: parseFloat(raw.v),  data: any// WebSocket Yöneticisi

  }

            high24h: parseFloat(raw.h), 

  private notifyUpdateCallbacks() {

    const markets = Array.from(this.marketData.values())            low24h: parseFloat(raw.l),}class WSManager {

    this.updateCallbacks.forEach(cb => cb(markets))

  }            open24h: parseFloat(raw.o)



  async connect() {          }  private connections: Map<string, WebSocket> = new Map()

    await this.fetchInitialData()

        }

    // Dummy connect for now

    this.wsManager.connectBinance(['BTCUSDT', 'ETHUSDT'])        this.messageHandlers.forEach(handler => handler(msg))// WebSocket Yöneticisi  private messageHandlers: ((msg: WSMessage) => void)[] = []

  }

      } catch (err) {

  private async fetchInitialData() {

    try {        console.error('Binance WebSocket error:', err)class WSManager {

      // Dummy data for now

      const dummyMarkets: Market[] = [      }

        {

          type: 'crypto',    })  private connections: Map<string, WebSocket> = new Map()  constructor() {}

          symbol: 'BTCUSDT',

          name: 'Bitcoin',

          lastPrice: 35000,

          priceChange: 1500,    this.connections.set('binance', ws)  private messageHandlers: ((msg: WSMessage) => void)[] = []

          priceChangePercent: 4.5,

          volume: 10000,  }

          high24h: 36000,

          low24h: 33500,  connectBinance(symbols: string[]) {

          open24h: 33500,

          exchange: 'Binance',  connectDeribit(symbols: string[]) {

          category: 'Crypto'

        },    const ws = new WebSocket('wss://www.deribit.com/ws/api/v2')  constructor() {}    const streams = symbols.map(s => `${s.toLowerCase()}@ticker`).join('/')

        {

          type: 'crypto',

          symbol: 'ETHUSDT',

          name: 'Ethereum',    ws.on('open', () => {    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streams}`)

          lastPrice: 2100,

          priceChange: 100,      symbols.forEach(symbol => {

          priceChangePercent: 5,

          volume: 5000,        ws.send(JSON.stringify({  connectBinance(symbols: string[]) {

          high24h: 2200,

          low24h: 2000,          jsonrpc: '2.0',

          open24h: 2000,

          exchange: 'Binance',          method: 'public/subscribe',    const streams = symbols.map(s => `${s.toLowerCase()}@ticker`).join('/')    ws.on('message', (data: string) => {

          category: 'Crypto'

        }          params: {

      ]

            channels: [`ticker.${symbol}.raw`]    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streams}`)      try {

      dummyMarkets.forEach(market => {

        this.marketData.set(market.symbol, market)          }

      })

        }))        const raw = JSON.parse(data)

      this.notifyUpdateCallbacks()

    } catch (err) {      })

      console.error('Error fetching initial market data:', err)

    }    })    ws.on('message', (data: string) => {        const msg: WSMessage = {

  }



  onUpdate(callback: (markets: Market[]) => void) {

    this.updateCallbacks.push(callback)    ws.on('message', (data: string) => {      try {          type: 'ticker',

  }

      try {

  getMarket(symbol: string): Market | undefined {

    return this.marketData.get(symbol)        const raw = JSON.parse(data)        const raw = JSON.parse(data)          symbol: raw.s,

  }

        if (raw.params?.channel?.startsWith('ticker')) {

  getAllMarkets(): Market[] {

    return Array.from(this.marketData.values())          const msg: WSMessage = {        const msg: WSMessage = {          data: {

  }

            type: 'ticker', 

  getMarketsByType(type: MarketType): Market[] {

    return this.getAllMarkets().filter(m => m.type === type)            symbol: raw.params.data.instrument_name,          type: 'ticker',            lastPrice: parseFloat(raw.c),

  }

}            data: {



export type MarketType = 'crypto' | 'crypto-futures' | 'crypto-options' | 'forex' | 'stocks' | 'bonds' | 'etf' | 'commodities' | 'indices'              lastPrice: raw.params.data.last_price,          symbol: raw.s,            priceChange: parseFloat(raw.p),



const marketService = new MarketDataManager()              priceChange: raw.params.data.price_change,



export default marketService              volume: raw.params.data.stats.volume,          data: {            priceChangePercent: parseFloat(raw.P),

              high24h: raw.params.data.stats.high,

              low24h: raw.params.data.stats.low            lastPrice: parseFloat(raw.c),            volume: parseFloat(raw.v),

            }

          }            priceChange: parseFloat(raw.p),            high24h: parseFloat(raw.h),

          this.messageHandlers.forEach(handler => handler(msg))

        }            priceChangePercent: parseFloat(raw.P),            low24h: parseFloat(raw.l),

      } catch (err) {

        console.error('Deribit WebSocket error:', err)             volume: parseFloat(raw.v),            open24h: parseFloat(raw.o)

      }

    })            high24h: parseFloat(raw.h),          }



    this.connections.set('deribit', ws)            low24h: parseFloat(raw.l),        }

  }

            open24h: parseFloat(raw.o)        this.messageHandlers.forEach(handler => handler(msg))

  onMessage(handler: (msg: WSMessage) => void) {

    this.messageHandlers.push(handler)          }      } catch (err) {

  }

        }        console.error('Binance WebSocket error:', err)

  close() {

    this.connections.forEach(ws => ws.close())        this.messageHandlers.forEach(handler => handler(msg))      }

    this.connections.clear()

  }      } catch (err) {    })

}

        console.error('Binance WebSocket error:', err)

// Market Schema

const MarketSchema = z.object({      }    this.connections.set('binance', ws)

  type: z.enum(['crypto', 'crypto-futures', 'crypto-options', 'forex', 'stocks', 'bonds', 'etf', 'commodities', 'indices']),

  symbol: z.string(),    })  }

  baseAsset: z.string().optional(),

  quoteAsset: z.string().optional(),

  name: z.string(),

  exchange: z.string().optional(),    this.connections.set('binance', ws)  connectDeribit(symbols: string[]) {

  category: z.string(),

  country: z.string().optional(),  }    const ws = new WebSocket('wss://www.deribit.com/ws/api/v2')

  unit: z.string().optional(),

  lastPrice: z.number(),

  priceChange: z.number(),

  priceChangePercent: z.number(),  connectDeribit(symbols: string[]) {    ws.on('open', () => {

  volume: z.number(),

  high24h: z.number(),    const ws = new WebSocket('wss://www.deribit.com/ws/api/v2')      // Subscribe to ticker channels

  low24h: z.number(),

  open24h: z.number(),      symbols.forEach(symbol => {

  marketCap: z.number().optional(),

  peRatio: z.number().optional(),    ws.on('open', () => {        ws.send(JSON.stringify({

  dividendYield: z.number().optional(),

  beta: z.number().optional(),      symbols.forEach(symbol => {          jsonrpc: '2.0',

  averageVolume: z.number().optional(),

  openInterest: z.number().optional(),        ws.send(JSON.stringify({          method: 'public/subscribe',

  strikePrice: z.number().optional(),

  expiryDate: z.string().optional(),          jsonrpc: '2.0',          params: {

  impliedVolatility: z.number().optional(),

  delta: z.number().optional(),          method: 'public/subscribe',            channels: [`ticker.${symbol}.raw`]

  gamma: z.number().optional(),

  theta: z.number().optional(),          params: {          }

  vega: z.number().optional(),

  couponRate: z.number().optional(),            channels: [`ticker.${symbol}.raw`]        }))

  maturityDate: z.string().optional(),

  yieldToMaturity: z.number().optional(),          }      })

  duration: z.number().optional(),

  rating: z.string().optional(),        }))    })

  trackingError: z.number().optional(),

  expenseRatio: z.number().optional(),      })

  nav: z.number().optional(),

  aum: z.number().optional(),    })    ws.on('message', (data: string) => {

  technicalIndicators: z.array(z.object({

    name: z.enum(['SMA', 'EMA', 'RSI', 'MACD', 'BB', 'STOCH', 'ATR', 'OBV', 'ADX', 'VWAP']),      try {

    value: z.number(),

    signal: z.enum(['buy', 'sell', 'neutral']),    ws.on('message', (data: string) => {        const raw = JSON.parse(data)

    meta: z.record(z.string(), z.any()).optional()

  })).optional()      try {        if (raw.params?.channel?.startsWith('ticker')) {

})

        const raw = JSON.parse(data)          const msg: WSMessage = {

export type Market = z.infer<typeof MarketSchema>

        if (raw.params?.channel?.startsWith('ticker')) {            type: 'ticker',

// API Clients 

const binance = new ccxt.binance({          const msg: WSMessage = {            symbol: raw.params.data.instrument_name,

  apiKey: process.env.BINANCE_API_KEY || '',

  secret: process.env.BINANCE_API_SECRET || ''            type: 'ticker',            data: {

})

            symbol: raw.params.data.instrument_name,              lastPrice: raw.params.data.last_price,

const deribit = new ccxt.deribit({

  apiKey: process.env.DERIBIT_API_KEY || '',            data: {              priceChange: raw.params.data.price_change,

  secret: process.env.DERIBIT_API_SECRET || ''

})              lastPrice: raw.params.data.last_price,              volume: raw.params.data.stats.volume,



// Market Pairs              priceChange: raw.params.data.price_change,              high24h: raw.params.data.stats.high,

export const MARKET_PAIRS: Record<MarketType, Array<{

  symbol: string              volume: raw.params.data.stats.volume,              low24h: raw.params.data.stats.low

  name: string

  baseAsset?: string              high24h: raw.params.data.stats.high,            }

  quoteAsset?: string

  category: string              low24h: raw.params.data.stats.low          }

  exchange?: string

  country?: string            }          this.messageHandlers.forEach(handler => handler(msg))

  unit?: string

}>> = {          }        }

  'crypto': [

    { symbol: 'BTC-USD', name: 'Bitcoin', baseAsset: 'BTC', quoteAsset: 'USD', category: 'Major', exchange: 'Binance' },          this.messageHandlers.forEach(handler => handler(msg))      } catch (err) {

    { symbol: 'ETH-USD', name: 'Ethereum', baseAsset: 'ETH', quoteAsset: 'USD', category: 'Major', exchange: 'Binance' }

  ],        }        console.error('Deribit WebSocket error:', err)

  'crypto-futures': [

    { symbol: 'BTC-PERP', name: 'Bitcoin Perpetual', baseAsset: 'BTC', quoteAsset: 'USD', category: 'Perpetual', exchange: 'Deribit' },      } catch (err) {      }

    { symbol: 'ETH-PERP', name: 'Ethereum Perpetual', baseAsset: 'ETH', quoteAsset: 'USD', category: 'Perpetual', exchange: 'Deribit' }

  ],        console.error('Deribit WebSocket error:', err)    })

  'crypto-options': [

    { symbol: 'BTC-25NOV25-45000-C', name: 'BTC Call 45000', baseAsset: 'BTC', category: 'Call', exchange: 'Deribit' },      }

    { symbol: 'ETH-25NOV25-3000-P', name: 'ETH Put 3000', baseAsset: 'ETH', category: 'Put', exchange: 'Deribit' }

  ],    })    this.connections.set('deribit', ws)

  'forex': [

    { symbol: 'EUR-USD', name: 'Euro/USD', baseAsset: 'EUR', quoteAsset: 'USD', category: 'Major' },  }

    { symbol: 'GBP-USD', name: 'Pound/USD', baseAsset: 'GBP', quoteAsset: 'USD', category: 'Major' }

  ],    this.connections.set('deribit', ws)

  'stocks': [

    { symbol: 'AAPL', name: 'Apple Inc.', category: 'Technology', exchange: 'NASDAQ', country: 'US', unit: 'USD' },  }  connectFinnhub(symbols: string[]) {

    { symbol: 'MSFT', name: 'Microsoft Corp.', category: 'Technology', exchange: 'NASDAQ', country: 'US', unit: 'USD' }

  ],    const ws = new WebSocket('wss://ws.finnhub.io')

  'bonds': [

    { symbol: 'US10Y', name: '10 Year Treasury', category: 'Government', country: 'US', unit: '%' },  onMessage(handler: (msg: WSMessage) => void) {

    { symbol: 'US30Y', name: '30 Year Treasury', category: 'Government', country: 'US', unit: '%' }

  ],    this.messageHandlers.push(handler)    ws.on('open', () => {

  'etf': [

    { symbol: 'SPY', name: 'SPDR S&P 500 ETF', category: 'Equity', exchange: 'NYSE', country: 'US', unit: 'USD' },  }      // Subscribe to trades

    { symbol: 'QQQ', name: 'Invesco QQQ Trust', category: 'Technology', exchange: 'NASDAQ', country: 'US', unit: 'USD' }

  ],      symbols.forEach(symbol => {

  'commodities': [

    { symbol: 'GOLD', name: 'Gold', category: 'Precious Metals', unit: 'USD/oz' },  close() {        ws.send(JSON.stringify({

    { symbol: 'SILVER', name: 'Silver', category: 'Precious Metals', unit: 'USD/oz' }

  ],    this.connections.forEach(ws => ws.close())          type: 'subscribe',

  'indices': [

    { symbol: 'SPX', name: 'S&P 500', category: 'US', unit: 'USD' },    this.connections.clear()          symbol: symbol

    { symbol: 'NDX', name: 'Nasdaq 100', category: 'US', unit: 'USD' }

  ]  }        }))

}

}      })

// Market Data Manager

export class MarketDataManager {    })

  private wsManager: WSManager

  private marketData: Map<string, Market> = new Map()// Market Şeması

  private updateCallbacks: ((markets: Market[]) => void)[] = []

const MarketSchema = z.object({    ws.on('message', (data: string) => {

  constructor() {

    this.wsManager = new WSManager()  type: z.enum(['crypto', 'crypto-futures', 'crypto-options', 'forex', 'stocks', 'bonds', 'etf', 'commodities', 'indices']),      try {

    

    this.wsManager.onMessage((msg) => {  symbol: z.string(),        const raw = JSON.parse(data)

      switch (msg.type) {

        case 'ticker':  baseAsset: z.string().optional(),        if (raw.type === 'trade') {

        case 'trade':

          this.updateMarketData(msg.symbol, msg.data)  quoteAsset: z.string().optional(),          const msg: WSMessage = {

          break

      }  name: z.string(),            type: 'trade',

    })

  }  exchange: z.string().optional(),            symbol: raw.data[0].s,



  private updateMarketData(symbol: string, data: any) {  category: z.string(),            data: {

    const existing = this.marketData.get(symbol)

    if (existing) {  country: z.string().optional(),              price: raw.data[0].p,

      this.marketData.set(symbol, { ...existing, ...data })

      this.notifyUpdateCallbacks()  unit: z.string().optional(),              volume: raw.data[0].v,

    }

  }  lastPrice: z.number(),              timestamp: raw.data[0].t



  private notifyUpdateCallbacks() {  priceChange: z.number(),            }

    const markets = Array.from(this.marketData.values())

    this.updateCallbacks.forEach(cb => cb(markets))  priceChangePercent: z.number(),          }

  }

  volume: z.number(),          this.messageHandlers.forEach(handler => handler(msg))

  async connect() {

    // Fetch initial market data  high24h: z.number(),        }

    await this.fetchInitialData()

  low24h: z.number(),      } catch (err) {

    // WebSocket connections

    const cryptoSymbols = MARKET_PAIRS.crypto.map(p => p.symbol)  open24h: z.number(),        console.error('Finnhub WebSocket error:', err)

    const cryptoFuturesSymbols = MARKET_PAIRS['crypto-futures'].map(p => p.symbol)

    const cryptoOptionsSymbols = MARKET_PAIRS['crypto-options'].map(p => p.symbol)  marketCap: z.number().optional(),      }



    this.wsManager.connectBinance(cryptoSymbols)  peRatio: z.number().optional(),    })

    this.wsManager.connectDeribit([...cryptoFuturesSymbols, ...cryptoOptionsSymbols])

  }  dividendYield: z.number().optional(),



  private async fetchInitialData() {  beta: z.number().optional(),    this.connections.set('finnhub', ws)

    try {

      // Fetch data for each market type from APIs  averageVolume: z.number().optional(),  }

      for (const [type, pairs] of Object.entries(MARKET_PAIRS)) {

        const symbols = pairs.map(p => p.symbol)  openInterest: z.number().optional(),

        const data = await this.fetchMarketData(type as MarketType, symbols)

          strikePrice: z.number().optional(),  onMessage(handler: (msg: WSMessage) => void) {

        data.forEach(market => {

          this.marketData.set(market.symbol, market)  expiryDate: z.string().optional(),    this.messageHandlers.push(handler)

        })

      }  impliedVolatility: z.number().optional(),  }



      this.notifyUpdateCallbacks()  delta: z.number().optional(),



    } catch (err) {  gamma: z.number().optional(),  close() {

      console.error('Error fetching initial market data:', err)

    }  theta: z.number().optional(),    this.connections.forEach(ws => ws.close())

  }

  vega: z.number().optional(),    this.connections.clear()

  private async fetchMarketData(type: MarketType, symbols: string[]): Promise<Market[]> {

    switch(type) {  couponRate: z.number().optional(),  }

      case 'crypto':

        return this.fetchCryptoSpotData(symbols)  maturityDate: z.string().optional(),}

      case 'crypto-futures':

        return this.fetchCryptoFuturesData(symbols)  yieldToMaturity: z.number().optional(),

      case 'crypto-options':

        return this.fetchCryptoOptionsData(symbols)  duration: z.number().optional(),// Market Tipleri

      default:

        return []  rating: z.string().optional(),export type MarketType = 

    }

  }  trackingError: z.number().optional(),  | 'crypto' 



  private async fetchCryptoSpotData(symbols: string[]): Promise<Market[]> {  expenseRatio: z.number().optional(),  | 'crypto-futures'

    try {

      const markets: Market[] = []  nav: z.number().optional(),  | 'crypto-options'

      

      const spotTickers = await binance.fetchTickers(symbols)  aum: z.number().optional(),  | 'forex'

      

      for (const [symbol, ticker] of Object.entries(spotTickers)) {  technicalIndicators: z.array(z.object({  | 'stocks'

        const pair = MARKET_PAIRS.crypto.find(p => p.symbol === symbol)

        if (!pair) continue    name: z.enum(['SMA', 'EMA', 'RSI', 'MACD', 'BB', 'STOCH', 'ATR', 'OBV', 'ADX', 'VWAP']),  | 'bonds'



        const parsedTicker = ticker as ccxt.Ticker    value: z.number(),  | 'etf'

        markets.push({

          type: 'crypto',    signal: z.enum(['buy', 'sell', 'neutral']),  | 'commodities'

          symbol,

          name: pair.name,    meta: z.record(z.string(), z.any()).optional()  | 'indices'

          baseAsset: pair.baseAsset,

          quoteAsset: pair.quoteAsset,  })).optional()

          exchange: 'Binance',

          category: pair.category,})// Teknik Gösterge Tipleri

          lastPrice: parsedTicker.last || 0,

          priceChange: parsedTicker.change || 0,export type IndicatorType = 

          priceChangePercent: parsedTicker.percentage || 0,

          volume: parsedTicker.baseVolume || 0,export type Market = z.infer<typeof MarketSchema>  | 'SMA' // Simple Moving Average

          high24h: parsedTicker.high || 0,

          low24h: parsedTicker.low || 0,  | 'EMA' // Exponential Moving Average

          open24h: parsedTicker.open || 0

        })// API İstemcileri  | 'RSI' // Relative Strength Index

      }

const binance = new ccxt.binance({  | 'MACD' // Moving Average Convergence Divergence

      return markets

    } catch (err) {  apiKey: process.env.BINANCE_API_KEY || '',  | 'BB' // Bollinger Bands

      console.error('Error fetching crypto spot data:', err)

      return []  secret: process.env.BINANCE_API_SECRET || ''  | 'STOCH' // Stochastic Oscillator

    }

  }})  | 'ATR' // Average True Range



  private async fetchCryptoFuturesData(symbols: string[]): Promise<Market[]> {  | 'OBV' // On Balance Volume

    try {

      const markets: Market[] = []const deribit = new ccxt.deribit({  | 'ADX' // Average Directional Index

      

      const futuresTickers = await deribit.fetchTickers(symbols)  apiKey: process.env.DERIBIT_API_KEY || '',  | 'VWAP' // Volume Weighted Average Price

      

      for (const [symbol, ticker] of Object.entries(futuresTickers)) {  secret: process.env.DERIBIT_API_SECRET || ''

        const pair = MARKET_PAIRS['crypto-futures'].find(p => p.symbol === symbol)

        if (!pair) continue})// Zaman Aralıkları



        const parsedTicker = ticker as ccxt.Ticker & { info: { open_interest: number } }export type TimeFrame = 

        markets.push({

          type: 'crypto-futures',// Market Çiftleri  | '1m'

          symbol,

          name: pair.name,export const MARKET_PAIRS: Record<MarketType, Array<{  | '5m'

          baseAsset: pair.baseAsset,

          quoteAsset: pair.quoteAsset,  symbol: string  | '15m'

          exchange: 'Deribit',

          category: pair.category,  name: string  | '30m'

          lastPrice: parsedTicker.last || 0,

          priceChange: parsedTicker.change || 0,  baseAsset?: string  | '1h'

          priceChangePercent: parsedTicker.percentage || 0,

          volume: parsedTicker.baseVolume || 0,  quoteAsset?: string  | '4h'

          high24h: parsedTicker.high || 0,

          low24h: parsedTicker.low || 0,  category: string  | '1d'

          open24h: parsedTicker.open || 0,

          openInterest: parsedTicker.info.open_interest || 0  exchange?: string  | '1w'

        })

      }  country?: string  | '1M'



      return markets  unit?: string

    } catch (err) {

      console.error('Error fetching crypto futures data:', err)}>> = {// Şema Tanımlamaları

      return []

    }  'crypto': [const MarketSchema = z.object({

  }

    { symbol: 'BTC-USD', name: 'Bitcoin', baseAsset: 'BTC', quoteAsset: 'USD', category: 'Major', exchange: 'Binance' },  type: z.enum(['crypto', 'crypto-futures', 'crypto-options', 'forex', 'stocks', 'bonds', 'etf', 'commodities', 'indices']),

  private async fetchCryptoOptionsData(symbols: string[]): Promise<Market[]> {

    try {    { symbol: 'ETH-USD', name: 'Ethereum', baseAsset: 'ETH', quoteAsset: 'USD', category: 'Major', exchange: 'Binance' }  symbol: z.string(),

      const markets: Market[] = []

        ],  baseAsset: z.string().optional(),

      const optionsTickers = await deribit.fetchTickers(symbols)

        'crypto-futures': [  quoteAsset: z.string().optional(),

      for (const [symbol, ticker] of Object.entries(optionsTickers)) {

        const pair = MARKET_PAIRS['crypto-options'].find(p => p.symbol === symbol)    { symbol: 'BTC-PERP', name: 'Bitcoin Perpetual', baseAsset: 'BTC', quoteAsset: 'USD', category: 'Perpetual', exchange: 'Deribit' },  name: z.string(),

        if (!pair) continue

    { symbol: 'ETH-PERP', name: 'Ethereum Perpetual', baseAsset: 'ETH', quoteAsset: 'USD', category: 'Perpetual', exchange: 'Deribit' }  exchange: z.string().optional(),

        const parsedTicker = ticker as ccxt.Ticker & { 

          info: {   ],  category: z.string(),

            open_interest: number

            implied_volatility: number  'crypto-options': [  country: z.string().optional(),

            greeks?: {

              delta?: number    { symbol: 'BTC-25NOV25-45000-C', name: 'BTC Call 45000', baseAsset: 'BTC', category: 'Call', exchange: 'Deribit' },  unit: z.string().optional(),

              gamma?: number

              theta?: number    { symbol: 'ETH-25NOV25-3000-P', name: 'ETH Put 3000', baseAsset: 'ETH', category: 'Put', exchange: 'Deribit' }  lastPrice: z.number(),

              vega?: number

            }  ],  priceChange: z.number(),

          } 

        }  'forex': [  priceChangePercent: z.number(),



        markets.push({    { symbol: 'EUR-USD', name: 'Euro/USD', baseAsset: 'EUR', quoteAsset: 'USD', category: 'Major' },  volume: z.number(),

          type: 'crypto-options',

          symbol,    { symbol: 'GBP-USD', name: 'Pound/USD', baseAsset: 'GBP', quoteAsset: 'USD', category: 'Major' }  high24h: z.number(),

          name: pair.name,

          baseAsset: pair.baseAsset,  ],  low24h: z.number(),

          exchange: 'Deribit',

          category: pair.category,  'stocks': [  open24h: z.number(),

          lastPrice: parsedTicker.last || 0,

          priceChange: parsedTicker.change || 0,    { symbol: 'AAPL', name: 'Apple Inc.', category: 'Technology', exchange: 'NASDAQ', country: 'US', unit: 'USD' },  marketCap: z.number().optional(),

          priceChangePercent: parsedTicker.percentage || 0,

          volume: parsedTicker.baseVolume || 0,    { symbol: 'MSFT', name: 'Microsoft Corp.', category: 'Technology', exchange: 'NASDAQ', country: 'US', unit: 'USD' }  peRatio: z.number().optional(),

          high24h: parsedTicker.high || 0,

          low24h: parsedTicker.low || 0,  ],  dividendYield: z.number().optional(),

          open24h: parsedTicker.open || 0,

          openInterest: parsedTicker.info.open_interest || 0,  'bonds': [  beta: z.number().optional(),

          impliedVolatility: parsedTicker.info.implied_volatility || 0,

          delta: parsedTicker.info.greeks?.delta || 0,    { symbol: 'US10Y', name: '10 Year Treasury', category: 'Government', country: 'US', unit: '%' },  averageVolume: z.number().optional(),

          gamma: parsedTicker.info.greeks?.gamma || 0,

          theta: parsedTicker.info.greeks?.theta || 0,    { symbol: 'US30Y', name: '30 Year Treasury', category: 'Government', country: 'US', unit: '%' }  openInterest: z.number().optional(), // Vadeli/Opsiyon için

          vega: parsedTicker.info.greeks?.vega || 0

        })  ],  strikePrice: z.number().optional(), // Opsiyon için

      }

  'etf': [  expiryDate: z.string().optional(), // Vadeli/Opsiyon için

      return markets

    } catch (err) {    { symbol: 'SPY', name: 'SPDR S&P 500 ETF', category: 'Equity', exchange: 'NYSE', country: 'US', unit: 'USD' },  impliedVolatility: z.number().optional(), // Opsiyon için

      console.error('Error fetching crypto options data:', err)

      return []    { symbol: 'QQQ', name: 'Invesco QQQ Trust', category: 'Technology', exchange: 'NASDAQ', country: 'US', unit: 'USD' }  delta: z.number().optional(), // Opsiyon için

    }

  }  ],  gamma: z.number().optional(), // Opsiyon için



  onUpdate(callback: (markets: Market[]) => void) {  'commodities': [  theta: z.number().optional(), // Opsiyon için

    this.updateCallbacks.push(callback)

  }    { symbol: 'GOLD', name: 'Gold', category: 'Precious Metals', unit: 'USD/oz' },  vega: z.number().optional(), // Opsiyon için



  getMarket(symbol: string): Market | undefined {    { symbol: 'SILVER', name: 'Silver', category: 'Precious Metals', unit: 'USD/oz' }  couponRate: z.number().optional(), // Tahvil için

    return this.marketData.get(symbol)

  }  ],  maturityDate: z.string().optional(), // Tahvil için



  getAllMarkets(): Market[] {  'indices': [  yieldToMaturity: z.number().optional(), // Tahvil için

    return Array.from(this.marketData.values())

  }    { symbol: 'SPX', name: 'S&P 500', category: 'US', unit: 'USD' },  duration: z.number().optional(), // Tahvil için



  getMarketsByType(type: MarketType): Market[] {    { symbol: 'NDX', name: 'Nasdaq 100', category: 'US', unit: 'USD' }  rating: z.string().optional(), // Tahvil için

    return this.getAllMarkets().filter(m => m.type === type)

  }  ]  trackingError: z.number().optional(), // ETF için

}

}  expenseRatio: z.number().optional(), // ETF için

// Market service instance

const marketService = new MarketDataManager()  nav: z.number().optional(), // ETF için



export default marketService// Market Veri Yöneticisi  aum: z.number().optional(), // ETF için



// Helper functionsexport class MarketDataManager {  technicalIndicators: z.array(z.object({

export const getAllMarketData = async () => {

  return marketService.getAllMarkets()  private wsManager: WSManager    name: z.enum(['SMA', 'EMA', 'RSI', 'MACD', 'BB', 'STOCH', 'ATR', 'OBV', 'ADX', 'VWAP']),

}

  private marketData: Map<string, Market> = new Map()    value: z.number(),

export const getMarketData = (symbol: string) => {

  return marketService.getMarket(symbol)  private updateCallbacks: ((markets: Market[]) => void)[] = []    signal: z.enum(['buy', 'sell', 'neutral']),

}

    meta: z.record(z.string(), z.any()).optional()

export const getMarketsByType = (type: MarketType) => {

  return marketService.getMarketsByType(type)  constructor() {  })).optional()

}
    this.wsManager = new WSManager()})

    

    this.wsManager.onMessage((msg) => {export type Market = z.infer<typeof MarketSchema>

      switch (msg.type) {

        case 'ticker':// WebSocket Mesaj Şeması

        case 'trade':const WSMessageSchema = z.object({

          this.updateMarketData(msg.symbol, msg.data)  type: z.enum(['trade', 'ticker', 'orderbook', 'kline']),

          break  symbol: z.string(),

      }  data: z.any()

    })})

  }

export type WSMessage = z.infer<typeof WSMessageSchema>

  private updateMarketData(symbol: string, data: any) {

    const existing = this.marketData.get(symbol)// Market Çiftleri

    if (existing) {export const MARKET_PAIRS: Record<MarketType, Array<{

      this.marketData.set(symbol, { ...existing, ...data })  symbol: string

      this.notifyUpdateCallbacks()  name: string

    }  baseAsset?: string

  }  quoteAsset?: string

  category: string

  private notifyUpdateCallbacks() {  exchange?: string

    const markets = Array.from(this.marketData.values())  country?: string

    this.updateCallbacks.forEach(cb => cb(markets))  unit?: string

  }}>> = {

  // Kripto Spot

  async connect() {  'crypto': [

    // İlk market verilerini çek    { symbol: 'BTC-USD', name: 'Bitcoin', baseAsset: 'BTC', quoteAsset: 'USD', category: 'Major', exchange: 'Binance' },

    await this.fetchInitialData()    { symbol: 'ETH-USD', name: 'Ethereum', baseAsset: 'ETH', quoteAsset: 'USD', category: 'Major', exchange: 'Binance' },

    // ...diğer kripto çiftleri

    // WebSocket bağlantıları  ],

    const cryptoSymbols = MARKET_PAIRS.crypto.map(p => p.symbol)  

    const cryptoFuturesSymbols = MARKET_PAIRS['crypto-futures'].map(p => p.symbol)  // Kripto Vadeli

    const cryptoOptionsSymbols = MARKET_PAIRS['crypto-options'].map(p => p.symbol)  'crypto-futures': [

    { symbol: 'BTC-PERP', name: 'Bitcoin Perpetual', baseAsset: 'BTC', quoteAsset: 'USD', category: 'Perpetual', exchange: 'Binance' },

    this.wsManager.connectBinance(cryptoSymbols)    { symbol: 'ETH-PERP', name: 'Ethereum Perpetual', baseAsset: 'ETH', quoteAsset: 'USD', category: 'Perpetual', exchange: 'Binance' },

    this.wsManager.connectDeribit([...cryptoFuturesSymbols, ...cryptoOptionsSymbols])    // ...diğer vadeli çiftler

  }  ],



  private async fetchInitialData() {  // Kripto Opsiyon

    try {  'crypto-options': [

      // Her market tipi için API'lerden veri çek    { symbol: 'BTC-25NOV25-45000-C', name: 'BTC Call 45000', baseAsset: 'BTC', category: 'Call', exchange: 'Deribit' },

      for (const [type, pairs] of Object.entries(MARKET_PAIRS)) {    { symbol: 'ETH-25NOV25-3000-P', name: 'ETH Put 3000', baseAsset: 'ETH', category: 'Put', exchange: 'Deribit' },

        const symbols = pairs.map(p => p.symbol)    // ...diğer opsiyon çiftleri

        const data = await this.fetchMarketData(type as MarketType, symbols)  ],

        

        data.forEach(market => {  // Forex

          this.marketData.set(market.symbol, market)  'forex': [

        })    { symbol: 'EUR-USD', name: 'Euro/USD', baseAsset: 'EUR', quoteAsset: 'USD', category: 'Major' },

      }    { symbol: 'GBP-USD', name: 'Pound/USD', baseAsset: 'GBP', quoteAsset: 'USD', category: 'Major' },

    // ...diğer forex çiftleri

      this.notifyUpdateCallbacks()  ],



    } catch (err) {  // Hisse Senetleri

      console.error('Error fetching initial market data:', err)  'stocks': [

    }    { symbol: 'AAPL', name: 'Apple Inc.', category: 'Technology', exchange: 'NASDAQ', country: 'US', unit: 'USD' },

  }    { symbol: 'MSFT', name: 'Microsoft Corp.', category: 'Technology', exchange: 'NASDAQ', country: 'US', unit: 'USD' },

    // ...diğer hisseler

  private async fetchMarketData(type: MarketType, symbols: string[]): Promise<Market[]> {  ],

    switch(type) {

      case 'crypto':  // Tahvil ve Bonolar

        return this.fetchCryptoSpotData(symbols)  'bonds': [

      case 'crypto-futures':    { symbol: 'US10Y', name: '10 Year Treasury', category: 'Government', country: 'US', unit: '%' },

        return this.fetchCryptoFuturesData(symbols)    { symbol: 'US30Y', name: '30 Year Treasury', category: 'Government', country: 'US', unit: '%' },

      case 'crypto-options':    { symbol: 'TURKEY5Y', name: '5 Year Turkey Bond', category: 'Government', country: 'TR', unit: '%' },

        return this.fetchCryptoOptionsData(symbols)    { symbol: 'CORP-AAA', name: 'AAA Corporate Index', category: 'Corporate', unit: '%' },

      default:    // ...diğer tahviller

        return []  ],

    }

  }  // ETF'ler

  'etf': [

  private async fetchCryptoSpotData(symbols: string[]): Promise<Market[]> {    { symbol: 'SPY', name: 'SPDR S&P 500 ETF', category: 'Equity', exchange: 'NYSE', country: 'US', unit: 'USD' },

    try {    { symbol: 'QQQ', name: 'Invesco QQQ Trust', category: 'Technology', exchange: 'NASDAQ', country: 'US', unit: 'USD' },

      const markets: Market[] = []    { symbol: 'GLD', name: 'SPDR Gold Shares', category: 'Commodity', exchange: 'NYSE', country: 'US', unit: 'USD' },

          { symbol: 'TLT', name: 'iShares 20+ Year Treasury', category: 'Bond', exchange: 'NASDAQ', country: 'US', unit: 'USD' },

      const spotTickers = await binance.fetchTickers(symbols)    // ...diğer ETF'ler

        ],

      for (const [symbol, ticker] of Object.entries(spotTickers)) {

        const pair = MARKET_PAIRS.crypto.find(p => p.symbol === symbol)  // Emtia

        if (!pair) continue  'commodities': [

    { symbol: 'GOLD', name: 'Gold', category: 'Precious Metals', unit: 'USD/oz' },

        const parsedTicker = ticker as ccxt.Ticker    { symbol: 'SILVER', name: 'Silver', category: 'Precious Metals', unit: 'USD/oz' },

        markets.push({    // ...diğer emtialar

          type: 'crypto',  ],

          symbol,

          name: pair.name,  // Endeksler  

          baseAsset: pair.baseAsset,  'indices': [

          quoteAsset: pair.quoteAsset,    { symbol: 'SPX', name: 'S&P 500', category: 'US', unit: 'USD' },

          exchange: 'Binance',    { symbol: 'NDX', name: 'Nasdaq 100', category: 'US', unit: 'USD' },

          category: pair.category,    // ...diğer endeksler

          lastPrice: parsedTicker.last || 0,  ]

          priceChange: parsedTicker.change || 0,}

          priceChangePercent: parsedTicker.percentage || 0,

          volume: parsedTicker.baseVolume || 0,// WebSocket Bağlantı Yöneticisi

          high24h: parsedTicker.high || 0,class WSManager {

          low24h: parsedTicker.low || 0,  private ws: WebSocket | null = null

          open24h: parsedTicker.open || 0  private reconnectTimer: NodeJS.Timeout | null = null

        })  private messageHandlers: ((msg: WSMessage) => void)[] = []

      }

  constructor(private url: string) {}

      return markets

    } catch (err) {  connect() {

      console.error('Error fetching crypto spot data:', err)    if (this.ws) return

      return []

    }    this.ws = new WebSocket(this.url)

  }    

    this.ws.on('open', () => {

  private async fetchCryptoFuturesData(symbols: string[]): Promise<Market[]> {      console.log('WebSocket connected')

    try {      if (this.reconnectTimer) {

      const markets: Market[] = []        clearTimeout(this.reconnectTimer)

              this.reconnectTimer = null

      const futuresTickers = await deribit.fetchTickers(symbols)      }

          })

      for (const [symbol, ticker] of Object.entries(futuresTickers)) {

        const pair = MARKET_PAIRS['crypto-futures'].find(p => p.symbol === symbol)    this.ws.on('message', (data: string) => {

        if (!pair) continue      try {

        const msg = WSMessageSchema.parse(JSON.parse(data))

        const parsedTicker = ticker as ccxt.Ticker & { info: { open_interest: number } }        this.messageHandlers.forEach(handler => handler(msg))

        markets.push({      } catch (err) {

          type: 'crypto-futures',        console.error('Invalid message format:', err)

          symbol,      }

          name: pair.name,    })

          baseAsset: pair.baseAsset,

          quoteAsset: pair.quoteAsset,    this.ws.on('close', () => {

          exchange: 'Deribit',      console.log('WebSocket disconnected')

          category: pair.category,      this.ws = null

          lastPrice: parsedTicker.last || 0,      this.reconnect()

          priceChange: parsedTicker.change || 0,    })

          priceChangePercent: parsedTicker.percentage || 0,

          volume: parsedTicker.baseVolume || 0,    this.ws.on('error', (err) => {

          high24h: parsedTicker.high || 0,      console.error('WebSocket error:', err)

          low24h: parsedTicker.low || 0,      this.ws?.close()

          open24h: parsedTicker.open || 0,    })

          openInterest: parsedTicker.info.open_interest || 0  }

        })

      }  private reconnect() {

    if (this.reconnectTimer) return

      return markets    

    } catch (err) {    this.reconnectTimer = setTimeout(() => {

      console.error('Error fetching crypto futures data:', err)      console.log('Attempting to reconnect...')

      return []      this.connect()

    }    }, Number(process.env.MARKET_WEBSOCKET_RECONNECT_INTERVAL) || 5000)

  }  }



  private async fetchCryptoOptionsData(symbols: string[]): Promise<Market[]> {  subscribe(symbols: string[]) {

    try {    if (!this.ws) return

      const markets: Market[] = []    

          this.ws.send(JSON.stringify({

      const optionsTickers = await deribit.fetchTickers(symbols)      type: 'subscribe',

            symbols

      for (const [symbol, ticker] of Object.entries(optionsTickers)) {    }))

        const pair = MARKET_PAIRS['crypto-options'].find(p => p.symbol === symbol)  }

        if (!pair) continue

  onMessage(handler: (msg: WSMessage) => void) {

        const parsedTicker = ticker as ccxt.Ticker & {     this.messageHandlers.push(handler)

          info: {   }

            open_interest: number

            implied_volatility: number  close() {

            greeks?: {    if (this.reconnectTimer) {

              delta?: number      clearTimeout(this.reconnectTimer)

              gamma?: number      this.reconnectTimer = null

              theta?: number    }

              vega?: number    this.ws?.close()

            }  }

          } }

        }

// Market Veri Yöneticisi

        markets.push({export class MarketDataManager {

          type: 'crypto-options',  private wsManager: WSManager

          symbol,  private marketData: Map<string, Market> = new Map()

          name: pair.name,  private updateCallbacks: ((markets: Market[]) => void)[] = []

          baseAsset: pair.baseAsset,

          exchange: 'Deribit',  constructor() {

          category: pair.category,    this.wsManager = new WSManager()

          lastPrice: parsedTicker.last || 0,    

          priceChange: parsedTicker.change || 0,    this.wsManager.onMessage((msg) => {

          priceChangePercent: parsedTicker.percentage || 0,      switch (msg.type) {

          volume: parsedTicker.baseVolume || 0,        case 'ticker':

          high24h: parsedTicker.high || 0,        case 'trade':

          low24h: parsedTicker.low || 0,          this.updateMarketData(msg.symbol, msg.data)

          open24h: parsedTicker.open || 0,          break

          openInterest: parsedTicker.info.open_interest || 0,      }

          impliedVolatility: parsedTicker.info.implied_volatility || 0,    })

          delta: parsedTicker.info.greeks?.delta || 0,  }

          gamma: parsedTicker.info.greeks?.gamma || 0,

          theta: parsedTicker.info.greeks?.theta || 0,  private updateMarketData(symbol: string, data: any) {

          vega: parsedTicker.info.greeks?.vega || 0    const existing = this.marketData.get(symbol)

        })    if (existing) {

      }      this.marketData.set(symbol, { ...existing, ...data })

      this.notifyUpdateCallbacks()

      return markets    }

    } catch (err) {  }

      console.error('Error fetching crypto options data:', err)

      return []  private notifyUpdateCallbacks() {

    }    const markets = Array.from(this.marketData.values())

  }    this.updateCallbacks.forEach(cb => cb(markets))

  }

  onUpdate(callback: (markets: Market[]) => void) {

    this.updateCallbacks.push(callback)  async connect() {

  }    // İlk market verilerini çek

    await this.fetchInitialData()

  getMarket(symbol: string): Market | undefined {

    return this.marketData.get(symbol)    // WebSocket bağlantıları

  }    const cryptoSymbols = MARKET_PAIRS.crypto.map(p => p.symbol)

    const cryptoFuturesSymbols = MARKET_PAIRS['crypto-futures'].map(p => p.symbol)

  getAllMarkets(): Market[] {    const cryptoOptionsSymbols = MARKET_PAIRS['crypto-options'].map(p => p.symbol)

    return Array.from(this.marketData.values())    const stockSymbols = MARKET_PAIRS.stocks.map(p => p.symbol)

  }

    this.wsManager.connectBinance(cryptoSymbols)

  getMarketsByType(type: MarketType): Market[] {    this.wsManager.connectDeribit([...cryptoFuturesSymbols, ...cryptoOptionsSymbols])

    return this.getAllMarkets().filter(m => m.type === type)    this.wsManager.connectFinnhub(stockSymbols)

  }  }

}

  private async fetchInitialData() {

// Market servis instance'ı    try {

const marketService = new MarketDataManager()      // Her market tipi için API'lerden veri çek

      for (const [type, pairs] of Object.entries(MARKET_PAIRS)) {

export default marketService        const symbols = pairs.map(p => p.symbol)

        const data = await this.fetchMarketData(type as MarketType, symbols)

// Yardımcı fonksiyonlar        

export const getAllMarketData = async () => {        data.forEach(market => {

  return marketService.getAllMarkets()          this.marketData.set(market.symbol, market)

}        })

      }

export const getMarketData = (symbol: string) => {

  return marketService.getMarket(symbol)      this.notifyUpdateCallbacks()

}

    } catch (err) {

export const getMarketsByType = (type: MarketType) => {      console.error('Error fetching initial market data:', err)

  return marketService.getMarketsByType(type)    }

}  }

  private async fetchMarketData(type: MarketType, symbols: string[]): Promise<Market[]> {
    // Her market tipi için uygun API'yi kullan
    switch(type) {
      case 'crypto':
      case 'crypto-futures':
      case 'crypto-options':
        return this.fetchCryptoData(type, symbols)
      
      case 'forex':
        return this.fetchForexData(symbols)
      
      case 'stocks':
        return this.fetchStockData(symbols)
      
      case 'bonds':
        return this.fetchBondData(symbols)
      
      case 'etf':
        return this.fetchETFData(symbols)
      
      case 'commodities':
        return this.fetchCommodityData(symbols)
      
      case 'indices':
        return this.fetchIndexData(symbols)
      
      default:
        throw new Error(`Unsupported market type: ${type}`)
    }
  }

  // Her market tipi için özel veri çekme fonksiyonları
  private async fetchCryptoData(type: MarketType, symbols: string[]): Promise<Market[]> {
    try {
      const markets: Market[] = []
      
      switch(type) {
        case 'crypto':
          const spotTickers = await binance.fetchTickers(symbols)
          for (const [symbol, ticker] of Object.entries(spotTickers)) {
            const pair = MARKET_PAIRS.crypto.find(p => p.symbol === symbol)
            if (!pair) continue

            markets.push({
              type: 'crypto',
              symbol,
              name: pair.name,
              baseAsset: pair.baseAsset,
              quoteAsset: pair.quoteAsset,
              exchange: 'Binance',
              category: pair.category,
              lastPrice: ticker.last || 0,
              priceChange: ticker.change || 0,
              priceChangePercent: ticker.percentage || 0,
              volume: ticker.baseVolume || 0,
              high24h: ticker.high || 0,
              low24h: ticker.low || 0,
              open24h: ticker.open || 0,
              marketCap: ticker.info.marketCap
            })
          }
          break

        case 'crypto-futures':
          const futuresTickers = await deribit.fetchTickers(symbols)
          for (const [symbol, ticker] of Object.entries(futuresTickers)) {
            const pair = MARKET_PAIRS['crypto-futures'].find(p => p.symbol === symbol)
            if (!pair) continue

            markets.push({
              type: 'crypto-futures',
              symbol,
              name: pair.name,
              baseAsset: pair.baseAsset,
              quoteAsset: pair.quoteAsset,
              exchange: 'Deribit',
              category: 'Futures',
              lastPrice: ticker.last || 0,
              priceChange: ticker.change || 0,
              priceChangePercent: ticker.percentage || 0,
              volume: ticker.baseVolume || 0,
              high24h: ticker.high || 0,
              low24h: ticker.low || 0,
              open24h: ticker.open || 0,
              openInterest: ticker.info.open_interest
            })
          }
          break

        case 'crypto-options':
          const optionsTickers = await deribit.fetchTickers(symbols)
          for (const [symbol, ticker] of Object.entries(optionsTickers)) {
            const pair = MARKET_PAIRS['crypto-options'].find(p => p.symbol === symbol)
            if (!pair) continue

            markets.push({
              type: 'crypto-options',
              symbol,
              name: pair.name,
              baseAsset: pair.baseAsset,
              exchange: 'Deribit',
              category: pair.category,
              lastPrice: ticker.last || 0,
              priceChange: ticker.change || 0,
              priceChangePercent: ticker.percentage || 0,
              volume: ticker.baseVolume || 0,
              openInterest: ticker.info.open_interest,
              impliedVolatility: ticker.info.implied_volatility,
              delta: ticker.info.greeks?.delta,
              gamma: ticker.info.greeks?.gamma,
              theta: ticker.info.greeks?.theta,
              vega: ticker.info.greeks?.vega
            })
          }
          break
      }

      return markets
    } catch (err) {
      console.error('Error fetching crypto data:', err)
      return []
    }
  }

  private async fetchForexData(symbols: string[]): Promise<Market[]> {
    try {
      const markets: Market[] = []
      
      for (const symbol of symbols) {
        const pair = MARKET_PAIRS.forex.find(p => p.symbol === symbol)
        if (!pair) continue

        const quote = await new Promise((resolve, reject) => {
          finnhubApi.forexCandles(symbol, 'D', Math.floor(Date.now()/1000) - 86400, Math.floor(Date.now()/1000), (error: any, data: any) => {
            if (error) reject(error)
            else resolve(data)
          })
        })

        if (!quote || !Array.isArray(quote.c)) continue

        markets.push({
          type: 'forex',
          symbol,
          name: pair.name,
          baseAsset: pair.baseAsset,
          quoteAsset: pair.quoteAsset,
          category: pair.category,
          lastPrice: quote.c[quote.c.length - 1],
          priceChange: quote.c[quote.c.length - 1] - quote.o[0],
          priceChangePercent: ((quote.c[quote.c.length - 1] - quote.o[0]) / quote.o[0]) * 100,
          volume: quote.v ? quote.v[quote.v.length - 1] : 0,
          high24h: Math.max(...quote.h),
          low24h: Math.min(...quote.l),
          open24h: quote.o[0]
        })
      }

      return markets
    } catch (err) {
      console.error('Error fetching forex data:', err)
      return []
    }
  }

  private async fetchStockData(symbols: string[]): Promise<Market[]> {
    try {
      const markets: Market[] = []
      
      for (const symbol of symbols) {
        const pair = MARKET_PAIRS.stocks.find(p => p.symbol === symbol)
        if (!pair) continue

        const [quote, basicFinancials] = await Promise.all([
          polygonClient.stocks.previousClose(symbol),
          polygonClient.reference.tickerDetails(symbol)
        ])

        if (!quote.results?.[0] || !basicFinancials.results) continue

        markets.push({
          type: 'stocks',
          symbol,
          name: pair.name,
          exchange: pair.exchange,
          category: pair.category,
          country: pair.country,
          unit: pair.unit,
          lastPrice: quote.results[0].c,
          priceChange: quote.results[0].c - quote.results[0].o,
          priceChangePercent: ((quote.results[0].c - quote.results[0].o) / quote.results[0].o) * 100,
          volume: quote.results[0].v,
          high24h: quote.results[0].h,
          low24h: quote.results[0].l,
          open24h: quote.results[0].o,
          marketCap: basicFinancials.results.market_cap,
          peRatio: basicFinancials.results.pe_ratio,
          dividendYield: basicFinancials.results.dividend_yield,
          beta: basicFinancials.results.beta
        })
      }

      return markets
    } catch (err) {
      console.error('Error fetching stock data:', err)
      return []
    }
  }

  private async fetchBondData(symbols: string[]): Promise<Market[]> {
    try {
      const markets: Market[] = []
      
      for (const symbol of symbols) {
        const pair = MARKET_PAIRS.bonds.find(p => p.symbol === symbol)
        if (!pair) continue

        const quote = await new Promise((resolve, reject) => {
          finnhubApi.bondYield(symbol, (error: any, data: any) => {
            if (error) reject(error)
            else resolve(data)
          })
        })

        if (!quote) continue

        markets.push({
          type: 'bonds',
          symbol,
          name: pair.name,
          category: pair.category,
          country: pair.country,
          unit: pair.unit,
          lastPrice: quote.yield,
          priceChange: quote.yield_change,
          priceChangePercent: (quote.yield_change / (quote.yield - quote.yield_change)) * 100,
          couponRate: quote.coupon_rate,
          maturityDate: quote.maturity_date,
          yieldToMaturity: quote.yield,
          duration: quote.duration,
          rating: quote.rating
        })
      }

      return markets
    } catch (err) {
      console.error('Error fetching bond data:', err)
      return []
    }
  }

  private async fetchETFData(symbols: string[]): Promise<Market[]> {
    try {
      const markets: Market[] = []
      
      for (const symbol of symbols) {
        const pair = MARKET_PAIRS.etf.find(p => p.symbol === symbol)
        if (!pair) continue

        const [quote, details] = await Promise.all([
          polygonClient.stocks.previousClose(symbol),
          polygonClient.reference.tickerDetails(symbol)
        ])

        if (!quote.results?.[0] || !details.results) continue

        markets.push({
          type: 'etf',
          symbol,
          name: pair.name,
          category: pair.category,
          exchange: pair.exchange,
          country: pair.country,
          unit: pair.unit,
          lastPrice: quote.results[0].c,
          priceChange: quote.results[0].c - quote.results[0].o,
          priceChangePercent: ((quote.results[0].c - quote.results[0].o) / quote.results[0].o) * 100,
          volume: quote.results[0].v,
          high24h: quote.results[0].h,
          low24h: quote.results[0].l,
          open24h: quote.results[0].o,
          trackingError: details.results.tracking_error,
          expenseRatio: details.results.expense_ratio,
          nav: details.results.nav,
          aum: details.results.aum
        })
      }

      return markets
    } catch (err) {
      console.error('Error fetching ETF data:', err)
      return []
    }
  }

  private async fetchCommodityData(symbols: string[]): Promise<Market[]> {
    try {
      const markets: Market[] = []
      
      for (const symbol of symbols) {
        const pair = MARKET_PAIRS.commodities.find(p => p.symbol === symbol)
        if (!pair) continue

        const quote = await new Promise((resolve, reject) => {
          finnhubApi.commodityQuote(symbol, (error: any, data: any) => {
            if (error) reject(error)
            else resolve(data)
          })
        })

        if (!quote) continue

        markets.push({
          type: 'commodities',
          symbol,
          name: pair.name,
          category: pair.category,
          unit: pair.unit,
          lastPrice: quote.c,
          priceChange: quote.c - quote.o,
          priceChangePercent: ((quote.c - quote.o) / quote.o) * 100,
          volume: quote.v,
          high24h: quote.h,
          low24h: quote.l,
          open24h: quote.o
        })
      }

      return markets
    } catch (err) {
      console.error('Error fetching commodity data:', err)
      return []
    }
  }

  private async fetchIndexData(symbols: string[]): Promise<Market[]> {
    try {
      const markets: Market[] = []
      
      for (const symbol of symbols) {
        const pair = MARKET_PAIRS.indices.find(p => p.symbol === symbol)
        if (!pair) continue

        const quote = await polygonClient.reference.marketStatus()

        if (!quote.results) continue

        markets.push({
          type: 'indices',
          symbol,
          name: pair.name,
          category: pair.category,
          unit: pair.unit,
          lastPrice: quote.results.close,
          priceChange: quote.results.close - quote.results.open,
          priceChangePercent: ((quote.results.close - quote.results.open) / quote.results.open) * 100,
          high24h: quote.results.high,
          low24h: quote.results.low,
          open24h: quote.results.open
        })
      }

      return markets
    } catch (err) {
      console.error('Error fetching index data:', err)
      return []
    }
  }

  onUpdate(callback: (markets: Market[]) => void) {
    this.updateCallbacks.push(callback)
  }

  getMarket(symbol: string): Market | undefined {
    return this.marketData.get(symbol)
  }

  getAllMarkets(): Market[] {
    return Array.from(this.marketData.values())
  }

  getMarketsByType(type: MarketType): Market[] {
    return this.getAllMarkets().filter(m => m.type === type)
  }

  async getOHLCV(symbol: string, timeframe: TimeFrame): Promise<any[]> {
    // İlgili API'den OHLCV verilerini çek
    return []
  }
}

// Market servis instance'ı
const marketService = new MarketDataManager()

export default marketService

// Yardımcı fonksiyonlar
export const getAllMarketData = async () => {
  return marketService.getAllMarkets()
}

export const getMarketData = (symbol: string) => {
  return marketService.getMarket(symbol)
}

export const getMarketsByType = (type: MarketType) => {
  return marketService.getMarketsByType(type)
}

export const getOHLCV = async (symbol: string, timeframe: TimeFrame) => {
  return marketService.getOHLCV(symbol, timeframe)
}