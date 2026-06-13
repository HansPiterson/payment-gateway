-- Create payments table for Bayar.gg integration
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id text unique,
  amount integer not null,
  description text,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  status text not null default 'pending',
  payment_method text,
  payment_url text,
  qris_url text,
  webhook_data jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index on status for filtering queries
create index if not exists idx_payments_status on public.payments (status);

-- Index on created_at for ordering
create index if not exists idx_payments_created_at on public.payments (created_at desc);

-- Auto-update updated_at on row modification
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_payments_updated
  before update on public.payments
  for each row
  execute function public.handle_updated_at();

-- Enable Row Level Security
alter table public.payments enable row level security;

-- Policy: allow authenticated users to read their own payments (by email)
create policy "Users can view their own payments"
  on public.payments
  for select
  to authenticated
  using (customer_email = auth.jwt() ->> 'email');

-- Policy: allow service role full access (edge functions use service role key)
-- Service role bypasses RLS by default, so no explicit policy needed.

-- Policy: allow anon users to read a payment by invoice_id (for status page)
create policy "Anyone can view payment by invoice_id"
  on public.payments
  for select
  to anon
  using (true);

-- Enable Realtime for the payments table
alter publication supabase_realtime add table public.payments;
