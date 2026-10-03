/**
 * What the dashboard is allowed to edit, and how stored overrides are merged
 * over the values in code.
 *
 * Code stays the source of truth for defaults. The database only holds
 * overrides, so a bad edit can be reverted by clearing a field, and the site
 * still renders correctly with the database completely empty or unreachable.
 */
import { currentOffer, trustBadges } from "../data";

export interface ContentOverrides {
  /** Dashed campaign headline, e.g. "Dussehra Special Price". */
  offerTitle?: string;
  /** Short line under the offer. */
  offerNote?: string;
  /** One line per perk. Replaces the whole list when present. */
  offerPerks?: string[];
  /** Numeric label, e.g. "500+". */
  trustCustomers?: string;
  /** Text label beside it. */
  trustLabel?: string;
}

export interface ContentState extends ContentOverrides {
  offerTitle: string;
  offerNote: string;
  offerPerks: string[];
  trustCustomers: string;
  trustLabel: string;
}

/**
 * Defaults taken from the code, so the dashboard always has something real to
 * show even before anyone has saved an edit.
 */
export function defaultContent(): ContentState {
  return {
    offerTitle: currentOffer.title,
    offerNote: currentOffer.note,
    offerPerks: [...currentOffer.perks],
    trustCustomers: trustBadges[0].value,
    trustLabel: trustBadges[0].label,
  };
}

/**
 * Merge stored overrides over the defaults, field by field.
 *
 * Each field is validated on the way through. This runs against data a browser
 * can edit, so a malformed or hostile row must not be able to crash the public
 * site - an empty perk list would render nothing, and a non-string would throw
 * during render.
 */
export function mergeContent(stored: unknown): ContentState {
  const base = defaultContent();
  if (!stored || typeof stored !== "object") return base;

  const row = stored as Record<string, unknown>;
  const text = (value: unknown, fallback: string): string =>
    typeof value === "string" && value.trim() ? value.trim() : fallback;

  const perks =
    Array.isArray(row.offerPerks) &&
    row.offerPerks.filter((p): p is string => typeof p === "string" && p.trim().length > 0)
      .length > 0
      ? (row.offerPerks as string[])
          .filter((p): p is string => typeof p === "string" && p.trim().length > 0)
          .map((p) => p.trim())
      : base.offerPerks;

  return {
    offerTitle: text(row.offerTitle, base.offerTitle),
    offerNote: text(row.offerNote, base.offerNote),
    offerPerks: perks,
    trustCustomers: text(row.trustCustomers, base.trustCustomers),
    trustLabel: text(row.trustLabel, base.trustLabel),
  };
}

/** The row shape stored in Supabase. */
export interface ContentRow {
  id: string;
  content: ContentOverrides;
  updated_at: string;
  updated_by: string | null;
}

/**
 * The price is deliberately absent from ContentOverrides. It is duplicated into
 * poster pixels and JSON-LD, so an edit made only in the database would
 * contradict both. It stays in src/config/site.ts where one change covers
 * everything.
 */