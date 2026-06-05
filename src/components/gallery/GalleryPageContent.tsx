"use client";

import { useLayoutEffect, useMemo, useState } from "react";
import { GALLERY_PAGE } from "@/data/gallery-page";
import GalleryGridSection from "./GalleryGridSection";
import GalleryHeroSection from "./GalleryHeroSection";
import GalleryLightbox from "./GalleryLightbox";

export default function GalleryPageContent() {
  const content = GALLERY_PAGE;
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredItems = useMemo(
    () =>
      activeCategory === "All"
        ? content.items
        : content.items.filter((item) => item.category === activeCategory),
    [activeCategory, content.items],
  );

  function openLightbox(index: number) {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  }

  function closeLightbox() {
    setLightboxOpen(false);
  }

  function nextImage() {
    setCurrentImageIndex((prev) => (prev + 1) % filteredItems.length);
  }

  function prevImage() {
    setCurrentImageIndex(
      (prev) => (prev - 1 + filteredItems.length) % filteredItems.length,
    );
  }

  function handleCategoryChange(category: string) {
    setActiveCategory(category);
    setLightboxOpen(false);
    setCurrentImageIndex(0);
  }

  return (
    <main className="flex-1 min-h-screen bg-white">
      <GalleryHeroSection
        eyebrow={content.eyebrow}
        heading={content.heading}
        categories={content.categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />
      <GalleryGridSection items={filteredItems} onItemClick={openLightbox} />
      {lightboxOpen && (
        <GalleryLightbox
          items={filteredItems}
          currentIndex={currentImageIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </main>
  );
}
