'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, TrendingDown, Search, Wallet, ArrowUpDown, PieChart } from 'lucide-react'
import { getMarketsByType, MarketData } from '@/lib/real-market-service'

export default function ETFPage() {
  const [markets, setMarkets] = useState<MarketData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedETF, setSelectedETF] = useState<MarketData | null>(null)
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMarkets = async () => {
      try {
        setLoading(true)
        const etfMarkets = await getMarketsByType('etf')
        setMarkets(etfMarkets)
        if (etfMarkets.length > 0) {
          setSelectedETF(etfMarkets[0])
          setPrice(etfMarkets[0].price.toString())
        }
      } catch (error) {
        console.error('Failed to load ETF markets:', error)
      } finally {
        setLoading(false)
      }
    }
    loadMarkets()
  }, [])

  const filteredMarkets = markets.filter(market =>
    market.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleTrade = () => {
    if (!selectedETF || !amount || !price) {
      alert('Lütfen tüm alanları doldurun')
      return
    }
    
    const total = parseFloat(amount) * parseFloat(price)
    const kk99Fee = total * 0.0005 * 0.5 // %50 indirim
    alert(`${orderType.toUpperCase()} Order: ${amount} ${selectedETF.symbol} @ $${price} (Total: $${total.toFixed(2)}) - KK99 Fee: ${kk99Fee.toFixed(4)} KK99`)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading ETF data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">ETF Trading</h1>
        <p className="text-lg text-muted-foreground">
          Exchange Traded Funds ile çeşitlendirilmiş portföy yatırımı yapın
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ETF List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>ETF Markets</span>
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search ETFs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredMarkets.map((etf) => (
                <div
                  key={etf.symbol}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedETF?.symbol === etf.symbol
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setSelectedETF(etf)
                    setPrice(etf.price.toString())
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{etf.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        Vol: ${(etf.volume / 1000000).toFixed(1)}M
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${etf.price.toFixed(2)}</div>
                      <div className={`text-sm flex items-center ${
                        etf.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {etf.changePercent >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {etf.changePercent.toFixed(2)}%
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
              <span>Trade {selectedETF?.symbol}</span>
            </CardTitle>
            <CardDescription>
              Current Price: ${selectedETF?.price.toFixed(2)}
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
                  <label className="text-sm font-medium">Price (USD)</label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Shares</label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Total: {amount && price ? (parseFloat(amount) * parseFloat(price)).toFixed(2) : '0.00'} USD
                </div>
                <Button 
                  onClick={handleTrade}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Buy {selectedETF?.symbol}
                </Button>
              </TabsContent>
              
              <TabsContent value="sell" className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Price (USD)</label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Shares</label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Total: {amount && price ? (parseFloat(amount) * parseFloat(price)).toFixed(2) : '0.00'} USD
                </div>
                <Button 
                  onClick={handleTrade}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Sell {selectedETF?.symbol}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Portfolio & Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="h-5 w-5" />
              <span>Portfolio</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>USD Balance</span>
                <span className="font-medium">$25,000.00</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>ETF Holdings</span>
                <span className="font-medium">$18,750.00</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span>KK99 Balance</span>
                <span className="font-medium text-blue-600">5,000</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <h4 className="font-medium">ETF Details</h4>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Price</span>
                  <span>${selectedETF?.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">24h High</span>
                  <span>${selectedETF?.high24h.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">24h Low</span>
                  <span>${selectedETF?.low24h.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">24h Volume</span>
                  <span>${selectedETF ? (selectedETF.volume / 1000000).toFixed(1) : '0'}M</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <h4 className="font-medium">ETF Holdings</h4>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>SPY</span>
                  <span>25 shares</span>
                </div>
                <div className="flex justify-between">
                  <span>QQQ</span>
                  <span>15 shares</span>
                </div>
                <div className="flex justify-between">
                  <span>VTI</span>
                  <span>30 shares</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KK99 Benefits */}
      <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle>KK99 Token ile ETF Yatırımında Avantajlar</CardTitle>
          <CardDescription>
            ETF yatırımlarınızda KK99 token kullanarak özel avantajlardan yararlanın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Badge className="mb-2">%50 İndirim</Badge>
              <div className="text-sm">İşlem ücretlerinde</div>
            </div>
            <div className="text-center">
              <Badge className="mb-2">Düşük Spread</Badge>
              <div className="text-sm">Alış-satış farkı</div>
            </div>
            <div className="text-center">
              <Badge className="mb-2">Öncelikli</Badge>
              <div className="text-sm">Emir işleme</div>
            </div>
            <div className="text-center">
              <Badge className="mb-2">Portföy</Badge>
              <div className="text-sm">Analiz araçları</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}