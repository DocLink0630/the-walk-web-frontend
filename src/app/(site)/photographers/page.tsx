import type { Metadata } from "next";
import UnderConstructionPage from "@/components/UnderConstructionPage";

export const metadata: Metadata = {
  title: "Photographers — The Walk",
  description: "The Walk photographers directory is coming soon.",
};

export default function PhotographersPage() {
  return (
    <UnderConstructionPage
      title="Photographers"
      description="Our photographers directory is under construction. Soon you'll be able to browse portfolios and book photographers through The Walk."
    />
  );
}
