import type { EventCategory } from "@/types/events-page";

export const EVENT_CATEGORY_COLORS: Record<EventCategory, string> = {
  RUNWAY: "#C8A97A",
  "ACADEMY EVENT": "#4A4A4A",
  EDITORIAL: "#9A9A9A",
  GALA: "#C8A97A",
};

export function eventCategoryColor(category: EventCategory): string {
  return EVENT_CATEGORY_COLORS[category] ?? "#C8A97A";
}
