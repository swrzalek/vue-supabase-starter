-- Create articles table
create table public.articles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for faster queries
create index articles_user_id_idx on public.articles(user_id);
create index articles_created_at_idx on public.articles(created_at desc);

-- Enable Row Level Security
alter table public.articles enable row level security;

-- Policy: Anyone can view all articles (public feed)
create policy "Articles are viewable by everyone"
  on public.articles
  for select
  using (true);

-- Policy: Authenticated users can create articles
create policy "Authenticated users can create articles"
  on public.articles
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Policy: Users can update their own articles
create policy "Users can update own articles"
  on public.articles
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Policy: Users can delete their own articles
create policy "Users can delete own articles"
  on public.articles
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Create storage bucket for article images
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'article-images',
  'article-images',
  true,
  5242880, -- 5MB
  array['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
);

-- Storage policies for article-images bucket
create policy "Anyone can view article images"
  on storage.objects
  for select
  using (bucket_id = 'article-images');

create policy "Authenticated users can upload article images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'article-images' 
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update their own article images"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'article-images' 
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete their own article images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'article-images' 
    and (storage.foldername(name))[1] = auth.uid()::text
  );

