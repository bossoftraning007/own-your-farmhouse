import { describe, expect, it } from "vitest";
import { buildLeadMessage, emptyLeadFields } from "../lib/lead";

describe("buildLeadMessage", () => {
  it("includes name, phone and interest", () => {
    const message = buildLeadMessage({
      name: "Ramesh Kumar",
      phone: "9505903371",
      email: "",
      purpose: "1BHK Farmhouse",
      message: "",
    });

    expect(message).toContain("Name: Ramesh Kumar");
    expect(message).toContain("Phone: 9505903371");
    expect(message).toContain("Interested in: 1BHK Farmhouse");
    expect(message).not.toContain("Email:");
    expect(message).not.toContain("Notes:");
  });

  it("includes email and notes only when supplied", () => {
    const message = buildLeadMessage({
      ...emptyLeadFields,
      name: "Priya",
      phone: "9849754071",
      email: "priya@example.com",
      purpose: "Site visit",
      message: "Looking at 2BHK",
    });

    expect(message).toContain("Email: priya@example.com");
    expect(message).toContain("Notes: Looking at 2BHK");
  });

  it("leaves no stray blank lines when optional fields are empty", () => {
    const message = buildLeadMessage({
      ...emptyLeadFields,
      name: "Ramesh",
      phone: "9505903371",
    });

    // .filter(Boolean) drops the empty optional lines, so a message with no
    // optional fields has no blank lines to render as gaps in WhatsApp.
    expect(message.split("\n").filter((l) => l.trim() === "")).toHaveLength(0);
    expect(message).toBe(
      "New enquiry from the website\nName: Ramesh\nPhone: 9505903371\nInterested in: 1BHK Farmhouse",
    );
  });

  it("survives url-encoding, so the wa.me link is valid", () => {
    const message = buildLeadMessage({
      ...emptyLeadFields,
      name: "Ramesh & Sons",
      phone: "9505903371",
      message: "Budget ₹21–24L, please call",
    });

    const encoded = encodeURIComponent(message);
    expect(encoded).not.toContain("₹");
    expect(decodeURIComponent(encoded)).toBe(message);
  });
});