'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, BarChart3, Coins, DollarSign, PieChart, Zap, Building, Activity, Landmark, Package } from 'lucide-react'

// Market types configuration
const marketTypes = [
  {
    id: 'spot',
    name: 'Spot Trading',
    description: 'Anında alım-satım işlemleri',
    icon: Coins,
    color: 'bg-blue-500',
    path: '/markets/spot'
  },
  {
    id: 'futures',
    name: 'Futures Trading',
    description: 'Vadeli işlem sözleşmeleri',
    icon: TrendingUp,
    color: 'bg-green-500',
    path: '/markets/futures'
  },
  {
    id: 'options',
    name: 'Options Trading',
    description: 'Opsiyon sözleşmeleri',
    icon: Activity,
    color: 'bg-purple-500',
    path: '/markets/options'
  },
  {
    id: 'forex',
    name: 'Forex Trading',
    description: 'Döviz piyasası işlemleri',
    icon: DollarSign,
    color: 'bg-yellow-500',
    path: '/markets/forex'
  },
  {
    id: 'stocks',
    name: 'Stock Trading',
    description: 'Hisse senedi işlemleri',
    icon: Building,
    color: 'bg-red-500',
    path: '/markets/stocks'
  },
  {
    id: 'commodities',
    name: 'Commodities',
    description: 'Emtia piyasası işlemleri',
    icon: Zap,
    color: 'bg-orange-500',
    path: '/markets/commodities'
  },
  {
    id: 'indices',
    name: 'Indices Trading',
    description: 'Endeks işlemleri',
    icon: BarChart3,
    color: 'bg-indigo-500',
    path: '/markets/indices'
  },
  {
    id: 'bonds',
    name: 'Bonds & Treasury',
    description: 'Tahvil ve bono işlemleri',
    icon: Landmark,
    color: 'bg-teal-500',
    path: '/markets/bonds'
  },
  {
    id: 'etf',
    name: 'ETF Trading',
    description: 'Exchange Traded Funds',
    icon: Package,
    color: 'bg-pink-500',
    path: '/markets/etf'
  }
]

export default function MarketsPage() {
  const [marketStats, setMarketStats] = useState<Record<string, any>>({})

  useEffect(() => {
    // Mock market statistics
    const stats = {
      totalVolume: '2.5B',
      activeMarkets: 247,
      totalUsers: '125K',
      dailyTrades: '45K'
    }
    setMarketStats(stats)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">KK Exchange Markets</h1>
        <p className="text-lg text-muted-foreground mb-6">
          9 farklı piyasada profesyonel trading deneyimi
        </p>
        
        {/* Market Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{marketStats.totalVolume}</div>
              <div className="text-sm text-muted-foreground">24h Volume</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{marketStats.activeMarkets}</div>
              <div className="text-sm text-muted-foreground">Active Markets</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{marketStats.totalUsers}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{marketStats.dailyTrades}</div>
              <div className="text-sm text-muted-foreground">Daily Trades</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Market Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketTypes.map((market) => {
          const IconComponent = market.icon
          return (
            <Card key={market.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${market.color}`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{market.name}</CardTitle>
                    <CardDescription>{market.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">24h Volume</span>
                    <Badge variant="secondary">
                      ${Math.floor(Math.random() * 1000)}M
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Pairs</span>
                    <Badge variant="outline">
                      {Math.floor(Math.random() * 50) + 10}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge className="bg-green-500">
                      <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                      Active
                    </Badge>
                  </div>
                  <Link href={market.path}>
                    <Button className="w-full mt-4">
                      Start Trading
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* KK99 Token Section */}
      <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Coins className="h-6 w-6 text-blue-600" />
            <span>KK99 Token ile Trading</span>
          </CardTitle>
          <CardDescription>
            Tüm işlemlerinizi platform tokenimiz KK99 ile gerçekleştirin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">0.05%</div>
              <div className="text-sm text-muted-foreground">KK99 ile işlem ücreti</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">%20</div>
              <div className="text-sm text-muted-foreground">Ek indirim oranı</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">24/7</div>
              <div className="text-sm text-muted-foreground">Kesintisiz işlem</div>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <Link href="/token">
              <Button variant="outline">
                KK99 Token Hakkında
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}