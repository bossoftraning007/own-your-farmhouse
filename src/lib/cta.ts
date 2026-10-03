/**
 * Copy shared by every enquiry CTA on the site.
 *
 * Keeping this in one place means a visitor always receives the same
 * well-formed message with the property, price and location filled in, which
 * means the reply lands in WhatsApp already readable.
 */
import { price } from "../config/site";

export function enquiryMessage(propertyName = "1BHK Farmhouse"): string {
  return [
    "Hello Bright Properties, I am interested in Green Orchid Farm Land.",
    "",
    `Property: ${propertyName}`,
    `Price range: ${price.onwards}`,
    "Location: Kothur, near JP Dargah, NH-44",
    "",
    "Please share availability, site visit timings and payment details.",
  ].join("\n");
}