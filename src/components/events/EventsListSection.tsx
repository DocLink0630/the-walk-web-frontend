"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { attachScrollTriggerResync, revealOnScroll } from "@/lib/gsap/scroll-trigger-setup";
import type { AgencyEvent, EventFilter } from "@/types/events-page";
import EventsListItem from "./EventsListItem";

gsap.registerPlugin(ScrollTrigger);

interface EventsListSectionProps {
  events: AgencyEvent[];
  activeFilter: EventFilter;
  onSelectEvent: (event: AgencyEvent) => void;
}

export default function EventsListSection({
  events,
  activeFilter,
  onSelectEvent,
}: EventsListSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || events.length === 0) return;

    const ctx = gsap.context(() => {
      itemRefs.current.forEach((el, index) => {
        if (!el) return;
        revealOnScroll(el, {
          trigger: el,
          start: "top 88%",
          y: 48,
          duration: 0.95,
          delay: (index % 2) * 0.08,
        });
      });
    }, section);

    const detachResync = attachScrollTriggerResync([section]);

    return () => {
      detachResync();
      ctx.revert();
    };
  }, [events, activeFilter]);

  return (
    <section ref={sectionRef} className="py-12 md:py-16 lg:py-[80px]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px]">
        {events.map((event, index) => (
          <div
            key={event.id}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
          >
            <EventsListItem
              event={event}
              onQuickGallery={() => onSelectEvent(event)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
