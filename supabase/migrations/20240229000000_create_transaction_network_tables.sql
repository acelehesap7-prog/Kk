-- networks tablosu
create table networks (
    id uuid default uuid_generate_v4() primary key,
    name varchar not null,
    symbol varchar not null,
    chain_id varchar not null,
    explorer_url varchar,
    enabled boolean default true,
    withdrawal_fee decimal(24,8) default 0,
    minimum_withdrawal decimal(24,8) default 0,
    is_withdraw_enabled boolean default true,
    is_deposit_enabled boolean default true,
    confirmations integer default 1,
    processing_time varchar default '10-30 dakika',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- assets tablosuna network desteği
alter table assets add column deposit_address varchar;

-- transactions tablosu
create table transactions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    type varchar not null check (type in ('deposit', 'withdrawal')),
    status varchar not null check (status in ('pending', 'completed', 'failed')),
    amount decimal(24,8) not null,
    symbol varchar not null,
    txid varchar,
    network varchar,
    to_address varchar,
    fee decimal(24,8),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Otomatik updated_at güncellemesi için trigger fonksiyonu
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- networks tablosu için trigger
create trigger update_networks_updated_at
    before update on networks
    for each row
    execute function update_updated_at_column();

-- transactions tablosu için trigger
create trigger update_transactions_updated_at
    before update on transactions
    for each row
    execute function update_updated_at_column();

-- RLS politikaları
alter table networks enable row level security;
alter table transactions enable row level security;

create policy "Networks görüntüleme herkese açık"
    on networks for select
    to authenticated
    using (enabled = true);

create policy "Transactions görüntüleme kullanıcıya özel"
    on transactions for select
    to authenticated
    using (user_id = auth.uid());

create policy "Transactions ekleme kullanıcıya özel"
    on transactions for insert
    to authenticated
    with check (user_id = auth.uid());

-- Örnek ağlar
insert into networks (name, symbol, chain_id, explorer_url, withdrawal_fee, minimum_withdrawal, processing_time) values
('Bitcoin', 'BTC', '1', 'https://blockstream.info', 0.0001, 0.001, '10-60 dakika'),
('Ethereum', 'ETH', '1', 'https://etherscan.io', 0.001, 0.01, '3-5 dakika'),
('BNB Smart Chain', 'BNB', '56', 'https://bscscan.com', 0.0005, 0.01, '1-3 dakika'),
('Tron', 'TRX', '1', 'https://tronscan.org', 1, 10, '30-60 saniye'),
('Solana', 'SOL', '1', 'https://solscan.io', 0.01, 0.1, '5-10 saniye');