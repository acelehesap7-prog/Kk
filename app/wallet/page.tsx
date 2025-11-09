'use client';'use client';'use client'



import { useState, useEffect, useCallback } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';import { useState, useEffect, useCallback } from 'react';import { useState, useEffect, useCallback } from 'react'

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';import { Badge } from '@/components/ui/badge';import { Badge } from '@/components/ui/badge'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { import { Button } from '@/components/ui/button';import { Button } from '@/components/ui/button'

  Wallet, 

  Send, import { Input } from '@/components/ui/input';import { Input } from '@/components/ui/input'

  ArrowDownLeft, 

  ArrowUpRight, import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

  Plus, 

  Minus,import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

  TrendingUp,

  TrendingDown,import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

  Eye,

  EyeOff,import { import { 

  Copy,

  ExternalLink,  Wallet,   Wallet, 

  Coins,

  CheckCircle2,  Send,   Send, 

  AlertCircle,

  QrCode,  ArrowDownLeft,   ArrowDownLeft, 

  ArrowRight,

  Search,  ArrowUpRight,   ArrowUpRight, 

  Settings2 as Settings,

  AlertTriangle,  Plus,   Plus, 

  ChevronRight,

  History,  Minus,  Minus,

  RefreshCw

} from 'lucide-react';  TrendingUp,  TrendingUp,

import { supabase } from '@/lib/supabase';

import { useRouter } from 'next/navigation';  TrendingDown,  TrendingDown,

import { QRCodeSVG } from 'qrcode.react';

import { toast } from 'sonner';  Eye,  Eye,



interface DBAsset {  EyeOff,  EyeOff,

  user_id: string;

  symbol: string;  Copy,  Copy,

  name: string;

  balance: number;  ExternalLink,  ExternalLink,

  current_price: number;

  price_change_24h: number;  Coins,  Coins,

  icon: string;

  deposit_address?: string;  CheckCircle2,  CheckCircle2,

}

  AlertCircle,  AlertCircle,

interface Asset {

  symbol: string;  QrCode,  QrCode,

  name: string;

  balance: number;  ArrowRight,  ArrowRight,

  value: number;

  change24h: number;  Search,  Search,

  icon: string;

  address?: string;  Settings2 as Settings,  Settings2 as Settings,

}

  AlertTriangle,  AlertTriangle,

interface DBTransaction {

  id: string;  ChevronRight,  ChevronRight,

  user_id: string;

  type: 'deposit' | 'withdraw' | 'transfer' | 'trade';  History,  History,

  amount: number;

  asset: string;  RefreshCw  RefreshCw

  status: 'pending' | 'completed' | 'failed';

  created_at: string;} from 'lucide-react';} from 'lucide-react'

  hash?: string;

  from_address?: string;import { supabase } from '@/lib/supabase';import { supabase } from '@/lib/supabase'

  to_address?: string;

}import { useRouter } from 'next/navigation';import { useRouter } from 'next/navigation'



interface Transaction {import { QRCodeSVG } from 'qrcode.react';import { QRCodeSVG } from 'qrcode.react'

  id: string;

  type: 'deposit' | 'withdraw' | 'transfer' | 'trade';import { toast } from 'sonner';import { toast } from 'sonner'

  amount: number;

  asset: string;

  value: number;

  status: 'pending' | 'completed' | 'failed';interface DBAsset {interface DBAsset {

  timestamp: string;

  hash?: string;  user_id: string;  user_id: string;

  from?: string;

  to?: string;  symbol: string;  symbol: string;

}

  name: string;  name: string;

interface DBWalletAddress {

  user_id: string;  balance: number;  balance: number;

  chain: string;

  address: string;  current_price: number;  current_price: number;

  memo?: string;

  network: string;  price_change_24h: number;  price_change_24h: number;

}

  icon: string;  icon: string;

interface WalletAddress {

  chain: string;  deposit_address?: string;  deposit_address?: string;

  address: string;

  memo?: string;}}

  network: string;

}



export default function WalletPage() {interface Asset {interface Asset {

  const router = useRouter();

  const [assets, setAssets] = useState<Asset[]>([]);  symbol: string;  symbol: string;

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [totalBalance, setTotalBalance] = useState(0);  name: string;  name: string;

  const [hideBalances, setHideBalances] = useState(false);

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);  balance: number;  balance: number;

  const [addresses, setAddresses] = useState<WalletAddress[]>([]);

  const [depositAddress, setDepositAddress] = useState<string>('');  value: number;  value: number;

  const [showQR, setShowQR] = useState(false);

  const [withdrawalAmount, setWithdrawalAmount] = useState('');  change24h: number;  change24h: number;

  const [withdrawalAddress, setWithdrawalAddress] = useState('');

  const [selectedChain, setSelectedChain] = useState('ETH');  icon: string;  icon: string;

  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');  address?: string;  address?: string;



  const loadWalletData = useCallback(async () => {}}

    setLoading(true);

    try {

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {interface DBTransaction {interface DBTransaction {

        router.push('/auth/login');

        return;  id: string;  id: string;

      }

  user_id: string;  user_id: string;

      const { data: assets } = await supabase

        .from('assets')  type: 'deposit' | 'withdraw' | 'transfer' | 'trade';  type: 'deposit' | 'withdraw' | 'transfer' | 'trade';

        .select('*')

        .eq('user_id', user.id);  amount: number;  amount: number;



      if (assets) {  asset: string;  asset: string;

        const formattedAssets: Asset[] = assets.map((asset: DBAsset) => ({

          symbol: asset.symbol,  status: 'pending' | 'completed' | 'failed';  status: 'pending' | 'completed' | 'failed';

          name: asset.name,

          balance: asset.balance,  created_at: string;  created_at: string;

          value: asset.balance * asset.current_price,

          change24h: asset.price_change_24h,  hash?: string;  hash?: string;

          icon: asset.icon,

          address: asset.deposit_address  from_address?: string;  from_address?: string;

        }));

  to_address?: string;  to_address?: string;

        setAssets(formattedAssets);

        const total = formattedAssets.reduce((acc, asset) => acc + asset.value, 0);}}

        setTotalBalance(total);

      }



      const { data: transactions } = await supabaseinterface Transaction {interface Transaction {

        .from('transactions')

        .select('*')  id: string;  id: string;

        .eq('user_id', user.id)

        .order('created_at', { ascending: false })  type: 'deposit' | 'withdraw' | 'transfer' | 'trade';  type: 'deposit' | 'withdraw' | 'transfer' | 'trade';

        .limit(10);

  amount: number;  amount: number;

      if (transactions) {

        setTransactions(transactions as Transaction[]);  asset: string;  asset: string;

      }

  value: number;  value: number;

      const { data: addresses } = await supabase

        .from('wallet_addresses')  status: 'pending' | 'completed' | 'failed';  status: 'pending' | 'completed' | 'failed';

        .select('*')

        .eq('user_id', user.id);  timestamp: string;  timestamp: string;



      if (addresses) {  hash?: string;  hash?: string;

        setAddresses(addresses as WalletAddress[]);

      }  from?: string;  from?: string;

    } catch (error) {

      console.error('Failed to load wallet data:', error);  to?: string;  to?: string;

      toast.error('Failed to load wallet data');

    } finally {}}

      setLoading(false);

    }

  }, [router]);

interface DBWalletAddress {interface DBWalletAddress {

  useEffect(() => {

    loadWalletData();  user_id: string;  user_id: string;

  }, [loadWalletData]);

  chain: string;  chain: string;

  const formatBalance = (balance: number) => {

    return hideBalances ? '****' : balance.toLocaleString();  address: string;  address: string;

  };

  memo?: string;  memo?: string;

  const formatValue = (value: number) => {

    return hideBalances ? '****' : `$${value.toLocaleString()}`;  network: string;  network: string;

  };

}}

  const filteredAssets = assets.filter(asset =>

    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||

    asset.name.toLowerCase().includes(searchTerm.toLowerCase())

  );interface WalletAddress {interface WalletAddress {



  const handleCopyAddress = (address: string) => {  chain: string;  chain: string;

    navigator.clipboard.writeText(address);

    toast.success('Address copied to clipboard');  address: string;  address: string;

  };

  memo?: string;  memo?: string;

  const handleDeposit = (asset: Asset) => {

    setSelectedAsset(asset);  network: string;  network: string;

    setShowQR(true);

  };}}



  const handleWithdraw = async () => {

    if (!selectedAsset || !withdrawalAmount || !withdrawalAddress) return;

    export default function WalletPage() {export default function WalletPage() {

    setLoading(true);

    try {  const router = useRouter();  const router = useRouter()

      // Implement withdrawal logic here

      await new Promise(resolve => setTimeout(resolve, 2000));  const [assets, setAssets] = useState<Asset[]>([]);  const [assets, setAssets] = useState<Asset[]>([])

      // Refresh data after successful withdrawal

      await loadWalletData();  const [transactions, setTransactions] = useState<Transaction[]>([]);  const [transactions, setTransactions] = useState<Transaction[]>([])

      toast.success('Withdrawal successful');

    } catch (error) {  const [totalBalance, setTotalBalance] = useState(0);  const [totalBalance, setTotalBalance] = useState(0)

      console.error('Withdrawal failed:', error);

      toast.error('Withdrawal failed');  const [hideBalances, setHideBalances] = useState(false);  const [hideBalances, setHideBalances] = useState(false)

    } finally {

      setLoading(false);  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)

    }

  };  const [addresses, setAddresses] = useState<WalletAddress[]>([]);  const [addresses, setAddresses] = useState<WalletAddress[]>([])



  return (  const [depositAddress, setDepositAddress] = useState<string>('');  const [depositAddress, setDepositAddress] = useState<string>('')

    <div className="container mx-auto px-4 py-8">

      <div className="flex items-center justify-between mb-8">  const [showQR, setShowQR] = useState(false);  const [showQR, setShowQR] = useState(false)

        <div>

          <h1 className="text-2xl font-bold">Varlıklarım</h1>  const [withdrawalAmount, setWithdrawalAmount] = useState('');  const [withdrawalAmount, setWithdrawalAmount] = useState('')

          <p className="text-muted-foreground">

            Varlıklarınızı yönetin ve işlem yapın  const [withdrawalAddress, setWithdrawalAddress] = useState('');  const [withdrawalAddress, setWithdrawalAddress] = useState('')

          </p>

        </div>  const [selectedChain, setSelectedChain] = useState('ETH');  const [selectedChain, setSelectedChain] = useState('ETH')

        <div className="flex items-center gap-4">

          <Button  const [loading, setLoading] = useState(false);  const [loading, setLoading] = useState(false)

            variant="ghost"

            size="icon"  const [searchTerm, setSearchTerm] = useState('');  const [searchTerm, setSearchTerm] = useState('')

            onClick={() => setHideBalances(!hideBalances)}

          >

            {hideBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}

          </Button>  const loadWalletData = useCallback(async () => {  const loadWalletData = useCallback(async () => {

          <Button

            variant="outline"    setLoading(true);    setLoading(true);

            onClick={() => router.push('/settings/wallet')}

          >    try {    try {  // eslint-disable-line react-hooks/exhaustive-deps

            <Settings className="h-4 w-4 mr-2" />

            Ayarlar      const { data: { user } } = await supabase.auth.getUser();

          </Button>

        </div>      if (!user) {  const loadWalletData = async () => {

      </div>

        router.push('/auth/login');    setLoading(true);

      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">

        <CardHeader>        return;    try {

          <CardTitle className="flex items-center space-x-2">

            <Wallet className="h-6 w-6 text-blue-600" />      }      // Kullanıcı kontrolü

            <span>Total Portfolio Value</span>

          </CardTitle>      const { data: { user } } = await supabase.auth.getUser()

        </CardHeader>

        <CardContent>      const { data: assets } = await supabase      if (!user) {

          <div className="text-4xl font-bold text-blue-600 mb-2">

            {formatValue(totalBalance)}        .from('assets')        router.push('/auth/login')

          </div>

          <div className="flex items-center space-x-2">        .select('*')        return

            <TrendingUp className="h-4 w-4 text-green-600" />

            <span className="text-green-600 font-medium">+2.45% (24h)</span>        .eq('user_id', user.id);      }

          </div>

        </CardContent>

      </Card>

      if (assets) {      // Varlık bilgileri

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2">        const formattedAssets: Asset[] = assets.map((asset: DBAsset) => ({      const { data: assetData } = await supabase

          <Card>

            <CardHeader>          symbol: asset.symbol,        .from('assets')

              <CardTitle>Assets</CardTitle>

              <CardDescription>          name: asset.name,        .select('*')

                Your cryptocurrency holdings

              </CardDescription>          balance: asset.balance,        .eq('user_id', user.id)

            </CardHeader>

            <CardContent>          value: asset.balance * asset.current_price,

              <div className="space-y-4">

                {filteredAssets.map((asset) => (          change24h: asset.price_change_24h,      const { data: assets } = await supabase

                  <div

                    key={asset.symbol}          icon: asset.icon,        .from('assets')

                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"

                    onClick={() => setSelectedAsset(asset)}          address: asset.deposit_address        .select('*')

                  >

                    <div className="flex items-center space-x-3">        }));        .eq('user_id', user.id)

                      <div className="text-2xl">{asset.icon}</div>

                      <div>

                        <div className="font-medium">{asset.symbol}</div>

                        <div className="text-sm text-muted-foreground">{asset.name}</div>        setAssets(formattedAssets);      if (assets) {

                      </div>

                    </div>        const total = formattedAssets.reduce((acc, asset) => acc + asset.value, 0);        const formattedAssets: Asset[] = assets.map((asset: DBAsset) => ({

                    <div className="text-right">

                      <div className="font-medium">{formatBalance(asset.balance)}</div>        setTotalBalance(total);          symbol: asset.symbol,

                      <div className="text-sm text-muted-foreground">{formatValue(asset.value)}</div>

                      <div className={`text-sm flex items-center ${      }          name: asset.name,

                        asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'

                      }`}>          balance: asset.balance,

                        {asset.change24h >= 0 ? (

                          <TrendingUp className="h-3 w-3 mr-1" />      const { data: transactions } = await supabase          value: asset.balance * asset.current_price,

                        ) : (

                          <TrendingDown className="h-3 w-3 mr-1" />        .from('transactions')          change24h: asset.price_change_24h,

                        )}

                        {asset.change24h.toFixed(2)}%        .select('*')          icon: asset.icon,

                      </div>

                    </div>        .eq('user_id', user.id)          address: asset.deposit_address

                  </div>

                ))}        .order('created_at', { ascending: false })        }))

              </div>

            </CardContent>        .limit(10);

          </Card>

        </div>        setAssets(formattedAssets)



        <div className="space-y-6">      if (transactions) {        const total = formattedAssets.reduce((acc, asset) => acc + asset.value, 0)

          <Card>

            <CardHeader>        setTransactions(transactions as Transaction[]);        setTotalBalance(total)

              <CardTitle>Quick Actions</CardTitle>

            </CardHeader>      }      }

            <CardContent className="space-y-3">

              <Button className="w-full" size="lg">

                <Plus className="h-4 w-4 mr-2" />

                Deposit      const { data: addresses } = await supabase      // İşlem geçmişi

              </Button>

              <Button variant="outline" className="w-full" size="lg">        .from('wallet_addresses')      const { data: transactions } = await supabase

                <Minus className="h-4 w-4 mr-2" />

                Withdraw        .select('*')        .from('transactions')

              </Button>

              <Button variant="outline" className="w-full" size="lg">        .eq('user_id', user.id);        .select('*')

                <Send className="h-4 w-4 mr-2" />

                Transfer        .eq('user_id', user.id)

              </Button>

              <Button variant="outline" className="w-full" size="lg">      if (addresses) {        .order('created_at', { ascending: false })

                <ArrowUpRight className="h-4 w-4 mr-2" />

                Trade        setAddresses(addresses as WalletAddress[]);        .limit(10)

              </Button>

            </CardContent>      }

          </Card>

    } catch (error) {      if (transactions) {

          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">

            <CardHeader>      console.error('Failed to load wallet data:', error);        setTransactions(transactions as Transaction[])

              <CardTitle className="flex items-center space-x-2">

                <Coins className="h-5 w-5 text-blue-600" />      toast.error('Failed to load wallet data');      }

                <span>KK99 Benefits</span>

              </CardTitle>    } finally {

            </CardHeader>

            <CardContent>      setLoading(false);      // Cüzdan adresleri

              <div className="space-y-3">

                <div className="flex justify-between">    }      const { data: addresses } = await supabase

                  <span className="text-sm">Current Balance:</span>

                  <span className="font-medium text-blue-600">{formatBalance(5000)} KK99</span>  }, [router]);        .from('wallet_addresses')

                </div>

                <div className="flex justify-between">        .select('*')

                  <span className="text-sm">Staking Rewards:</span>

                  <span className="font-medium text-green-600">+125 KK99</span>  useEffect(() => {        .eq('user_id', user.id)

                </div>

                <div className="flex justify-between">    loadWalletData();

                  <span className="text-sm">Trading Discounts:</span>

                  <span className="font-medium text-purple-600">75% OFF</span>  }, [loadWalletData]);      if (addresses) {

                </div>

                <Button variant="outline" size="sm" className="w-full mt-3">        setAddresses(addresses as WalletAddress[])

                  Stake KK99

                </Button>  const formatBalance = (balance: number) => {      }

              </div>

            </CardContent>    return hideBalances ? '****' : balance.toLocaleString();      } catch (error) {

          </Card>

        </div>  };        console.error('Failed to load wallet data:', error) 

      </div>

        toast.error('Failed to load wallet data')

      <Card className="mt-8">

        <CardHeader>  const formatValue = (value: number) => {      } finally {

          <CardTitle>Recent Transactions</CardTitle>

          <CardDescription>    return hideBalances ? '****' : `$${value.toLocaleString()}`;        setLoading(false)

            Your latest wallet activity

          </CardDescription>  };      }

        </CardHeader>

        <CardContent>  }, [])

          <div className="space-y-4">

            {transactions.map((tx) => (  const filteredAssets = assets.filter(asset =>

              <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg border">

                <div className="flex items-center space-x-3">    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||  const formatBalance = (balance: number) => {

                  <div className={`p-2 rounded-full ${

                    tx.type === 'deposit' ? 'bg-green-100' :    asset.name.toLowerCase().includes(searchTerm.toLowerCase())    return hideBalances ? '****' : balance.toLocaleString()

                    tx.type === 'withdraw' ? 'bg-red-100' :

                    tx.type === 'trade' ? 'bg-blue-100' :  );  }

                    'bg-purple-100'

                  }`}>

                    {tx.type === 'deposit' && <ArrowDownLeft className="h-4 w-4 text-green-600" />}

                    {tx.type === 'withdraw' && <ArrowUpRight className="h-4 w-4 text-red-600" />}  const handleCopyAddress = (address: string) => {  const formatValue = (value: number) => {

                    {tx.type === 'trade' && <ArrowUpRight className="h-4 w-4 text-blue-600" />}

                    {tx.type === 'transfer' && <Send className="h-4 w-4 text-purple-600" />}    navigator.clipboard.writeText(address);    return hideBalances ? '****' : `$${value.toLocaleString()}`

                  </div>

                  <div>    toast.success('Address copied to clipboard');  }

                    <div className="font-medium capitalize">{tx.type}</div>

                    <div className="text-sm text-muted-foreground">  };

                      {tx.timestamp}

                    </div>  const filteredAssets = assets.filter(asset =>

                  </div>

                </div>  const handleDeposit = (asset: Asset) => {    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||

                <div className="text-right">

                  <div className="font-medium">    setSelectedAsset(asset);    asset.name.toLowerCase().includes(searchTerm.toLowerCase())

                    {tx.amount} {tx.asset}

                  </div>    setShowQR(true);  )

                  <div className="text-sm text-muted-foreground">

                    ${tx.value.toFixed(2)}  };

                  </div>

                  <Badge   const handleCopyAddress = (address: string) => {

                    variant={tx.status === 'completed' ? 'default' : 

                            tx.status === 'pending' ? 'secondary' : 'destructive'}  const handleWithdraw = async () => {    navigator.clipboard.writeText(address)

                    className="text-xs"

                  >    if (!selectedAsset || !withdrawalAmount || !withdrawalAddress) return;    // Todo: Add toast notification

                    {tx.status}

                  </Badge>      }

                </div>

              </div>    setLoading(true);

            ))}

          </div>    try {  const handleDeposit = (asset: Asset) => {

          <div className="mt-4 text-center">

            <Button variant="outline">      // Implement withdrawal logic here    setSelectedAsset(asset)

              View All Transactions

              <ExternalLink className="h-4 w-4 ml-2" />      await new Promise(resolve => setTimeout(resolve, 2000));    setShowQR(true)

            </Button>

          </div>      // Refresh data after successful withdrawal  }

        </CardContent>

      </Card>      await loadWalletData();

    </div>

  );      toast.success('Withdrawal successful');  const handleWithdraw = async () => {

}
    } catch (error) {    if (!selectedAsset || !withdrawalAmount || !withdrawalAddress) return

      console.error('Withdrawal failed:', error);    

      toast.error('Withdrawal failed');    setLoading(true)

    } finally {    try {

      setLoading(false);      // Implement withdrawal logic here

    }      await new Promise(resolve => setTimeout(resolve, 2000))

  };      // Refresh data after successful withdrawal

      await loadWalletData()

  return (    } catch (error) {

    <div className="container mx-auto px-4 py-8">      console.error('Withdrawal failed:', error)

      <div className="flex items-center justify-between mb-8">    } finally {

        <div>      setLoading(false)

          <h1 className="text-2xl font-bold">Varlıklarım</h1>    }

          <p className="text-muted-foreground">  }

            Varlıklarınızı yönetin ve işlem yapın

          </p>  return (

        </div>    <div className="container mx-auto px-4 py-8">

        <div className="flex items-center gap-4">      <div className="flex items-center justify-between mb-8">

          <Button        <div>

            variant="ghost"          <h1 className="text-2xl font-bold">Varlıklarım</h1>

            size="icon"          <p className="text-muted-foreground">

            onClick={() => setHideBalances(!hideBalances)}            Varlıklarınızı yönetin ve işlem yapın

          >          </p>

            {hideBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}        </div>

          </Button>        <div className="flex items-center gap-4">

          <Button          <Button

            variant="outline"            variant="ghost"

            onClick={() => router.push('/settings/wallet')}            size="icon"

          >            onClick={() => setHideBalances(!hideBalances)}

            <Settings className="h-4 w-4 mr-2" />          >

            Ayarlar            {hideBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}

          </Button>          </Button>

        </div>          <Button

      </div>            variant="outline"

            onClick={() => router.push('/settings/wallet')}

      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">          >

        <CardHeader>            <Settings className="h-4 w-4 mr-2" />

          <CardTitle className="flex items-center space-x-2">            Ayarlar

            <Wallet className="h-6 w-6 text-blue-600" />          </Button>

            <span>Total Portfolio Value</span>        </div>

          </CardTitle>      </div>

        </CardHeader>

        <CardContent>      {/* Total Balance */}

          <div className="text-4xl font-bold text-blue-600 mb-2">      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">

            {formatValue(totalBalance)}        <CardHeader>

          </div>          <CardTitle className="flex items-center space-x-2">

          <div className="flex items-center space-x-2">            <Wallet className="h-6 w-6 text-blue-600" />

            <TrendingUp className="h-4 w-4 text-green-600" />            <span>Total Portfolio Value</span>

            <span className="text-green-600 font-medium">+2.45% (24h)</span>          </CardTitle>

          </div>        </CardHeader>

        </CardContent>        <CardContent>

      </Card>          <div className="text-4xl font-bold text-blue-600 mb-2">

            {formatValue(totalBalance)}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">          </div>

        <div className="lg:col-span-2">          <div className="flex items-center space-x-2">

          <Card>            <TrendingUp className="h-4 w-4 text-green-600" />

            <CardHeader>            <span className="text-green-600 font-medium">+2.45% (24h)</span>

              <CardTitle>Assets</CardTitle>          </div>

              <CardDescription>        </CardContent>

                Your cryptocurrency holdings      </Card>

              </CardDescription>

            </CardHeader>      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <CardContent>        {/* Assets List */}

              <div className="space-y-4">        <div className="lg:col-span-2">

                {filteredAssets.map((asset) => (          <Card>

                  <div            <CardHeader>

                    key={asset.symbol}              <CardTitle>Assets</CardTitle>

                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"              <CardDescription>

                    onClick={() => setSelectedAsset(asset)}                Your cryptocurrency holdings

                  >              </CardDescription>

                    <div className="flex items-center space-x-3">            </CardHeader>

                      <div className="text-2xl">{asset.icon}</div>            <CardContent>

                      <div>              <div className="space-y-4">

                        <div className="font-medium">{asset.symbol}</div>                {assets.map((asset) => (

                        <div className="text-sm text-muted-foreground">{asset.name}</div>                  <div

                      </div>                    key={asset.symbol}

                    </div>                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"

                    <div className="text-right">                    onClick={() => setSelectedAsset(asset)}

                      <div className="font-medium">{formatBalance(asset.balance)}</div>                  >

                      <div className="text-sm text-muted-foreground">{formatValue(asset.value)}</div>                    <div className="flex items-center space-x-3">

                      <div className={`text-sm flex items-center ${                      <div className="text-2xl">{asset.icon}</div>

                        asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'                      <div>

                      }`}>                        <div className="font-medium">{asset.symbol}</div>

                        {asset.change24h >= 0 ? (                        <div className="text-sm text-muted-foreground">{asset.name}</div>

                          <TrendingUp className="h-3 w-3 mr-1" />                      </div>

                        ) : (                    </div>

                          <TrendingDown className="h-3 w-3 mr-1" />                    <div className="text-right">

                        )}                      <div className="font-medium">{formatBalance(asset.balance)}</div>

                        {asset.change24h.toFixed(2)}%                      <div className="text-sm text-muted-foreground">{formatValue(asset.value)}</div>

                      </div>                      <div className={`text-sm flex items-center ${

                    </div>                        asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'

                  </div>                      }`}>

                ))}                        {asset.change24h >= 0 ? (

              </div>                          <TrendingUp className="h-3 w-3 mr-1" />

            </CardContent>                        ) : (

          </Card>                          <TrendingDown className="h-3 w-3 mr-1" />

        </div>                        )}

                        {asset.change24h.toFixed(2)}%

        <div className="space-y-6">                      </div>

          <Card>                    </div>

            <CardHeader>                  </div>

              <CardTitle>Quick Actions</CardTitle>                ))}

            </CardHeader>              </div>

            <CardContent className="space-y-3">            </CardContent>

              <Button className="w-full" size="lg">          </Card>

                <Plus className="h-4 w-4 mr-2" />        </div>

                Deposit

              </Button>        {/* Quick Actions */}

              <Button variant="outline" className="w-full" size="lg">        <div className="space-y-6">

                <Minus className="h-4 w-4 mr-2" />          <Card>

                Withdraw            <CardHeader>

              </Button>              <CardTitle>Quick Actions</CardTitle>

              <Button variant="outline" className="w-full" size="lg">            </CardHeader>

                <Send className="h-4 w-4 mr-2" />            <CardContent className="space-y-3">

                Transfer              <Button className="w-full" size="lg">

              </Button>                <Plus className="h-4 w-4 mr-2" />

              <Button variant="outline" className="w-full" size="lg">                Deposit

                <ArrowUpRight className="h-4 w-4 mr-2" />              </Button>

                Trade              <Button variant="outline" className="w-full" size="lg">

              </Button>                <Minus className="h-4 w-4 mr-2" />

            </CardContent>                Withdraw

          </Card>              </Button>

              <Button variant="outline" className="w-full" size="lg">

          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">                <Send className="h-4 w-4 mr-2" />

            <CardHeader>                Transfer

              <CardTitle className="flex items-center space-x-2">              </Button>

                <Coins className="h-5 w-5 text-blue-600" />              <Button variant="outline" className="w-full" size="lg">

                <span>KK99 Benefits</span>                <ArrowUpRight className="h-4 w-4 mr-2" />

              </CardTitle>                Trade

            </CardHeader>              </Button>

            <CardContent>            </CardContent>

              <div className="space-y-3">          </Card>

                <div className="flex justify-between">

                  <span className="text-sm">Current Balance:</span>          {/* KK99 Special Section */}

                  <span className="font-medium text-blue-600">{formatBalance(5000)} KK99</span>          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">

                </div>            <CardHeader>

                <div className="flex justify-between">              <CardTitle className="flex items-center space-x-2">

                  <span className="text-sm">Staking Rewards:</span>                <Coins className="h-5 w-5 text-blue-600" />

                  <span className="font-medium text-green-600">+125 KK99</span>                <span>KK99 Benefits</span>

                </div>              </CardTitle>

                <div className="flex justify-between">            </CardHeader>

                  <span className="text-sm">Trading Discounts:</span>            <CardContent>

                  <span className="font-medium text-purple-600">75% OFF</span>              <div className="space-y-3">

                </div>                <div className="flex justify-between">

                <Button variant="outline" size="sm" className="w-full mt-3">                  <span className="text-sm">Current Balance:</span>

                  Stake KK99                  <span className="font-medium text-blue-600">{formatBalance(5000)} KK99</span>

                </Button>                </div>

              </div>                <div className="flex justify-between">

            </CardContent>                  <span className="text-sm">Staking Rewards:</span>

          </Card>                  <span className="font-medium text-green-600">+125 KK99</span>

        </div>                </div>

      </div>                <div className="flex justify-between">

                  <span className="text-sm">Trading Discounts:</span>

      <Card className="mt-8">                  <span className="font-medium text-purple-600">75% OFF</span>

        <CardHeader>                </div>

          <CardTitle>Recent Transactions</CardTitle>                <Button variant="outline" size="sm" className="w-full mt-3">

          <CardDescription>                  Stake KK99

            Your latest wallet activity                </Button>

          </CardDescription>              </div>

        </CardHeader>            </CardContent>

        <CardContent>          </Card>

          <div className="space-y-4">        </div>

            {transactions.map((tx) => (      </div>

              <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg border">

                <div className="flex items-center space-x-3">      {/* Transaction History */}

                  <div className={`p-2 rounded-full ${      <Card className="mt-8">

                    tx.type === 'deposit' ? 'bg-green-100' :        <CardHeader>

                    tx.type === 'withdraw' ? 'bg-red-100' :          <CardTitle>Recent Transactions</CardTitle>

                    tx.type === 'trade' ? 'bg-blue-100' :          <CardDescription>

                    'bg-purple-100'            Your latest wallet activity

                  }`}>          </CardDescription>

                    {tx.type === 'deposit' && <ArrowDownLeft className="h-4 w-4 text-green-600" />}        </CardHeader>

                    {tx.type === 'withdraw' && <ArrowUpRight className="h-4 w-4 text-red-600" />}        <CardContent>

                    {tx.type === 'trade' && <ArrowUpRight className="h-4 w-4 text-blue-600" />}          <div className="space-y-4">

                    {tx.type === 'transfer' && <Send className="h-4 w-4 text-purple-600" />}            {transactions.map((tx) => (

                  </div>              <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg border">

                  <div>                <div className="flex items-center space-x-3">

                    <div className="font-medium capitalize">{tx.type}</div>                  <div className={`p-2 rounded-full ${

                    <div className="text-sm text-muted-foreground">                    tx.type === 'deposit' ? 'bg-green-100' :

                      {tx.timestamp}                    tx.type === 'withdraw' ? 'bg-red-100' :

                    </div>                    tx.type === 'trade' ? 'bg-blue-100' :

                  </div>                    'bg-purple-100'

                </div>                  }`}>

                <div className="text-right">                    {tx.type === 'deposit' && <ArrowDownLeft className="h-4 w-4 text-green-600" />}

                  <div className="font-medium">                    {tx.type === 'withdraw' && <ArrowUpRight className="h-4 w-4 text-red-600" />}

                    {tx.amount} {tx.asset}                    {tx.type === 'trade' && <ArrowUpRight className="h-4 w-4 text-blue-600" />}

                  </div>                    {tx.type === 'transfer' && <Send className="h-4 w-4 text-purple-600" />}

                  <div className="text-sm text-muted-foreground">                  </div>

                    ${tx.value.toFixed(2)}                  <div>

                  </div>                    <div className="font-medium capitalize">{tx.type}</div>

                  <Badge                     <div className="text-sm text-muted-foreground">

                    variant={tx.status === 'completed' ? 'default' :                       {tx.timestamp.toLocaleString()}

                            tx.status === 'pending' ? 'secondary' : 'destructive'}                    </div>

                    className="text-xs"                  </div>

                  >                </div>

                    {tx.status}                <div className="text-right">

                  </Badge>                  <div className="font-medium">

                </div>                    {tx.amount} {tx.asset}

              </div>                  </div>

            ))}                  <div className="text-sm text-muted-foreground">

          </div>                    ${tx.value.toFixed(2)}

          <div className="mt-4 text-center">                  </div>

            <Button variant="outline">                  <Badge 

              View All Transactions                    variant={tx.status === 'completed' ? 'default' : 

              <ExternalLink className="h-4 w-4 ml-2" />                            tx.status === 'pending' ? 'secondary' : 'destructive'}

            </Button>                    className="text-xs"

          </div>                  >

        </CardContent>                    {tx.status}

      </Card>                  </Badge>

    </div>                </div>

  );              </div>

}            ))}
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