-- Tokenlab — Supabase Schema
-- Run this in the Supabase SQL Editor (once, on a fresh project)

-- ─── Extensions ───────────────────────────────────────────────────────────────

create extension if not exists "uuid-ossp";

-- ─── Tables ───────────────────────────────────────────────────────────────────

create table public.projects (
  id            uuid primary key default uuid_generate_v4(),
  owner_id      uuid not null references auth.users(id) on delete cascade,
  name          text not null,
  description   text not null default '',
  token_name    text not null default '',
  token_ticker  text not null default '',
  project_type  text check (project_type in ('web3_native','web2_to_web3','dao','rwa','social_impact')),
  project_stage text check (project_stage in ('ideation','mvp','live')),
  blockchain    text not null default '',
  token_type    text check (token_type in ('utility','governance','security','stablecoin','hybrid')),
  health_score  integer not null default 0,
  completed_modules integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.module_data (
  id            uuid primary key default uuid_generate_v4(),
  project_id    uuid not null references public.projects(id) on delete cascade,
  module_key    text not null check (module_key in ('step0','m1','m2','m3','m4','m5','m6','m7','m8','m9')),
  data          jsonb not null default '{}',
  ai_feedback   text,
  is_complete   boolean not null default false,
  updated_at    timestamptz not null default now(),
  unique (project_id, module_key)
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

create index projects_owner_id_idx on public.projects(owner_id);
create index module_data_project_id_idx on public.module_data(project_id);

-- ─── updated_at auto-trigger ──────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create trigger module_data_updated_at
  before update on public.module_data
  for each row execute function public.set_updated_at();

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table public.projects    enable row level security;
alter table public.module_data enable row level security;

-- projects: owner full access only
create policy "projects: owner select"
  on public.projects for select
  using (owner_id = auth.uid());

create policy "projects: owner insert"
  on public.projects for insert
  with check (owner_id = auth.uid());

create policy "projects: owner update"
  on public.projects for update
  using (owner_id = auth.uid());

create policy "projects: owner delete"
  on public.projects for delete
  using (owner_id = auth.uid());

-- module_data: access via project ownership
create policy "module_data: owner select"
  on public.module_data for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.owner_id = auth.uid()
    )
  );

create policy "module_data: owner insert"
  on public.module_data for insert
  with check (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.owner_id = auth.uid()
    )
  );

create policy "module_data: owner update"
  on public.module_data for update
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.owner_id = auth.uid()
    )
  );

create policy "module_data: owner delete"
  on public.module_data for delete
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.owner_id = auth.uid()
    )
  );
