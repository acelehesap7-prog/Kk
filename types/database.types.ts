export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          created_at: string
          updated_at: string
          balance: number
          kyc_verified: boolean
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          created_at?: string
          updated_at?: string
          balance?: number
          kyc_verified?: boolean
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          created_at?: string
          updated_at?: string
          balance?: number
          kyc_verified?: boolean
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'deposit' | 'withdrawal' | 'trade'
          amount: number
          status: 'pending' | 'completed' | 'failed'
          created_at: string
          updated_at: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          type: 'deposit' | 'withdrawal' | 'trade'
          amount: number
          status?: 'pending' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'deposit' | 'withdrawal' | 'trade'
          amount?: number
          status?: 'pending' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
          metadata?: Json | null
        }
      }
      trades: {
        Row: {
          id: string
          user_id: string
          market: string
          side: 'buy' | 'sell'
          amount: number
          price: number
          status: 'pending' | 'filled' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          market: string
          side: 'buy' | 'sell'
          amount: number
          price: number
          status?: 'pending' | 'filled' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          market?: string
          side?: 'buy' | 'sell'
          amount?: number
          price?: number
          status?: 'pending' | 'filled' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      token_balances: {
        Row: {
          id: string
          user_id: string
          token: string
          balance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          token: string
          balance: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          token?: string
          balance?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}