-- Database Schema for Flash Autolike Bot (Updated & Extended)

-- 1. Profiles Table (extends Auth Users with RBAC)
create table if not exists public.profiles (
  id uuid default gen_random_uuid() primary key,
  uid text unique not null,
  nickname text,
  avatar_url text,
  role text default 'user' check (role in ('super_admin', 'admin', 'moderator', 'support_staff', 'user')),
  is_banned boolean default false,
  banned_until timestamp with time zone,
  hide_profile boolean default true,
  region text default 'India',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies for Profiles
create policy "Allow public read for visible profiles" on public.profiles
  for select using (true);

create policy "Allow insert & update for profiles" on public.profiles
  for all using (true);

-- 2. Free Fire Accounts Cache & Sync Table
create table if not exists public.ff_accounts (
  uid text primary key,
  nickname text,
  region text,
  level integer,
  likes integer,
  last_login text,
  created_at text,
  avatar_id text,
  pet_name text,
  guild_name text,
  raw_json jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.ff_accounts enable row level security;

create policy "Allow public read access to ff_accounts" on public.ff_accounts
  for select using (true);

create policy "Allow public insert/update to ff_accounts" on public.ff_accounts
  for all using (true);

-- 3. Plans Table
create table if not exists public.plans (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  price numeric not null,
  duration_days integer not null,
  daily_delivery integer default 220,
  delivery_time text default '4:00 AM IST',
  discount_percent integer default 0,
  features text[] default '{}'::text[] not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.plans enable row level security;

create policy "Allow public read for active plans" on public.plans
  for select using (is_active = true);

create policy "Allow staff full access to plans" on public.plans
  for all using (true);

-- Seed Default Plans
insert into public.plans (name, price, duration_days, daily_delivery, delivery_time, features, is_active) values
('Demo Trial', 20.00, 1, 220, '4:00 AM IST', array['1 Day Demo', 'Total Likes: ~220', 'Daily Load: ~220 Likes', 'Daily Time: 4:00 AM IST'], true),
('7 Days Starter', 50.00, 7, 220, '4:00 AM IST', array['7 Days Active', 'Total Likes: 1,540', 'Daily Load: ~220 Likes', 'Daily Time: 4:00 AM IST'], true),
('15 Days Growth', 100.00, 15, 220, '4:00 AM IST', array['15 Days Active', 'Total Likes: 3,300', 'Daily Load: ~220 Likes', 'Daily Time: 4:00 AM IST'], true),
('30 Days Pro', 200.00, 30, 220, '4:00 AM IST', array['30 Days Active', 'Total Likes: 6,600', 'Daily Load: ~220 Likes', 'Daily Time: 4:00 AM IST'], true),
('60 Days Premium', 400.00, 60, 220, '4:00 AM IST', array['60 Days Active', 'Total Likes: 13,200', 'Daily Load: ~220 Likes', 'Daily Time: 4:00 AM IST'], true),
('90 Days Pro+', 600.00, 90, 220, '4:00 AM IST', array['90 Days Active', 'Total Likes: 19,800', 'Daily Load: ~220 Likes', 'Daily Time: 4:00 AM IST'], true)
on conflict do nothing;

-- 4. Coupons Table
create table if not exists public.coupons (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  discount_percent integer not null check (discount_percent > 0 and discount_percent <= 100),
  valid_until timestamp with time zone,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.coupons enable row level security;

create policy "Allow read active coupons" on public.coupons
  for select using (is_active = true);

create policy "Allow staff full access to coupons" on public.coupons
  for all using (true);

-- 5. Orders / Payments Table
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  plan_id uuid references public.plans(id) on delete cascade not null,
  amount numeric not null,
  payment_method text not null check (payment_method in ('razorpay', 'upi')),
  status text default 'pending' check (status in ('pending', 'approved', 'rejected', 'success')),
  razorpay_order_id text,
  razorpay_payment_id text,
  utr_number text,
  screenshot_url text,
  rejection_reason text,
  refund_status text default 'none' check (refund_status in ('none', 'requested', 'refunded')),
  admin_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  verified_at timestamp with time zone
);

alter table public.orders enable row level security;

create policy "Allow public read & insert orders" on public.orders
  for all using (true);

-- 6. Subscriptions Table
create table if not exists public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  plan_id uuid references public.plans(id) on delete cascade not null,
  activated_at timestamp with time zone not null,
  expires_at timestamp with time zone not null,
  status text default 'active' check (status in ('active', 'paused', 'expired')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.subscriptions enable row level security;

create policy "Allow public read & manage subscriptions" on public.subscriptions
  for all using (true);

-- 7. Proof Gallery Table
create table if not exists public.gallery (
  id uuid default gen_random_uuid() primary key,
  url text not null,
  type text not null check (type in ('image', 'video')),
  title text,
  is_featured boolean default false,
  is_visible boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.gallery enable row level security;

create policy "Allow read access to public visible gallery" on public.gallery
  for select using (is_visible = true);

create policy "Allow staff full access to gallery" on public.gallery
  for all using (true);

-- 8. Announcements Table
create table if not exists public.announcements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  banner_text text,
  offer_details text,
  type text default 'notification' check (type in ('popup', 'banner', 'offer', 'maintenance', 'notification', 'update')),
  is_active boolean default true,
  scheduled_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.announcements enable row level security;

create policy "Allow read access to active announcements" on public.announcements
  for select using (is_active = true);

create policy "Allow staff full access to announcements" on public.announcements
  for all using (true);

insert into public.announcements (title, content, type, is_active) values
('Welcome to Flash Autolike Bot!', 'Get instant autolikes on your posts with high delivery speeds. Try our basic or premium plans today!', 'popup', true)
on conflict do nothing;

-- 9. Support Tickets Table
create table if not exists public.tickets (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  subject text not null,
  status text default 'open' check (status in ('open', 'replied', 'closed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.tickets enable row level security;

create policy "Allow manage tickets" on public.tickets
  for all using (true);

-- 10. Ticket Replies Table
create table if not exists public.ticket_replies (
  id uuid default gen_random_uuid() primary key,
  ticket_id uuid references public.tickets(id) on delete cascade not null,
  sender_id text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.ticket_replies enable row level security;

create policy "Allow ticket replies" on public.ticket_replies
  for all using (true);

-- 11. Notifications Table
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id text,
  title text not null,
  message text not null,
  type text check (type in ('payment_success', 'plan_activated', 'plan_expiring', 'announcement', 'support_reply', 'maintenance', 'offer')),
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notifications enable row level security;

create policy "Allow notifications read/write" on public.notifications
  for all using (true);

-- 12. Activity Logs Table
create table if not exists public.activity_logs (
  id uuid default gen_random_uuid() primary key,
  user_id text,
  action text not null,
  details jsonb,
  ip_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.activity_logs enable row level security;

create policy "Allow activity logs read/write" on public.activity_logs
  for all using (true);

-- 13. Site Settings Table (One row only - Extended with Realtime Theme Colors & Bot Stats)
create table if not exists public.settings (
  id integer primary key default 1 check (id = 1),
  site_name text default 'Flash Autolike Bot',
  theme_color text default '#FF2E93',
  primary_color text default '#FF2E93',
  secondary_color text default '#9333EA',
  bg_color text default '#0B0B0F',
  card_color text default '#16161F',
  button_color text default '#FF2E93',
  nav_color text default '#16161F',
  footer_color text default '#0B0B0F',
  text_color text default '#FFFFFF',
  logo_url text default '',
  favicon_url text default '',
  hero_banner_url text default '',
  background_image_url text default '',
  login_background_url text default '',
  hero_title text default 'Instant Free Fire Autolikes Delivered Daily',
  hero_subtitle text default 'Boost your Free Fire profile likes automatically with instant delivery rates.',
  upi_id text default 'payment@upi',
  upi_enabled boolean default true,
  qr_code_url text default 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=payment@upi&pn=Flash%20Autolike&am=299&cu=INR',
  razorpay_enabled boolean default true,
  razorpay_key_id text default '',
  razorpay_key_secret text default '',
  future_api_url text default 'https://flash-player-info.onrender.com/player-info?uid={UID}&key=Flash',
  telegram_username text default 'FL4SH_FF',
  support_username text default 'FL4SH_AUTOLIKE_BOT',
  social_links jsonb default '{"telegram":"https://t.me/FL4SH_FF","youtube":"","instagram":""}'::jsonb,
  meta_title text default 'FLASH AUTOLIKE - Instant Free Fire Likes',
  meta_description text default 'Boost your Free Fire profile likes automatically with instant delivery rates.',
  maintenance_mode boolean default false,
  registered_members integer default 134,
  active_members integer default 25,
  online_users_min integer default 13,
  online_users_max integer default 50,
  todays_deliveries integer default 3300,
  total_deliveries bigint default 145000,
  plans_sold integer default 189,
  success_rate numeric default 99.8,
  bot_status text default 'Online',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.settings enable row level security;

create policy "Allow public read for settings" on public.settings
  for select using (true);

create policy "Allow all updates to settings" on public.settings
  for all using (true);

insert into public.settings (id, site_name, theme_color, primary_color, secondary_color, bg_color, card_color, button_color, nav_color, footer_color, text_color, upi_id, maintenance_mode, registered_members, active_members, bot_status)
values (1, 'Flash Autolike Bot', '#FF2E93', '#FF2E93', '#9333EA', '#0B0B0F', '#16161F', '#FF2E93', '#16161F', '#0B0B0F', '#FFFFFF', 'payment@upi', false, 134, 25, 'Online')
on conflict (id) do update set
  primary_color = coalesce(public.settings.primary_color, '#FF2E93'),
  secondary_color = coalesce(public.settings.secondary_color, '#9333EA'),
  bg_color = coalesce(public.settings.bg_color, '#0B0B0F'),
  card_color = coalesce(public.settings.card_color, '#16161F'),
  button_color = coalesce(public.settings.button_color, '#FF2E93'),
  nav_color = coalesce(public.settings.nav_color, '#16161F'),
  footer_color = coalesce(public.settings.footer_color, '#0B0B0F'),
  text_color = coalesce(public.settings.text_color, '#FFFFFF'),
  registered_members = coalesce(public.settings.registered_members, 134),
  active_members = coalesce(public.settings.active_members, 25),
  bot_status = coalesce(public.settings.bot_status, 'Online');

-- 14. API Settings Table (Seeded with Live Free Fire Player Info API)
create table if not exists public.api_settings (
  id integer primary key default 1 check (id = 1),
  api_url text default 'https://flash-player-info.onrender.com/player-info?uid={UID}&key=Flash',
  api_key text default 'Flash',
  is_enabled boolean default true,
  status text default 'active',
  last_tested_at timestamp with time zone,
  logs jsonb default '[]'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.api_settings enable row level security;

create policy "Allow all updates to api_settings" on public.api_settings
  for all using (true);

insert into public.api_settings (id, api_url, api_key, is_enabled, status)
values (1, 'https://flash-player-info.onrender.com/player-info?uid={UID}&key=Flash', 'Flash', true, 'active')
on conflict (id) do update set 
  api_url = 'https://flash-player-info.onrender.com/player-info?uid={UID}&key=Flash',
  api_key = 'Flash',
  is_enabled = true,
  status = 'active';
