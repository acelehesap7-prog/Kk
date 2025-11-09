'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wallet, EyeOff, Eye, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft,
  Send, Copy, QrCode, RefreshCw, History, Filter, Search, Settings2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';

interface Network {
  id: string;
  name: string;
  symbol: string;
  chain_id: string;
  explorer_url: string;
  enabled: boolean;
  withdrawalFee: number;
  minimumWithdrawal: number;
  isWithdrawEnabled: boolean;
  isDepositEnabled: boolean;
  confirmations: number;
  processingTime: string;
}

interface Transaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal';
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  symbol: string;
  txid?: string;
  created_at: string;
  network?: string;
  fromAddress?: string;
  toAddress?: string;
  fee?: number;
}

interface Asset {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  change24h: number;
  icon: string;
  depositAddress?: string;
  networks: Network[];
}

export default function WalletPage() {
  const router = useRouter();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [hideBalances, setHideBalances] = useState(false);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');

  useEffect(() => {
    const loadWalletData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth/login');
          return;
        }

        const [assetsResult, networksResult, transactionsResult] = await Promise.all([
          supabase
            .from('assets')
            .select('symbol,name,balance,current_price,price_change_24h,icon,deposit_address')
            .eq('user_id', user.id),
          supabase
            .from('networks')
            .select('*'),
          supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10)
        ]);

        const networks = networksResult.data || [];
        
        if (assetsResult.data && Array.isArray(assetsResult.data)) {
          const formattedAssets = assetsResult.data.map((asset) => ({
            symbol: asset.symbol,
            name: asset.name,
            balance: Number(asset.balance) || 0,
            value: (Number(asset.balance) || 0) * (Number(asset.current_price) || 0),
            change24h: asset.price_change_24h || 0,
            icon: asset.icon || '💰',
            depositAddress: asset.deposit_address,
            networks: networks.filter((n: Network) => n.symbol === asset.symbol)
          }));

          setAssets(formattedAssets);
          const total = formattedAssets.reduce((acc: number, asset: Asset) => acc + asset.value, 0);
          setTotalBalance(total);
        }

        if (transactionsResult.data) {
          setTransactions(transactionsResult.data as Transaction[]);
        }

      } catch (error) {
        console.error('Failed to load wallet data:', error);
        toast.error('Varlık bilgileri yüklenemedi');
      } finally {
        setLoading(false);
      }
    };

    loadWalletData();
  }, [router]);

  const formatBalance = (balance: number) => {
    return hideBalances ? '****' : balance.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    });
  };

  const formatValue = (value: number) => {
    return hideBalances ? '****' : value.toLocaleString('tr-TR', {
      style: 'currency',
      currency: 'USD'
    });
  };

  const handleDeposit = (asset: Asset) => {
    setSelectedAsset(asset);
    setSelectedNetwork(asset.networks[0]);
    setShowDepositDialog(true);
  };

  const handleWithdraw = (asset: Asset) => {
    setSelectedAsset(asset);
    setSelectedNetwork(asset.networks[0]);
    setWithdrawAmount('');
    setWithdrawAddress('');
    setShowWithdrawDialog(true);
  };

  const handleWithdrawalSubmit = async () => {
    if (!selectedAsset || !selectedNetwork || !withdrawAmount || !withdrawAddress) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const amount = parseFloat(withdrawAmount);
      if (isNaN(amount) || amount <= 0) {
        toast.error('Geçerli bir miktar girin');
        return;
      }

      if (amount > selectedAsset.balance) {
        toast.error('Yetersiz bakiye');
        return;
      }

      if (amount < selectedNetwork.minimumWithdrawal) {
        toast.error(`Minimum çekim tutarı: ${selectedNetwork.minimumWithdrawal} ${selectedAsset.symbol}`);
        return;
      }

      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'withdrawal',
          status: 'pending',
          amount,
          symbol: selectedAsset.symbol,
          network: selectedNetwork.name,
          toAddress: withdrawAddress,
          fee: selectedNetwork.withdrawalFee,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Çekim talebi oluşturuldu');
      setTransactions(prev => [data as Transaction, ...prev]);
      setShowWithdrawDialog(false);
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast.error('Çekim talebi oluşturulamadı');
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Varlıklarım</h1>
          <p className="text-muted-foreground">
            Kripto varlıklarınızı görüntüleyin ve yönetin
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setHideBalances(!hideBalances)}
        >
          {hideBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>

      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span>Toplam Portföy Değeri</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {formatValue(totalBalance)}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="assets" className="mb-8">
        <TabsList>
          <TabsTrigger value="assets">Varlıklar</TabsTrigger>
          <TabsTrigger value="transactions">İşlemler</TabsTrigger>
        </TabsList>

        <TabsContent value="assets">
          <Card>
            <CardHeader>
              <CardTitle>Varlıklarım</CardTitle>
              <CardDescription>
                Tüm kripto varlıklarınız
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
                  <p className="text-muted-foreground">Yükleniyor...</p>
                </div>
              ) : assets.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Henüz hiç varlığınız bulunmuyor</p>
                  <Button onClick={() => router.push('/markets')}>
                    Piyasaları Keşfet
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {assets.map((asset) => (
                    <div
                      key={asset.symbol}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{asset.icon}</div>
                        <div>
                          <div className="font-medium">{asset.symbol}</div>
                          <div className="text-sm text-muted-foreground">{asset.name}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium">{formatBalance(asset.balance)} {asset.symbol}</div>
                          <div className="text-sm text-muted-foreground">{formatValue(asset.value)}</div>
                          <div className={`text-sm flex items-center justify-end gap-1 ${
                            asset.change24h >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {asset.change24h >= 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {Math.abs(asset.change24h).toFixed(2)}%
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeposit(asset)}
                          >
                            <ArrowDownLeft className="h-4 w-4 mr-1" />
                            Yatır
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleWithdraw(asset)}
                          >
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            Çek
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Son İşlemler</CardTitle>
              <CardDescription>
                Son yapılan yatırma ve çekim işlemleri
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Henüz hiç işlem yapılmamış</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        {tx.type === 'deposit' ? (
                          <ArrowDownLeft className="h-5 w-5 text-green-600" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 text-red-600" />
                        )}
                        <div>
                          <div className="font-medium">
                            {tx.type === 'deposit' ? 'Yatırma' : 'Çekim'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(tx.created_at).toLocaleString('tr-TR')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium">
                            {tx.amount} {tx.symbol}
                          </div>
                          <div className="text-sm">
                            <Badge variant={
                              tx.status === 'completed' ? 'default' :
                              tx.status === 'pending' ? 'secondary' : 'destructive'
                            }>
                              {tx.status === 'completed' ? 'Tamamlandı' :
                               tx.status === 'pending' ? 'Bekliyor' : 'Başarısız'}
                            </Badge>
                          </div>
                        </div>
                        {tx.txid && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const network = assets
                                .find(a => a.symbol === tx.symbol)
                                ?.networks.find(n => n.name === tx.network);
                              
                              if (network?.explorer_url) {
                                window.open(`${network.explorer_url}/tx/${tx.txid}`, '_blank');
                              }
                            }}
                          >
                            <Search className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yatırma</DialogTitle>
            <DialogDescription>
              {selectedAsset?.name} yatırmak için aşağıdaki adresi kullanın
            </DialogDescription>
          </DialogHeader>

          {selectedAsset && (
            <div className="space-y-4">
              {selectedAsset.networks.length > 1 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ağ Seçin</label>
                  <Select
                    value={selectedNetwork?.name}
                    onValueChange={(value) => {
                      const network = selectedAsset.networks.find(n => n.name === value);
                      if (network) setSelectedNetwork(network);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedAsset.networks.map((network) => (
                        <SelectItem
                          key={network.name}
                          value={network.name}
                          disabled={!network.isDepositEnabled}
                        >
                          {network.name}
                          {!network.isDepositEnabled && ' (Kapalı)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedNetwork?.isDepositEnabled && selectedAsset.depositAddress && (
                <>
                  <div className="flex justify-center">
                    <QRCodeSVG
                      value={selectedAsset.depositAddress}
                      size={200}
                      level="H"
                      includeMargin
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Yatırma Adresi</label>
                    <div className="flex gap-2">
                      <Input
                        readOnly
                        value={selectedAsset.depositAddress}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedAsset.depositAddress || '');
                          toast.success('Adres kopyalandı');
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="font-medium">Önemli Notlar:</div>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Sadece {selectedNetwork?.name} ağı üzerinden yatırın</li>
                      <li>Minimum {selectedAsset.symbol} yatırma tutarı: {
                        selectedNetwork?.minimumWithdrawal
                      }</li>
                      <li>{selectedNetwork?.confirmations || 1} blok onayı gerekli</li>
                      <li>İşlem süresi: ~{selectedNetwork?.processingTime}</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Çekim</DialogTitle>
            <DialogDescription>
              {selectedAsset?.name} çekmek için aşağıdaki formu doldurun
            </DialogDescription>
          </DialogHeader>

          {selectedAsset && (
            <div className="space-y-4">
              {selectedAsset.networks.length > 1 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ağ Seçin</label>
                  <Select
                    value={selectedNetwork?.name}
                    onValueChange={(value) => {
                      const network = selectedAsset.networks.find(n => n.name === value);
                      if (network) setSelectedNetwork(network);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedAsset.networks.map((network) => (
                        <SelectItem
                          key={network.name}
                          value={network.name}
                          disabled={!network.isWithdrawEnabled}
                        >
                          {network.name}
                          {!network.isWithdrawEnabled && ' (Kapalı)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Çekim Adresi</label>
                <Input
                  placeholder={`${selectedAsset.name} adresinizi girin`}
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Miktar</label>
                <Input
                  type="number"
                  min={0}
                  step="any"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Bakiye: {selectedAsset.balance} {selectedAsset.symbol}</span>
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => setWithdrawAmount(selectedAsset.balance.toString())}
                  >
                    Tümünü Kullan
                  </button>
                </div>
              </div>

              {selectedNetwork && (
                <div className="space-y-2 text-sm">
                  <div className="font-medium">Önemli Bilgiler:</div>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Çekim ücreti: {selectedNetwork.withdrawalFee} {selectedAsset.symbol}</li>
                    <li>Minimum çekim: {selectedNetwork.minimumWithdrawal} {selectedAsset.symbol}</li>
                    <li>İşlem süresi: ~{selectedNetwork.processingTime}</li>
                  </ul>
                </div>
              )}

              <DialogFooter>
                <Button
                  onClick={handleWithdrawalSubmit}
                  disabled={
                    !selectedNetwork?.isWithdrawEnabled ||
                    !withdrawAddress ||
                    !withdrawAmount ||
                    parseFloat(withdrawAmount) <= 0
                  }
                >
                  Çekim Yap
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
