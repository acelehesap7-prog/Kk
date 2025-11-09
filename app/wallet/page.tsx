'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, EyeOff, Eye, TrendingUp, TrendingDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Asset {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  change24h: number;
  icon: string;
}

export default function WalletPage() {
  const router = useRouter();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [hideBalances, setHideBalances] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWalletData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth/login');
          return;
        }

        const { data: assets } = await supabase
          .from('assets')
          .select('symbol,name,balance,current_price,price_change_24h,icon')
          .eq('user_id', user.id);

        if (assets && Array.isArray(assets)) {
          const formattedAssets = assets.map((asset: any) => ({
            symbol: asset.symbol,
            name: asset.name,
            balance: Number(asset.balance) || 0,
            value: (Number(asset.balance) || 0) * (Number(asset.current_price) || 0),
            change24h: asset.price_change_24h || 0,
            icon: asset.icon || '💰'
          }));

          setAssets(formattedAssets);
          const total = formattedAssets.reduce((acc, asset) => acc + asset.value, 0);
          setTotalBalance(total);
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
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{asset.icon}</div>
                    <div>
                      <div className="font-medium">{asset.symbol}</div>
                      <div className="text-sm text-muted-foreground">{asset.name}</div>
                    </div>
                  </div>
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
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
