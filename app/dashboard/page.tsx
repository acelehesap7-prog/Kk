'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Title, Text, BarChart, DonutChart, LineChart } from '@tremor/react'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { supabase, type TablesRow } from '@/lib/supabase'
import { getBalance } from '@/lib/payment-service'
import { getMarketsByType } from '@/lib/market-service'
import type { Market } from '@/lib/market-service'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<TablesRow['users'] | null>(null)
  const [balance, setBalance] = useState<number>(0)
  const [transactions, setTransactions] = useState<TablesRow['transactions'][]>([])
  const [markets, setMarkets] = useState<Market[]>([])
  const [portfolioData, setPortfolioData] = useState<any[]>([])
  const [tradingHistory, setTradingHistory] = useState<any[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Get user profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      setUser(profile)

      // Get balance
      const userBalance = await getBalance(user.id)
      setBalance(userBalance)

      // Get recent transactions
      const { data: txs } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      setTransactions(txs || [])

      // Get market data
      const cryptoMarkets = await getMarketsByType('crypto')
      setMarkets(cryptoMarkets)

      // Get portfolio data
      const { data: portfolio } = await supabase
        .from('token_balances')
        .select('*')
        .eq('user_id', user.id)

      setPortfolioData(portfolio || [])

      // Get trading history
      const { data: trades } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      setTradingHistory(trades || [])
    } catch (error) {
      console.error('Error loading dashboard:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="grid gap-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Hoş Geldiniz, {user?.name}</h1>
            <p className="text-muted-foreground">
              Hesabınızı ve işlemlerinizi buradan yönetin
            </p>
          </div>
          <Button onClick={() => router.push('/trade')}>
            İşlem Yap
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Icons.DollarSign className="h-4 w-4 text-muted-foreground" />
              <Text>Toplam Bakiye</Text>
            </div>
            <Title className="mt-2">${balance.toFixed(2)}</Title>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Icons.TrendingUp className="h-4 w-4 text-muted-foreground" />
              <Text>Açık İşlemler</Text>
            </div>
            <Title className="mt-2">{tradingHistory.filter(t => t.status === 'pending').length}</Title>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Icons.ChartLine className="h-4 w-4 text-muted-foreground" />
              <Text>24s Hacim</Text>
            </div>
            <Title className="mt-2">
              ${tradingHistory
                .filter(t => {
                  const date = new Date(t.created_at)
                  const now = new Date()
                  return now.getTime() - date.getTime() < 24 * 60 * 60 * 1000
                })
                .reduce((acc, t) => acc + t.amount, 0)
                .toFixed(2)}
            </Title>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Icons.Token className="h-4 w-4 text-muted-foreground" />
              <Text>KK99 Token</Text>
            </div>
            <Title className="mt-2">
              {portfolioData
                .find(p => p.token === 'KK99')
                ?.balance || 0}
            </Title>
          </Card>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 mb-8 lg:grid-cols-2">
        <Card>
          <Title>Portföy Dağılımı</Title>
          <DonutChart
            className="mt-4 h-64"
            data={portfolioData.map(p => ({
              name: p.token,
              value: p.balance
            }))}
            category="value"
            index="name"
            colors={['blue', 'emerald', 'yellow', 'purple']}
          />
        </Card>

        <Card>
          <Title>İşlem Geçmişi</Title>
          <LineChart
            className="mt-4 h-64"
            data={tradingHistory.map(t => ({
              date: new Date(t.created_at).toLocaleDateString(),
              amount: t.amount
            }))}
            index="date"
            categories={['amount']}
            colors={['blue']}
          />
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6">
        <Card>
          <Title>Son İşlemler</Title>
          <div className="mt-4 divide-y">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  {tx.type === 'deposit' ? (
                    <Icons.ArrowRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <Icons.ArrowRight className="h-4 w-4 text-red-500" />
                  )}
                  <div>
                    <Text>
                      {tx.type === 'deposit' ? 'Yatırma' : 'Çekme'}
                    </Text>
                    <Text className="text-muted-foreground">
                      {new Date(tx.created_at).toLocaleString()}
                    </Text>
                  </div>
                </div>
                <div className="text-right">
                  <Text className={tx.type === 'deposit' ? 'text-green-500' : 'text-red-500'}>
                    {tx.type === 'deposit' ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                  </Text>
                  <Text className="text-muted-foreground">
                    {tx.status === 'completed' ? 'Tamamlandı' : tx.status === 'pending' ? 'Bekliyor' : 'Başarısız'}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}