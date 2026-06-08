"use client";

import { useLayoutEffect, useMemo, useState } from "react";
import { EVENTS_PAGE } from "@/data/events-page";
import type { AgencyEvent, EventFilter } from "@/types/events-page";
import EventsCtaSection from "./EventsCtaSection";
import EventsFilterBar from "./EventsFilterBar";
import EventsGalleryModal from "./EventsGalleryModal";
import EventsHeroSection from "./EventsHeroSection";
import EventsListSection from "./EventsListSection";

export default function EventsPageContent() {
  const content = EVENTS_PAGE;
  const [activeFilter, setActiveFilter] = useState<EventFilter>("ALL");
  const [selectedEvent, setSelectedEvent] = useState<AgencyEvent | null>(null);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredEvents = useMemo(() => {
    if (activeFilter === "ALL") return content.events;
    return content.events.filter((event) => event.status === activeFilter);
  }, [activeFilter, content.events]);

  return (
    <main className="flex-1 min-h-screen bg-white">
      <EventsHeroSection {...content.hero} />
      <EventsFilterBar
        activeFilter={activeFilter}
        count={filteredEvents.length}
        onChange={setActiveFilter}
      />
      <EventsListSection
        events={filteredEvents}
        activeFilter={activeFilter}
        onSelectEvent={setSelectedEvent}
      />
      <EventsCtaSection cta={content.cta} />
      {selectedEvent && (
        <EventsGalleryModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </main>
  );
}
