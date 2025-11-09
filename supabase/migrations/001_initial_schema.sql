-- KK Exchange Database Schema
-- Initial migration for trading platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table with enhanced profile information
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    country VARCHAR(2),
    is_admin BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    kyc_status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    referral_code VARCHAR(20) UNIQUE,
    referred_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- KK99 Token balances
CREATE TABLE token_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(20) NOT NULL, -- BTC, ETH, USDT, KK99, etc.
    balance DECIMAL(20, 8) DEFAULT 0,
    locked_balance DECIMAL(20, 8) DEFAULT 0, -- For pending orders
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, token)
);

-- Wallet addresses for deposits/withdrawals
CREATE TABLE wallet_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    network VARCHAR(50) NOT NULL, -- ETH, BSC, POLYGON, etc.
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trading pairs configuration
CREATE TABLE trading_pairs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symbol VARCHAR(20) NOT NULL UNIQUE, -- BTC/USDT, ETH/BTC, etc.
    base_asset VARCHAR(10) NOT NULL, -- BTC, ETH, etc.
    quote_asset VARCHAR(10) NOT NULL, -- USDT, BTC, etc.
    market_type VARCHAR(20) NOT NULL, -- spot, futures, options, forex, stocks, commodities, indices, bonds, etf
    min_order_size DECIMAL(20, 8) DEFAULT 0,
    max_order_size DECIMAL(20, 8),
    price_precision INTEGER DEFAULT 8,
    quantity_precision INTEGER DEFAULT 8,
    trading_fee DECIMAL(5, 4) DEFAULT 0.001, -- 0.1% default
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    trading_pair_id UUID NOT NULL REFERENCES trading_pairs(id),
    order_type VARCHAR(20) NOT NULL, -- market, limit, stop_loss, take_profit
    side VARCHAR(10) NOT NULL, -- buy, sell
    quantity DECIMAL(20, 8) NOT NULL,
    price DECIMAL(20, 8), -- NULL for market orders
    stop_price DECIMAL(20, 8), -- For stop orders
    filled_quantity DECIMAL(20, 8) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending', -- pending, partial, filled, cancelled, rejected
    time_in_force VARCHAR(10) DEFAULT 'GTC', -- GTC, IOC, FOK
    kk99_fee_discount DECIMAL(5, 4) DEFAULT 0, -- Discount percentage using KK99
    total_fee DECIMAL(20, 8) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    filled_at TIMESTAMP WITH TIME ZONE
);

-- Trades/Executions table
CREATE TABLE trades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id),
    user_id UUID NOT NULL REFERENCES users(id),
    trading_pair_id UUID NOT NULL REFERENCES trading_pairs(id),
    side VARCHAR(10) NOT NULL,
    quantity DECIMAL(20, 8) NOT NULL,
    price DECIMAL(20, 8) NOT NULL,
    fee DECIMAL(20, 8) NOT NULL,
    fee_asset VARCHAR(10) NOT NULL,
    kk99_used DECIMAL(20, 8) DEFAULT 0, -- KK99 tokens used for fee discount
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table (deposits, withdrawals, transfers)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL, -- deposit, withdrawal, transfer, fee, reward
    token VARCHAR(20) NOT NULL,
    amount DECIMAL(20, 8) NOT NULL,
    fee DECIMAL(20, 8) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, failed, cancelled
    tx_hash VARCHAR(255), -- Blockchain transaction hash
    network VARCHAR(50),
    from_address VARCHAR(255),
    to_address VARCHAR(255),
    confirmations INTEGER DEFAULT 0,
    required_confirmations INTEGER DEFAULT 12,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE
);

-- KK99 Token staking
CREATE TABLE kk99_staking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(20, 8) NOT NULL,
    staking_period INTEGER NOT NULL, -- Days
    apy DECIMAL(5, 2) NOT NULL, -- Annual percentage yield
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- active, completed, cancelled
    rewards_earned DECIMAL(20, 8) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market data cache (for performance)
CREATE TABLE market_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symbol VARCHAR(20) NOT NULL,
    market_type VARCHAR(20) NOT NULL,
    price DECIMAL(20, 8) NOT NULL,
    change_24h DECIMAL(20, 8) NOT NULL,
    change_percent_24h DECIMAL(8, 4) NOT NULL,
    volume_24h DECIMAL(30, 8) NOT NULL,
    high_24h DECIMAL(20, 8) NOT NULL,
    low_24h DECIMAL(20, 8) NOT NULL,
    market_cap DECIMAL(30, 2),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(symbol, market_type)
);

-- System settings
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_token_balances_user_token ON token_balances(user_id, token);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_trades_user_id ON trades(user_id);
CREATE INDEX idx_trades_created_at ON trades(created_at);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_market_data_symbol ON market_data(symbol);
CREATE INDEX idx_market_data_market_type ON market_data(market_type);

-- Insert default admin user
INSERT INTO users (email, password_hash, first_name, last_name, is_admin, is_verified, kyc_status)
VALUES (
    'berkecansuskun1998@gmail.com',
    crypt('7892858a', gen_salt('bf')),
    'Berke Can',
    'Suskun',
    TRUE,
    TRUE,
    'approved'
);

-- Insert default trading pairs
INSERT INTO trading_pairs (symbol, base_asset, quote_asset, market_type, trading_fee) VALUES
-- Crypto Spot
('BTC/USDT', 'BTC', 'USDT', 'spot', 0.001),
('ETH/USDT', 'ETH', 'USDT', 'spot', 0.001),
('BNB/USDT', 'BNB', 'USDT', 'spot', 0.001),
('ADA/USDT', 'ADA', 'USDT', 'spot', 0.001),
('SOL/USDT', 'SOL', 'USDT', 'spot', 0.001),
('KK99/USDT', 'KK99', 'USDT', 'spot', 0.0005),

-- Crypto Futures
('BTCUSDT', 'BTC', 'USDT', 'futures', 0.0004),
('ETHUSDT', 'ETH', 'USDT', 'futures', 0.0004),
('BNBUSDT', 'BNB', 'USDT', 'futures', 0.0004),

-- Forex
('EUR/USD', 'EUR', 'USD', 'forex', 0.0001),
('GBP/USD', 'GBP', 'USD', 'forex', 0.0001),
('USD/JPY', 'USD', 'JPY', 'forex', 0.0001),
('AUD/USD', 'AUD', 'USD', 'forex', 0.0001),

-- Stocks
('AAPL', 'AAPL', 'USD', 'stocks', 0.0005),
('TSLA', 'TSLA', 'USD', 'stocks', 0.0005),
('GOOGL', 'GOOGL', 'USD', 'stocks', 0.0005),
('MSFT', 'MSFT', 'USD', 'stocks', 0.0005),
('AMZN', 'AMZN', 'USD', 'stocks', 0.0005),

-- Commodities
('GOLD', 'XAU', 'USD', 'commodities', 0.0002),
('SILVER', 'XAG', 'USD', 'commodities', 0.0002),
('OIL', 'WTI', 'USD', 'commodities', 0.0002),
('COPPER', 'XCU', 'USD', 'commodities', 0.0002),

-- Indices
('SPX500', 'SPX', 'USD', 'indices', 0.0001),
('NASDAQ', 'NDX', 'USD', 'indices', 0.0001),
('DOW30', 'DJI', 'USD', 'indices', 0.0001),

-- Bonds
('US10Y', 'TNX', 'USD', 'bonds', 0.0001),
('US30Y', 'TYX', 'USD', 'bonds', 0.0001),
('DE10Y', 'TNX-DE', 'EUR', 'bonds', 0.0001),

-- ETFs
('SPY', 'SPY', 'USD', 'etf', 0.0005),
('QQQ', 'QQQ', 'USD', 'etf', 0.0005),
('VTI', 'VTI', 'USD', 'etf', 0.0005);

-- Insert system settings
INSERT INTO system_settings (key, value, description) VALUES
('kk99_fee_discount_rate', '0.75', 'Maximum fee discount when using KK99 tokens (75%)'),
('kk99_staking_apy', '12.5', 'Annual percentage yield for KK99 staking'),
('min_withdrawal_amount', '10', 'Minimum withdrawal amount in USDT equivalent'),
('max_daily_withdrawal', '50000', 'Maximum daily withdrawal limit in USDT equivalent'),
('trading_enabled', 'true', 'Global trading enable/disable flag'),
('maintenance_mode', 'false', 'Maintenance mode flag');

-- Insert initial KK99 balance for admin
INSERT INTO token_balances (user_id, token, balance) 
SELECT id, 'KK99', 1000000 FROM users WHERE email = 'berkecansuskun1998@gmail.com';

-- Insert some initial USDT balance for testing
INSERT INTO token_balances (user_id, token, balance) 
SELECT id, 'USDT', 10000 FROM users WHERE email = 'berkecansuskun1998@gmail.com';