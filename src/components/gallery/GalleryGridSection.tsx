"use client";

import Image from "next/image";
import { galleryAspectClass } from "@/lib/gallery/aspect-ratio";
import type { GalleryItem } from "@/types/gallery-page";

interface GalleryGridSectionProps {
  items: GalleryItem[];
  onItemClick: (index: number) => void;
}

export default function GalleryGridSection({
  items,
  onItemClick,
}: GalleryGridSectionProps) {
  return (
    <section className="pb-16 md:pb-24">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-[80px]">
        {items.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-6">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="group cursor-pointer overflow-hidden bg-[#F5F5F5] break-inside-avoid mb-4 md:mb-6 w-full"
                onClick={() => onItemClick(index)}
                data-cursor="view"
              >
                <div
                  className={`relative w-full ${galleryAspectClass(item.aspectRatio)} overflow-hidden`}
                >
                  <Image
                    src={item.url}
                    alt={item.title}
                    fill
                    sizes="(max-width: 750px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="font-ui text-[8px] md:text-[9px] tracking-[0.3em] uppercase text-[#C8A97A] mb-1 md:mb-2">
                        {item.category}
                      </p>
                      <p className="font-display text-[16px] md:text-[18px] font-light text-white leading-[1.3]">
                        {item.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-display text-[20px] font-light text-[#9A9A9A] italic">
              No images found in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
