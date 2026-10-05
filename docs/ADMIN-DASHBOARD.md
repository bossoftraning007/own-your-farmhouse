# Admin dashboard

Lives at **`/#/admin`** — the *Admin* link in the site footer.

Restricted to exactly two accounts:

- `premcharantejtej@gmail.com`
- `rasamallaganesh71@gmail.com`

Sign-in is a one-time email link (no password). From there you can copy the
WhatsApp campaign messages, download the posters, edit the words on the offer
banner, and upload photos.

---

## One-time setup (about 10 minutes)

The site works exactly as it does now without any of this. The dashboard only
activates once these steps are done.

### 1. Create the Supabase project

1. Sign up at [supabase.com](https://supabase.com) (free tier).
2. **New project** → name it anything, set a strong database password, pick the
   region closest to India (Mumbai / Singapore) for lower latency.
3. Wait for the project to finish provisioning.

### 2. Create the tables and access rules

1. In Supabase, open **SQL Editor → New query**.
2. Paste the entire contents of [`supabase/schema.sql`](./supabase/schema.sql).
3. Click **Run**.

This creates the content table, the image bucket, and — the part that actually
matters — the row-level security policies limiting reads and writes to the two
owner emails.

> **Why this step is not optional.** The Supabase *anon* key is deliberately
> public; it ships inside the website bundle. The policies in `schema.sql` are
> what stop anyone from reading or rewriting your content with that key. Skip
> this and your content is editable by anyone who opens devtools.

#### The schema has been corrected — check you have the fixed version

The first version of `schema.sql` shipped with a syntax error and could not be
run at all. The `owners read content` policy closed its parentheses after
`auth.jwt() ->> 'email'`, leaving `in (...)` dangling outside the clause:

```sql
-- broken, fails with: syntax error at or near "in"
using (auth.jwt() ->> 'email') in ( 'a@b.com', 'c@d.com' );
```

The clause delimiter must wrap the whole condition:

```sql
-- correct
using ((auth.jwt() ->> 'email') in ( 'a@b.com', 'c@d.com' ));
```

Two things changed beyond that one line:

- **RLS is now enabled on `storage.objects` explicitly.** Previously it relied on
  Supabase enabling it by default. Had that default ever differed, the storage
  policies would have been stored but never evaluated — leaving uploads and
  deletes open to any signed-in account with no error anywhere.
- Both fixes are now covered by tests, so the file cannot silently regress.

Verify the copy in this repo before you run it:

```bash
npm run verify:schema
```

That executes the file against a real Postgres and then attempts reads, writes,
uploads and deletes as an owner, a stranger and an anonymous visitor. It should
end with `RESULT: schema.sql runs cleanly and the policies enforce the
allowlist`. It runs as part of `npm run check`.

> If you already ran a corrected version by hand, the live policies are fine —
> but this file and the live database should match, or the next person to run it
> from the repo hits the error.

### 3. Copy the two keys

**Project Settings → API**. Copy:

- **Project URL** → looks like `https://abcdefghijkl.supabase.co`
- **anon public** key → the long `eyJ...` string

> Do **not** use the `service_role` key. It bypasses the policies above and
> would let anyone read or delete your entire database.

### 4. Add them to the project

Copy `.env.example` to `.env.local` and fill in:

```
VITE_SUPABASE_URL=https://abcdefghijkl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

`.env.local` is gitignored, so the keys never reach the repository.

### 5. Turn on email sign-in

Still in Supabase:

1. **Authentication → Providers → Email** → enable **Confirm email**.
   > Do this. Without it, anyone who knows an owner's email address could get a
   > sign-in link for an address that was never actually verified.
2. **Authentication → URL Configuration → Site URL** → set to your Vercel URL:
   `https://myfarmhouse.vercel.app`
3. **Redirect URLs** → add:
   - `https://myfarmhouse.vercel.app/#/admin`
   - `http://localhost:5173/#/admin`

### 6. Deploy

```bash
npm run build
git add -A && git commit -m "Enable admin dashboard" && git push
```

Vercel picks up `.env.local` at build time. Open `/#/admin` and sign in.

---

## What can and cannot be edited from the dashboard

**Can:** offer title, offer perks, offer note, the customer-count figures,
campaign message text, and photo uploads.

**Cannot:** the price.

The price also appears baked into the poster images and in the Google results
(structured data). Letting it be changed in one place only would produce a site
that says one number on the page, a different number in the shared image, and a
third in search results. It lives in `src/config/site.ts` instead, where one
edit plus `npm run assets` updates every surface together.

---

## How account restriction actually works

Two independent checks:

1. **`src/admin/config.ts`** — the allowlist. Controls what the UI offers.
2. **`supabase/schema.sql`** — row level security. This is the real boundary.

Check 1 alone would be no protection at all: the allowlist ships in the browser
bundle, and anyone can call the Supabase API directly regardless of what the
interface shows. Check 2 is enforced by the database and refuses every request
from an account that is not on the list.

---

## Adding new photos

Uploading from the dashboard puts the file in Supabase storage. To make it show
in the gallery it also needs adding to `galleryImages` in `src/data/index.ts` —
say the file names and it will be added.

Alternatively drop photos into `assets/incoming/` and they can be processed into
the gallery directly.

---

## Troubleshooting

**"Supabase is not connected yet"** — the two env keys are missing or the build
predates them. Check `.env.local`, then rebuild.

**Sign-in link never arrives** — confirm the address is one of the two allowed
ones, check spam, and confirm "Confirm email" is enabled in Supabase.

**"Not allowed" after signing in** — that account is not on the allowlist. Edit
both `src/admin/config.ts` and the policies in `supabase/schema.sql`, then
redeploy.

**Uploads fail** — the `gallery` bucket may not exist. Re-run `schema.sql`.