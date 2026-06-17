import type { AgencyEvent } from "@/types/events-page";
import type { SiteContentOverrides } from "./types";

export function mergeEvents(
  hardcoded: AgencyEvent[],
  overrides: SiteContentOverrides,
): AgencyEvent[] {
  const hidden = new Set(overrides.hiddenEventIds);

  const fromHardcoded = hardcoded.filter((event) => !hidden.has(event.id));
  const fromAdmin = overrides.events
    .filter((event) => !hidden.has(event.id))
    .map(stripAdminMetadata);

  return [...fromHardcoded, ...fromAdmin];
}

function stripAdminMetadata(
  event: AgencyEvent & { source?: string; createdAt?: string; updatedAt?: string },
): AgencyEvent {
  const { source: _source, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = event;
  return rest;
}

export function getMergedEventById(
  id: string,
  hardcoded: AgencyEvent[],
  overrides: SiteContentOverrides,
): AgencyEvent | undefined {
  return mergeEvents(hardcoded, overrides).find((event) => event.id === id);
}

export function getMergedEventIds(
  hardcoded: AgencyEvent[],
  overrides: SiteContentOverrides,
): string[] {
  return mergeEvents(hardcoded, overrides).map((event) => event.id);
}
