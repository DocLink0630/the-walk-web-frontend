import { EVENTS_PAGE } from "@/data/events-page";
import { backendFetch, getBackendUrl } from "@/lib/backend/fetch";
import { mergeEvents, getMergedEventById as mergeGetById } from "@/lib/site-content/merge-events";
import type { SiteContentOverrides } from "@/lib/site-content/types";
import { EMPTY_SITE_CONTENT } from "@/lib/site-content/types";
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

async function fetchOverridesServer(): Promise<SiteContentOverrides> {
  try {
    getBackendUrl();
    const { status, data } = await backendFetch("/v1/public/site-content");
    if (status !== 200 || !data) return EMPTY_SITE_CONTENT;
    return data as SiteContentOverrides;
  } catch {
    return EMPTY_SITE_CONTENT;
  }
}

export async function getAllEventsMerged(): Promise<AgencyEvent[]> {
  const overrides = await fetchOverridesServer();
  return mergeEvents(EVENTS_PAGE.events, overrides);
}

export async function getMergedEventById(id: string): Promise<AgencyEvent | undefined> {
  const overrides = await fetchOverridesServer();
  return mergeGetById(id, EVENTS_PAGE.events, overrides);
}

export async function getMergedEventIds(): Promise<string[]> {
  const events = await getAllEventsMerged();
  return events.map((event) => event.id);
}
