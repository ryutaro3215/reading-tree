create table if not exists bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id uuid not null references books(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, book_id)
);

alter table bookmarks enable row level security;

create policy "bookmarks_select" on bookmarks for select using (auth.uid() = user_id);
create policy "bookmarks_insert" on bookmarks for insert with check (auth.uid() = user_id);
create policy "bookmarks_delete" on bookmarks for delete using (auth.uid() = user_id);
