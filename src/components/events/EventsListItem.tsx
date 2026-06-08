"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Grid } from "lucide-react";
import { eventCategoryColor } from "@/lib/events/category-colors";
import type { AgencyEvent } from "@/types/events-page";

interface EventsListItemProps {
  event: AgencyEvent;
  onQuickGallery: () => void;
}

export default function EventsListItem({
  event,
  onQuickGallery,
}: EventsListItemProps) {
  const detailHref = `/events/${event.id}`;
  const previewGallery = event.gallery.slice(0, 8);
  const totalImages = event.gallery.length + 1;

  return (
    <article className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-t border-[#E0E0E0] group overflow-hidden">
      <div className="lg:col-span-7 py-8 md:py-12 lg:py-16 lg:pr-12">
        <Link
          href={detailHref}
          className="block w-full aspect-[16/10] overflow-hidden border border-[#E0E0E0] mb-3 md:mb-4"
          data-cursor="view"
        >
          <div className="relative w-full h-full">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
          </div>
        </Link>

        {previewGallery.length > 0 && (
          <div className="grid grid-cols-4 gap-2 md:gap-3">
            {previewGallery.map((img, idx) => (
              <button
                key={`${event.id}-thumb-${idx}`}
                type="button"
                onClick={onQuickGallery}
                className="relative aspect-square overflow-hidden border border-[#E0E0E0]"
                data-cursor="view"
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                  sizes="(max-width: 768px) 25vw, 15vw"
                />
              </button>
            ))}
          </div>
        )}

        {event.gallery.length > 8 && (
          <button
            type="button"
            onClick={onQuickGallery}
            data-cursor="button"
            className="mt-3 md:mt-4 inline-block font-ui text-[9px] tracking-[0.25em] uppercase text-[#C8A97A] hover:text-[#0A0A0A] transition-colors duration-300"
          >
            + VIEW ALL {totalImages} IMAGES
          </button>
        )}
      </div>

      <div className="lg:col-span-5 py-8 md:py-12 lg:py-16 lg:pl-12 lg:border-l border-[#E0E0E0]">
        <div className="flex items-center gap-2 mb-4 md:mb-5">
          <span
            className="font-ui text-[9px] tracking-[0.28em] uppercase"
            style={{ color: eventCategoryColor(event.category) }}
          >
            {event.category}
          </span>
          <span className="text-[#E0E0E0]">·</span>
          <span
            className={`font-ui text-[9px] tracking-[0.25em] uppercase ${
              event.status === "UPCOMING" ? "text-[#C8A97A]" : "text-[#B0B0B0]"
            }`}
          >
            {event.status}
          </span>
        </div>

        <Link href={detailHref} data-cursor="view">
          <h2 className="font-display text-[32px] md:text-[42px] lg:text-[48px] font-light text-[#0A0A0A] leading-[1.05] mb-5 md:mb-6 group-hover:text-[#C8A97A] transition-colors duration-400">
            {event.title}
          </h2>
        </Link>

        <div className="mb-5 md:mb-6 pb-5 md:pb-6 border-b border-[#E5E3E0]">
          <p className="font-ui text-[11px] font-light tracking-[0.15em] text-[#4A4A4A] leading-[1.6] mb-1">
            {event.date}
          </p>
          <p className="font-ui text-[10px] font-light tracking-[0.12em] text-[#9A9A9A] leading-[1.6]">
            {event.location}
          </p>
        </div>

        <p className="font-display text-[16px] md:text-[17px] font-light text-[#4A4A4A] leading-[1.75] mb-5 md:mb-6">
          {event.description}
        </p>

        <p className="font-ui text-[9px] tracking-[0.28em] uppercase text-[#C8A97A] mb-6 md:mb-8">
          {event.highlight}
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href={detailHref}
            data-cursor="button"
            className="group inline-flex items-center justify-center gap-2 font-ui text-[9px] tracking-[0.25em] uppercase px-6 md:px-7 py-3 bg-[#0A0A0A] text-white hover:bg-[#C8A97A] transition-colors duration-300 text-center"
          >
            <ExternalLink
              size={14}
              strokeWidth={1.5}
              className="group-hover:translate-x-0.5 transition-transform"
            />
            VIEW EVENT DETAILS
          </Link>
          <button
            type="button"
            onClick={onQuickGallery}
            data-cursor="button"
            className="group inline-flex items-center justify-center gap-2 font-ui text-[9px] tracking-[0.25em] uppercase px-6 md:px-7 py-3 border border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors duration-300 text-center"
          >
            <Grid size={14} strokeWidth={1.5} />
            QUICK GALLERY VIEW
          </button>
          {event.status === "UPCOMING" && (
            <Link
              href="/inquiry"
              data-cursor="button"
              className="inline-block text-center font-ui text-[9px] tracking-[0.25em] uppercase px-6 md:px-7 py-3 border border-[#C8A97A] text-[#C8A97A] hover:bg-[#C8A97A] hover:text-white transition-colors duration-300"
            >
              ENQUIRE ABOUT EVENT
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
