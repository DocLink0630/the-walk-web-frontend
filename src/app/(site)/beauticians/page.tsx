import type { Metadata } from "next";
import ServiceProvidersPageContent from "@/components/service-providers/ServiceProvidersPageContent";

export const metadata: Metadata = {
  title: "Beauticians — The Walk",
  description: "Browse professional beauty artists available for runway, editorial, and events through The Walk.",
};

export default function BeauticiansPage() {
  return <ServiceProvidersPageContent type="beautician" />;
}
