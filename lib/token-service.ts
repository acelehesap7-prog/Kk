import { ethers } from 'ethers'
import { supabase } from './supabase'

// KK99 Token Contract ABI
const TOKEN_ABI = [
  // ERC20 Standard Functions
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',

  // Custom Functions
  'function mint(address to, uint256 amount)',
  'function burn(uint256 amount)',
  'function pause()',
  'function unpause()',
  
  // Events
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  'event Paused(address account)',
  'event Unpaused(address account)'
]

export class TokenService {
  private provider: ethers.JsonRpcProvider
  private contract: ethers.Contract
  
  constructor() {
    // Provider Setup
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
    
    // Contract Setup
    this.contract = new ethers.Contract(
      process.env.TOKEN_CONTRACT_ADDRESS!,
      TOKEN_ABI,
      this.provider
    )
  }

  // Token Info
  async getTokenInfo() {
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      this.contract.name(),
      this.contract.symbol(),
      this.contract.decimals(),
      this.contract.totalSupply()
    ])

    return {
      name,
      symbol,
      decimals,
      totalSupply: ethers.formatUnits(totalSupply, decimals)
    }
  }

  // Balance Functions
  async getBalance(address: string) {
    const balance = await this.contract.balanceOf(address)
    const decimals = await this.contract.decimals()
    return ethers.formatUnits(balance, decimals)
  }

  async getAllowance(owner: string, spender: string) {
    const allowance = await this.contract.allowance(owner, spender)
    const decimals = await this.contract.decimals()
    return ethers.formatUnits(allowance, decimals)
  }

  // Transaction Functions
  async transfer(
    signer: ethers.Signer,
    to: string,
    amount: string
  ) {
    try {
      const decimals = await this.contract.decimals()
      const parsedAmount = ethers.parseUnits(amount, decimals)
      
      const connectedContract = this.contract.connect(signer)
      const tx = await connectedContract.transfer(to, parsedAmount)
      const receipt = await tx.wait()

      // Save transaction to database
      await this.saveTransaction({
        hash: receipt.hash,
        from: await signer.getAddress(),
        to,
        amount,
        type: 'transfer'
      })

      return receipt
    } catch (error) {
      console.error('Transfer error:', error)
      throw error
    }
  }

  async approve(
    signer: ethers.Signer,
    spender: string,
    amount: string
  ) {
    try {
      const decimals = await this.contract.decimals()
      const parsedAmount = ethers.parseUnits(amount, decimals)
      
      const connectedContract = this.contract.connect(signer)
      const tx = await connectedContract.approve(spender, parsedAmount)
      const receipt = await tx.wait()

      // Save transaction to database
      await this.saveTransaction({
        hash: receipt.hash,
        from: await signer.getAddress(),
        to: spender,
        amount,
        type: 'approve'
      })

      return receipt
    } catch (error) {
      console.error('Approve error:', error)
      throw error
    }
  }

  async transferFrom(
    signer: ethers.Signer,
    from: string,
    to: string,
    amount: string
  ) {
    try {
      const decimals = await this.contract.decimals()
      const parsedAmount = ethers.parseUnits(amount, decimals)
      
      const connectedContract = this.contract.connect(signer)
      const tx = await connectedContract.transferFrom(from, to, parsedAmount)
      const receipt = await tx.wait()

      // Save transaction to database
      await this.saveTransaction({
        hash: receipt.hash,
        from,
        to,
        amount,
        type: 'transferFrom'
      })

      return receipt
    } catch (error) {
      console.error('TransferFrom error:', error)
      throw error
    }
  }

  // Admin Functions
  async mint(
    signer: ethers.Signer,
    to: string,
    amount: string
  ) {
    try {
      const decimals = await this.contract.decimals()
      const parsedAmount = ethers.parseUnits(amount, decimals)
      
      const connectedContract = this.contract.connect(signer)
      const tx = await connectedContract.mint(to, parsedAmount)
      const receipt = await tx.wait()

      // Save transaction to database
      await this.saveTransaction({
        hash: receipt.hash,
        from: '0x0000000000000000000000000000000000000000',
        to,
        amount,
        type: 'mint'
      })

      return receipt
    } catch (error) {
      console.error('Mint error:', error)
      throw error
    }
  }

  async burn(
    signer: ethers.Signer,
    amount: string
  ) {
    try {
      const decimals = await this.contract.decimals()
      const parsedAmount = ethers.parseUnits(amount, decimals)
      
      const connectedContract = this.contract.connect(signer)
      const tx = await connectedContract.burn(parsedAmount)
      const receipt = await tx.wait()

      // Save transaction to database
      await this.saveTransaction({
        hash: receipt.hash,
        from: await signer.getAddress(),
        to: '0x0000000000000000000000000000000000000000',
        amount,
        type: 'burn'
      })

      return receipt
    } catch (error) {
      console.error('Burn error:', error)
      throw error
    }
  }

  async pause(signer: ethers.Signer) {
    try {
      const connectedContract = this.contract.connect(signer)
      const tx = await connectedContract.pause()
      return await tx.wait()
    } catch (error) {
      console.error('Pause error:', error)
      throw error
    }
  }

  async unpause(signer: ethers.Signer) {
    try {
      const connectedContract = this.contract.connect(signer)
      const tx = await connectedContract.unpause()
      return await tx.wait()
    } catch (error) {
      console.error('Unpause error:', error)
      throw error
    }
  }

  // Transaction History
  async getTransactionHistory(address: string) {
    const { data: transactions, error } = await supabase
      .from('token_transactions')
      .select('*')
      .or(`from.eq.${address},to.eq.${address}`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return transactions
  }

  // Private Helper Functions
  private async saveTransaction({
    hash,
    from,
    to,
    amount,
    type
  }: {
    hash: string
    from: string
    to: string
    amount: string
    type: 'transfer' | 'approve' | 'transferFrom' | 'mint' | 'burn'
  }) {
    const { error } = await supabase
      .from('token_transactions')
      .insert({
        hash,
        from_address: from,
        to_address: to,
        amount,
        type
      })

    if (error) throw error
  }
}

// Create singleton instance
export const tokenService = new TokenService()

// Export helper functions
export const getTokenInfo = async () => {
  return tokenService.getTokenInfo()
}

export const getBalance = async (address: string) => {
  return tokenService.getBalance(address)
}

export const getAllowance = async (owner: string, spender: string) => {
  return tokenService.getAllowance(owner, spender)
}

export const getTransactionHistory = async (address: string) => {
  return tokenService.getTransactionHistory(address)
}

export default tokenService