'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Title, Text, BarChart, DonutChart, LineChart } from '@tremor/react'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { supabase, type TablesRow } from '@/lib/supabase'
import { getBalance } from '@/lib/payment-service'
import { RealMarketService } from '@/lib/real-market-service'
import { WalletService, type WalletConnection } from '@/lib/wallet-service'
import { KK99Service, type KK99Balance } from '@/lib/kk99-service'
import { Activity, AlertTriangle } from 'lucide-react'

import { QuickStatsCard } from '@/components/dashboard/QuickStatsCard'
import { TransactionItem } from '@/components/dashboard/TransactionItem'
import { DashboardState, Market, SafeUser, TokenBalance, Transaction } from '@/types/dashboard'

const initialState: DashboardState = {
  user: null,
  balance: 0,
  transactions: [],
  markets: [],
  tokenBalances: [],
  walletConnection: null,
  kk99Balance: {
    balance: 0,
    lockedBalance: 0,
    stakingBalance: 0,
    totalBalance: 0
  },
  loading: true
}

export default function DashboardPage() {
  const router = useRouter()
  const [state, setState] = useState<DashboardState>(initialState)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    let interval: NodeJS.Timeout

    const loadData = async () => {
      if (!isMounted) return

      try {
        const newState = await loadDashboardData()
        if (isMounted) {
          setState(prev => ({ ...prev, ...newState, loading: false }))
          setError(null) // Başarılı yükleme durumunda hatayı temizle
        }
      } catch (error) {
        if (isMounted) {
          console.error('Dashboard verisi yüklenirken hata:', error)
          setError('Veriler yüklenirken bir hata oluştu')
          setState(prev => ({ ...prev, loading: false }))
        }
      }
    }

    loadData()
    interval = setInterval(loadData, 30000)

    return () => {
      isMounted = false
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [router])

  async function loadDashboardData(): Promise<Partial<DashboardState>> {
    try {
      // Kullanıcı kimlik doğrulama kontrolü
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return {}
      }

      // Kullanıcı profili kontrolü
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!profile) {
        setError('Kullanıcı profili bulunamadı')
        return {}
      }

      // Paralel veri yükleme
      try {
        const [balance, txs, markets, walletData] = await Promise.all([
          loadBalanceData(user.id),
          loadTransactionData(user.id),
          loadMarketData(),
          loadWalletData()
        ])

        return {
          user: profile as SafeUser,
          balance,
          transactions: txs,
          markets,
          ...walletData,
          loading: false
        }

      } catch (loadErr) {
        console.error('Veri yükleme hatası:', loadErr)
        setError('Veriler yüklenirken bir hata oluştu')
        
        // Hata durumunda varsayılan değerlerle devam et
        return {
          user: profile as SafeUser,
          balance: 0,
          transactions: [],
          markets: [],
          tokenBalances: [],
          walletConnection: null,
          kk99Balance: {
            balance: 0,
            lockedBalance: 0,
            stakingBalance: 0,
            totalBalance: 0
          },
          loading: false
        }
      }
    } catch (authErr) {
      console.error('Kimlik doğrulama hatası:', authErr)
      setError('Oturum bilgileriniz yüklenirken hata oluştu')
      router.push('/auth/login')
      return {}
    }
  }

  async function loadBalanceData(userId: string): Promise<number> {
    try {
      return await getBalance(userId)
    } catch (error) {
      console.error('Bakiye bilgisi yüklenirken hata:', error)
      return 0
    }
  }

  async function loadTransactionData(userId: string): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) {
        console.error('İşlem verisi yüklenirken hata:', error)
        return []
      }

      return (data || []) as Transaction[]
    } catch (error) {
      console.error('İşlem verisi yüklenirken hata:', error)
      return []
    }
  }

  async function loadMarketData(): Promise<Market[]> {
    try {
      const marketService = RealMarketService.getInstance()
      
      const marketRequests = [
        { symbol: 'BTC/USDT', type: 'spot', marketType: 'crypto' },
        { symbol: 'EUR/USD', type: 'forex', marketType: 'forex' },
        { symbol: 'AAPL', type: 'stocks', marketType: 'stocks' }
      ]

      const results = await Promise.all(
        marketRequests.map(({ symbol, type }) => 
          marketService.getMarketData(symbol, type)
            .catch(error => {
              console.error(`${symbol} verisi yüklenirken hata:`, error)
              return null
            })
        )
      )

      return results
        .map((data, index) => {
          if (!data) return null
          const { symbol, marketType } = marketRequests[index]
          return {
            symbol,
            price: data.price,
            change24h: data.changePercent,
            volume24h: data.volume,
            high24h: data.high24h,
            low24h: data.low24h,
            type: marketType
          }
        })
        .filter((item): item is Market => item !== null)
    } catch (error) {
      console.error('Piyasa verileri yüklenirken hata:', error)
      return []
    }
  }

  async function loadWalletData(): Promise<{
    walletConnection: WalletConnection | null;
    kk99Balance: KK99Balance;
    tokenBalances: TokenBalance[];
  }> {
    try {
      const walletService = WalletService.getInstance()
      const kk99Service = KK99Service.getInstance()

      let connection: WalletConnection | null = null
      try {
        connection = await walletService.connectMetaMask()
      } catch (walletErr) {
        console.error('MetaMask bağlantısı başarısız:', walletErr)
      }

      if (!connection) {
        return {
          walletConnection: null,
          kk99Balance: initialState.kk99Balance,
          tokenBalances: []
        }
      }

      try {
        const [kk99Data, tokenBalances] = await Promise.all([
          kk99Service.getKK99Balance(connection.address)
            .catch(err => {
              console.error('KK99 bakiye bilgisi alınamadı:', err)
              return null
            }),
          loadTokenBalances(connection.address)
        ])

        return {
          walletConnection: connection,
          kk99Balance: kk99Data || initialState.kk99Balance,
          tokenBalances
        }
      } catch (dataErr) {
        console.error('Token verileri yüklenirken hata:', dataErr)
        return {
          walletConnection: connection,
          kk99Balance: initialState.kk99Balance,
          tokenBalances: []
        }
      }
    } catch (error) {
      console.error('Cüzdan verisi yüklenirken hata:', error)
      return {
        walletConnection: null,
        kk99Balance: initialState.kk99Balance,
        tokenBalances: []
      }
    }
  }

  async function loadTokenBalances(address: string): Promise<TokenBalance[]> {
    try {
      const { data: tokens, error } = await supabase
        .from('token_balances')
        .select('*')
        .eq('user_id', address) as { data: TablesRow['token_balances'][] | null, error: any }

      if (error) {
        console.error('Token bakiyeleri yüklenirken hata:', error)
        return []
      }

      return (tokens || []).map(item => ({
        token: item.token,
        balance: item.balance,
        value: item.balance * item.locked_balance // Örnek değer hesaplama
      }))
    } catch (error) {
      console.error('Token bakiyeleri yüklenirken hata:', error)
      return []
    }
  }

  if (state.loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
        <Text className="mt-4">Yükleniyor...</Text>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-500">
          <div className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="grid gap-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Hoş Geldiniz, {state.user?.first_name || state.user?.email}
            </h1>
            <p className="text-muted-foreground">
              Hesabınızı ve işlemlerinizi buradan yönetin
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/wallet')}
            >
              <Icons.Balance className="h-4 w-4 mr-2" />
              Cüzdan
            </Button>
            <Button onClick={() => router.push('/markets')}>
              <Activity className="h-4 w-4 mr-2" />
              İşlem Yap
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickStatsCard
            icon={<Icons.Money className="h-4 w-4 text-muted-foreground" />}
            title="Toplam Bakiye"
            value={state.balance}
            valuePrefix="$"
          />

          <QuickStatsCard
            icon={<Icons.Crypto className="h-4 w-4 text-muted-foreground" />}
            title="KK99 Token"
            value={state.kk99Balance.balance}
          />

          <QuickStatsCard
            icon={<Icons.Trend className="h-4 w-4 text-muted-foreground" />}
            title="Stake Edilen"
            value={state.kk99Balance.stakingBalance}
          />

          <QuickStatsCard
            icon={<Icons.Chart className="h-4 w-4 text-muted-foreground" />}
            title="24s Hacim"
            value={state.markets.reduce((acc, m) => acc + m.volume24h, 0)}
            valuePrefix="$"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 mb-8 lg:grid-cols-2">
        <Card>
          <Title>Piyasa Özeti</Title>
          <LineChart
            className="mt-4 h-64"
            data={state.markets.map(m => ({
              name: m.symbol,
              Fiyat: m.price,
              Değişim: m.change24h
            }))}
            index="name"
            categories={['Fiyat', 'Değişim']}
            colors={['blue', 'green']}
          />
        </Card>

        <Card>
          <Title>Token Dağılımı</Title>
          <DonutChart
            className="mt-4 h-64"
            data={state.tokenBalances.map(t => ({
              name: t.token,
              value: t.value
            }))}
            category="value"
            index="name"
            colors={['blue', 'green', 'yellow', 'purple']}
          />
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6">
        <Card>
          <Title>Son İşlemler</Title>
          <div className="mt-4 divide-y">
            {state.transactions.map((transaction) => (
              <TransactionItem 
                key={transaction.id} 
                transaction={transaction} 
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}