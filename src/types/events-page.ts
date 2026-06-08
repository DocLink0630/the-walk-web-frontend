export type EventStatus = "UPCOMING" | "PAST";

export type EventCategory = "RUNWAY" | "ACADEMY EVENT" | "EDITORIAL" | "GALA";

export type EventFilter = "ALL" | "UPCOMING" | "PAST";

export interface EventStat {
  label: string;
  value: string;
}

export interface AgencyEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  category: EventCategory;
  status: EventStatus;
  description: string;
  fullDescription: string;
  highlight: string;
  stats?: EventStat[];
  image: string;
  gallery: string[];
}

export interface EventsPageContent {
  hero: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    backgroundImage: string;
  };
  cta: {
    eyebrow: string;
    heading: string;
    description: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  events: AgencyEvent[];
}
