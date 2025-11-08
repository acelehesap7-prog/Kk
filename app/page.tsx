'use client'

import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import Link from 'next/link'
import { Card, Metric, Text, Tab, TabList, TabGroup, TabPanel, TabPanels, LineChart, BarChart } from '@tremor/react'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Kripto', href: '/markets/crypto', icon: Icons.Bitcoin },
  { name: 'Forex', href: '/markets/forex', icon: Icons.DollarSign },
  { name: 'Hisse Senetleri', href: '/markets/stocks', icon: Icons.TrendingUp },
  { name: 'KK99 Token', href: '/token', icon: Icons.Token },
]

const marketData = {
  crypto: [
    {
      title: "Bitcoin (BTC)",
      metric: "$36,789.45",
      trend: "+5.12%",
      data: [
        { date: "Jan 1", price: 34000 },
        { date: "Jan 2", price: 35400 },
        { date: "Jan 3", price: 36789 },
      ],
    },
    {
      title: "Ethereum (ETH)",
      metric: "$2,145.67",
      trend: "+3.45%",
      data: [
        { date: "Jan 1", price: 2000 },
        { date: "Jan 2", price: 2100 },
        { date: "Jan 3", price: 2145 },
      ],
    },
  ],
  forex: [
    {
      title: "EUR/USD",
      metric: "1.0865",
      trend: "-0.23%",
      data: [
        { date: "Jan 1", price: 1.0890 },
        { date: "Jan 2", price: 1.0875 },
        { date: "Jan 3", price: 1.0865 },
      ],
    },
    {
      title: "GBP/USD",
      metric: "1.2745",
      trend: "+0.15%",
      data: [
        { date: "Jan 1", price: 1.2725 },
        { date: "Jan 2", price: 1.2735 },
        { date: "Jan 3", price: 1.2745 },
      ],
    },
  ],
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-800 backdrop-blur-sm bg-background/90">
        <nav className="flex items-center justify-between p-4 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link href="/" className="flex items-center space-x-2">
              <Icons.Logo className="h-8 w-8" />
              <span className="text-xl font-bold">KK Exchange</span>
            </Link>
          </div>
          
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
            <Button variant="outline" asChild>
              <Link href="/auth/login">
                Giriş Yap
              </Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">
                Ücretsiz Başla
              </Link>
            </Button>
          </div>
        </nav>

        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-800">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <Icons.Logo className="h-8 w-8" />
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-muted-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <Icons.X className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-800">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-2 -mx-3 rounded-lg px-3 py-2 text-base font-semibold text-foreground hover:bg-accent"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
                <div className="py-6 space-y-4">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/auth/login">Giriş Yap</Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href="/auth/register">Ücretsiz Başla</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 lg:pt-36">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                  En Gelişmiş Trading Platformu
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Kripto, forex ve hisse senetleri. Profesyonel trading araçları ve düşük komisyonlarla tüm piyasalara tek platformdan erişin.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/auth/register">
                    Ücretsiz Hesap Aç
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/token">
                    KK99 Token Keşfet
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Market Overview */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <TabGroup>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold tracking-tight">Piyasa Özeti</h2>
                <TabList variant="solid">
                  <Tab>Kripto</Tab>
                  <Tab>Forex</Tab>
                </TabList>
              </div>
              <TabPanels>
                <TabPanel>
                  <div className="grid gap-6 md:grid-cols-2">
                    {marketData.crypto.map((item, index) => (
                      <Card key={index}>
                        <div className="flex items-start justify-between">
                          <div>
                            <Text>{item.title}</Text>
                            <Metric>{item.metric}</Metric>
                          </div>
                          <Text className={item.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                            {item.trend}
                          </Text>
                        </div>
                        <LineChart
                          data={item.data}
                          index="date"
                          categories={["price"]}
                          colors={["blue"]}
                          showLegend={false}
                          showGridLines={false}
                          showXAxis={false}
                          showYAxis={false}
                          height="h

-24"
                        />
                      </Card>
                    ))}
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="grid gap-6 md:grid-cols-2">
                    {marketData.forex.map((item, index) => (
                      <Card key={index}>
                        <div className="flex items-start justify-between">
                          <div>
                            <Text>{item.title}</Text>
                            <Metric>{item.metric}</Metric>
                          </div>
                          <Text className={item.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                            {item.trend}
                          </Text>
                        </div>
                        <LineChart
                          data={item.data}
                          index="date"
                          categories={["price"]}
                          colors={["blue"]}
                          showLegend={false}
                          showGridLines={false}
                          showXAxis={false}
                          showYAxis={false}
                          height="h-24"
                        />
                      </Card>
                    ))}
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-accent/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-3">
              <div className="space-y-4">
                <div className="inline-block p-3 rounded-lg bg-primary/10">
                  <Icons.ChartLine className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Gelişmiş Grafikler</h3>
                <p className="text-muted-foreground">
                  TradingView entegrasyonu ile profesyonel analiz araçları ve teknik indikatörler
                </p>
              </div>
              <div className="space-y-4">
                <div className="inline-block p-3 rounded-lg bg-primary/10">
                  <Icons.Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Güvenli İşlemler</h3>
                <p className="text-muted-foreground">
                  2FA, soğuk cüzdan ve gelişmiş güvenlik protokolleri ile varlıklarınız güvende
                </p>
              </div>
              <div className="space-y-4">
                <div className="inline-block p-3 rounded-lg bg-primary/10">
                  <Icons.Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Hızlı İşlemler</h3>
                <p className="text-muted-foreground">
                  Yüksek performanslı eşleştirme motoru ile milisaniyeler içinde işlem gerçekleştirin
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}