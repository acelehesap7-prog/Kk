'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, TrendingDown, Search, Wallet, BarChart3, Globe } from 'lucide-react'

const indices = [
  { symbol: 'SPX', name: 'S&P 500', price: 4785.25, change: 25.50, changePercent: 0.54, volume: 125000, region: 'US' },
  { symbol: 'NDX', name: 'NASDAQ 100', price: 16850.75, change: -45.25, changePercent: -0.27, volume: 98000, region: 'US' },
  { symbol: 'DJI', name: 'Dow Jones', price: 37250.50, change: 125.75, changePercent: 0.34, volume: 85000, region: 'US' },
  { symbol: 'FTSE', name: 'FTSE 100', price: 7685.25, change: -15.50, changePercent: -0.20, volume: 65000, region: 'UK' },
  { symbol: 'DAX', name: 'DAX 40', price: 16425.75, change: 85.25, changePercent: 0.52, volume: 75000, region: 'Germany' },
  { symbol: 'NIKKEI', name: 'Nikkei 225', price: 33250.50, change: 185.25, changePercent: 0.56, volume: 55000, region: 'Japan' },
]

export default function IndicesTradingPage() {
  const [selectedIndex, setSelectedIndex] = useState(indices[0])
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy')
  const [leverage, setLeverage] = useState('10')
  const [amount, setAmount] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredIndices = indices.filter(index =>
    index.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    index.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleTrade = () => {
    if (!amount) {
      alert('Lütfen işlem miktarını girin')
      return
    }
    
    const total = parseFloat(amount) * selectedIndex.price
    alert(`${orderType.toUpperCase()} Order: ${amount} units of ${selectedIndex.symbol} @ ${selectedIndex.price} (Leverage: ${leverage}x, Total: $${total.toFixed(2)})`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Indices Trading</h1>
        <p className="text-lg text-muted-foreground">
          Dünya endekslerinde CFD işlemleri
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Indices List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>World Indices</span>
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search indices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredIndices.map((index) => (
                <div
                  key={index.symbol}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedIndex?.symbol === index.symbol
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedIndex(index)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{index.symbol}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {index.name}
                      </div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {index.region}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{index.price.toFixed(2)}</div>
                      <div className={`text-sm flex items-center ${
                        index.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {index.changePercent >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {index.changePercent.toFixed(2)}%
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
              <BarChart3 className="h-5 w-5" />
              <span>Trade {selectedIndex?.symbol}</span>
            </CardTitle>
            <CardDescription>
              {selectedIndex?.name} - {selectedIndex?.price.toFixed(2)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Tabs value={orderType} onValueChange={(value) => setOrderType(value as 'buy' | 'sell')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="buy" className="text-green-600">Buy (Long)</TabsTrigger>
                  <TabsTrigger value="sell" className="text-red-600">Sell (Short)</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div>
                <label className="text-sm font-medium">Leverage</label>
                <Select value={leverage} onValueChange={setLeverage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1:1</SelectItem>
                    <SelectItem value="5">1:5</SelectItem>
                    <SelectItem value="10">1:10</SelectItem>
                    <SelectItem value="20">1:20</SelectItem>
                    <SelectItem value="50">1:50</SelectItem>
                    <SelectItem value="100">1:100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Units</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1"
                  min="0.1"
                  step="0.1"
                />
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Index Value:</span>
                  <span>{selectedIndex?.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Position Value:</span>
                  <span>${amount ? (parseFloat(amount) * selectedIndex.price).toFixed(2) : '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Margin Required:</span>
                  <span>${amount ? ((parseFloat(amount) * selectedIndex.price) / parseFloat(leverage)).toFixed(2) : '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Spread:</span>
                  <span>0.5 points</span>
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
                {orderType === 'buy' ? 'Buy' : 'Sell'} {selectedIndex?.symbol}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Positions & Market Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="h-5 w-5" />
              <span>Positions & Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="positions">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="positions">Positions</TabsTrigger>
                <TabsTrigger value="status">Market Status</TabsTrigger>
              </TabsList>
              
              <TabsContent value="positions" className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">SPX</div>
                      <div className="text-sm text-muted-foreground">2.5 units (Long)</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$11,963.13</div>
                      <div className="text-sm text-green-600">+$63.75</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">NDX</div>
                      <div className="text-sm text-muted-foreground">1 unit (Short)</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$16,850.75</div>
                      <div className="text-sm text-green-600">+$45.25</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="status" className="space-y-3">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">US Markets:</span>
                    <Badge className="bg-green-500">Open</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">European Markets:</span>
                    <Badge variant="secondary">Closed</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Asian Markets:</span>
                    <Badge variant="secondary">Closed</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next Open:</span>
                    <span>Tokyo - 2h 15m</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 space-y-3">
              <h4 className="font-medium">Account Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Available Margin</span>
                  <span className="font-medium">$18,500.00</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Used Margin</span>
                  <span className="font-medium">$2,865.00</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span>KK99 Balance</span>
                  <span className="font-medium text-blue-600">5,000</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KK99 Benefits */}
      <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle>KK99 Token ile Endeks Avantajları</CardTitle>
          <CardDescription>
            Endeks işlemlerinde KK99 token kullanarak özel avantajlardan yararlanın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Badge className="mb-2">Sıfır</Badge>
              <div className="text-sm">Spread maliyeti</div>
            </div>
            <div className="text-center">
              <Badge className="mb-2">Yüksek</Badge>
              <div className="text-sm">Kaldıraç oranları</div>
            </div>
            <div className="text-center">
              <Badge className="mb-2">24/7</Badge>
              <div className="text-sm">İşlem imkanı</div>
            </div>
            <div className="text-center">
              <Badge className="mb-2">Gelişmiş</Badge>
              <div className="text-sm">Teknik analiz</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}