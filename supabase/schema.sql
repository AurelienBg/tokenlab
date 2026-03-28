-- Tokenlab — Supabase schema (V2 ready)
-- Run this in Supabase SQL Editor when adding auth/cloud sync

create extension if not exists "uuid-ossp";

-- ─── projects ─────────────────────────────────────────────────────────────────
create table if not exists public.projects (
  id                uuid primary key default uuid_generate_v4(),
  owner_id          uuid not null references auth.users(id) on delete cascade,
  name              text not null,
  description       text,
  token_name        text,
  token_ticker      text,
  project_type      text check (project_type in ('web3_native','web2_to_web3','dao','rwa','social_impact')),
  project_stage     text check (project_stage in ('ideation','mvp','live')),
  blockchain        text,
  token_type        text check (token_type in ('utility','governance','security','stablecoin','hybrid')),
  health_score      smallint default 0 check (health_score between 0 and 100),
  completed_modules integer default 0,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- ─── project_members (V2) ────────────────────────────────────────────────────
create table if not exists public.project_members (
  id         uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text not null default 'owner' check (role in ('owner', 'editor', 'viewer')),
  joined_at  timestamptz default now(),
  unique(project_id, user_id)
);

-- ─── module_data ──────────────────────────────────────────────────────────────
create table if not exists public.module_data (
  id           uuid primary key default uuid_generate_v4(),
  project_id   uuid not null references public.projects(id) on delete cascade,
  module_key   text not null check (module_key in ('step0','m1','m2','m3','m4','m5','m6','m7','m8','m9')),
  data         jsonb not null default '{}',
  ai_feedback  text,
  is_complete  boolean default false,
  updated_at   timestamptz default now(),
  unique(project_id, module_key)
);

-- ─── RLS ─────────────────────────────────────────────────────────────────────
alter table public.projects        enable row level security;
alter table public.project_members enable row level security;
alter table public.module_data     enable row level security;

create policy "owner full access on projects"
  on public.projects for all
  using (auth.uid() = owner_id);

create policy "members see their projects"
  on public.projects for select
  using (exists (
    select 1 from public.project_members pm
    where pm.project_id = id and pm.user_id = auth.uid()
  ));

create policy "members see own membership"
  on public.project_members for all
  using (auth.uid() = user_id);

create policy "project members access module_data"
  on public.module_data for all
  using (exists (
    select 1 from public.projects p
    where p.id = project_id
      and (p.owner_id = auth.uid() or exists (
        select 1 from public.project_members pm
        where pm.project_id = p.id and pm.user_id = auth.uid()
      ))
  ));

-- ─── updated_at trigger ──────────────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger touch_projects_updated_at
  before update on public.projects
  for each row execute procedure public.touch_updated_at();

create trigger touch_module_data_updated_at
  before update on public.module_data
  for each row execute procedure public.touch_updated_at();
