-- Create merchant_wallet table to track balance
create table if not exists public.merchant_wallet (
  id uuid primary key default gen_random_uuid(),
  balance bigint not null default 2000,
  updated_at timestamptz not null default now()
);

-- Create withdrawals table to record payouts
create table if not exists public.withdrawals (
  id uuid primary key default gen_random_uuid(),
  amount bigint not null,
  status text not null default 'completed',
  created_at timestamptz not null default now()
);

-- Insert initial wallet row with Rp 2.000 balance
insert into public.merchant_wallet (balance)
select 2000 where not exists (select 1 from public.merchant_wallet);

-- Enable RLS
alter table public.merchant_wallet enable row level security;
alter table public.withdrawals enable row level security;

-- Policies: allow read by anon/authenticated for wallet
create policy "Anyone can view wallet" on public.merchant_wallet
  for select using (true);

-- Policies: allow read by authenticated for withdrawals
create policy "Anyone can view withdrawals" on public.withdrawals
  for select using (true);
