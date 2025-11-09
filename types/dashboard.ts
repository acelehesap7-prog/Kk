import { TablesRow } from '@/lib/supabase'
import { WalletConnection } from '@/lib/wallet-service'
import { KK99Balance } from '@/lib/kk99-service'

export type SafeUser = NonNullable<TablesRow['users']>

export interface Market {
  symbol: string
  price: number
  change24h: number
  volume24h: number
  high24h: number
  low24h: number
  type: string
}

export interface TokenBalance {
  token: string
  balance: number
  value: number
}

export interface Transaction {
  id: string
  user_id: string
  type: 'deposit' | 'withdrawal'
  amount: number
  status: 'completed' | 'pending' | 'failed'
  created_at: string
  confirmed_at?: string
  metadata?: Record<string, any>
}

export interface DashboardState {
  user: SafeUser | null
  balance: number
  transactions: Transaction[]
  markets: Market[]
  tokenBalances: TokenBalance[]
  walletConnection: WalletConnection | null
  kk99Balance: KK99Balance
  loading: boolean
}