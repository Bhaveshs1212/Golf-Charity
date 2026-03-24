create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  role text default 'user' check (role in ('user', 'admin')),
  subscription_status text default 'inactive' check (subscription_status in ('active', 'inactive', 'past_due', 'canceled')),
  subscription_plan text default 'monthly' check (subscription_plan in ('monthly', 'yearly')),
  charity_id uuid,
  donation_percentage numeric default 10,
  stripe_customer_id text,
  created_at timestamp with time zone default now()
);

create table if not exists public.charities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text default '',
  active boolean default true,
  created_at timestamp with time zone default now()
);

alter table public.users
  drop constraint if exists fk_users_charity;

alter table public.users
  add constraint fk_users_charity
  foreign key (charity_id)
  references public.charities(id);

create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  value integer not null check (value between 1 and 45),
  created_at timestamp with time zone default now()
);

create table if not exists public.draws (
  id uuid primary key default gen_random_uuid(),
  month text not null,
  numbers integer[] not null,
  status text default 'draft' check (status in ('draft', 'published')),
  draw_type text default 'random' check (draw_type in ('random', 'algorithmic')),
  published_at timestamp with time zone,
  rollover_amount numeric default 0,
  prize_total numeric default 0,
  prize_tiers jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now(),
  constraint draw_numbers_length check (array_length(numbers, 1) = 5)
);

create table if not exists public.participations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  draw_id uuid not null references public.draws(id) on delete cascade,
  scores_snapshot integer[] not null,
  matches integer not null default 0,
  created_at timestamp with time zone default now()
);

create table if not exists public.winners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  draw_id uuid not null references public.draws(id) on delete cascade,
  matches integer not null,
  prize_amount numeric not null,
  status text default 'pending' check (status in ('pending', 'verified', 'paid')),
  proof_url text,
  created_at timestamp with time zone default now()
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.enforce_rolling_scores()
returns trigger as $$
begin
  delete from public.scores
  where id in (
    select id
    from public.scores
    where user_id = new.user_id
    order by created_at asc
    offset 4
  );
  return new;
end;
$$ language plpgsql;

create trigger scores_rolling_limit
  before insert on public.scores
  for each row
  execute function public.enforce_rolling_scores();

alter table public.users enable row level security;
alter table public.scores enable row level security;
alter table public.charities enable row level security;
alter table public.draws enable row level security;
alter table public.participations enable row level security;
alter table public.winners enable row level security;

create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Admins can manage users"
  on public.users for all
  using (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'))
  with check (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

create policy "Users can view own scores"
  on public.scores for select
  using (auth.uid() = user_id);

create policy "Users can insert own scores"
  on public.scores for insert
  with check (auth.uid() = user_id);

create policy "Admins can manage scores"
  on public.scores for all
  using (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'))
  with check (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

create policy "Charities are public"
  on public.charities for select
  using (true);

create policy "Admins can manage charities"
  on public.charities for all
  using (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'))
  with check (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

create policy "Draws are published"
  on public.draws for select
  using (status = 'published');

create policy "Admins can manage draws"
  on public.draws for all
  using (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'))
  with check (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

create policy "Participations are own"
  on public.participations for select
  using (auth.uid() = user_id);

create policy "Admins can manage participations"
  on public.participations for all
  using (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'))
  with check (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

create policy "Winners are own"
  on public.winners for select
  using (auth.uid() = user_id);

create policy "Users can update own winners"
  on public.winners for update
  using (auth.uid() = user_id);

create policy "Admins can manage winners"
  on public.winners for all
  using (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'))
  with check (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

insert into storage.buckets (id, name, public)
values ('proofs', 'proofs', true)
on conflict (id) do nothing;

create policy "Proofs are readable"
  on storage.objects for select
  using (bucket_id = 'proofs');

create policy "Users can upload proofs"
  on storage.objects for insert
  with check (bucket_id = 'proofs' and auth.uid() = owner);

create policy "Users can update proofs"
  on storage.objects for update
  using (bucket_id = 'proofs' and auth.uid() = owner)
  with check (bucket_id = 'proofs' and auth.uid() = owner);
