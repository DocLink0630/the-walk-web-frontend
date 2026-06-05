import type { Metadata } from "next";
import GalleryPageContent from "@/components/gallery/GalleryPageContent";

export const metadata: Metadata = {
  title: "Gallery — The Walk",
  description:
    "Explore The Walk's visual showcase — runway, editorial, academy, events, and behind-the-scenes photography.",
};

export default function GalleryPage() {
  return <GalleryPageContent />;
}
