import type { SiteContentOverrides } from "./types";
import { EMPTY_SITE_CONTENT } from "./types";

export async function fetchSiteContentOverrides(): Promise<SiteContentOverrides> {
  try {
    const res = await fetch("/api/site/content", { next: { revalidate: 60 } });
    if (!res.ok) return EMPTY_SITE_CONTENT;
    return (await res.json()) as SiteContentOverrides;
  } catch {
    return EMPTY_SITE_CONTENT;
  }
}

export async function fetchSiteContentOverridesClient(): Promise<SiteContentOverrides> {
  try {
    const res = await fetch("/api/site/content");
    if (!res.ok) return EMPTY_SITE_CONTENT;
    return (await res.json()) as SiteContentOverrides;
  } catch {
    return EMPTY_SITE_CONTENT;
  }
}
