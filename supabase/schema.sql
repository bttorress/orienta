create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('income', 'expense')),
  color text not null default '#06b6d4',
  created_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  type text not null check (type in ('income', 'expense')),
  description text not null,
  amount numeric(12,2) not null check (amount > 0),
  transaction_date date not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  target_amount numeric(12,2) not null check (target_amount > 0),
  current_amount numeric(12,2) not null default 0 check (current_amount >= 0),
  due_date date,
  created_at timestamptz not null default now()
);

create index if not exists categories_user_id_idx on public.categories(user_id);
create index if not exists transactions_user_id_idx on public.transactions(user_id);
create index if not exists transactions_category_id_idx on public.transactions(category_id);
create index if not exists goals_user_id_idx on public.goals(user_id);

alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.goals enable row level security;

create policy "Users can read own categories"
  on public.categories for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert own categories"
  on public.categories for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update own categories"
  on public.categories for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete own categories"
  on public.categories for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can read own transactions"
  on public.transactions for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert own transactions"
  on public.transactions for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and (
      category_id is null
      or exists (
        select 1 from public.categories
        where categories.id = transactions.category_id
          and categories.user_id = (select auth.uid())
      )
    )
  );

create policy "Users can update own transactions"
  on public.transactions for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete own transactions"
  on public.transactions for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can read own goals"
  on public.goals for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert own goals"
  on public.goals for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update own goals"
  on public.goals for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete own goals"
  on public.goals for delete
  to authenticated
  using ((select auth.uid()) = user_id);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.categories to authenticated;
grant select, insert, update, delete on public.transactions to authenticated;
grant select, insert, update, delete on public.goals to authenticated;
