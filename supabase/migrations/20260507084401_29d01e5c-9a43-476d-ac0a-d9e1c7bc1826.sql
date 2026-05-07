
-- Roles enum + table
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null default 'user',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users view own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);
create policy "Admins view all roles" on public.user_roles for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "Admins manage roles" on public.user_roles for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Profiles
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  plan text not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Profiles viewable by owner" on public.profiles for select to authenticated using (auth.uid() = user_id);
create policy "Admins view all profiles" on public.profiles for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "Users update own profile" on public.profiles for update to authenticated using (auth.uid() = user_id);
create policy "Users insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = user_id);

-- Auto-create profile + default user role on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, email, full_name, avatar_url)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'), new.raw_user_meta_data->>'avatar_url')
  on conflict (user_id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'user') on conflict do nothing;
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

create trigger update_profiles_updated_at before update on public.profiles for each row execute function public.update_updated_at_column();

-- Career assessments
create table public.career_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  recommended_stream text,
  recommended_career text,
  score jsonb,
  created_at timestamptz not null default now()
);
alter table public.career_assessments enable row level security;
create policy "users own assessments" on public.career_assessments for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Saved roadmaps
create table public.saved_roadmaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  career text,
  steps jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.saved_roadmaps enable row level security;
create policy "users own roadmaps" on public.saved_roadmaps for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Interview progress
create table public.interview_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  challenge_slug text not null,
  difficulty text,
  score integer not null default 0,
  total integer not null default 0,
  completed boolean not null default false,
  details jsonb,
  created_at timestamptz not null default now()
);
alter table public.interview_progress enable row level security;
create policy "users own progress" on public.interview_progress for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "admins view all progress" on public.interview_progress for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "leaderboard public read" on public.interview_progress for select to anon using (true);

-- Subscriptions
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null,
  status text not null default 'active',
  razorpay_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.subscriptions enable row level security;
create policy "users view own subs" on public.subscriptions for select to authenticated using (auth.uid() = user_id);
create policy "admins view all subs" on public.subscriptions for select to authenticated using (public.has_role(auth.uid(),'admin'));
create trigger update_subs_updated_at before update on public.subscriptions for each row execute function public.update_updated_at_column();

-- Payments
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text,
  amount integer not null,
  currency text not null default 'INR',
  status text not null default 'created',
  plan text,
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  created_at timestamptz not null default now()
);
alter table public.payments enable row level security;
create policy "users view own payments" on public.payments for select to authenticated using (auth.uid() = user_id);
create policy "admins view all payments" on public.payments for select to authenticated using (public.has_role(auth.uid(),'admin'));

-- Email logs
create table public.email_logs (
  id uuid primary key default gen_random_uuid(),
  to_email text not null,
  template text not null,
  subject text,
  status text not null default 'sent',
  error text,
  meta jsonb,
  created_at timestamptz not null default now()
);
alter table public.email_logs enable row level security;
create policy "admins view email logs" on public.email_logs for select to authenticated using (public.has_role(auth.uid(),'admin'));
