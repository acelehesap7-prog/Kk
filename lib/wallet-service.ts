'use client'

import { supabase } from './supabase'

export interface WalletConnection {
  address: string
  network: string
  balance: number
  isConnected: boolean
}

export interface DepositAddress {
  address: string
  network: string
  token: string
  qrCode?: string
}

export interface WithdrawalRequest {
  token: string
  amount: number
  toAddress: string
  network: string
  fee: number
}

export interface Transaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'transfer'
  token: string
  amount: number
  fee: number
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled'
  txHash?: string
  network: string
  fromAddress?: string
  toAddress?: string
  confirmations: number
  requiredConfirmations: number
  createdAt: string
  confirmedAt?: string
}

export class WalletService {
  private static instance: WalletService
  private connectedWallets: Map<string, WalletConnection> = new Map()

  public static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService()
    }
    return WalletService.instance
  }

  // Connect to MetaMask wallet
  async connectMetaMask(): Promise<WalletConnection | null> {
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask not installed')
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      if (accounts.length === 0) {
        throw new Error('No accounts found')
      }

      const address = accounts[0]
      const balance = await this.getETHBalance(address)

      const connection: WalletConnection = {
        address,
        network: 'ethereum',
        balance,
        isConnected: true
      }

      this.connectedWallets.set('metamask', connection)
      return connection
    } catch (error) {
      console.error('Error connecting to MetaMask:', error)
      return null
    }
  }

  // Connect to WalletConnect
  async connectWalletConnect(): Promise<WalletConnection | null> {
    try {
      // WalletConnect integration would go here
      // This is a simplified mock implementation
      console.log('WalletConnect integration not implemented yet')
      return null
    } catch (error) {
      console.error('Error connecting to WalletConnect:', error)
      return null
    }
  }

  // Get ETH balance
  private async getETHBalance(address: string): Promise<number> {
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        return 0
      }

      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      })

      // Convert from wei to ETH
      return parseInt(balance, 16) / Math.pow(10, 18)
    } catch (error) {
      console.error('Error getting ETH balance:', error)
      return 0
    }
  }

  // Generate deposit address
  async generateDepositAddress(
    userId: string,
    token: string,
    network: string = 'ethereum'
  ): Promise<DepositAddress | null> {
    try {
      // In a real implementation, this would generate a unique address
      // For now, we'll create a mock address and store it in the database
      const mockAddress = this.generateMockAddress(token, network)

      const { data, error } = await supabase
        .from('wallet_addresses')
        .insert({
          user_id: userId,
          token,
          address: mockAddress,
          network,
          is_active: true
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      return {
        address: mockAddress,
        network,
        token,
        qrCode: `data:image/svg+xml;base64,${btoa(this.generateQRCode(mockAddress))}`
      }
    } catch (error) {
      console.error('Error generating deposit address:', error)
      return null
    }
  }

  // Generate mock address (in production, use proper address generation)
  private generateMockAddress(token: string, network: string): string {
    const prefixes = {
      ethereum: '0x',
      bitcoin: '1',
      binance: 'bnb',
      polygon: '0x'
    }

    const prefix = prefixes[network as keyof typeof prefixes] || '0x'
    const randomHex = Math.random().toString(16).substring(2, 42)
    
    if (network === 'bitcoin') {
      return `1${randomHex.substring(0, 33)}`
    }
    
    return `${prefix}${randomHex.padEnd(40, '0')}`
  }

  // Generate simple QR code SVG
  private generateQRCode(address: string): string {
    return `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <text x="100" y="100" text-anchor="middle" font-size="8" fill="black">
          ${address.substring(0, 20)}...
        </text>
        <text x="100" y="120" text-anchor="middle" font-size="6" fill="gray">
          QR Code Placeholder
        </text>
      </svg>
    `
  }

  // Get user's deposit addresses
  async getDepositAddresses(userId: string): Promise<DepositAddress[]> {
    try {
      const { data, error } = await supabase
        .from('wallet_addresses')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)

      if (error) {
        throw error
      }

      return data.map(addr => ({
        address: addr.address,
        network: addr.network,
        token: addr.token
      }))
    } catch (error) {
      console.error('Error fetching deposit addresses:', error)
      return []
    }
  }

  // Process withdrawal request
  async requestWithdrawal(
    userId: string,
    withdrawal: WithdrawalRequest
  ): Promise<boolean> {
    try {
      // Check if user has sufficient balance
      const { data: balance, error: balanceError } = await supabase
        .from('token_balances')
        .select('balance')
        .eq('user_id', userId)
        .eq('token', withdrawal.token)
        .single()

      if (balanceError || !balance) {
        throw new Error('Token balance not found')
      }

      if (balance.balance < withdrawal.amount + withdrawal.fee) {
        throw new Error('Insufficient balance')
      }

      // Create withdrawal transaction
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'withdrawal',
          token: withdrawal.token,
          amount: withdrawal.amount,
          fee: withdrawal.fee,
          status: 'pending',
          network: withdrawal.network,
          to_address: withdrawal.toAddress,
          required_confirmations: this.getRequiredConfirmations(withdrawal.network)
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      // Lock the funds
      const { error: lockError } = await supabase.rpc('lock_token_balance', {
        p_user_id: userId,
        p_token: withdrawal.token,
        p_amount: withdrawal.amount + withdrawal.fee
      })

      if (lockError) {
        throw lockError
      }

      // In a real implementation, this would trigger the actual blockchain transaction
      this.processWithdrawalAsync(data.id, withdrawal)

      return true
    } catch (error) {
      console.error('Error requesting withdrawal:', error)
      return false
    }
  }

  // Process withdrawal asynchronously (mock implementation)
  private async processWithdrawalAsync(transactionId: string, withdrawal: WithdrawalRequest) {
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 5000))

      // Generate mock transaction hash
      const txHash = `0x${Math.random().toString(16).substring(2, 66)}`

      // Update transaction with hash and confirmed status
      const { error } = await supabase
        .from('transactions')
        .update({
          tx_hash: txHash,
          status: 'confirmed',
          confirmations: this.getRequiredConfirmations(withdrawal.network),
          confirmed_at: new Date().toISOString()
        })
        .eq('id', transactionId)

      if (error) {
        throw error
      }

      console.log(`Withdrawal processed: ${txHash}`)
    } catch (error) {
      console.error('Error processing withdrawal:', error)
      
      // Mark transaction as failed
      await supabase
        .from('transactions')
        .update({ status: 'failed' })
        .eq('id', transactionId)
    }
  }

  // Get required confirmations for network
  private getRequiredConfirmations(network: string): number {
    const confirmations = {
      ethereum: 12,
      bitcoin: 6,
      binance: 15,
      polygon: 20
    }
    return confirmations[network as keyof typeof confirmations] || 12
  }

  // Get user's transaction history
  async getTransactionHistory(userId: string): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        throw error
      }

      return data.map(tx => ({
        id: tx.id,
        type: tx.type,
        token: tx.token,
        amount: tx.amount,
        fee: tx.fee,
        status: tx.status,
        txHash: tx.tx_hash,
        network: tx.network,
        fromAddress: tx.from_address,
        toAddress: tx.to_address,
        confirmations: tx.confirmations,
        requiredConfirmations: tx.required_confirmations,
        createdAt: tx.created_at,
        confirmedAt: tx.confirmed_at
      }))
    } catch (error) {
      console.error('Error fetching transaction history:', error)
      return []
    }
  }

  // Monitor deposits (would run as a background service)
  async monitorDeposits(userId: string): Promise<void> {
    try {
      // Get user's deposit addresses
      const addresses = await this.getDepositAddresses(userId)

      for (const addr of addresses) {
        // In a real implementation, this would check blockchain for new transactions
        // For now, we'll simulate finding a deposit
        const hasNewDeposit = Math.random() < 0.1 // 10% chance of new deposit

        if (hasNewDeposit) {
          await this.processDeposit(userId, addr, Math.random() * 10)
        }
      }
    } catch (error) {
      console.error('Error monitoring deposits:', error)
    }
  }

  // Process detected deposit
  private async processDeposit(
    userId: string,
    address: DepositAddress,
    amount: number
  ): Promise<void> {
    try {
      const txHash = `0x${Math.random().toString(16).substring(2, 66)}`

      // Create deposit transaction
      const { error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'deposit',
          token: address.token,
          amount,
          fee: 0,
          status: 'confirmed',
          tx_hash: txHash,
          network: address.network,
          to_address: address.address,
          confirmations: this.getRequiredConfirmations(address.network),
          required_confirmations: this.getRequiredConfirmations(address.network),
          confirmed_at: new Date().toISOString()
        })

      if (txError) {
        throw txError
      }

      // Update user balance
      const { error: balanceError } = await supabase.rpc('update_token_balance', {
        p_user_id: userId,
        p_token: address.token,
        p_amount: amount
      })

      if (balanceError) {
        throw balanceError
      }

      console.log(`Deposit processed: ${amount} ${address.token} to ${userId}`)
    } catch (error) {
      console.error('Error processing deposit:', error)
    }
  }

  // Get supported networks
  getSupportedNetworks(): string[] {
    return ['ethereum', 'bitcoin', 'binance', 'polygon']
  }

  // Get supported tokens for a network
  getSupportedTokens(network: string): string[] {
    const tokens = {
      ethereum: ['ETH', 'USDT', 'USDC', 'BTC', 'KK99'],
      bitcoin: ['BTC'],
      binance: ['BNB', 'USDT', 'BUSD', 'KK99'],
      polygon: ['MATIC', 'USDT', 'USDC', 'KK99']
    }
    return tokens[network as keyof typeof tokens] || []
  }

  // Calculate withdrawal fee
  calculateWithdrawalFee(token: string, network: string, amount: number): number {
    const fees = {
      ethereum: {
        ETH: 0.005,
        USDT: 10,
        USDC: 10,
        KK99: 50
      },
      bitcoin: {
        BTC: 0.0005
      },
      binance: {
        BNB: 0.001,
        USDT: 1,
        KK99: 10
      },
      polygon: {
        MATIC: 0.01,
        USDT: 1,
        KK99: 5
      }
    }

    const networkFees = fees[network as keyof typeof fees]
    if (!networkFees) return 0

    return networkFees[token as keyof typeof networkFees] || 0
  }
}

// Export singleton instance
export const walletService = WalletService.getInstance()

// Extend Window interface for MetaMask
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (accounts: string[]) => void) => void
      removeListener: (event: string, callback: (accounts: string[]) => void) => void
    }
  }
}