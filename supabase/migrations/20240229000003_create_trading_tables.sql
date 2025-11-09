-- Create transaction_networks table
create table transaction_networks (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  symbol text not null,
  is_testnet boolean not null default false,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create deposit_addresses table
create table deposit_addresses (
  id uuid primary key default gen_random_uuid(),
  user_address text not null,
  network_id uuid not null references transaction_networks(id),
  address text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_address, network_id)
);

-- Create user_balances table
create table user_balances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  balance numeric not null default 0,
  locked_balance numeric not null default 0,
  staking_balance numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

-- Create transactions table
create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  type text not null check (type in ('deposit', 'withdrawal', 'trade', 'stake', 'unstake')),
  status text not null check (status in ('pending', 'completed', 'failed')),
  amount numeric not null,
  fee numeric not null default 0,
  token text not null,
  destination_address text,
  network_id uuid references transaction_networks(id),
  tx_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create staking table
create table staking (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  amount numeric not null,
  start_date timestamptz not null default now(),
  end_date timestamptz,
  apy numeric not null,
  rewards_earned numeric not null default 0,
  status text not null check (status in ('active', 'ended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create orders table
create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  symbol text not null,
  market text not null,
  type text not null check (type in ('limit', 'market')),
  side text not null check (side in ('buy', 'sell')),
  amount numeric not null,
  price numeric,
  status text not null check (status in ('pending', 'filled', 'cancelled')),
  filled numeric not null default 0,
  remaining numeric not null,
  fee numeric not null default 0,
  fee_token text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create trades table
create table trades (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id),
  user_id uuid not null references auth.users(id),
  symbol text not null,
  market text not null,
  side text not null check (side in ('buy', 'sell')),
  amount numeric not null,
  price numeric not null,
  fee numeric not null,
  fee_token text not null,
  created_at timestamptz not null default now()
);

-- Create functions for balance operations
create or replace function increment_balance(
  p_user_id uuid,
  p_amount numeric
) returns numeric as $$
declare
  v_new_balance numeric;
begin
  update user_balances
  set balance = balance + p_amount,
      updated_at = now()
  where user_id = p_user_id
  returning balance into v_new_balance;
  
  return v_new_balance;
end;
$$ language plpgsql security definer;

create or replace function decrement_balance(
  p_user_id uuid,
  p_amount numeric
) returns numeric as $$
declare
  v_new_balance numeric;
begin
  if not exists (
    select 1 from user_balances
    where user_id = p_user_id and balance >= p_amount
  ) then
    raise exception 'Insufficient balance';
  end if;

  update user_balances
  set balance = balance - p_amount,
      updated_at = now()
  where user_id = p_user_id
  returning balance into v_new_balance;
  
  return v_new_balance;
end;
$$ language plpgsql security definer;

-- Create function for staking
create or replace function stake_tokens(
  p_user_id uuid,
  p_amount numeric,
  p_apy numeric
) returns void as $$
begin
  -- Check if user has enough balance
  if not exists (
    select 1 from user_balances
    where user_id = p_user_id and balance >= p_amount
  ) then
    raise exception 'Insufficient balance';
  end if;

  -- Begin transaction
  begin
    -- Reduce user's available balance
    update user_balances
    set balance = balance - p_amount,
        staking_balance = staking_balance + p_amount,
        updated_at = now()
    where user_id = p_user_id;

    -- Create staking record
    insert into staking (
      user_id,
      amount,
      apy,
      status
    ) values (
      p_user_id,
      p_amount,
      p_apy,
      'active'
    );

    -- Create transaction record
    insert into transactions (
      user_id,
      type,
      status,
      amount,
      token
    ) values (
      p_user_id,
      'stake',
      'completed',
      p_amount,
      'KK99'
    );
  end;
end;
$$ language plpgsql security definer;