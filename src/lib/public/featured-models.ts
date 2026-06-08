import type { PublicFeaturedModel } from "@/types/public-model";

export function getFirstName(fullName: string): string {
  const trimmed = fullName.trim();
  if (!trimmed) return "";
  return trimmed.split(/\s+/)[0] ?? trimmed;
}

export async function fetchFeaturedModels(): Promise<
  { ok: true; data: PublicFeaturedModel[] } | { ok: false; message: string }
> {
  try {
    const res = await fetch("/api/public/featured-models");
    if (!res.ok) {
      let message = "Failed to load featured models";
      try {
        const body = await res.json();
        if (body?.message) message = String(body.message);
      } catch {
        /* ignore */
      }
      return { ok: false, message };
    }

    const data = (await res.json()) as PublicFeaturedModel[];
    return { ok: true, data: Array.isArray(data) ? data : [] };
  } catch {
    return { ok: false, message: "Unable to connect to the server." };
  }
}

/** Stagger offsets for portrait grid (cycles through preset values). */
export const PORTRAIT_OFFSETS = [0, 60, 30, 90, 40, 70, 20, 50] as const;
