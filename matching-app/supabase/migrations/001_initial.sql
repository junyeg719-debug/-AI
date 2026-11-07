-- ============================================================
-- Matching App - Initial Schema
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- profiles テーブル
-- ============================================================
create table if not exists public.profiles (
  id           uuid default uuid_generate_v4() primary key,
  user_id      uuid references auth.users(id) on delete cascade not null unique,
  name         text not null,
  age          integer not null check (age >= 18 and age <= 100),
  gender       text not null check (gender in ('male', 'female', 'other')),
  looking_for  text not null check (looking_for in ('male', 'female', 'both')),
  bio          text,
  avatar_url   text,
  photos       text[] default '{}',
  interests    text[] default '{}',
  location     text,
  occupation   text,
  height       integer check (height >= 100 and height <= 250),
  created_at   timestamptz default now() not null,
  updated_at   timestamptz default now() not null
);

-- RLS
alter table public.profiles enable row level security;

create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  using (auth.role() = 'authenticated');

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

-- updated_at の自動更新トリガー
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profile_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- swipes テーブル
-- ============================================================
create table if not exists public.swipes (
  id          uuid default uuid_generate_v4() primary key,
  swiper_id   uuid references public.profiles(user_id) on delete cascade not null,
  swiped_id   uuid references public.profiles(user_id) on delete cascade not null,
  direction   text not null check (direction in ('like', 'pass')),
  created_at  timestamptz default now() not null,
  unique (swiper_id, swiped_id)
);

alter table public.swipes enable row level security;

create policy "Users can view their own swipes"
  on public.swipes for select
  using (auth.uid() = swiper_id);

create policy "Users can insert swipes"
  on public.swipes for insert
  with check (auth.uid() = swiper_id);

-- ============================================================
-- matches テーブル
-- ============================================================
create table if not exists public.matches (
  id               uuid default uuid_generate_v4() primary key,
  user1_id         uuid references public.profiles(user_id) on delete cascade not null,
  user2_id         uuid references public.profiles(user_id) on delete cascade not null,
  created_at       timestamptz default now() not null,
  last_message_at  timestamptz,
  check (user1_id < user2_id),
  unique (user1_id, user2_id)
);

alter table public.matches enable row level security;

create policy "Users can view their own matches"
  on public.matches for select
  using (auth.uid() = user1_id or auth.uid() = user2_id);

-- ============================================================
-- messages テーブル
-- ============================================================
create table if not exists public.messages (
  id          uuid default uuid_generate_v4() primary key,
  match_id    uuid references public.matches(id) on delete cascade not null,
  sender_id   uuid references public.profiles(user_id) on delete cascade not null,
  content     text not null,
  is_read     boolean default false not null,
  created_at  timestamptz default now() not null
);

alter table public.messages enable row level security;

create policy "Users can view messages in their matches"
  on public.messages for select
  using (
    exists (
      select 1 from public.matches
      where matches.id = messages.match_id
        and (matches.user1_id = auth.uid() or matches.user2_id = auth.uid())
    )
  );

create policy "Users can insert messages in their matches"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.matches
      where matches.id = match_id
        and (matches.user1_id = auth.uid() or matches.user2_id = auth.uid())
    )
  );

create policy "Users can update read status"
  on public.messages for update
  using (
    exists (
      select 1 from public.matches
      where matches.id = messages.match_id
        and (matches.user1_id = auth.uid() or matches.user2_id = auth.uid())
    )
  );

-- ============================================================
-- マッチング自動生成ファンクション
-- swipes に like が入ったとき、相手も like 済みなら matches を作成
-- ============================================================
create or replace function public.handle_new_swipe()
returns trigger as $$
declare
  other_like_exists boolean;
  u1 uuid;
  u2 uuid;
begin
  if new.direction = 'like' then
    select exists (
      select 1 from public.swipes
      where swiper_id = new.swiped_id
        and swiped_id = new.swiper_id
        and direction = 'like'
    ) into other_like_exists;

    if other_like_exists then
      -- user1_id < user2_id の順に正規化
      if new.swiper_id < new.swiped_id then
        u1 := new.swiper_id;
        u2 := new.swiped_id;
      else
        u1 := new.swiped_id;
        u2 := new.swiper_id;
      end if;

      insert into public.matches (user1_id, user2_id)
      values (u1, u2)
      on conflict do nothing;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_swipe_inserted
  after insert on public.swipes
  for each row execute procedure public.handle_new_swipe();

-- ============================================================
-- Realtime を有効化
-- ============================================================
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.matches;
