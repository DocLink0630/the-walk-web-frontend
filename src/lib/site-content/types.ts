import type { AgencyEvent } from "@/types/events-page";
import type { GalleryItem } from "@/types/gallery-page";

export interface SiteContentOverrides {
  hiddenEventIds: string[];
  hiddenGalleryIds: string[];
  events: AgencyEvent[];
  galleryItems: GalleryItem[];
  galleryOrder: string[];
}

export const EMPTY_SITE_CONTENT: SiteContentOverrides = {
  hiddenEventIds: [],
  hiddenGalleryIds: [],
  events: [],
  galleryItems: [],
  galleryOrder: [],
};
