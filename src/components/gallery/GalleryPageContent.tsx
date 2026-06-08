"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { GALLERY_PAGE } from "@/data/gallery-page";
import GalleryGridSection from "./GalleryGridSection";
import GalleryHeroSection from "./GalleryHeroSection";
import GalleryLightbox from "./GalleryLightbox";

export default function GalleryPageContent() {
  const content = GALLERY_PAGE;
  const gridWrapRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const grid = gridWrapRef.current;
    if (!grid) return;

    gsap.fromTo(
      grid,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
    );
  }, [activeCategory, filteredItems.length]);

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
        imageCount={filteredItems.length}
      />
      <div ref={gridWrapRef}>
        <GalleryGridSection items={filteredItems} onItemClick={openLightbox} />
      </div>
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
