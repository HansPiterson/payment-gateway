-- 1. Create Campaigns Table
create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null,
  banner_url text,
  logo_url text,
  donation_type text not null check (donation_type in ('free', 'fixed')),
  fixed_amounts jsonb, -- e.g. [10000, 50000, 100000]
  target_amount integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for ordering
create index if not exists idx_campaigns_created_at on public.campaigns (created_at desc);

-- Auto-update updated_at
create trigger on_campaigns_updated
  before update on public.campaigns
  for each row
  execute function public.handle_updated_at();

-- RLS for Campaigns
alter table public.campaigns enable row level security;

-- Policy: allow anon users to read active campaigns
create policy "Anyone can view active campaigns"
  on public.campaigns
  for select
  to anon
  using (is_active = true);

-- Policy: allow authenticated users (admin) full access to campaigns
create policy "Admin has full access to campaigns"
  on public.campaigns
  for all
  to authenticated
  using (true);

-- Enable Realtime
alter publication supabase_realtime add table public.campaigns;

-- 2. Extend Payments Table
alter table public.payments add column campaign_id uuid references public.campaigns(id);
alter table public.payments add column is_anonymous boolean default false;
alter table public.payments add column message text;

-- Index for campaign queries
create index if not exists idx_payments_campaign_id on public.payments (campaign_id);

-- 3. Create Storage Bucket for Campaign Assets
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'campaigns', 
  'campaigns', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) on conflict (id) do nothing;

-- RLS for Storage
-- Public read access
create policy "Campaign assets are publicly accessible"
  on storage.objects for select
  to public
  using ( bucket_id = 'campaigns' );

-- Admin full access to storage
create policy "Admin can upload campaign assets"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'campaigns' );

create policy "Admin can update campaign assets"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'campaigns' );

create policy "Admin can delete campaign assets"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'campaigns' );
