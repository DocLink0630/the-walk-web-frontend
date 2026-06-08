import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EventDetailPageContent from "@/components/events/EventDetailPageContent";
import { getEventById, getEventIds } from "@/lib/events/events-data";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getEventIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = getEventById(id);

  if (!event) {
    return { title: "Event Not Found — The Walk" };
  }

  return {
    title: `${event.title} — The Walk`,
    description: event.description,
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const event = getEventById(id);

  if (!event) {
    notFound();
  }

  return <EventDetailPageContent event={event} />;
}
