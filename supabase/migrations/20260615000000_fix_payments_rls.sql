-- Allow authenticated admin to view all payments (or simply allow everyone to view a payment if they have the ID)
create policy "Anyone can view any payment"
  on public.payments
  for select
  using (true);

-- Drop the old overly restrictive policy
drop policy if exists "Anyone can view payment by invoice_id" on public.payments;
drop policy if exists "Users can view their own payments" on public.payments;
