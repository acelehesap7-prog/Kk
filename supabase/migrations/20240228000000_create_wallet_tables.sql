-- Create assets table
CREATE TABLE assets (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    symbol varchar NOT NULL,
    name varchar NOT NULL,
    balance numeric(24,8) NOT NULL DEFAULT 0,
    current_price numeric(24,8) NOT NULL DEFAULT 0,
    price_change_24h numeric(24,8) NOT NULL DEFAULT 0,
    icon varchar NOT NULL,
    deposit_address varchar,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id, symbol)
);

-- Create transactions table
CREATE TABLE transactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    type varchar NOT NULL CHECK (type IN ('deposit', 'withdraw', 'transfer', 'trade')),
    amount numeric(24,8) NOT NULL,
    asset varchar NOT NULL,
    value numeric(24,8) NOT NULL,
    status varchar NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
    hash varchar,
    from_address varchar,
    to_address varchar,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create wallet addresses table
CREATE TABLE wallet_addresses (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    chain varchar NOT NULL,
    address varchar NOT NULL,
    memo varchar,
    network varchar NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id, chain, network)
);

-- Create RLS policies
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own assets" ON assets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own assets" ON assets
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own transactions" ON transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own wallet addresses" ON wallet_addresses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own wallet addresses" ON wallet_addresses
    FOR ALL USING (auth.uid() = user_id);

-- Create functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_assets_updated_at
    BEFORE UPDATE ON assets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallet_addresses_updated_at
    BEFORE UPDATE ON wallet_addresses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();