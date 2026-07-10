-- Supabase Database Schema for Rapid Photo Auth, Profiles & Cloudinary History Integration

-- =========================================================================
-- 1. Profiles Table (Holds roles, statuses, and synced auth metadata)
-- =========================================================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  status text not null default 'active' check (status in ('active', 'banned')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Grant permissions to authenticated users
grant select, update on public.profiles to authenticated;

-- RLS Policies for Profiles
create policy "Users can view their own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- =========================================================================
-- 2. User Images Table (Saves generated passport/visa photo history)
-- =========================================================================
create table public.user_images (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  image_url text not null,
  public_id text not null,
  format_id text not null,
  format_name text not null,
  dimensions text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.user_images enable row level security;

-- Grant permissions to the authenticated role
grant select, insert, delete on public.user_images to authenticated;

-- RLS Policies for User Images (Ensure users can only access their own data)
create policy "Users can insert their own images" 
  on public.user_images for insert 
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can view their own images" 
  on public.user_images for select 
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete their own images" 
  on public.user_images for delete 
  to authenticated
  using (auth.uid() = user_id);

-- =========================================================================
-- 3. Database Triggers for Syncing auth.users with public.profiles
-- =========================================================================

-- Trigger function to automate profile creation on user registration (Google OAuth/Email)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role, status)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', ''),
    'user',
    'active'
  );
  return new;
exception when others then
  -- Safe fallback to prevent breaking authentication if profile insert fails
  return new;
end;
$$ language plpgsql security definer;

-- Attach trigger
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
