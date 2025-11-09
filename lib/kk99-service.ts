'use client'

import { supabase } from './supabase'

export interface KK99Balance {
  balance: number
  lockedBalance: number
  stakingBalance: number
  totalBalance: number
}

export interface FeeCalculation {
  baseFee: number
  kk99Discount: number
  finalFee: number
  kk99Required: number
  discountPercentage: number
}

export interface StakingReward {
  amount: number
  timestamp: number
  apy: number
}

export interface KK99Transaction {
  id: string
  type: 'trade' | 'stake' | 'unstake' | 'reward'
  amount: number
  timestamp: number
  status: 'pending' | 'completed' | 'failed'
}

export interface StakingInfo {
  amount: number
  apy: number
  period: number
  estimatedReward: number
}

export class KK99Service {
  private static instance: KK99Service
  private readonly MAX_DISCOUNT = 0.75 // 75% maximum discount
  private readonly BASE_FEE_RATES = {
    spot: 0.001,      // 0.1%
    futures: 0.0004,  // 0.04%
    stocks: 0.0005,   // 0.05%
    forex: 0.0001,    // 0.01%
    commodities: 0.0002, // 0.02%
    indices: 0.0001,  // 0.01%
    bonds: 0.0001,    // 0.01%
    etf: 0.0005,      // 0.05%
    options: 0.001    // 0.1%
  }

  public static getInstance(): KK99Service {
    if (!KK99Service.instance) {
      KK99Service.instance = new KK99Service()
    }
    return KK99Service.instance
  }

  // Get user's KK99 balance
  async getKK99Balance(userId: string): Promise<KK99Balance> {
    try {
      // Get regular balance
      const { data: balanceData, error: balanceError } = await supabase
        .from('token_balances')
        .select('balance, locked_balance')
        .eq('user_id', userId)
        .eq('token', 'KK99')
        .single()

      if (balanceError && balanceError.code !== 'PGRST116') {
        throw balanceError
      }

      // Get staking balance
      const { data: stakingData, error: stakingError } = await supabase
        .from('kk99_staking')
        .select('amount')
        .eq('user_id', userId)
        .eq('status', 'active')

      if (stakingError && stakingError.code !== 'PGRST116') {
        throw stakingError
      }

      const balance = balanceData?.balance || 0
      const lockedBalance = balanceData?.locked_balance || 0
      const stakingBalance = stakingData?.reduce((sum, stake) => sum + stake.amount, 0) || 0

      return {
        balance,
        lockedBalance,
        stakingBalance,
        totalBalance: balance + lockedBalance + stakingBalance
      }
    } catch (error) {
      console.error('Error fetching KK99 balance:', error)
      return {
        balance: 0,
        lockedBalance: 0,
        stakingBalance: 0,
        totalBalance: 0
      }
    }
  }

  // Calculate trading fee with KK99 discount
  calculateTradingFee(
    marketType: string,
    tradeAmount: number,
    kk99Balance: number,
    useKK99: boolean = true
  ): FeeCalculation {
    const baseFeeRate = this.BASE_FEE_RATES[marketType as keyof typeof this.BASE_FEE_RATES] || 0.001
    const baseFee = tradeAmount * baseFeeRate

    if (!useKK99 || kk99Balance <= 0) {
      return {
        baseFee,
        kk99Discount: 0,
        finalFee: baseFee,
        kk99Required: 0,
        discountPercentage: 0
      }
    }

    // Calculate discount based on KK99 balance
    const discountPercentage = this.calculateDiscountPercentage(kk99Balance)
    const kk99Discount = baseFee * discountPercentage
    const finalFee = baseFee - kk99Discount
    
    // KK99 tokens required for the discount (1:1 ratio with discount amount)
    const kk99Required = kk99Discount

    return {
      baseFee,
      kk99Discount,
      finalFee,
      kk99Required,
      discountPercentage
    }
  }

  // Calculate discount percentage based on KK99 balance
  private calculateDiscountPercentage(kk99Balance: number): number {
    // Tiered discount system
    if (kk99Balance >= 100000) return this.MAX_DISCOUNT      // 75% for 100k+ KK99
    if (kk99Balance >= 50000) return 0.60                    // 60% for 50k+ KK99
    if (kk99Balance >= 25000) return 0.50                    // 50% for 25k+ KK99
    if (kk99Balance >= 10000) return 0.40                    // 40% for 10k+ KK99
    if (kk99Balance >= 5000) return 0.30                     // 30% for 5k+ KK99
    if (kk99Balance >= 1000) return 0.20                     // 20% for 1k+ KK99
    if (kk99Balance >= 100) return 0.10                      // 10% for 100+ KK99
    return 0                                                 // No discount for < 100 KK99
  }

  // Process trading fee payment
  async processTradingFee(
    userId: string,
    feeCalculation: FeeCalculation,
    tradeId: string
  ): Promise<boolean> {
    try {
      if (feeCalculation.kk99Required > 0) {
        // Deduct KK99 tokens for discount
        const { error: deductError } = await supabase.rpc('update_token_balance', {
          p_user_id: userId,
          p_token: 'KK99',
          p_amount: -feeCalculation.kk99Required
        })

        if (deductError) {
          throw deductError
        }

        // Record the KK99 usage in trades table
        const { error: tradeError } = await supabase
          .from('trades')
          .update({ kk99_used: feeCalculation.kk99Required })
          .eq('id', tradeId)

        if (tradeError) {
          throw tradeError
        }
      }

      return true
    } catch (error) {
      console.error('Error processing trading fee:', error)
      return false
    }
  }

  // Stake KK99 tokens
  async stakeKK99(
    userId: string,
    amount: number,
    stakingPeriod: number // in days
  ): Promise<boolean> {
    try {
      // Check if user has enough balance
      const balance = await this.getKK99Balance(userId)
      if (balance.balance < amount) {
        throw new Error('Insufficient KK99 balance')
      }

      // Calculate APY based on staking period
      const apy = this.calculateStakingAPY(stakingPeriod)
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + stakingPeriod)

      // Create staking record
      const { error: stakingError } = await supabase
        .from('kk99_staking')
        .insert({
          user_id: userId,
          amount,
          staking_period: stakingPeriod,
          apy,
          end_date: endDate.toISOString()
        })

      if (stakingError) {
        throw stakingError
      }

      // Move tokens from balance to staking
      const { error: balanceError } = await supabase.rpc('update_token_balance', {
        p_user_id: userId,
        p_token: 'KK99',
        p_amount: -amount
      })

      if (balanceError) {
        throw balanceError
      }

      return true
    } catch (error) {
      console.error('Error staking KK99:', error)
      return false
    }
  }

  // Calculate staking APY based on period
  private calculateStakingAPY(stakingPeriod: number): number {
    // Longer staking periods get higher APY
    if (stakingPeriod >= 365) return 15.0      // 15% for 1 year+
    if (stakingPeriod >= 180) return 12.5      // 12.5% for 6 months+
    if (stakingPeriod >= 90) return 10.0       // 10% for 3 months+
    if (stakingPeriod >= 30) return 7.5        // 7.5% for 1 month+
    return 5.0                                 // 5% for less than 1 month
  }

  // Calculate staking rewards
  calculateStakingReward(amount: number, apy: number, period: number): StakingReward {
    const dailyRate = apy / 365 / 100
    const estimatedReward = amount * dailyRate * period

    return {
      amount,
      apy,
      period,
      estimatedReward
    }
  }

  // Get user's staking positions
  async getStakingPositions(userId: string) {
    try {
      const { data, error } = await supabase
        .from('kk99_staking')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error fetching staking positions:', error)
      return []
    }
  }

  // Claim staking rewards
  async claimStakingRewards(userId: string, stakingId: string): Promise<boolean> {
    try {
      const { data: staking, error: fetchError } = await supabase
        .from('kk99_staking')
        .select('*')
        .eq('id', stakingId)
        .eq('user_id', userId)
        .single()

      if (fetchError || !staking) {
        throw new Error('Staking position not found')
      }

      const now = new Date()
      const endDate = new Date(staking.end_date)

      if (now < endDate) {
        throw new Error('Staking period not completed')
      }

      // Calculate total rewards
      const stakingReward = this.calculateStakingReward(
        staking.amount,
        staking.apy,
        staking.staking_period
      )

      const totalAmount = staking.amount + stakingReward.estimatedReward

      // Return staked amount + rewards to balance
      const { error: balanceError } = await supabase.rpc('update_token_balance', {
        p_user_id: userId,
        p_token: 'KK99',
        p_amount: totalAmount
      })

      if (balanceError) {
        throw balanceError
      }

      // Update staking status
      const { error: updateError } = await supabase
        .from('kk99_staking')
        .update({
          status: 'completed',
          rewards_earned: stakingReward.estimatedReward
        })
        .eq('id', stakingId)

      if (updateError) {
        throw updateError
      }

      return true
    } catch (error) {
      console.error('Error claiming staking rewards:', error)
      return false
    }
  }

  // Get KK99 price (mock implementation)
  async getKK99Price(): Promise<number> {
    // In a real implementation, this would fetch from an exchange or price oracle
    return 0.25 // $0.25 per KK99 token
  }

  // Get user's trading fee discount tier
  async getUserDiscountTier(userId: string): Promise<{
    tier: string
    discount: number
    nextTier: string | null
    tokensNeeded: number
  }> {
    const balance = await this.getKK99Balance(userId)
    const totalBalance = balance.totalBalance
    const discount = this.calculateDiscountPercentage(totalBalance)

    let tier = 'Bronze'
    let nextTier: string | null = 'Silver'
    let tokensNeeded = 100 - totalBalance

    if (totalBalance >= 100000) {
      tier = 'Diamond'
      nextTier = null
      tokensNeeded = 0
    } else if (totalBalance >= 50000) {
      tier = 'Platinum'
      nextTier = 'Diamond'
      tokensNeeded = 100000 - totalBalance
    } else if (totalBalance >= 25000) {
      tier = 'Gold'
      nextTier = 'Platinum'
      tokensNeeded = 50000 - totalBalance
    } else if (totalBalance >= 10000) {
      tier = 'Silver'
      nextTier = 'Gold'
      tokensNeeded = 25000 - totalBalance
    } else if (totalBalance >= 100) {
      tier = 'Bronze'
      nextTier = 'Silver'
      tokensNeeded = 10000 - totalBalance
    } else {
      tier = 'None'
      nextTier = 'Bronze'
      tokensNeeded = 100 - totalBalance
    }

    return {
      tier,
      discount,
      nextTier,
      tokensNeeded: Math.max(0, tokensNeeded)
    }
  }
}

// Export singleton instance
export const kk99Service = KK99Service.getInstance()

// Helper function to format KK99 amounts
export function formatKK99(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M KK99`
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K KK99`
  } else {
    return `${amount.toFixed(2)} KK99`
  }
}

// Helper function to format fee discount
export function formatDiscount(percentage: number): string {
  return `${(percentage * 100).toFixed(0)}%`
}