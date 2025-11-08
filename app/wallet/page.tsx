'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Wallet, 
  Send, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Plus, 
  Minus,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Coins
} from 'lucide-react'

interface Asset {
  symbol: string
  name: string
  balance: number
  value: number
  change24h: number
  icon: string
}

interface Transaction {
  id: string
  type: 'deposit' | 'withdraw' | 'trade' | 'transfer'
  asset: string
  amount: number
  value: number
  timestamp: Date
  status: 'completed' | 'pending' | 'failed'
}

export default function WalletPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [totalBalance, setTotalBalance] = useState(0)
  const [hideBalances, setHideBalances] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)

  useEffect(() => {
    // Mock wallet data
    const mockAssets: Asset[] = [
      {
        symbol: 'KK99',
        name: 'KK Exchange Token',
        balance: 5000,
        value: 2500.00,
        change24h: 5.25,
        icon: '🪙'
      },
      {
        symbol: 'USDT',
        name: 'Tether USD',
        balance: 1250.50,
        value: 1250.50,
        change24h: 0.01,
        icon: '💵'
      },
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        balance: 0.0285,
        value: 1231.63,
        change24h: 2.45,
        icon: '₿'
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        balance: 0.5420,
        value: 1436.55,
        change24h: -1.25,
        icon: 'Ξ'
      },
      {
        symbol: 'BNB',
        name: 'Binance Coin',
        balance: 2.15,
        value: 645.75,
        change24h: 3.15,
        icon: '🔶'
      }
    ]

    const mockTransactions: Transaction[] = [
      {
        id: '1',
        type: 'deposit',
        asset: 'USDT',
        amount: 500,
        value: 500,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'completed'
      },
      {
        id: '2',
        type: 'trade',
        asset: 'BTC',
        amount: 0.0085,
        value: 367.25,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        status: 'completed'
      },
      {
        id: '3',
        type: 'transfer',
        asset: 'KK99',
        amount: 1000,
        value: 500,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        status: 'completed'
      }
    ]

    setAssets(mockAssets)
    setTransactions(mockTransactions)
    setTotalBalance(mockAssets.reduce((sum, asset) => sum + asset.value, 0))
  }, [])

  const formatBalance = (balance: number) => {
    return hideBalances ? '****' : balance.toLocaleString()
  }

  const formatValue = (value: number) => {
    return hideBalances ? '****' : `$${value.toLocaleString()}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Wallet</h1>
            <p className="text-lg text-muted-foreground">
              Manage your digital assets and transactions
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHideBalances(!hideBalances)}
          >
            {hideBalances ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Total Balance */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="h-6 w-6 text-blue-600" />
            <span>Total Portfolio Value</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {formatValue(totalBalance)}
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-green-600 font-medium">+2.45% (24h)</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assets List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Assets</CardTitle>
              <CardDescription>
                Your cryptocurrency holdings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assets.map((asset) => (
                  <div
                    key={asset.symbol}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedAsset(asset)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{asset.icon}</div>
                      <div>
                        <div className="font-medium">{asset.symbol}</div>
                        <div className="text-sm text-muted-foreground">{asset.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatBalance(asset.balance)}</div>
                      <div className="text-sm text-muted-foreground">{formatValue(asset.value)}</div>
                      <div className={`text-sm flex items-center ${
                        asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {asset.change24h >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {asset.change24h.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Deposit
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                <Minus className="h-4 w-4 mr-2" />
                Withdraw
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                <Send className="h-4 w-4 mr-2" />
                Transfer
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Trade
              </Button>
            </CardContent>
          </Card>

          {/* KK99 Special Section */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Coins className="h-5 w-5 text-blue-600" />
                <span>KK99 Benefits</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Current Balance:</span>
                  <span className="font-medium text-blue-600">{formatBalance(5000)} KK99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Staking Rewards:</span>
                  <span className="font-medium text-green-600">+125 KK99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Trading Discounts:</span>
                  <span className="font-medium text-purple-600">75% OFF</span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  Stake KK99
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Transaction History */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Your latest wallet activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    tx.type === 'deposit' ? 'bg-green-100' :
                    tx.type === 'withdraw' ? 'bg-red-100' :
                    tx.type === 'trade' ? 'bg-blue-100' :
                    'bg-purple-100'
                  }`}>
                    {tx.type === 'deposit' && <ArrowDownLeft className="h-4 w-4 text-green-600" />}
                    {tx.type === 'withdraw' && <ArrowUpRight className="h-4 w-4 text-red-600" />}
                    {tx.type === 'trade' && <ArrowUpRight className="h-4 w-4 text-blue-600" />}
                    {tx.type === 'transfer' && <Send className="h-4 w-4 text-purple-600" />}
                  </div>
                  <div>
                    <div className="font-medium capitalize">{tx.type}</div>
                    <div className="text-sm text-muted-foreground">
                      {tx.timestamp.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {tx.amount} {tx.asset}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${tx.value.toFixed(2)}
                  </div>
                  <Badge 
                    variant={tx.status === 'completed' ? 'default' : 
                            tx.status === 'pending' ? 'secondary' : 'destructive'}
                    className="text-xs"
                  >
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline">
              View All Transactions
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}