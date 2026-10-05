import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Static guardrails for supabase/schema.sql.
 *
 * The first version of this file shipped a policy whose USING clause closed its
 * parentheses after `auth.jwt() ->> 'email'`, leaving `in (...)` outside the
 * clause. It looked correct and PostgreSQL rejected it at run time with
 * "syntax error at or near in" - so the dashboard could not be set up until it
 * was caught by hand.
 *
 * These checks are deliberately cheap and need no database, so they run in the
 * ordinary test suite. scripts/verify-schema.mjs does the real thing against a
 * live Postgres and is wired into `npm run check`; this file is the fast net.
 */
const SCHEMA = readFileSync(
  path.join(process.cwd(), "supabase", "schema.sql"),
  "utf-8",
);

/** Strip `--` comments so commented-out SQL cannot affect the checks. */
function code(sql: string): string {
  return sql
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");
}

describe("supabase schema", () => {
  it("closes every USING and WITH CHECK clause before the statement ends", () => {
    // The bug this guards: `using (auth.jwt() ->> 'email') in (...)` closes the
    // clause's parentheses after the first term, so `in (...)` is left dangling
    // and PostgreSQL fails with "syntax error at or near in".
    //
    // Note the total paren count still balances in the broken version, so a
    // simple balance check passes it. What distinguishes the two is what comes
    // AFTER the clause's closing paren: a further clause, the statement
    // terminator, or nothing - and never more expression.
    const sql = code(SCHEMA);
    const offenders: string[] = [];

    for (const clause of ["using", "with check"]) {
      let index = sql.indexOf(clause);
      while (index !== -1) {
        const open = sql.indexOf("(", index + clause.length);
        if (open === -1) break;

        // Scan to the paren that closes this clause.
        let depth = 0;
        let close = -1;
        for (let i = open; i < sql.length; i++) {
          if (sql[i] === "(") depth++;
          else if (sql[i] === ")") {
            depth--;
            if (depth === 0) {
              close = i;
              break;
            }
          }
        }

        if (close === -1) {
          offenders.push(`${clause}: never closed`);
        } else {
          const trailing = sql.slice(close + 1).trimStart();
          const allowed =
            trailing === "" ||
            trailing.startsWith(";") ||
            /^with\s+check\b/i.test(trailing) ||
            /^using\b/i.test(trailing);
          if (!allowed) {
            offenders.push(
              `${clause}: ${sql
                .slice(index, close + 30)
                .replace(/\s+/g, " ")
                .trim()}...`,
            );
          }
        }

        index = sql.indexOf(clause, index + clause.length);
      }
    }

    expect(offenders).toEqual([]);
  });

  it("keeps the owner allowlist identical everywhere it appears", () => {
    const emails = [...SCHEMA.matchAll(/[\w.+-]+@[\w.-]+\.\w+/g)].map(
      (match) => match[0],
    );
    const unique = [...new Set(emails)].sort();

    // Every address in the schema must be one of the two owners, and both must
    // appear. A typo in one policy silently locks an owner out of editing.
    expect(unique).toEqual([
      "premcharantejtej@gmail.com",
      "rasamallaganesh71@gmail.com",
    ]);
    expect(emails.length).toBeGreaterThanOrEqual(6);
  });

  it("matches the allowlist used by the application", () => {
    // The UI allowlist and the database policies must agree, or an owner sees a
    // sign-in form that the database then refuses.
    const config = readFileSync(
      path.join(process.cwd(), "src", "admin", "config.ts"),
      "utf-8",
    );
    for (const email of [
      "premcharantejtej@gmail.com",
      "rasamallaganesh71@gmail.com",
    ]) {
      expect(SCHEMA).toContain(email);
      expect(config).toContain(email);
    }
  });

  it("enables row level security on every table it creates policies for", () => {
    // A policy on a table without RLS is stored but never evaluated, so the
    // table stays open to every signed-in account with no error anywhere.
    // site_content is covered by its own DDL; storage.objects relies on a
    // Supabase default, so the file now states it explicitly.
    expect(code(SCHEMA)).toMatch(
      /alter table public\.site_content enable row level security/,
    );
    expect(code(SCHEMA)).toMatch(
      /alter table storage\.objects enable row level security/,
    );
  });

  it("never disables or bypasses RLS", () => {
    expect(code(SCHEMA)).not.toMatch(/disable row level security/i);
    expect(code(SCHEMA)).not.toMatch(/bypassrls/i);
  });
});