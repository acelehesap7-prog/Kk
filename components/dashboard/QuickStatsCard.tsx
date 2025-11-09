'use client'

import { Card, Text, Title } from '@tremor/react'
import { ReactNode } from 'react'

interface QuickStatsCardProps {
  icon: ReactNode
  title: string
  value: string | number
  valuePrefix?: string
  className?: string
}

export function QuickStatsCard({
  icon,
  title,
  value,
  valuePrefix = '',
  className = ''
}: QuickStatsCardProps) {
  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center gap-2">
        {icon}
        <Text>{title}</Text>
      </div>
      <Title className="mt-2">
        {valuePrefix}
        {typeof value === 'number' ? value.toFixed(2) : value}
      </Title>
    </Card>
  )
}