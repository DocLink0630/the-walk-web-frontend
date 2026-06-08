import { EVENTS_PAGE } from "@/data/events-page";
import type { AgencyEvent } from "@/types/events-page";

export function getAllEvents(): AgencyEvent[] {
  return EVENTS_PAGE.events;
}

export function getEventById(id: string): AgencyEvent | undefined {
  return EVENTS_PAGE.events.find((event) => event.id === id);
}

export function getEventIds(): string[] {
  return EVENTS_PAGE.events.map((event) => event.id);
}
