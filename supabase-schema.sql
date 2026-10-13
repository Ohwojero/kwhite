-- Supabase schema for Social Links
-- Copy and paste this script into your Supabase project's SQL Editor and click "Run"

create table if not exists public.social_links (
  id text primary key,
  name text not null,
  handle text not null default '',
  href text not null default '',
  color text not null default '#ffffff',
  bg text not null default '#000000',
  active boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table public.social_links enable row level security;

-- Policy to allow anyone to read links (for visitors on your website)
drop policy if exists "Allow public read access" on public.social_links;
create policy "Allow public read access"
  on public.social_links
  for select
  using (true);~

-- Policy to allow updating and inserting links (for admin dashboard)
drop policy if exists "Allow public write access" on public.social_links;
create policy "Allow public write access"
  on public.social_links
  for all
  using (true)
  with check (true);

-- Seed initial default links if they don't already exist
insert into public.social_links (id, name, handle, href, color, bg, active, sort_order)
values
  ('whatsapp', 'WhatsApp', 'Chat with us', 'https://wa.me/67570083806', '#ffffff', '#25D366', true, 1),
  ('telegram', 'Telegram', 'Message us', 'https://t.me/Investment_Co_ltd', '#ffffff', '#2AABEE', true, 2),
  ('zangi', 'Zangi', 'Talk on Zangi', 'https://zangi.me/6745477134', '#ffffff', '#7B5EA7', true, 3),
  ('signal', 'Signal', 'Secure chat', 'https://signal.me/#p/+14245108660', '#ffffff', '#3A76F0', true, 4)
on conflict (id) do update set
  name = excluded.name,
  sort_order = excluded.sort_order;
