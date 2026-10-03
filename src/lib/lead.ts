/**
 * Lead message construction.
 *
 * The prefilled WhatsApp text is used in two places - the automatic popup and
 * the fallback link the visitor taps if the popup was blocked - so it is built
 * once, here, and both paths share it. They cannot drift apart.
 */

export interface LeadFields {
  name: string;
  phone: string;
  email: string;
  purpose: string;
  message: string;
}

export const emptyLeadFields: LeadFields = {
  name: "",
  phone: "",
  email: "",
  purpose: "1BHK Farmhouse",
  message: "",
};

/** The enquiry text the sales team receives in WhatsApp. */
export function buildLeadMessage(fields: LeadFields): string {
  return [
    "New enquiry from the website",
    "",
    `Name: ${fields.name}`,
    `Phone: ${fields.phone}`,
    fields.email ? `Email: ${fields.email}` : "",
    `Interested in: ${fields.purpose}`,
    fields.message ? `Notes: ${fields.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}