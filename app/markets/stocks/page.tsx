'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, TrendingDown, Search, Wallet, PieChart, Building } from 'lucide-react'

const stocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 189.50, change: 2.35, changePercent: 1.26, volume: 45000000, sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.25, change: -1.85, changePercent: -0.49, volume: 32000000, sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.80, change: 0.95, changePercent: 0.67, volume: 28000000, sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 155.75, change: -0.45, changePercent: -0.29, volume: 35000000, sector: 'Consumer Discretionary' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: 8.25, changePercent: 3.44, volume: 85000000, sector: 'Consumer Discretionary' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 485.20, change: 12.80, changePercent: 2.71, volume: 42000000, sector: 'Technology' },
]

export default function StocksTradingPage() {
  const [selectedStock, setSelectedStock] = useState(stocks[0])
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleTrade = () => {
    if (!amount) {
      alert('Lütfen hisse adedini girin')
      return
    }
    
    const total = parseFloat(amount) * selectedStock.price
    alert(`${orderType.toUpperCase()} Order: ${amount} shares of ${selectedStock.symbol} @ $${selectedStock.price} (Total: $${total.toFixed(2)})`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Stock Trading</h1>
        <p className="text-lg text-muted-foreground">
          Dünya borsalarında hisse senedi işlemleri
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Stocks</span>
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredStocks.map((stock) => (
                <div
                  key={stock.symbol}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedStock?.symbol === stock.symbol
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedStock(stock)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{stock.symbol}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {stock.name}
                      </div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {stock.sector}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${stock.price.toFixed(2)}</div>
                      <div className={`text-sm flex items-center ${
                        stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stock.changePercent >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {stock.changePercent.toFixed(2)}%
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
              <PieChart className="h-5 w-5" />
              <span>Trade {selectedStock?.symbol}</span>
            </CardTitle>
            <CardDescription>
              {selectedStock?.name} - ${selectedStock?.price.toFixed(2)}
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
                <label className="text-sm font-medium">Shares</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  min="1"
                />
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price per Share:</span>
                  <span>${selectedStock?.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Cost:</span>
                  <span>${amount ? (parseFloat(amount) * selectedStock.price).toFixed(2) : '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Commission:</span>
                  <span>$0.00</span>
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
                {orderType === 'buy' ? 'Buy' : 'Sell'} {selectedStock?.symbol}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio & Account */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="h-5 w-5" />
              <span>Portfolio</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="portfolio">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="portfolio">Holdings</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
              </TabsList>
              
              <TabsContent value="portfolio" className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">AAPL</div>
                      <div className="text-sm text-muted-foreground">10 shares</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$1,895.00</div>
                      <div className="text-sm text-green-600">+$23.50</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">MSFT</div>
                      <div className="text-sm text-muted-foreground">5 shares</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$1,891.25</div>
                      <div className="text-sm text-red-600">-$9.25</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="account" className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Cash Balance</span>
                  <span className="font-medium">$8,500.00</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Portfolio Value</span>
                  <span className="font-medium">$3,786.25</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span>KK99 Balance</span>
                  <span className="font-medium text-blue-600">5,000</span>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 space-y-3">
              <h4 className="font-medium">Market Info</h4>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Market Cap:</span>
                  <span>$2.95T</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">P/E Ratio:</span>
                  <span>29.8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">52W High:</span>
                  <span>$199.62</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">52W Low:</span>
                  <span>$124.17</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KK99 Benefits */}
      <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle>KK99 Token ile Hisse Senedi Avantajları</CardTitle>
          <CardDescription>
            Hisse senedi işlemlerinde KK99 token kullanarak özel avantajlardan yararlanın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Badge className="mb-2">$0</Badge>
              <div className="text-sm">Komisyon ücreti</div>
            </div>
            <div className="text-center">
              <Badge className="mb-2">Gerçek Zamanlı</Badge>
              <div className="text-sm">Piyasa verileri</div>
            </div>
            <div className="text-center">
              <Badge className="mb-2">Gelişmiş</Badge>
              <div className="text-sm">Analiz araçları</div>
            </div>
            <div className="text-center">
              <Badge className="mb-2">Öncelikli</Badge>
              <div className="text-sm">Emir işleme</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}