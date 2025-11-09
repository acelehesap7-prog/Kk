'use client'

import { Card, Text } from '@tremor/react'
import { Icons } from '@/components/icons'
import { Transaction } from '@/types/dashboard'

interface TransactionCardProps {
  transaction: Transaction
}

export function TransactionItem({ transaction: tx }: TransactionCardProps) {
  return (
    <div className="py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {tx.type === 'deposit' ? (
          <Icons.ArrowIn className="h-4 w-4 text-green-500" />
        ) : (
          <Icons.ArrowOut className="h-4 w-4 text-red-500" />
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
  )
}