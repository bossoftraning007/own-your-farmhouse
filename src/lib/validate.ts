/**
 * Client-side validation for the lead form.
 *
 * Lives outside the component file so the form stays a pure component export
 * (React Fast Refresh requirement) and the rules can be unit tested directly.
 */

/** Indian mobile: 10 digits starting 6-9, tolerant of spaces, dashes and +91. */
export function isValidIndianPhone(value: string): boolean {
  const digits = value.replace(/[\s\-()]/g, "").replace(/^(\+?91)/, "");
  return /^[6-9]\d{9}$/.test(digits);
}

/** Deliberately permissive - empty is allowed, malformed is not. */
export function isValidEmail(value: string): boolean {
  if (value.trim() === "") return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}