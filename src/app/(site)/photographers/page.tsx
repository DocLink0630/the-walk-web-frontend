import type { Metadata } from "next";
import ServiceProvidersPageContent from "@/components/service-providers/ServiceProvidersPageContent";

export const metadata: Metadata = {
  title: "Photographers — The Walk",
  description: "Browse professional photographers for fashion, editorial, and commercial shoots through The Walk.",
};

export default function PhotographersPage() {
  return <ServiceProvidersPageContent type="photographer" />;
}
