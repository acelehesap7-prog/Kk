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
          password_hash: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          country: string | null
          is_admin: boolean
          is_verified: boolean
          kyc_status: string
          two_factor_enabled: boolean
          referral_code: string | null
          referred_by: string | null
          created_at: string
          updated_at: string
          last_login: string | null
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          country?: string | null
          is_admin?: boolean
          is_verified?: boolean
          kyc_status?: string
          two_factor_enabled?: boolean
          referral_code?: string | null
          referred_by?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          country?: string | null
          is_admin?: boolean
          is_verified?: boolean
          kyc_status?: string
          two_factor_enabled?: boolean
          referral_code?: string | null
          referred_by?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
      }
      token_balances: {
        Row: {
          id: string
          user_id: string
          token: string
          balance: number
          locked_balance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          token: string
          balance?: number
          locked_balance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          token?: string
          balance?: number
          locked_balance?: number
          created_at?: string
          updated_at?: string
        }
      }
      trading_pairs: {
        Row: {
          id: string
          symbol: string
          base_asset: string
          quote_asset: string
          market_type: string
          min_order_size: number
          max_order_size: number | null
          price_precision: number
          quantity_precision: number
          trading_fee: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          symbol: string
          base_asset: string
          quote_asset: string
          market_type: string
          min_order_size?: number
          max_order_size?: number | null
          price_precision?: number
          quantity_precision?: number
          trading_fee?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          symbol?: string
          base_asset?: string
          quote_asset?: string
          market_type?: string
          min_order_size?: number
          max_order_size?: number | null
          price_precision?: number
          quantity_precision?: number
          trading_fee?: number
          is_active?: boolean
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          trading_pair_id: string
          order_type: string
          side: string
          quantity: number
          price: number | null
          stop_price: number | null
          filled_quantity: number
          status: string
          time_in_force: string
          kk99_fee_discount: number
          total_fee: number
          created_at: string
          updated_at: string
          filled_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          trading_pair_id: string
          order_type: string
          side: string
          quantity: number
          price?: number | null
          stop_price?: number | null
          filled_quantity?: number
          status?: string
          time_in_force?: string
          kk99_fee_discount?: number
          total_fee?: number
          created_at?: string
          updated_at?: string
          filled_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          trading_pair_id?: string
          order_type?: string
          side?: string
          quantity?: number
          price?: number | null
          stop_price?: number | null
          filled_quantity?: number
          status?: string
          time_in_force?: string
          kk99_fee_discount?: number
          total_fee?: number
          created_at?: string
          updated_at?: string
          filled_at?: string | null
        }
      }
      trades: {
        Row: {
          id: string
          order_id: string
          user_id: string
          trading_pair_id: string
          side: string
          quantity: number
          price: number
          fee: number
          fee_asset: string
          kk99_used: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          user_id: string
          trading_pair_id: string
          side: string
          quantity: number
          price: number
          fee: number
          fee_asset: string
          kk99_used?: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          user_id?: string
          trading_pair_id?: string
          side?: string
          quantity?: number
          price?: number
          fee?: number
          fee_asset?: string
          kk99_used?: number
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: string
          token: string
          amount: number
          fee: number
          status: string
          tx_hash: string | null
          network: string | null
          from_address: string | null
          to_address: string | null
          confirmations: number
          required_confirmations: number
          created_at: string
          updated_at: string
          confirmed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          token: string
          amount: number
          fee?: number
          status?: string
          tx_hash?: string | null
          network?: string | null
          from_address?: string | null
          to_address?: string | null
          confirmations?: number
          required_confirmations?: number
          created_at?: string
          updated_at?: string
          confirmed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          token?: string
          amount?: number
          fee?: number
          status?: string
          tx_hash?: string | null
          network?: string | null
          from_address?: string | null
          to_address?: string | null
          confirmations?: number
          required_confirmations?: number
          created_at?: string
          updated_at?: string
          confirmed_at?: string | null
        }
      }
      market_data: {
        Row: {
          id: string
          symbol: string
          market_type: string
          price: number
          change_24h: number
          change_percent_24h: number
          volume_24h: number
          high_24h: number
          low_24h: number
          market_cap: number | null
          updated_at: string
        }
        Insert: {
          id?: string
          symbol: string
          market_type: string
          price: number
          change_24h: number
          change_percent_24h: number
          volume_24h: number
          high_24h: number
          low_24h: number
          market_cap?: number | null
          updated_at?: string
        }
        Update: {
          id?: string
          symbol?: string
          market_type?: string
          price?: number
          change_24h?: number
          change_percent_24h?: number
          volume_24h?: number
          high_24h?: number
          low_24h?: number
          market_cap?: number | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}