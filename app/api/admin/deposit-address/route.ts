import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Admin işlemleri için auth middleware kontrolü
const adminAuth = async (req: Request) => {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Admin rolünü kontrol et
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return session;
};

export async function POST(req: Request) {
  const authResponse = await adminAuth(req);
  if (authResponse instanceof NextResponse) {
    return authResponse;
  }

  try {
    const body = await req.json();
    const { userId, symbol, network, address } = body;

    // Gerekli alanları kontrol et
    if (!userId || !symbol || !network || !address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Yatırma adresini güncelle
    const { error } = await supabase
      .from('assets')
      .update({ deposit_address: address })
      .eq('user_id', userId)
      .eq('symbol', symbol);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating deposit address:', error);
    return NextResponse.json(
      { error: 'Failed to update deposit address' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const authResponse = await adminAuth(req);
  if (authResponse instanceof NextResponse) {
    return authResponse;
  }

  const searchParams = new URL(req.url).searchParams;
  const userId = searchParams.get('userId');
  const symbol = searchParams.get('symbol');

  if (!userId || !symbol) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from('assets')
      .select('deposit_address')
      .eq('user_id', userId)
      .eq('symbol', symbol)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ address: data?.deposit_address });
  } catch (error) {
    console.error('Error fetching deposit address:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deposit address' },
      { status: 500 }
    );
  }
}