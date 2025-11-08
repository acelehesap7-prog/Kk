'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, TrendingDown, Search, Wallet, BarChart3, Target } from 'lucide-react'

const options = [
  { symbol: 'BTC-20241215-45000-C', underlying: 'BTC', strike: 45000, expiry: '2024-12-15', type: 'Call', price: 1250.00, change: 125.50, changePercent: 11.16 },
  { symbol: 'BTC-20241215-45000-P', underlying: 'BTC', strike: 45000, expiry: '2024-12-15', type: 'Put', price: 850.00, change: -45.25, changePercent: -5.05 },
  { symbol: 'ETH-20241215-2800-C', underlying: 'ETH', strike: 2800, expiry: '2024-12-15', type: 'Call', price: 185.50, change: 15.75, changePercent: 9.28 },
  { symbol: 'ETH-20241215-2800-P', underlying: 'ETH', strike: 2800, expiry: '2024-12-15', type: 'Put', price: 125.25, change: -8.50, changePercent: -6.35 },
]

export default function OptionsTradingPage() {
  const [selectedOption, setSelectedOption] = useState(options[0])
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy')
  const [contracts, setContracts] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredOptions = options.filter(option =>
    option.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.underlying.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleTrade = () => {
    if (!contracts) {
      alert('Lütfen kontrat adedini girin')
      return
    }
    
    const total = parseFloat(contracts) * selectedOption.price
    alert(`${orderType.toUpperCase()} Order: ${contracts} contracts of ${selectedOption.symbol} @ $${selectedOption.price} (Total: $${total.toFixed(2)})`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Options Trading</h1>
        <p className="text-lg text-muted-foreground">
          Opsiyon sözleşmeleri ile gelişmiş trading stratejileri
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Options List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Options Chain</span>
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search options..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredOptions.map((option) => (
                <div
                  key={option.symbol}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedOption?.symbol === option.symbol
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedOption(option)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{option.underlying}</div>
                      <div className="text-sm text-muted-foreground">
                        Strike: ${option.strike}
                      </div>
                      <div className="flex space-x-2 mt-1">
                        <Badge variant={option.type === 'Call' ? 'default' : 'secondary'} className="text-xs">
                          {option.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {option.expiry}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${option.price.toFixed(2)}</div>
                      <div className={`text-sm flex items-center ${
                        option.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {option.changePercent >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {option.changePercent.toFixed(2)}%
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
              <span>Trade {selectedOption?.underlying} Option</span>
            </CardTitle>
            <CardDescription>
              {selectedOption?.symbol} - ${selectedOption?.price.toFixed(2)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Tabs value={orderType} onValueChange={(value) => setOrderType(value as 'buy' | 'sell')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="buy" className="text-green-600">Buy to Open</TabsTrigger>
                  <TabsTrigger value="sell" className="text-red-600">Sell to Open</TabsTrigger>
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
                  <span className="text-muted-foreground">Premium per Contract:</span>
                  <span>${selectedOption?.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Premium:</span>
                  <span>${contracts ? (parseFloat(contracts) * selectedOption.price).toFixed(2) : '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Strike Price:</span>
                  <span>${selectedOption?.strike.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expiry:</span>
                  <span>{selectedOption?.expiry}</span>
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
                {orderType === 'buy' ? 'Buy' : 'Sell'} Option
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Greeks & Account */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="h-5 w-5" />
              <span>Greeks & Account</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="greeks">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="greeks">Greeks</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
              </TabsList>
              
              <TabsContent value="greeks" className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delta:</span>
                    <span className="font-medium">0.65</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gamma:</span>
                    <span className="font-medium">0.012</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Theta:</span>
                    <span className="font-medium text-red-600">-2.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vega:</span>
                    <span className="font-medium">15.8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rho:</span>
                    <span className="font-medium">8.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IV:</span>
                    <span className="font-medium">65.2%</span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="account" className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Available Balance</span>
                  <span className="font-medium">$12,500.00</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Options Buying Power</span>
                  <span className="font-medium">$25,000.00</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span>KK99 Balance</span>
                  <span className="font-medium text-blue-600">5,000</span>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 space-y-3">
              <h4 className="font-medium">Risk Metrics</h4>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Risk:</span>
                  <span className="text-red-600">${contracts ? (parseFloat(contracts) * selectedOption.price).toFixed(2) : '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Profit:</span>
                  <span className="text-green-600">Unlimited</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Breakeven:</span>
                  <span>${selectedOption ? (selectedOption.strike + selectedOption.price).toFixed(2) : '0.00'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KK99 Benefits */}
      <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle>KK99 Token ile Options Avantajları</CardTitle>
          <CardDescription>
            Opsiyon işlemlerinde KK99 token kullanarak özel avantajlardan yararlanın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Badge className="mb-2">%80 İndirim</Badge>
              <div className="text-sm">Opsiyon ücretlerinde</div>
            </div>
            <div className="text-center">
              <Badge className="mb-2">Gelişmiş</Badge>
              <div className="text-sm">Greeks hesaplaması</div>
            </div>
            <div className="text-center">
              <Badge className="mb-2">Özel</Badge>
              <div className="text-sm">Strateji araçları</div>
            </div>
            <div className="text-center">
              <Badge className="mb-2">Düşük</Badge>
              <div className="text-sm">Margin gereksinimleri</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}