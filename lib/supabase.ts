import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null })
    })
  }
} else {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
}

export { supabase }

export type Tables = Database['public']['Tables']
export type TablesInsert = {
  [K in keyof Tables]: Tables[K]['Insert']
}
export type TablesUpdate = {
  [K in keyof Tables]: Tables[K]['Update']
}
export type TablesRow = {
  [K in keyof Tables]: Tables[K]['Row']
}

// Auth helpers
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email)
  return { data, error }
}

// User helpers
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

// Transaction helpers
export const createTransaction = async (transaction: TablesInsert['transactions']) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transaction)
    .select()
    .single()
  return { data, error }
}

export const getTransactions = async (userId: string) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

// Trade helpers
export const createTrade = async (trade: TablesInsert['trades']) => {
  const { data, error } = await supabase
    .from('trades')
    .insert(trade)
    .select()
    .single()
  return { data, error }
}

export const getTrades = async (userId: string) => {
  const { data, error } = await supabase
    .from('trades')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

// Token balance helpers
export const getTokenBalance = async (userId: string, token: string) => {
  const { data, error } = await supabase
    .from('token_balances')
    .select('*')
    .eq('user_id', userId)
    .eq('token', token)
    .single()
  return { data, error }
}

export const updateTokenBalance = async (
  userId: string,
  token: string,
  amount: number
) => {
  const { data, error } = await supabase
    .from('token_balances')
    .upsert({
      user_id: userId,
      token,
      balance: amount,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()
  return { data, error }
}