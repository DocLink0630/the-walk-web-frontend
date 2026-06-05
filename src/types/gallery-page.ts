export type GalleryAspectRatio = "portrait" | "landscape" | "square";

export type GalleryCategory =
  | "Runway"
  | "Editorial"
  | "Academy"
  | "Events"
  | "Behind the Scenes"
  | "Campaigns";

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  category: GalleryCategory;
  aspectRatio: GalleryAspectRatio;
}

export interface GalleryPageContent {
  eyebrow: string;
  heading: string;
  categories: readonly string[];
  items: GalleryItem[];
}
