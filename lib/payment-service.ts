import Stripe from 'stripe'
import { supabase } from './supabase'
import type { Tables } from './supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export class PaymentService {
  // Create payment intent
  async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    userId: string
  ) {
    try {
      // Get user
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (userError) throw userError
      if (!user) throw new Error('User not found')

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata: {
          userId,
          type: 'deposit'
        }
      })

      // Save to transactions table
      const { error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'deposit',
          amount,
          status: 'pending',
          metadata: {
            payment_intent_id: paymentIntent.id,
            provider: 'stripe'
          }
        })

      if (txError) throw txError

      return {
        clientSecret: paymentIntent.client_secret
      }
    } catch (error) {
      console.error('Create payment intent error:', error)
      throw error
    }
  }

  // Handle Stripe webhook
  async handleStripeWebhook(
    event: Stripe.Event
  ) {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
          break

        case 'payment_intent.payment_failed':
          await this.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
          break

        default:
          console.log(`Unhandled event type ${event.type}`)
      }
    } catch (error) {
      console.error('Webhook error:', error)
      throw error
    }
  }

  // Get transaction history
  async getTransactionHistory(
    userId: string,
    type?: Tables['transactions']['Row']['type'],
    status?: Tables['transactions']['Row']['status'],
    limit: number = 10,
    offset: number = 0
  ) {
    try {
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (type) {
        query = query.eq('type', type)
      }

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query

      if (error) throw error
      return data
    } catch (error) {
      console.error('Get transaction history error:', error)
      throw error
    }
  }

  // Get balance
  async getBalance(userId: string) {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('balance')
        .eq('id', userId)
        .single()

      if (error) throw error
      return user?.balance || 0
    } catch (error) {
      console.error('Get balance error:', error)
      throw error
    }
  }

  // Request withdrawal
  async requestWithdrawal(
    userId: string,
    amount: number,
    bankDetails: {
      accountHolder: string
      accountNumber: string
      bankName: string
      swiftCode: string
    }
  ) {
    try {
      // Check user balance
      const balance = await this.getBalance(userId)
      if (balance < amount) {
        throw new Error('Insufficient balance')
      }

      // Create transaction record
      const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'withdrawal',
          amount: amount * -1, // Negative amount for withdrawals
          status: 'pending',
          metadata: {
            bank_details: bankDetails
          }
        })
        .select()
        .single()

      if (txError) throw txError

      // Update user balance
      const { error: updateError } = await supabase
        .from('users')
        .update({
          balance: balance - amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (updateError) throw updateError

      return transaction
    } catch (error) {
      console.error('Request withdrawal error:', error)
      throw error
    }
  }

  // Private handlers
  private async handlePaymentIntentSucceeded(
    paymentIntent: Stripe.PaymentIntent
  ) {
    const userId = paymentIntent.metadata.userId
    const amount = paymentIntent.amount / 100 // Convert from cents

    try {
      // Update transaction status
      const { error: txError } = await supabase
        .from('transactions')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('metadata->payment_intent_id', paymentIntent.id)

      if (txError) throw txError

      // Update user balance
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('balance')
        .eq('id', userId)
        .single()

      if (userError) throw userError

      const { error: updateError } = await supabase
        .from('users')
        .update({
          balance: (user?.balance || 0) + amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (updateError) throw updateError
    } catch (error) {
      console.error('Payment success handler error:', error)
      throw error
    }
  }

  private async handlePaymentIntentFailed(
    paymentIntent: Stripe.PaymentIntent
  ) {
    try {
      // Update transaction status
      const { error } = await supabase
        .from('transactions')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString(),
          metadata: {
            ...paymentIntent.metadata,
            failure_message: paymentIntent.last_payment_error?.message
          }
        })
        .eq('metadata->payment_intent_id', paymentIntent.id)

      if (error) throw error
    } catch (error) {
      console.error('Payment failure handler error:', error)
      throw error
    }
  }
}

// Create singleton instance
export const paymentService = new PaymentService()

// Export helper functions
export const createPaymentIntent = async (
  amount: number,
  currency: string,
  userId: string
) => {
  return paymentService.createPaymentIntent(amount, currency, userId)
}

export const getTransactionHistory = async (
  userId: string,
  type?: Tables['transactions']['Row']['type'],
  status?: Tables['transactions']['Row']['status'],
  limit?: number,
  offset?: number
) => {
  return paymentService.getTransactionHistory(userId, type, status, limit, offset)
}

export const getBalance = async (userId: string) => {
  return paymentService.getBalance(userId)
}

export const requestWithdrawal = async (
  userId: string,
  amount: number,
  bankDetails: {
    accountHolder: string
    accountNumber: string
    bankName: string
    swiftCode: string
  }
) => {
  return paymentService.requestWithdrawal(userId, amount, bankDetails)
}

export default paymentService