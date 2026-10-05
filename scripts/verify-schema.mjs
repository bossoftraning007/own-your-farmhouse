/**
 * Executes supabase/schema.sql against a real Postgres to prove it runs, then
 * proves the policies actually enforce what they claim.
 *
 * Parsing is not enough here. A policy that compiles but compares the wrong
 * thing is silent, permanent data exposure. So this stubs the two Supabase
 * builtins the file depends on (auth.jwt and the storage tables), runs the file
 * verbatim, and then attempts reads and writes as an owner, a stranger and an
 * anonymous visitor.
 *
 * Run: node scripts/verify-schema.mjs
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCHEMA = path.join(ROOT, "supabase", "schema.sql");

const OWNERS = ["premcharantejtej@gmail.com", "rasamallaganesh71@gmail.com"];
const STRANGER = "attacker@example.com";

let failed = false;
const fail = (m) => {
  console.log(`  FAIL ${m}`);
  failed = true;
};
const ok = (m) => console.log(`  ok   ${m}`);

const sql = readFileSync(SCHEMA, "utf-8");
const db = new PGlite();

/**
 * Split a script into individual statements.
 *
 * Comments are stripped first so a semicolon inside a comment cannot split a
 * statement, and nothing in schema.sql uses dollar quoting, so splitting on a
 * bare semicolon is safe. Running them one at a time means a failure names the
 * exact statement instead of a byte offset.
 */
function statements(script) {
  return script
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
}

// --- Stub the Supabase builtins the file depends on -------------------------
const STUBS = [
  `create schema if not exists auth`,
  `create table if not exists auth.current_jwt (jwt jsonb)`,
  `insert into auth.current_jwt values ('{}'::jsonb)`,
  // Single-quoted body, not dollar-quoted: the WASM simple-query parser splits
  // on dollar-quote boundaries and mis-handles $$ here.
  `create or replace function auth.jwt() returns jsonb language sql stable as 'select jwt from auth.current_jwt'`,
  `create schema if not exists storage`,
  `create table if not exists storage.buckets (id text primary key, name text, public boolean default false)`,
  `create table if not exists storage.objects (id text primary key default 'obj-'||md5(random()::text), bucket_id text, name text)`,
  `do $$ begin if not exists (select 1 from pg_roles where rolname='authenticated') then create role authenticated; end if; end $$;`,
  `do $$ begin if not exists (select 1 from pg_roles where rolname='anon') then create role anon; end if; end $$;`,
];

for (const stmt of STUBS) {
  try {
    await db.exec(stmt);
  } catch (error) {
    console.log(`  STUB FAILED: ${stmt.slice(0, 60)}...\n  ${error.message}`);
    process.exit(1);
  }
}

async function actAs(email) {
  await db.exec(
    `update auth.current_jwt set jwt = ${email === null ? "'{}'" : `'{"email":"${email}"}'`}::jsonb;`,
  );
}

/**
 * Run a statement as a non-superuser role, the way PostgREST does.
 *
 * Two things make this a valid test rather than a false pass:
 *
 *  1. Session-level `set role`, not `set local role`. `set local` is scoped to
 *     a transaction, and each PGlite query runs in its own implicit
 *     transaction, so `set local` would be discarded and every query would run
 *     as superuser - which bypasses RLS entirely and passes everything.
 *  2. The roles are granted table privileges first. Without GRANT the query
 *     fails on privilege rather than on policy, so every assertion would read
 *     as "blocked" even if the policies were meaningless.
 */
async function asRole(role, sqlText) {
  await db.exec(`set role ${role}`);
  try {
    return { ok: true, result: await db.query(sqlText) };
  } catch (error) {
    return { ok: false, error };
  } finally {
    await db.exec("reset role");
  }
}

// --- Run the real file -------------------------------------------------------
console.log("\nRunning supabase/schema.sql against real Postgres...");
for (const stmt of statements(sql)) {
  try {
    await db.exec(stmt);
  } catch (error) {
    fail(`execution failed on: ${stmt.slice(0, 90).replace(/\s+/g, " ")}...`);
    console.log(`  postgres said: ${error.message}`);
    await db.close();
    process.exit(1);
  }
}
ok(`all ${statements(sql).length} statements executed with no syntax errors`);

// Roles need table privileges before RLS can be exercised at all. Supabase
// grants these to `authenticated` and `anon` by default; a throwaway database
// does not, so without this every query would be refused on privilege rather
// than on policy and the checks below would pass for the wrong reason.
for (const grant of [
  "grant usage on schema public to authenticated, anon",
  // Supabase grants these too. Without USAGE on `auth`, evaluating auth.jwt()
  // inside a policy errors, which would look identical to "blocked" and hide
  // whether the allowlist itself works.
  "grant usage on schema auth, storage to authenticated, anon",
  "grant select on auth.current_jwt to authenticated, anon",
  "grant execute on function auth.jwt() to authenticated, anon",
  "grant select, insert, update on public.site_content to authenticated",
  "grant select on storage.objects to anon",
  "grant select, insert, delete on storage.objects to authenticated",
]) {
  await db.exec(grant);
}

// --- Did every policy get created? ------------------------------------------
console.log("\nPolicies created:");
const policies = await db.query(`
  select policyname, tablename, cmd from pg_policies
  where schemaname in ('public','storage')
  order by tablename, policyname;
`);
for (const row of policies.rows) {
  console.log(`  ${row.tablename}.${row.policyname} (${row.cmd})`);
}

const expected = [
  "site_content:owners read content",
  "site_content:owners update content",
  "site_content:owners write content",
  "objects:owners delete gallery",
  "objects:owners upload gallery",
];
const actual = policies.rows.map(
  (r) => `${r.tablename}:${r.policyname}`,
);
for (const name of expected) {
  if (!actual.includes(name)) fail(`missing policy ${name}`);
}
if (expected.length === actual.length) ok("all 5 policies present");

// --- Does the allowlist actually gate access? --------------------------------
console.log("\nContent table access:");

await actAs(null);
const anonSelect = await asRole("anon", "select * from public.site_content;");
if (anonSelect.ok && anonSelect.result.rows.length > 0) {
  fail("anonymous visitor could read site_content");
} else ok("anonymous visitor blocked");

await actAs(STRANGER);
const strangerSelect = await asRole("authenticated", "select * from public.site_content;");
if (strangerSelect.ok && strangerSelect.result.rows.length > 0) {
  fail("non-owner account could read site_content");
} else ok("non-owner account blocked");

for (const owner of OWNERS) {
  await actAs(owner);
  const read = await asRole("authenticated", "select * from public.site_content;");
  if (!read.ok || read.result.rows.length === 0) {
    fail(`owner ${owner} could not read site_content`);
  } else ok(`owner ${owner} can read`);

  const write = await asRole(
    "authenticated",
    `insert into public.site_content (id, content) values ('t-${owner}', '{"offerTitle":"x"}'::jsonb);`,
  );
  if (!write.ok) fail(`owner ${owner} could not write: ${write.error?.message}`);
  else ok(`owner ${owner} can write`);
}

await actAs(STRANGER);
const strangerWrite = await asRole(
  "authenticated",
  `insert into public.site_content (id, content) values ('evil','{}'::jsonb);`,
);
if (strangerWrite.ok) fail("non-owner account could WRITE site_content");
else ok("non-owner write blocked");

// --- Gallery bucket ----------------------------------------------------------
console.log("\nGallery storage access:");

await actAs(STRANGER);
const strangerUpload = await asRole(
  "authenticated",
  `insert into storage.objects (bucket_id, name) values ('gallery','evil.png');`,
);
if (strangerUpload.ok) fail("non-owner could upload to the gallery");
else ok("non-owner upload blocked");

await actAs(OWNERS[1]);
const ownerUpload = await asRole(
  "authenticated",
  `insert into storage.objects (bucket_id, name) values ('gallery','good.png');`,
);
if (!ownerUpload.ok) fail(`owner could not upload: ${ownerUpload.error?.message}`);
else ok("owner can upload");

// A DELETE filtered by a USING clause succeeds while matching zero rows - it
// does not raise. So success is not the signal here; whether the row survived
// is. Asserting on the error code alone would read this correct behaviour as a
// security failure.
const strangerDelete = await asRole(
  "authenticated",
  `delete from storage.objects where name='good.png';`,
);
if (!strangerDelete.ok) {
  fail(`non-owner delete errored instead of being filtered: ${strangerDelete.error?.message}`);
} else {
  const survivor = await db.query(
    `select name from storage.objects where name='good.png';`,
  );
  if (survivor.rows.length === 0) fail("non-owner actually deleted a gallery object");
  else ok("non-owner delete blocked - the object survived");
}

const bucket = await db.query(`select id, public from storage.buckets where id='gallery';`);
if (!bucket.rows.length) fail("gallery bucket was not created");
else if (bucket.rows[0].public !== true) fail("gallery bucket is not public - visitors could not load images");
else ok("gallery bucket exists and is public for reading");

await db.close();

console.log(
  failed
    ? "\nRESULT: schema.sql FAILED verification"
    : "\nRESULT: schema.sql runs cleanly and the policies enforce the allowlist",
);
process.exit(failed ? 1 : 0);