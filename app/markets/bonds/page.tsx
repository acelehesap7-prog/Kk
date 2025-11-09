'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, TrendingDown, Search, Wallet, ArrowUpDown, BarChart3 } from 'lucide-react'
import { getMarketsByType, MarketData } from '@/lib/real-market-service'

export default function BondsPage() {
  const [markets, setMarkets] = useState<MarketData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBond, setSelectedBond] = useState<MarketData | null>(null)
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMarkets = async () => {
      try {
        setLoading(true)
        const bondsMarkets = await getMarketsByType('bonds')
        setMarkets(bondsMarkets)
        if (bondsMarkets.length > 0) {
          setSelectedBond(bondsMarkets[0])
        }
      } catch (error) {
        console.error('Failed to load bonds markets:', error)
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
    if (!selectedBond || !amount) {
      alert('Lütfen tüm alanları doldurun')
      return
    }
    
    const total = parseFloat(amount) * selectedBond.price
    const kk99Fee = total * 0.001 * 0.5 // %50 indirim
    alert(`${orderType.toUpperCase()} Order: ${amount} ${selectedBond.symbol} @ ${selectedBond.price.toFixed(4)}% (Total: $${total.toFixed(2)}) - KK99 Fee: ${kk99Fee.toFixed(4)} KK99`)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading bonds data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Tahvil ve Bonolar</h1>
        <p className="text-lg text-muted-foreground">
          Devlet tahvilleri ve kurumsal bonolarda yatırım yapın
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bonds List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Tahvil & Bonolar</span>
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tahvil ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredMarkets.map((bond) => (
                <div
                  key={bond.symbol}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedBond?.symbol === bond.symbol
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedBond(bond)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{bond.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        Yield: {bond.price.toFixed(3)}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{bond.price.toFixed(3)}%</div>
                      <div className={`text-sm flex items-center ${
                        bond.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {bond.changePercent >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {bond.changePercent.toFixed(2)}%
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
              <span>Trade {selectedBond?.symbol}</span>
            </CardTitle>
            <CardDescription>
              Current Yield: {selectedBond?.price.toFixed(3)}%
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
                  <label className="text-sm font-medium">Amount (USD)</label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Yield: {selectedBond?.price.toFixed(3)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Total: {amount ? (parseFloat(amount)).toFixed(2) : '0.00'} USD
                </div>
                <Button 
                  onClick={handleTrade}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Buy {selectedBond?.symbol}
                </Button>
              </TabsContent>
              
              <TabsContent value="sell" className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Amount (USD)</label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Yield: {selectedBond?.price.toFixed(3)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Total: {amount ? (parseFloat(amount)).toFixed(2) : '0.00'} USD
                </div>
                <Button 
                  onClick={handleTrade}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Sell {selectedBond?.symbol}
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
                <span className="font-medium">$10,000.00</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>Bonds Value</span>
                <span className="font-medium">$5,250.00</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span>KK99 Balance</span>
                <span className="font-medium text-blue-600">5,000</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <h4 className="font-medium">Bond Details</h4>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Yield</span>
                  <span>{selectedBond?.price.toFixed(3)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">24h High</span>
                  <span>{selectedBond?.high24h.toFixed(3)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">24h Low</span>
                  <span>{selectedBond?.low24h.toFixed(3)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">24h Volume</span>
                  <span>${selectedBond ? (selectedBond.volume / 1000000).toFixed(1) : '0'}M</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KK99 Benefits */}
      <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle>KK99 Token ile Tahvil Yatırımında Avantajlar</CardTitle>
          <CardDescription>
            Tahvil ve bono yatırımlarınızda KK99 token kullanarak özel avantajlardan yararlanın
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
              <Badge className="mb-2">Özel</Badge>
              <div className="text-sm">Tahvil analizi</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}