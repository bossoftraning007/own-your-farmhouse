-- ---------------------------------------------------------------------------
-- Bright Properties - admin dashboard
--
-- Run this once in the Supabase SQL editor (Dashboard -> SQL Editor -> New
-- query). It creates the content table and the image bucket, and - most
-- importantly - the row level security policies that restrict BOTH to the two
-- owner accounts.
--
-- The allowlist in src/admin/config.ts only hides the UI. These policies are
-- what actually enforce access: the anon key is public in the shipped bundle,
-- so without RLS anyone could read and rewrite the site's content.
-- ---------------------------------------------------------------------------

-- Content overrides ------------------------------------------------------------
create table if not exists public.site_content (
  id          text primary key,
  content     jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  updated_by  text
);

alter table public.site_content enable row level security;

-- Only the two owners may read or write. Replace these two addresses with your
-- own if they change.
--
-- Note the double parentheses in the USING clause below: the outer pair is the
-- clause delimiter, the inner pair groups the expression. Wrapping only
-- `auth.jwt() ->> 'email'` and leaving `in (...)` outside it is a syntax error
-- at or near "in".
drop policy if exists "owners read content" on public.site_content;
create policy "owners read content"
  on public.site_content for select
  using ((auth.jwt() ->> 'email') in (
    'premcharantejtej@gmail.com',
    'rasamallaganesh71@gmail.com'
  ));

drop policy if exists "owners write content" on public.site_content;
create policy "owners write content"
  on public.site_content for insert
  with check ((auth.jwt() ->> 'email') in (
    'premcharantejtej@gmail.com',
    'rasamallaganesh71@gmail.com'
  ));

drop policy if exists "owners update content" on public.site_content;
create policy "owners update content"
  on public.site_content for update
  using ((auth.jwt() ->> 'email') in (
    'premcharantejtej@gmail.com',
    'rasamallaganesh71@gmail.com'
  ))
  with check ((auth.jwt() ->> 'email') in (
    'premcharantejtej@gmail.com',
    'rasamallaganesh71@gmail.com'
  ));

-- Gallery uploads --------------------------------------------------------------
-- RLS is enabled explicitly rather than relied upon from Supabase's default.
-- Without it the policies below are parsed and stored but never evaluated,
-- which means every signed-in account could upload and delete freely - and
-- nothing would report an error. Belt and braces on the one table whose
-- protection is not enforced by this file's own DDL.
alter table storage.objects enable row level security;

insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

-- The bucket is public so visitors can load the images, but writes stay closed.
drop policy if exists "owners upload gallery" on storage.objects;
create policy "owners upload gallery"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'gallery'
    and (auth.jwt() ->> 'email') in (
      'premcharantejtej@gmail.com',
      'rasamallaganesh71@gmail.com'
    )
  );

drop policy if exists "owners delete gallery" on storage.objects;
create policy "owners delete gallery"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'gallery'
    and (auth.jwt() ->> 'email') in (
      'premcharantejtej@gmail.com',
      'rasamallaganesh71@gmail.com'
    )
  );

-- Public read is handled by the bucket's public flag, not a policy.

-- Seed the row so the dashboard has something to update immediately.
insert into public.site_content (id, content)
values ('site', '{}'::jsonb)
on conflict (id) do nothing;

-- Auth settings (do this in the dashboard UI, not here) -------------------------
-- 1. Authentication -> Providers -> Email: enable "Confirm email".
--    Magic links require the email to be confirmed, which stops anyone who
--    knows an owner's address from getting a link before the owner has.
-- 2. Authentication -> URL Configuration -> Site URL: your Vercel URL.
-- 3. Authentication -> URL Configuration -> Redirect URLs: add
--    https://myfarmhouse.vercel.app/#/admin
-- 4. Authentication -> Email -> Email Templates: set the "Magic Link" subject
--    and body so it is obvious the mail is a sign-in link and not marketing.