/**
 * End-to-end analytics check in a REAL browser (not jsdom).
 *
 * jsdom + vi.stubEnv can only prove the code does the right thing given a
 * value. This loads the actual deployed site and reports what really happens:
 * the console output, the gtag script tag, and every Google Analytics request
 * the page makes.
 *
 * Usage: node scripts/check-analytics.mjs [url]
 */
import puppeteer from "puppeteer";

const URL = process.argv[2] || "https://myfarmhouse.vercel.app";

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const page = await browser.newPage();

// Default UA includes "HeadlessChrome", which GA4 filters out of reports.
// Spoof a normal desktop UA so the hit counts the way a real visit would.
await page.setUserAgent(
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
);
await page.setViewport({ width: 1280, height: 900 });

const consoleLines = [];
const pageErrors = [];
const failedRequests = [];
const gaRequests = [];
const allRequests = [];

page.on("console", (msg) => {
  consoleLines.push(`[${msg.type()}] ${msg.text()}`);
});
page.on("pageerror", (err) => pageErrors.push(String(err)));
page.on("request", (req) => {
  const url = req.url();
  allRequests.push(url);
  if (/googletagmanager\.com|google-analytics\.com|analytics\.google/.test(url)) {
    gaRequests.push({ method: req.method(), url: url.slice(0, 200) });
  }
});
page.on("requestfailed", (req) => {
  failedRequests.push({
    url: req.url().slice(0, 160),
    reason: req.failure()?.errorText,
  });
});
page.on("response", (res) => {
  const url = res.url();
  if (/googletagmanager\.com|google-analytics\.com/.test(url)) {
    gaRequests[gaRequests.length - 1] = {
      method: res.request().method(),
      url: url.slice(0, 200),
      status: res.status(),
    };
  }
});

const response = await page.goto(URL, {
  waitUntil: "networkidle2",
  timeout: 60000,
});

console.log("=".repeat(70));
console.log("URL            :", URL);
console.log("HTTP status    :", response?.status());
console.log("=".repeat(70));

// Give gtag.js time to finish loading and dispatch collect.
await new Promise((r) => setTimeout(r, 4000));

const analyticsLogs = consoleLines.filter((l) => l.includes("[analytics]"));

console.log("\n--- console: [analytics] lines ---");
if (analyticsLogs.length === 0) {
  console.log("  (none) <-- initAnalytics never ran");
} else {
  analyticsLogs.forEach((l) => console.log("  " + l));
}

console.log("\n--- all console output ---");
consoleLines.forEach((l) => console.log("  " + l));

console.log("\n--- did the app render? ---");
const rendered = await page.evaluate(() => {
  const root = document.getElementById("root");
  return {
    rootChildCount: root?.children.length ?? 0,
    h1: document.querySelector("h1")?.textContent?.trim() ?? null,
    leadFormPresent: document.body.innerText.includes("Request a Callback"),
    stickyBarPresent: document.body.innerText.includes("WhatsApp"),
  };
});
console.log(" ", JSON.stringify(rendered, null, 2).replace(/\n/g, "\n  "));

console.log("\n--- gtag script tag in DOM ---");
const scriptTag = await page.evaluate(() => {
  const el = document.querySelector(
    'script[src*="googletagmanager.com/gtag/js"]',
  );
  return el ? { src: el.src, async: el.async } : null;
});
console.log(" ", JSON.stringify(scriptTag));

console.log("\n--- window.gtag / dataLayer state ---");
const gtagState = await page.evaluate(() => {
  const dl = window.dataLayer || [];
  return {
    gtagIsFunction: typeof window.gtag === "function",
    dataLayerLength: dl.length,
    commands: dl.map((e) => (Array.isArray(e) ? e[0] : e?.event ?? typeof e)),
  };
});
console.log(" ", JSON.stringify(gtagState, null, 2).replace(/\n/g, "\n  "));

console.log("\n--- Google Analytics network requests ---");
if (gaRequests.length === 0) {
  console.log("  (none) <-- gtag.js never requested");
} else {
  gaRequests.forEach((r) =>
    console.log(`  ${r.status ?? "?"} ${r.method} ${r.url}`),
  );
}

console.log("\n--- failed requests (all origins) ---");
if (failedRequests.length === 0) {
  console.log("  (none)");
} else {
  failedRequests.forEach((r) => console.log(`  ${r.reason} ${r.url}`));
}

console.log("\n--- page errors ---");
console.log(pageErrors.length === 0 ? "  (none)" : pageErrors.join("\n"));

console.log("\n--- total requests:", allRequests.length, "---");

await browser.close();