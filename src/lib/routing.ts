/**
 * Hash-based routing.
 *
 * Deliberately not react-router: the site is a single static page with no
 * router today, and this is the only second route it needs. Using the URL hash
 * means /#/admin works on Vercel with no rewrite rule and no vercel.json, so
 * adding the dashboard cannot break the existing deployment.
 *
 * A path-based /admin route would 404 on a static host unless server rewrites
 * were added, which is a deploy-config change with real blast radius.
 */
import { useEffect, useState } from "react";

export const ADMIN_HASH = "#/admin";

export function isAdminRoute(): boolean {
  return window.location.hash.startsWith("#/admin");
}

export function useHashRoute(): string {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return hash;
}