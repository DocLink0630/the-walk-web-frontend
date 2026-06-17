"use client";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { EVENTS_PAGE } from "@/data/events-page";
import { fetchSiteContentOverridesClient } from "@/lib/site-content/fetch-site-content";
import { mergeEvents } from "@/lib/site-content/merge-events";
import type { AgencyEvent, EventFilter } from "@/types/events-page";
import EventsCtaSection from "./EventsCtaSection";
import EventsFilterBar from "./EventsFilterBar";
import EventsGalleryModal from "./EventsGalleryModal";
import EventsHeroSection from "./EventsHeroSection";
import EventsListSection from "./EventsListSection";

export default function EventsPageContent() {
  const content = EVENTS_PAGE;
  const [events, setEvents] = useState<AgencyEvent[]>(content.events);
  const [activeFilter, setActiveFilter] = useState<EventFilter>("ALL");
  const [selectedEvent, setSelectedEvent] = useState<AgencyEvent | null>(null);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const overrides = await fetchSiteContentOverridesClient();
      if (cancelled) return;
      setEvents(mergeEvents(content.events, overrides));
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [content.events]);

  const filteredEvents = useMemo(() => {
    if (activeFilter === "ALL") return events;
    return events.filter((event) => event.status === activeFilter);
  }, [activeFilter, events]);

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
