import { supabase } from './supabase';

export interface Network {
  id: string;
  name: string;
  symbol: string;
  chainId: string;
  explorerUrl: string;
  enabled: boolean;
  withdrawalFee: number;
  minimumWithdrawal: number;
  isWithdrawEnabled: boolean;
  isDepositEnabled: boolean;
  confirmations: number;
  processingTime: string;
}

class NetworkService {
  async getNetworks(): Promise<Network[]> {
    const { data, error } = await supabase
      .from('networks')
      .select('*')
      .eq('enabled', true);

    if (error) {
      throw error;
    }

    return data || [];
  }

  async getNetworksBySymbol(symbol: string): Promise<Network[]> {
    const { data, error } = await supabase
      .from('networks')
      .select('*')
      .eq('symbol', symbol)
      .eq('enabled', true);

    if (error) {
      throw error;
    }

    return data || [];
  }

  async validateNetwork(networkId: string, type: 'deposit' | 'withdrawal'): Promise<boolean> {
    const { data, error } = await supabase
      .from('networks')
      .select('*')
      .eq('id', networkId)
      .single();

    if (error || !data) {
      return false;
    }

    if (type === 'deposit' && !data.isDepositEnabled) {
      return false;
    }

    if (type === 'withdrawal' && !data.isWithdrawEnabled) {
      return false;
    }

    return true;
  }

  getExplorerUrl(network: Network, txId: string): string {
    if (!network.explorerUrl || !txId) {
      return '';
    }
    return `${network.explorerUrl}/tx/${txId}`;
  }
}

export const networkService = new NetworkService();