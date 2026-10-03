import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminApp } from "../admin/AdminApp";
import { ALLOWED_EMAILS, isAllowedEmail } from "../admin/config";
import { defaultContent, mergeContent } from "../admin/content";
import { campaigns, currentOffer, trustBadges } from "../data";
import { price } from "../config/site";

/**
 * The dashboard is the one place a stranger could try to edit the site, so its
 * access rules are asserted here rather than trusted. These run without
 * Supabase configured, which is exactly the state a fresh clone is in.
 */
describe("admin allowlist", () => {
it("permits exactly the two owner accounts", () => {
    expect([...ALLOWED_EMAILS]).toEqual([
      "premcharantejtej@gmail.com",
      "rasamallaganesh07@gmail.com",
    ]);
  });

  it("accepts the owners regardless of case and stray whitespace", () => {
    for (const email of ALLOWED_EMAILS) {
      expect(isAllowedEmail(email)).toBe(true);
      expect(isAllowedEmail(`  ${email.toUpperCase()}  `)).toBe(true);
    }
  });

  it("rejects everyone else, including near misses", () => {
    for (const email of [
      undefined,
      null,
      "",
      "attacker@gmail.com",
      "premcharantejtej@gmail.com.evil.com",
      "xpremcharantejtej@gmail.com",
      "premcharantejtej@gmail.co",
      "admin@brightproperties.com",
    ]) {
      expect(isAllowedEmail(email)).toBe(false);
    }
  });
});

describe("admin access control", () => {
  it("never renders an editor before a session is confirmed", () => {
    // With Supabase unset the dashboard must show setup instructions only.
    // An editor reachable at this point would be an open door.
    render(<AdminApp />);
    expect(screen.getByText(/Supabase is not connected yet/i)).toBeTruthy();
    expect(screen.queryByText(/Save changes/i)).toBeNull();
    expect(screen.queryByText(/Add Photos/i)).toBeNull();
    expect(screen.queryByText(/Our Campaigns/i)).toBeNull();
  });
});

describe("editable content", () => {
  it("falls back to the code defaults when nothing is stored", () => {
    const merged = mergeContent(null);
    expect(merged.offerTitle).toBe(defaultContent().offerTitle);
    expect(merged.offerPerks).toEqual(defaultContent().offerPerks);
  });

  it("applies stored overrides field by field", () => {
    const merged = mergeContent({ offerTitle: "Ugadi Offer" });
    expect(merged.offerTitle).toBe("Ugadi Offer");
    expect(merged.offerNote).toBe(defaultContent().offerNote);
  });

  it("ignores malformed stored values instead of rendering them", () => {
    // The row is browser-editable data, so a bad shape must not crash the
    // public site or blank out the offer.
    const merged = mergeContent({
      offerTitle: 42,
      offerPerks: ["real perk", "", null, 7],
      offerNote: { nested: true },
    });
    expect(merged.offerTitle).toBe(defaultContent().offerTitle);
    expect(merged.offerNote).toBe(defaultContent().offerNote);
    expect(merged.offerPerks).toEqual(["real perk"]);
  });

  it("keeps the default perks when the stored list is entirely blank", () => {
    const merged = mergeContent({ offerPerks: ["", "   "] });
    expect(merged.offerPerks).toEqual(defaultContent().offerPerks);
  });

  it("never lets the database restate the price", () => {
    // Price is intentionally not an editable field: it also lives in poster
    // pixels and JSON-LD, so an override here would contradict both.
    const merged = mergeContent({ price: "₹1,00,000", numeric: 100000 });
    expect(JSON.stringify(merged)).not.toMatch(/1,00,000|100000/);
  });
});

describe("campaign broadcasts", () => {
  it("quotes the canonical price so a paste cannot contradict the site", () => {
    const dussehra = campaigns.find((c) => c.id === "dussehra");
    expect(dussehra?.body).toContain(price.display);
  });

  it("derives the headline price rather than retyping it", () => {
    const launch = campaigns.find((c) => c.id === "project-launch");
    expect(launch?.body).toContain(`${price.numeric / 100000} LAKHS`);
  });

  it("carries both contact numbers in the launch broadcast", () => {
    const launch = campaigns.find((c) => c.id === "project-launch");
    expect(launch?.body).toContain("9849754071");
    expect(launch?.body).toContain("9505903371");
  });

  it("states the 400 sq.ft built-up area in the offer", () => {
    const dussehra = campaigns.find((c) => c.id === "dussehra");
    expect(dussehra?.body).toContain("400 sq.ft");
    expect(currentOffer.perks.join(" ")).toContain("400 sq.ft");
  });

  it("shows the trust claims the owners asked for", () => {
    expect(trustBadges.map((b) => b.value)).toContain("500+");
  });
});