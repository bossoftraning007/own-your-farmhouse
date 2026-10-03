import { price, SITE_URL } from "../config/site";

export const SHARE_URL = SITE_URL;

/** WhatsApp share link with a prefilled message. */
export function whatsappShare(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export const posterShareMessage = [
  "Weekend Houses at Green Orchid Farm Land! 🏡",
  "",
  `💰 ${price.headline}`,
  "📍 Near Kothur, JP Dargah, Bangalore Highway NH-44",
  "🌿 Gated · Swimming pool · Club house",
  "✈️ 15 mins from Shamshabad Airport",
  "",
  `View details: ${SHARE_URL}`,
].join("\n");

export const siteShareMessage = [
  "Check out this farmhouse! 🏡",
  "",
  `🌿 Green Orchid Farm Land, Kothur`,
  `💰 ${price.headline} · Gated community`,
  "🏊 Swimming pool · 🏛️ Club house · 🔒 Gated community",
  "",
  `View details: ${SHARE_URL}`,
].join("\n");

/** Copy helper with a clipboard fallback for non-secure contexts. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path below
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

/** Native share sheet on mobile, clipboard everywhere else. */
export async function shareOrCopy(
  url: string,
  title: string,
  text: string,
): Promise<"shared" | "copied" | "failed"> {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return "shared";
    } catch (error) {
      // AbortError means the user dismissed the sheet - not a failure.
      if (error instanceof DOMException && error.name === "AbortError") {
        return "shared";
      }
    }
  }
  return (await copyToClipboard(url)) ? "copied" : "failed";
}