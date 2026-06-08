"use client";

import type { EventFilter } from "@/types/events-page";

const FILTERS: EventFilter[] = ["ALL", "UPCOMING", "PAST"];

interface EventsFilterBarProps {
  activeFilter: EventFilter;
  count: number;
  onChange: (filter: EventFilter) => void;
}

export default function EventsFilterBar({
  activeFilter,
  count,
  onChange,
}: EventsFilterBarProps) {
  return (
    <section className="sticky top-[65px] md:top-[73px] z-40 bg-white/90 backdrop-blur-sm border-b border-[#E0E0E0]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px] py-4 md:py-5">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-8">
          <span className="font-ui text-[9px] tracking-[0.3em] uppercase text-[#9A9A9A]">
            FILTER:
          </span>
          <div className="flex gap-2 md:gap-3 flex-wrap">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => onChange(filter)}
                data-cursor="button"
                className={`font-ui text-[9px] tracking-[0.25em] uppercase px-4 md:px-5 py-2 border transition-colors duration-200 ${
                  activeFilter === filter
                    ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                    : "text-[#0A0A0A] border-[#E0E0E0] hover:border-[#0A0A0A]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <span className="font-ui text-[9px] tracking-[0.3em] uppercase text-[#9A9A9A] md:ml-auto">
            {count} {count === 1 ? "EVENT" : "EVENTS"}
          </span>
        </div>
      </div>
    </section>
  );
}
