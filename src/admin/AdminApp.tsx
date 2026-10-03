/**
 * Admin dashboard.
 *
 * Reached at /#/admin. Split into three panels that map to what the owners
 * actually need to do between site visits: send a campaign, change the words on
 * the page, and add photos.
 */
import { useEffect, useState } from "react";
import { campaigns, galleryImages, properties } from "../data";
import { price } from "../config/site";
import { ALLOWED_EMAILS, CONTENT_ROW_ID, GALLERY_BUCKET } from "./config";
import { getSupabase } from "./supabase";
import { useAuth } from "./useAuth";
import {
  defaultContent,
  mergeContent,
  type ContentState,
} from "./content";

export function AdminApp() {
  const { status, email, signIn, signOut } = useAuth();

  if (status === "unconfigured") return <NotConfigured />;
  if (status === "loading") return <Shell title="Admin"><p className="text-slate-400">Checking your session…</p></Shell>;
  if (status === "signed-out") return <SignIn onSignIn={signIn} />;
  if (status === "not-allowed") {
    return (
      <Shell title="Admin">
        <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-5">
          <h2 className="text-lg font-bold text-red-300 mb-2">Not allowed</h2>
          <p className="text-slate-300 text-sm">
            <span className="font-mono">{email}</span> is signed in but is not on
            the allowlist. Only these accounts may edit the site:
          </p>
          <ul className="mt-3 space-y-1">
            {ALLOWED_EMAILS.map((allowed) => (
              <li key={allowed} className="font-mono text-emerald-300 text-sm">
                {allowed}
              </li>
            ))}
          </ul>
          <button
            onClick={signOut}
            className="mt-5 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Sign out
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell title="Admin" email={email} onSignOut={signOut}>
      <CampaignsPanel />
      <ContentPanel />
      <UploadsPanel />
    </Shell>
  );
}

function Shell({
  title,
  email,
  onSignOut,
  children,
}: {
  title: string;
  email?: string | null;
  onSignOut?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <h1 className="text-2xl font-bold">
            📸 <span className="text-emerald-400">{title}</span>
          </h1>
          <div className="flex items-center gap-3">
            {email && <span className="text-slate-400 text-xs">{email}</span>}
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="bg-slate-800 hover:bg-slate-700 text-sm px-3 py-1.5 rounded-lg"
              >
                Sign out
              </button>
            )}
            <a
              href={window.location.origin}
              className="bg-slate-800 hover:bg-slate-700 text-sm px-3 py-1.5 rounded-lg"
            >
              View site
            </a>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}

function NotConfigured() {
  return (
    <Shell title="Admin">
      <div className="bg-amber-500/10 border border-amber-400/40 rounded-xl p-6">
        <h2 className="text-lg font-bold text-amber-300 mb-3">
          Supabase is not connected yet
        </h2>
        <p className="text-slate-300 text-sm mb-4">
          The dashboard needs two values before it can sign anyone in. The
          website itself is unaffected and works normally without them.
        </p>
        <ol className="list-decimal list-inside text-slate-300 text-sm space-y-2">
          <li>
            Create a free project at{" "}
            <span className="font-mono text-emerald-300">supabase.com</span>
          </li>
          <li>
            Run <span className="font-mono">supabase/schema.sql</span> in its SQL
            editor
          </li>
          <li>
            Copy <span className="font-mono">.env.example</span> to{" "}
            <span className="font-mono">.env.local</span> and fill in{" "}
            <span className="font-mono">VITE_SUPABASE_URL</span> and{" "}
            <span className="font-mono">VITE_SUPABASE_ANON_KEY</span>
          </li>
          <li>Redeploy</li>
        </ol>
      </div>
    </Shell>
  );
}

function SignIn({ onSignIn }: { onSignIn: (email: string) => Promise<void> }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await onSignIn(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the link");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell title="Admin">
      <form onSubmit={submit} className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md">
        <h2 className="text-lg font-bold mb-2">Sign in</h2>
        <p className="text-slate-400 text-sm mb-4">
          We will email you a one-time sign-in link. There is no password to
          remember or leak.
        </p>

        {sent ? (
          <p className="text-emerald-300 text-sm">
            Check {email} for the sign-in link.
          </p>
        ) : (
          <>
            <label htmlFor="admin-email" className="block text-sm text-slate-300 mb-1">
              Email address
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gmail.com"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm mb-3"
            />
            {error && <p className="text-red-300 text-sm mb-3">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg"
            >
              {busy ? "Sending…" : "Email me a sign-in link"}
            </button>
          </>
        )}

        <p className="text-slate-500 text-xs mt-5">
          Allowed accounts: {ALLOWED_EMAILS.join(", ")}
        </p>
      </form>
    </Shell>
  );
}

/**
 * Campaign broadcasts and poster downloads.
 *
 * This is the "Our Campaigns" section that used to sit on the public homepage.
 * It is sales collateral for the owners, not something visitors need.
 */
function CampaignsPanel() {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(id: string, body: string) {
    try {
      await navigator.clipboard.writeText(body);
    } catch {
      // Clipboard needs a secure context; fall back to a manual selection.
      const area = document.createElement("textarea");
      area.value = body;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(id);
    window.setTimeout(() => setCopied(null), 2000);
  }

  const posters = [
    { full: "/generated/farmhouse.webp", jpeg: "/generated/farmhouse.jpg", name: "green-orchid-farmhouse.jpg" },
    { full: "/generated/weekend-houses.webp", jpeg: "/generated/weekend-houses.jpg", name: "green-orchid-weekend-houses.jpg" },
  ];

  return (
    <Panel title="📸 Our Campaigns">
      <p className="text-slate-400 text-sm mb-5">
        Ready-to-send WhatsApp broadcasts. Copy one, paste it into a broadcast
        list, done.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
            <h3 className="font-semibold text-sm mb-2">{campaign.label}</h3>
            <pre className="text-slate-300 text-xs whitespace-pre-wrap font-sans bg-slate-900 rounded-lg p-3 mb-3 max-h-56 overflow-auto">
              {campaign.body}
            </pre>
            <button
              onClick={() => copy(campaign.id, campaign.body)}
              className="bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold px-4 py-2 rounded-lg"
            >
              {copied === campaign.id ? "Copied ✓" : "Copy message"}
            </button>
          </div>
        ))}
      </div>

      <h3 className="font-semibold text-sm mb-3">
        Download &amp; Share These Posters
      </h3>
      <p className="text-slate-400 text-xs mb-4">
        High resolution posters ready for WhatsApp, Instagram and print.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {posters.map((poster) => (
          <a
            key={poster.name}
            href={poster.jpeg}
            download={poster.name}
            className="block bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-colors"
          >
            <img src={poster.full} alt={poster.name} className="w-full" />
            <span className="block text-center text-sm py-2.5">
              ⬇️ Download {poster.name}
            </span>
          </a>
        ))}
      </div>
    </Panel>
  );
}

function ContentPanel() {
  const [content, setContent] = useState<ContentState>(defaultContent);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Guarded by `active` so a slow response cannot set state after the panel
    // is unmounted when the owner navigates away mid-request.
    let active = true;

    void (async () => {
      try {
        const supabase = await getSupabase();
        const { data, error } = await supabase
          .from("site_content")
          .select("content")
          .eq("id", CONTENT_ROW_ID)
          .maybeSingle();
        if (error) throw error;
        if (active && data?.content) setContent(mergeContent(data.content));
      } catch (err) {
        if (active) {
          setStatus(
            `Could not load saved content: ${err instanceof Error ? err.message : "unknown error"}`,
          );
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const supabase = await getSupabase();
      const payload = {
        offerTitle: content.offerTitle,
        offerNote: content.offerNote,
        offerPerks: content.offerPerks,
        trustCustomers: content.trustCustomers,
        trustLabel: content.trustLabel,
      };
      const { error } = await supabase.from("site_content").upsert({
        id: CONTENT_ROW_ID,
        content: payload,
        updated_by: (await supabase.auth.getUser()).data.user?.email ?? null,
      });
      if (error) throw error;
      setStatus("Saved. The website picks this up on its next load.");
    } catch (err) {
      setStatus(
        `Could not save: ${err instanceof Error ? err.message : "unknown error"}`,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel title="✏️ Edit Words On The Page">
      <form onSubmit={save}>
        <Field label="Offer title">
          <input
            value={content.offerTitle}
            onChange={(e) => setContent({ ...content, offerTitle: e.target.value })}
            className={inputClass}
          />
        </Field>

        <Field label="Offer perks (one per line)">
          <textarea
            rows={4}
            value={content.offerPerks.join("\n")}
            onChange={(e) =>
              setContent({
                ...content,
                offerPerks: e.target.value.split("\n").filter((l) => l.trim()),
              })
            }
            className={inputClass}
          />
        </Field>

        <Field label="Offer note">
          <textarea
            rows={2}
            value={content.offerNote}
            onChange={(e) => setContent({ ...content, offerNote: e.target.value })}
            className={inputClass}
          />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Customers served (e.g. 500+)">
            <input
              value={content.trustCustomers}
              onChange={(e) =>
                setContent({ ...content, trustCustomers: e.target.value })
              }
              className={inputClass}
            />
          </Field>
          <Field label="That number's label">
            <input
              value={content.trustLabel}
              onChange={(e) => setContent({ ...content, trustLabel: e.target.value })}
              className={inputClass}
            />
          </Field>
        </div>

        <p className="text-amber-300/90 text-xs mb-4">
          The price ({price.display}) is not editable here. It also appears in
          the posters and in Google results, so it is changed in one place in
          the code and regenerated everywhere.
        </p>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={busy}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-lg"
          >
            {busy ? "Saving…" : "Save changes"}
          </button>
          {status && <span className="text-slate-400 text-xs">{status}</span>}
        </div>
      </form>
    </Panel>
  );
}

function UploadsPanel() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploaded, setUploaded] = useState<string[]>([]);

  async function upload(event: React.FormEvent) {
    event.preventDefault();
    if (files.length === 0) return;
    setBusy(true);
    setStatus(null);

    try {
      const supabase = await getSupabase();
      const done: string[] = [];

      for (const file of files) {
        // Prefix with a timestamp so re-uploading the same filename does not
        // collide with, or silently overwrite, the earlier copy.
        const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        const path = `${Date.now()}-${safe}`;
        const { error } = await supabase.storage
          .from(GALLERY_BUCKET)
          .upload(path, file, { cacheControl: "3600", upsert: true });
        if (error) throw error;
        done.push(path);
      }

      setUploaded(done);
      setStatus(
        `Uploaded ${done.length} image${done.length === 1 ? "" : "s"}. They appear in the gallery once added to the gallery list in code — send the file names and they will be added.`,
      );
      setFiles([]);
    } catch (err) {
      setStatus(
        `Upload failed: ${err instanceof Error ? err.message : "unknown error"}`,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel title="🖼️ Add Photos">
      <form onSubmit={upload}>
        <label
          htmlFor="gallery-upload"
          className="block border-2 border-dashed border-slate-600 hover:border-emerald-500/60 rounded-xl p-8 text-center cursor-pointer transition-colors"
        >
          <input
            id="gallery-upload"
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          />
          <p className="text-slate-300 text-sm">
            {files.length > 0
              ? `${files.length} file${files.length === 1 ? "" : "s"} ready`
              : "Click to choose photos"}
          </p>
          <p className="text-slate-500 text-xs mt-1">
            JPG or PNG. Landscape works best in the gallery.
          </p>
        </label>

        {uploaded.length > 0 && (
          <ul className="mt-4 space-y-1">
            {uploaded.map((path) => (
              <li key={path} className="font-mono text-xs text-slate-400">
                {path}
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-4 mt-4">
          <button
            type="submit"
            disabled={busy || files.length === 0}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-lg"
          >
            {busy ? "Uploading…" : "Upload"}
          </button>
          {status && <span className="text-slate-400 text-xs">{status}</span>}
        </div>
      </form>

      <p className="text-slate-500 text-xs mt-6">
        Currently on the site:{" "}
        {galleryImages.map((image) => image.label).join(" · ")} ·{" "}
        {properties.length} property photos
      </p>
    </Panel>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-slate-900 border border-slate-700 rounded-2xl p-6 mb-6">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-sm text-slate-300 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm";