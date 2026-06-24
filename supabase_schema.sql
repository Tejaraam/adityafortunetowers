-- Aditya Fortune Towers Supabase Schema & Seed Script

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. TABLES

-- Events Table
create table public.events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  description text not null,
  event_date timestamp with time zone not null,
  category text not null,
  cover_image text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Event Media Table
create table public.event_media (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  media_url text not null,
  media_type text not null check (media_type in ('image', 'youtube_url')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Documents Table
create table public.documents (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  category text not null,
  description text,
  file_url text not null,
  document_date timestamp with time zone not null,
  is_public boolean default true,
  status text not null default 'draft' check (status in ('draft', 'published')),
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Committee Table
create table public.committee (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  position text not null,
  phone text,
  email text,
  photo_url text,
  tenure text not null,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Vendors Table
create table public.vendors (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  service_category text not null,
  contact_number text not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Announcements Table
create table public.announcements (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  content text not null,
  priority text default 'normal' check (priority in ('low', 'normal', 'high')),
  expiry_date timestamp with time zone,
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Community Info Table (for Home/About pages content blocks)
create table public.community_info (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Gallery Table (standalone images/videos not tied to a specific event)
create table public.gallery (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  category text not null,
  media_url text not null,
  media_type text not null check (media_type in ('image', 'youtube_url')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Emergency Contacts Table
create table public.emergency_contacts (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  designation text not null,
  phone text not null,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Site Settings Table
create table public.site_settings (
  id uuid default uuid_generate_v4() primary key,
  community_name text not null default 'Aditya Fortune Towers',
  address text,
  phone text,
  email text,
  google_maps_link text,
  facebook_link text,
  youtube_link text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. INDEXES
create index idx_events_date on public.events(event_date);
create index idx_documents_category on public.documents(category);
create index idx_gallery_category on public.gallery(category);

-- 4. ROW LEVEL SECURITY (RLS)
-- Enable RLS
alter table public.events enable row level security;
alter table public.event_media enable row level security;
alter table public.documents enable row level security;
alter table public.committee enable row level security;
alter table public.vendors enable row level security;
alter table public.announcements enable row level security;
alter table public.community_info enable row level security;
alter table public.gallery enable row level security;
alter table public.emergency_contacts enable row level security;
alter table public.site_settings enable row level security;

-- Policies for public reading
create policy "Allow public read access on published events" on public.events for select using (status = 'published');
create policy "Allow admin full access on events" on public.events for all using (auth.role() = 'authenticated');

create policy "Allow public read access on event media" on public.event_media for select using (true);
create policy "Allow admin full access on event media" on public.event_media for all using (auth.role() = 'authenticated');

create policy "Allow public read access on published documents" on public.documents for select using (status = 'published' and is_public = true);
create policy "Allow admin full access on documents" on public.documents for all using (auth.role() = 'authenticated');

create policy "Allow public read access on committee" on public.committee for select using (true);
create policy "Allow admin full access on committee" on public.committee for all using (auth.role() = 'authenticated');

create policy "Allow public read access on vendors" on public.vendors for select using (true);
create policy "Allow admin full access on vendors" on public.vendors for all using (auth.role() = 'authenticated');

create policy "Allow public read access on active announcements" on public.announcements for select using (expiry_date is null or expiry_date > now());
create policy "Allow admin full access on announcements" on public.announcements for all using (auth.role() = 'authenticated');

create policy "Allow public read access on community info" on public.community_info for select using (true);
create policy "Allow admin full access on community info" on public.community_info for all using (auth.role() = 'authenticated');

create policy "Allow public read access on gallery" on public.gallery for select using (true);
create policy "Allow admin full access on gallery" on public.gallery for all using (auth.role() = 'authenticated');

create policy "Allow public read access on emergency contacts" on public.emergency_contacts for select using (true);
create policy "Allow admin full access on emergency contacts" on public.emergency_contacts for all using (auth.role() = 'authenticated');

create policy "Allow public read access on site settings" on public.site_settings for select using (true);
create policy "Allow admin full access on site settings" on public.site_settings for all using (auth.role() = 'authenticated');

-- 5. STORAGE BUCKETS
insert into storage.buckets (id, name, public) values ('images', 'images', true);
insert into storage.buckets (id, name, public) values ('documents', 'documents', true);

-- Storage RLS
create policy "Public Access" on storage.objects for select using ( bucket_id in ('images', 'documents') );
create policy "Admin Upload Access" on storage.objects for insert with check ( auth.role() = 'authenticated' );
create policy "Admin Update Access" on storage.objects for update using ( auth.role() = 'authenticated' );
create policy "Admin Delete Access" on storage.objects for delete using ( auth.role() = 'authenticated' );

-- 6. SEED DATA (Valid Placeholders)
-- Ensure to clear existing settings to avoid duplicates if re-run
delete from public.site_settings;
insert into public.site_settings (community_name, address, phone, email, google_maps_link)
values (
  'Aditya Fortune Towers',
  'Midhilapuri VUDA Colony, Madhurawada, Visakhapatnam, Andhra Pradesh 530041',
  '+91 00000 00000',
  'contact@adityafortunetowers.com',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3798.115684784403!2d83.3516423!3d17.8335345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a395b121aaaaaab%3A0x1111111111111111!2sAditya%20Fortune%20Towers!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin'
);

delete from public.emergency_contacts;
insert into public.emergency_contacts (name, designation, phone, display_order) values
('Main Gate Security', 'Security', '+91 00000 00000', 1),
('Maintenance Office', 'Maintenance', '+91 00000 00000', 2),
('Lift Emergency', 'Elevator Services', '+91 00000 00000', 3);

delete from public.announcements;
insert into public.announcements (title, slug, content, priority, is_featured) values
('Welcome to the New Portal', 'welcome-to-the-new-portal', 'Welcome to the official Aditya Fortune Towers portal. Here you can find updates and documents.', 'high', true);

delete from public.events;
insert into public.events (title, slug, description, event_date, category, status, is_featured) values
('Sample Featured Event', 'sample-featured-event', 'A placeholder for a featured community event.', '2026-06-20 10:00:00+05:30', 'Community Meetings', 'published', true),
('Annual General Meeting 2025', 'annual-general-meeting-2025', 'Minutes and details of the AGM 2025.', '2025-10-15 10:00:00+05:30', 'Community Meetings', 'published', false);

delete from public.documents;
insert into public.documents (title, slug, category, description, file_url, document_date, is_public, status, is_featured) values
('Community Bylaws', 'community-bylaws', 'Association Documents', 'The official bylaws of Aditya Fortune Towers.', '#', '2018-01-01 00:00:00+05:30', true, 'published', true);

delete from public.committee;
insert into public.committee (name, position, tenure, display_order) values
('President Placeholder', 'President', '2025-2026', 1),
('Secretary Placeholder', 'Secretary', '2025-2026', 2),
('Treasurer Placeholder', 'Treasurer', '2025-2026', 3);

delete from public.vendors;
insert into public.vendors (name, service_category, contact_number, notes) values
('Electrician Placeholder', 'Electrical', '+91 00000 00000', 'On-call electrician for the community'),
('Plumber Placeholder', 'Plumbing', '+91 00000 00000', 'Available during daytime');
