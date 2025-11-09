'use client'

import { useState, useEffect } from 'react'
import { RealMarketService } from '@/lib/real-market-service'
import { WalletService } from '@/lib/wallet-service'
import { KK99Service } from '@/lib/kk99-service'
import { TradingService } from '@/lib/trading-service'
import { MarketData } from '@/lib/market-service'

export default function ForexTradingPage() {
  const [markets, setMarkets] = useState<MarketData[]>([])
  const [selectedPair, setSelectedPair] = useState<MarketData | null>(null)
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market')
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')
  const [walletConnection, setWalletConnection] = useState(null)
  const [kk99Balance, setKk99Balance] = useState(0)
  const [feeCalculation, setFeeCalculation] = useState(null)

  useEffect(() => {
    const loadMarkets = async () => {
      try {
        const forexRates = await marketService.getForexRates()
        setMarkets(forexRates)
        if (!selectedPair && forexRates.length > 0) {
          setSelectedPair(forexRates[0])
          setPrice(forexRates[0].price.toString())
        }
      } catch (error) {
        console.error('Error loading forex markets:', error)
      }
    }

    loadMarkets()
    const interval = setInterval(loadMarkets, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const loadWalletAndKK99 = async () => {
      try {
        const connection = walletService.getWalletConnection()
        setWalletConnection(connection)
        
        if (connection) {
          const balance = await kk99Service.getBalance()
          setKk99Balance(balance.totalBalance)
        }
      } catch (error) {
        console.error('Error loading wallet/KK99 data:', error)
      }
    }

    loadWalletAndKK99()
  }, [])
    }
    
    const total = parseFloat(amount) * selectedPair.price
    alert(`${orderType.toUpperCase()} Order: ${amount} ${selectedPair.symbol} @ ${selectedPair.price} (Leverage: ${leverage}x)`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Forex Trading</h1>
        <p className="text-lg text-muted-foreground">
          Döviz piyasasında 24/7 işlem yapın
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Currency Pairs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Currency Pairs</span>
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pairs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredPairs.map((pair) => (
                <div
                  key={pair.symbol}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedPair?.symbol === pair.symbol
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPair(pair)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{pair.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        Vol: ${(pair.volume / 1000000).toFixed(0)}M
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{pair.price.toFixed(4)}</div>
                      <div className={`text-sm flex items-center ${
                        pair.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {pair.changePercent >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {pair.changePercent.toFixed(2)}%
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
              <DollarSign className="h-5 w-5" />
              <span>Trade {selectedPair?.symbol}</span>
            </CardTitle>
            <CardDescription>
              Current Rate: {selectedPair?.price.toFixed(4)}
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
                <label className="text-sm font-medium">Leverage</label>
                <Select value={leverage} onValueChange={setLeverage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1:1</SelectItem>
                    <SelectItem value="10">1:10</SelectItem>
                    <SelectItem value="50">1:50</SelectItem>
                    <SelectItem value="100">1:100</SelectItem>
                    <SelectItem value="200">1:200</SelectItem>
                    <SelectItem value="500">1:500</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Amount (Lots)</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.01"
                  step="0.01"
                />
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Margin Required:</span>
                  <span>{amount ? ((parseFloat(amount) * 100000 * selectedPair.price) / parseFloat(leverage)).toFixed(2) : '0.00'} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Position Value:</span>
                  <span>{amount ? (parseFloat(amount) * 100000 * selectedPair.price).toFixed(2) : '0.00'} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Spread:</span>
                  <span>0.8 pips</span>
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
                {orderType === 'buy' ? 'Buy' : 'Sell'} {selectedPair?.symbol}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="h-5 w-5" />
              <span>Account</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>Account Balance</span>
                <span className="font-medium">$5,000.00</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>Free Margin</span>
                <span className="font-medium">$4,850.00</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>Used Margin</span>
                <span className="font-medium">$150.00</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span>KK99 Balance</span>
                <span className="font-medium text-blue-600">5,000</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <h4 className="font-medium">Market Hours</h4>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">London</span>
                  <Badge className="bg-green-500">Open</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">New York</span>
                  <Badge className="bg-green-500">Open</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tokyo</span>
                  <Badge variant="secondary">Closed</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sydney</span>
                  <Badge variant="secondary">Closed</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KK99 Benefits */}
      <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle>KK99 Token ile Forex Avantajları</CardTitle>
          <CardDescription>
            Forex trading'de KK99 token kullanarak özel avantajlardan yararlanın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Badge className="mb-2">Düşük</Badge>
              <div className="text-sm">Spread oranları</div>
            </div>
            <div className="text-center">
              <Badge className="mb-2">Yüksek</Badge>
              <div className="text-sm">Kaldıraç limitleri</div>
            </div>
            <div className="text-center">
              <Badge className="mb-2">Hızlı</Badge>
              <div className="text-sm">Emir işleme</div>
            </div>
            <div className="text-center">
              <Badge className="mb-2">%70 İndirim</Badge>
              <div className="text-sm">Swap ücretlerinde</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}