import type { PublicFeaturedModel } from "@/types/public-model";

export function getFirstName(fullName: string): string {
  const trimmed = fullName.trim();
  if (!trimmed) return "";
  return trimmed.split(/\s+/)[0] ?? trimmed;
}

/** Moves a model matching `name` (case-insensitive) to index 0; otherwise returns `models` unchanged. */
export function pinModelFirst(
  models: PublicFeaturedModel[],
  name: string,
): PublicFeaturedModel[] {
  const target = name.trim().toLowerCase();
  if (!target || models.length === 0) return models;

  const idx = models.findIndex((m) => m.name.trim().toLowerCase() === target);
  if (idx <= 0) return models;

  const next = [...models];
  const [pinned] = next.splice(idx, 1);
  return [pinned, ...next];
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
    return {
      ok: true,
      data: pinModelFirst(Array.isArray(data) ? data : [], "Rashmi Keshara"),
    };
  } catch {
    return { ok: false, message: "Unable to connect to the server." };
  }
}

/** Stagger offsets for portrait grid (cycles through preset values). */
export const PORTRAIT_OFFSETS = [0, 60, 30, 90, 40, 70, 20, 50] as const;
