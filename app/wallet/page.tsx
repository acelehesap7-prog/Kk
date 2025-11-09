'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
  Coins,
  CheckCircle2,
  AlertCircle,
  QrCode,
  ArrowRight,
  Search,
  Settings2 as Settings,
  AlertTriangle,
  ChevronRight,
  History,
  RefreshCw
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'sonner'

interface DBAsset {
  user_id: string;
  symbol: string;
  name: string;
  balance: number;
  current_price: number;
  price_change_24h: number;
  icon: string;
  deposit_address?: string;
}

interface Asset {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  change24h: number;
  icon: string;
  address?: string;
}

interface DBTransaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdraw' | 'transfer' | 'trade';
  amount: number;
  asset: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  hash?: string;
  from_address?: string;
  to_address?: string;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'transfer' | 'trade';
  amount: number;
  asset: string;
  value: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  hash?: string;
  from?: string;
  to?: string;
}

interface DBWalletAddress {
  user_id: string;
  chain: string;
  address: string;
  memo?: string;
  network: string;
}

interface WalletAddress {
  chain: string;
  address: string;
  memo?: string;
  network: string;
}

export default function WalletPage() {
  const router = useRouter()
  const [assets, setAssets] = useState<Asset[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [totalBalance, setTotalBalance] = useState(0)
  const [hideBalances, setHideBalances] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [addresses, setAddresses] = useState<WalletAddress[]>([])
  const [depositAddress, setDepositAddress] = useState<string>('')
  const [showQR, setShowQR] = useState(false)
  const [withdrawalAmount, setWithdrawalAmount] = useState('')
  const [withdrawalAddress, setWithdrawalAddress] = useState('')
  const [selectedChain, setSelectedChain] = useState('ETH')
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadWalletData()
  }, []);

  async function loadWalletData() {
    setLoading(true)
    try {
      // Kullanıcı kontrolü
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Varlık bilgileri
      const { data: assetData } = await supabase
        .from('assets')
        .select('*')
        .eq('user_id', user.id)

      const { data: assets } = await supabase
        .from('assets')
        .select('*')
        .eq('user_id', user.id)

      if (assets) {
        const formattedAssets: Asset[] = assets.map((asset: DBAsset) => ({
          symbol: asset.symbol,
          name: asset.name,
          balance: asset.balance,
          value: asset.balance * asset.current_price,
          change24h: asset.price_change_24h,
          icon: asset.icon,
          address: asset.deposit_address
        }))

        setAssets(formattedAssets)
        const total = formattedAssets.reduce((acc, asset) => acc + asset.value, 0)
        setTotalBalance(total)
      }

      // İşlem geçmişi
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (transactions) {
        setTransactions(transactions as Transaction[])
      }

      // Cüzdan adresleri
      const { data: addresses } = await supabase
        .from('wallet_addresses')
        .select('*')
        .eq('user_id', user.id)

      if (addresses) {
        setAddresses(addresses as WalletAddress[])
      }
      } catch (error) {
        console.error('Failed to load wallet data:', error) 
        toast.error('Failed to load wallet data')
      } finally {
        setLoading(false)
      }
  }, [])

  const formatBalance = (balance: number) => {
    return hideBalances ? '****' : balance.toLocaleString()
  }

  const formatValue = (value: number) => {
    return hideBalances ? '****' : `$${value.toLocaleString()}`
  }

  const filteredAssets = assets.filter(asset =>
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    // Todo: Add toast notification
  }

  const handleDeposit = (asset: Asset) => {
    setSelectedAsset(asset)
    setShowQR(true)
  }

  const handleWithdraw = async () => {
    if (!selectedAsset || !withdrawalAmount || !withdrawalAddress) return
    
    setLoading(true)
    try {
      // Implement withdrawal logic here
      await new Promise(resolve => setTimeout(resolve, 2000))
      // Refresh data after successful withdrawal
      await loadWalletData()
    } catch (error) {
      console.error('Withdrawal failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Varlıklarım</h1>
          <p className="text-muted-foreground">
            Varlıklarınızı yönetin ve işlem yapın
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setHideBalances(!hideBalances)}
          >
            {hideBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/settings/wallet')}
          >
            <Settings className="h-4 w-4 mr-2" />
            Ayarlar
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