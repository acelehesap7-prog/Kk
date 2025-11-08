'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, TrendingDown, Search, Wallet, ArrowUpDown } from 'lucide-react'
import { getMarketsByType, MarketData } from '@/lib/market-service'

export default function SpotTradingPage() {
  const [markets, setMarkets] = useState<MarketData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPair, setSelectedPair] = useState<MarketData | null>(null)
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')

  useEffect(() => {
    const loadMarkets = async () => {
      try {
        const spotMarkets = await getMarketsByType('spot')
        setMarkets(spotMarkets)
        if (spotMarkets.length > 0) {
          setSelectedPair(spotMarkets[0])
          setPrice(spotMarkets[0].price.toString())
        }
      } catch (error) {
        console.error('Failed to load spot markets:', error)
      }
    }
    loadMarkets()
  }, [])

  const filteredMarkets = markets.filter(market =>
    market.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleTrade = () => {
    if (!selectedPair || !amount || !price) {
      alert('Lütfen tüm alanları doldurun')
      return
    }
    
    const total = parseFloat(amount) * parseFloat(price)
    alert(`${orderType.toUpperCase()} Order: ${amount} ${selectedPair.symbol} @ ${price} (Total: ${total.toFixed(2)} USDT)`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Spot Trading</h1>
        <p className="text-lg text-muted-foreground">
          Anında alım-satım işlemleri gerçekleştirin
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market List */}
        <Card>
          <CardHeader>
            <CardTitle>Markets</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search markets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredMarkets.map((market) => (
                <div
                  key={market.symbol}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedPair?.symbol === market.symbol
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setSelectedPair(market)
                    setPrice(market.price.toString())
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{market.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        Vol: ${(market.volume / 1000000).toFixed(1)}M
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${market.price.toFixed(2)}</div>
                      <div className={`text-sm flex items-center ${
                        market.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {market.changePercent >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {market.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trading Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ArrowUpDown className="h-5 w-5" />
              <span>Trade {selectedPair?.symbol}</span>
            </CardTitle>
            <CardDescription>
              Current Price: ${selectedPair?.price.toFixed(2)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={orderType} onValueChange={(value) => setOrderType(value as 'buy' | 'sell')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buy" className="text-green-600">Buy</TabsTrigger>
                <TabsTrigger value="sell" className="text-red-600">Sell</TabsTrigger>
              </TabsList>
              
              <TabsContent value="buy" className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Price (USDT)</label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Amount</label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Total: {amount && price ? (parseFloat(amount) * parseFloat(price)).toFixed(2) : '0.00'} USDT
                </div>
                <Button 
                  onClick={handleTrade}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Buy {selectedPair?.symbol.split('/')[0]}
                </Button>
              </TabsContent>
              
              <TabsContent value="sell" className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Price (USDT)</label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Amount</label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Total: {amount && price ? (parseFloat(amount) * parseFloat(price)).toFixed(2) : '0.00'} USDT
                </div>
                <Button 
                  onClick={handleTrade}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Sell {selectedPair?.symbol.split('/')[0]}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Wallet & Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="h-5 w-5" />
              <span>Wallet</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>USDT Balance</span>
                <span className="font-medium">1,250.00</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>BTC Balance</span>
                <span className="font-medium">0.0285</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>ETH Balance</span>
                <span className="font-medium">0.5420</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span>KK99 Balance</span>
                <span className="font-medium text-blue-600">5,000</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <h4 className="font-medium">Market Stats</h4>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">24h High</span>
                  <span>${selectedPair?.high24h.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">24h Low</span>
                  <span>${selectedPair?.low24h.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">24h Volume</span>
                  <span>${selectedPair ? (selectedPair.volume / 1000000).toFixed(1) : '0'}M</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KK99 Benefits */}
      <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle>KK99 Token ile Avantajlar</CardTitle>
          <CardDescription>
            Spot trading işlemlerinizde KK99 token kullanarak özel avantajlardan yararlanın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <Badge className="mb-2">%50 İndirim</Badge>
              <div className="text-sm">İşlem ücretlerinde</div>
            </div>
            <div className="text-center">
              <Badge className="mb-2">Öncelikli</Badge>
              <div className="text-sm">Emir işleme</div>
            </div>
            <div className="text-center">
              <Badge className="mb-2">Özel</Badge>
              <div className="text-sm">Analiz araçları</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}