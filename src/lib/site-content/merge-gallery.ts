import type { GalleryItem } from "@/types/gallery-page";
import type { SiteContentOverrides } from "./types";

export function mergeGalleryItems(
  hardcoded: GalleryItem[],
  overrides: SiteContentOverrides,
): GalleryItem[] {
  const hidden = new Set(overrides.hiddenGalleryIds);

  const visibleHardcoded = hardcoded.filter((item) => !hidden.has(item.id));
  const visibleAdmin = overrides.galleryItems
    .filter((item) => !hidden.has(item.id))
    .map(stripAdminMetadata);

  const byId = new Map<string, GalleryItem>();
  for (const item of [...visibleHardcoded, ...visibleAdmin]) {
    byId.set(item.id, item);
  }

  const order =
    overrides.galleryOrder.length > 0
      ? overrides.galleryOrder
      : [...visibleHardcoded, ...visibleAdmin].map((item) => item.id);

  const ordered: GalleryItem[] = [];
  const seen = new Set<string>();

  for (const id of order) {
    const item = byId.get(id);
    if (item && !hidden.has(id)) {
      ordered.push(item);
      seen.add(id);
    }
  }

  for (const item of byId.values()) {
    if (!seen.has(item.id)) {
      ordered.push(item);
    }
  }

  return ordered;
}

function stripAdminMetadata(
  item: GalleryItem & { source?: string; createdAt?: string; updatedAt?: string },
): GalleryItem {
  const { source: _source, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = item;
  return rest;
}

export function mergeGalleryCategories(
  hardcodedCategories: readonly string[],
  items: GalleryItem[],
): string[] {
  const set = new Set<string>(["All", ...hardcodedCategories.filter((c) => c !== "All")]);
  for (const item of items) {
    set.add(item.category);
  }
  return Array.from(set);
}
