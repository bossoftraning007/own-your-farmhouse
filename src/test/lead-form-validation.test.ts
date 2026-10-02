import { describe, expect, it } from "vitest";
import { isValidEmail, isValidIndianPhone } from "../lib/validate";

describe("isValidIndianPhone", () => {
  it("accepts a plain 10-digit mobile number", () => {
    expect(isValidIndianPhone("9505903371")).toBe(true);
  });

  it("accepts spaced and dashed formats", () => {
    expect(isValidIndianPhone("95059 03371")).toBe(true);
    expect(isValidIndianPhone("95059-03371")).toBe(true);
  });

  it("accepts a +91 prefix", () => {
    expect(isValidIndianPhone("+919505903371")).toBe(true);
    expect(isValidIndianPhone("919505903371")).toBe(true);
  });

  it("rejects numbers that do not start 6-9", () => {
    expect(isValidIndianPhone("1234567890")).toBe(false);
    expect(isValidIndianPhone("5505903371")).toBe(false);
  });

  it("rejects wrong lengths", () => {
    expect(isValidIndianPhone("950590337")).toBe(false);
    expect(isValidIndianPhone("95059033712")).toBe(false);
    expect(isValidIndianPhone("")).toBe(false);
  });

  it("rejects non-digits", () => {
    expect(isValidIndianPhone("abcdefghij")).toBe(false);
  });
});

describe("isValidEmail", () => {
  it("accepts an empty value because email is optional", () => {
    expect(isValidEmail("")).toBe(true);
    expect(isValidEmail("   ")).toBe(true);
  });

  it("accepts a normal address", () => {
    expect(isValidEmail("ramesh@example.com")).toBe(true);
  });

  it("rejects malformed addresses", () => {
    expect(isValidEmail("ramesh")).toBe(false);
    expect(isValidEmail("ramesh@")).toBe(false);
    expect(isValidEmail("ramesh@example")).toBe(false);
    expect(isValidEmail("@example.com")).toBe(false);
  });
});