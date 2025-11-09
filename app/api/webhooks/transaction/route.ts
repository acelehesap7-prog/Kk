import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Webhook secret için bir environment variable kullanılmalı
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    // Webhook güvenlik kontrolü
    const signature = req.headers.get('x-webhook-signature');
    if (!signature || signature !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const body = await req.json();
    const { txId, status, network, confirmations } = body;

    if (!txId || !status || !network) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // İşlem durumunu güncelle
    const { data: tx, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .eq('txid', txId)
      .single();

    if (txError || !tx) {
      throw new Error('Transaction not found');
    }

    // İlgili ağ için gerekli onay sayısını kontrol et
    const { data: network_data } = await supabase
      .from('networks')
      .select('confirmations')
      .eq('name', network)
      .single();

    const requiredConfirmations = network_data?.confirmations || 1;
    
    // Onay sayısı yeterliyse durumu güncelle
    if (confirmations >= requiredConfirmations) {
      const { error } = await supabase
        .from('transactions')
        .update({ 
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('txid', txId);

      if (error) {
        throw error;
      }

      // Yatırma işlemi tamamlandıysa bakiyeyi güncelle
      if (status === 'completed' && tx.type === 'deposit') {
        const { error: balanceError } = await supabase.rpc(
          'update_asset_balance',
          { 
            p_user_id: tx.user_id,
            p_symbol: tx.symbol,
            p_amount: tx.amount
          }
        );

        if (balanceError) {
          throw balanceError;
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}