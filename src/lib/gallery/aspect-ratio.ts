import type { GalleryAspectRatio } from "@/types/gallery-page";

export function galleryAspectClass(aspectRatio: GalleryAspectRatio): string {
  switch (aspectRatio) {
    case "portrait":
      return "aspect-[3/4]";
    case "landscape":
      return "aspect-[4/3]";
    case "square":
      return "aspect-square";
    default:
      return "aspect-[3/4]";
  }
}
