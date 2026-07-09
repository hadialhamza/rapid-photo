-- Supabase Database Schema for Rapid Photo Auth & Cloudinary History Integration

-- 1. Create user_images table
create table public.user_images (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  image_url text not null,
  public_id text not null,
  format_id text not null,
  format_name text not null,
  dimensions text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.user_images enable row level security;

-- 3. Grant table-level permissions to the authenticated role
-- (RLS policies control WHICH rows; GRANT controls WHETHER the role can touch the table at all)
grant select, insert, delete on public.user_images to authenticated;

-- 4. Create RLS Policies (Ensure users can only access their own data)
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
