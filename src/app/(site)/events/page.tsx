import type { Metadata } from "next";
import EventsPageContent from "@/components/events/EventsPageContent";

export const metadata: Metadata = {
  title: "Events — The Walk",
  description:
    "Runway shows, graduate showcases, editorials and industry galas from The Walk Agency and Academy.",
};

export default function EventsPage() {
  return <EventsPageContent />;
}
