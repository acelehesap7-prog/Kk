'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, TrendingDown, Search, Wallet, Zap, Fuel } from 'lucide-react'

const commodities = [
  { symbol: 'GOLD', name: 'Gold', price: 2045.50, change: 15.25, changePercent: 0.75, volume: 125000, unit: 'oz', category: 'Precious Metals' },
  { symbol: 'SILVER', name: 'Silver', price: 24.85, change: -0.35, changePercent: -1.39, volume: 85000, unit: 'oz', category: 'Precious Metals' },
  { symbol: 'WTI', name: 'Crude Oil WTI', price: 78.25, change: 2.15, changePercent: 2.83, volume: 95000, unit: 'barrel', category: 'Energy' },
  { symbol: 'BRENT', name: 'Brent Oil', price: 82.50, change: 1.85, changePercent: 2.29, volume: 88000, unit: 'barrel', category: 'Energy' },
  { symbol: 'NATGAS', name: 'Natural Gas', price: 2.85, change: -0.15, changePercent: -5.00, volume: 65000, unit: 'MMBtu', category: 'Energy' },
  { symbol: 'WHEAT', name: 'Wheat', price: 6.25, change: 0.08, changePercent: 1.30, volume: 45000, unit: 'bushel', category: 'Agriculture' },
]

export default function CommoditiesTradingPage() {
  const [selectedCommodity, setSelectedCommodity] = useState(commodities[0])
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy')
  const [contracts, setContracts] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCommodities = commodities.filter(commodity =>
    commodity.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commodity.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleTrade = () => {
    if (!contracts) {
      alert('Lütfen kontrat adedini girin')
      return
    }
    
    const total = parseFloat(contracts) * selectedCommodity.price
    alert(`${orderType.toUpperCase()} Order: ${contracts} contracts of ${selectedCommodity.symbol} @ $${selectedCommodity.price}/${selectedCommodity.unit} (Total: $${total.toFixed(2)})`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Commodities Trading</h1>
        <p className="text-lg text-muted-foreground">
          Emtia piyasalarında altın, petrol, tarım ürünleri işlemleri
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Commodities List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Fuel className="h-5 w-5" />
              <span>Commodities</span>
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search commodities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredCommodities.map((commodity) => (
                <div
                  key={commodity.symbol}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedCommodity?.symbol === commodity.symbol
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedCommodity(commodity)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{commodity.symbol}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {commodity.name}
                      </div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {commodity.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${commodity.price.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">per {commodity.unit}</div>
                      <div className={`text-sm flex items-center ${
                        commodity.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {commodity.changePercent >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {commodity.changePercent.toFixed(2)}%
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
              <Zap className="h-5 w-5" />
              <span>Trade {selectedCommodity?.symbol}</span>
            </CardTitle>
            <CardDescription>
              {selectedCommodity?.name} - ${selectedCommodity?.price.toFixed(2)}/{selectedCommodity?.unit}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Tabs value={orderType} onValueChange={(value) => setOrderType(value as 'buy' | 'sell')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="buy" className="text-green-600">Buy</TabsTrigger>
                  <TabsTrigger value="sell" className="text-red-600">Sell</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div>
                <label className="text-sm font-medium">Contracts</label>
                <Input
                  type="number"
                  value={contracts}
                  onChange={(e) => setContracts(e.target.value)}
                  placeholder="1"
                  min="1"
                />
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price per {selectedCommodity?.unit}:</span>
                  <span>${selectedCommodity?.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Value:</span>
                  <span>${contracts ? (parseFloat(contracts) * selectedCommodity.price).toFixed(2) : '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Margin Required:</span>
                  <span>${contracts ? ((parseFloat(contracts) * selectedCommodity.price) * 0.1).toFixed(2) : '0.00'}</span>
                </div>
              </div>
              
              <Button 
                onClick={handleTrade}
                className={`w-full ${
                  orderType === 'buy' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {orderType === 'buy' ? 'Buy' : 'Sell'} {selectedCommodity?.symbol}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio & Market Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="h-5 w-5" />
              <span>Portfolio</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="positions">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="positions">Positions</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
              </TabsList>
              
              <TabsContent value="positions" className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">GOLD</div>
                      <div className="text-sm text-muted-foreground">2 contracts</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$4,091.00</div>
                      <div className="text-sm text-green-600">+$30.50</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">WTI</div>
                      <div className="text-sm text-muted-foreground">1 contract</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$78.25</div>
                      <div className="text-sm text-green-600">+$2.15</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="account" className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Available Margin</span>
                  <span className="font-medium">$15,000.00</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Used Margin</span>
                  <span className="font-medium">$417.00</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span>KK99 Balance</span>
                  <span className="font-medium text-blue-600">5,000</span>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 space-y-3">
              <h4 className="font-medium">Market Factors</h4>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Supply/Demand:</span>
                  <Badge className="bg-green-500">Bullish</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seasonal Trend:</span>
                  <Badge variant="outline">Neutral</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Economic Impact:</span>
                  <Badge className="bg-yellow-500">Moderate</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volatility:</span>
                  <span>Medium</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KK99 Benefits */}
      <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle>KK99 Token ile Emtia Avantajları</CardTitle>
          <CardDescription>
            Emtia işlemlerinde KK99 token kullanarak özel avantajlardan yararlanın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Badge className="mb-2">%75 İndirim</Badge>
              <div className="text-sm">İşlem ücretlerinde</div>
            </div>
            <div className="text-center">
              <Badge className="mb-2">Düşük</Badge>
              <div className="text-sm">Margin oranları</div>
            </div>
            <div className="text-center">
              <Badge className="mb-2">Gerçek Zamanlı</Badge>
              <div className="text-sm">Piyasa analizi</div>
            </div>
            <div className="text-center">
              <Badge className="mb-2">Özel</Badge>
              <div className="text-sm">Hedge araçları</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}