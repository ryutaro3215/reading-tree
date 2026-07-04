-- books
create table if not exists books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text,
  isbn text unique,
  created_at timestamptz not null default now()
);

-- fields (e.g. 経営学)
create table if not exists fields (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- field_books: 分野ごとの書籍とレベル
create table if not exists field_books (
  id uuid primary key default gen_random_uuid(),
  field_id uuid not null references fields(id) on delete cascade,
  book_id uuid not null references books(id) on delete cascade,
  level text not null check (level in ('beginner', 'intermediate', 'advanced')),
  created_at timestamptz not null default now(),
  unique (field_id, book_id)
);

-- edges: 書籍間の前提関係 (from → to)
create table if not exists edges (
  id uuid primary key default gen_random_uuid(),
  field_id uuid not null references fields(id) on delete cascade,
  from_book_id uuid not null references books(id) on delete cascade,
  to_book_id uuid not null references books(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (field_id, from_book_id, to_book_id)
);

-- proposals: ユーザーからの追加提案
create table if not exists proposals (
  id uuid primary key default gen_random_uuid(),
  proposer_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('book', 'edge')),
  status text not null default 'in_review' check (status in ('in_review', 'approved', 'rejected')),
  field_id uuid references fields(id) on delete set null,
  -- book proposal
  book_title text,
  book_author text,
  book_isbn text,
  level text check (level in ('beginner', 'intermediate', 'advanced')),
  -- edge proposal
  from_book_id uuid references books(id) on delete set null,
  to_book_id uuid references books(id) on delete set null,
  note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

-- RLS
alter table books enable row level security;
alter table fields enable row level security;
alter table field_books enable row level security;
alter table edges enable row level security;
alter table proposals enable row level security;

-- 読み取りは全員可
create policy "books_read" on books for select using (true);
create policy "fields_read" on fields for select using (true);
create policy "field_books_read" on field_books for select using (true);
create policy "edges_read" on edges for select using (true);

-- proposals: 本人のみ読み取り・投稿可
create policy "proposals_read_own" on proposals for select using (auth.uid() = proposer_id);
create policy "proposals_insert" on proposals for insert with check (auth.uid() = proposer_id);
