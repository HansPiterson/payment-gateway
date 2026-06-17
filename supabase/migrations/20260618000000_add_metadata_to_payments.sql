-- Add metadata column to payments table
alter table public.payments add column if not exists metadata jsonb;
