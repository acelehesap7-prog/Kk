'use client'

import { Card, Metric, Text, BarChart, DonutChart, Title } from '@tremor/react'

const performanceData = [
  {
    date: 'Jan 22',
    'İşlem Hacmi': 2890,
    'Yeni Kullanıcı': 2338,
  },
  {
    date: 'Feb 22',
    'İşlem Hacmi': 3890,
    'Yeni Kullanıcı': 2103,
  },
  {
    date: 'Mar 22',
    'İşlem Hacmi': 3490,
    'Yeni Kullanıcı': 2980,
  },
  {
    date: 'Apr 22',
    'İşlem Hacmi': 4190,
    'Yeni Kullanıcı': 3102,
  },
  {
    date: 'May 22',
    'İşlem Hacmi': 3590,
    'Yeni Kullanıcı': 2980,
  },
]

const userDistribution = [
  {
    name: 'Kripto',
    value: 45,
  },
  {
    name: 'Forex',
    value: 30,
  },
  {
    name: 'Hisse Senedi',
    value: 25,
  },
]

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="pb-5 border-b border-accent mb-8">
        <h3 className="text-2xl font-semibold leading-6">Dashboard</h3>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <Text>Toplam Kullanıcı</Text>
          <Metric>12,545</Metric>
        </Card>
        <Card>
          <Text>Aylık İşlem Hacmi</Text>
          <Metric>$4.2M</Metric>
        </Card>
        <Card>
          <Text>Aktif İşlemler</Text>
          <Metric>2,345</Metric>
        </Card>
        <Card>
          <Text>Günlük Yeni Kullanıcı</Text>
          <Metric>145</Metric>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 mt-8 lg:grid-cols-2">
        <Card>
          <Title>Performans Metrikler</Title>
          <BarChart
            data={performanceData}
            index="date"
            categories={['İşlem Hacmi', 'Yeni Kullanıcı']}
            colors={['blue', 'emerald']}
            yAxisWidth={48}
            onValueChange={(v) => console.log(v)}
          />
        </Card>
        <Card>
          <Title>Kullanıcı Dağılımı</Title>
          <DonutChart
            data={userDistribution}
            category="value"
            index="name"
            colors={['blue', 'emerald', 'purple']}
          />
        </Card>
      </div>
    </div>
  )
}