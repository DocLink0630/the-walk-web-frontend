import type { Metadata } from "next";
import UnderConstructionPage from "@/components/UnderConstructionPage";

export const metadata: Metadata = {
  title: "Beauticians — The Walk",
  description: "The Walk beauticians directory is coming soon.",
};
// beauticians page
export default function BeauticiansPage() {
  return (
    <UnderConstructionPage
      title="Beauticians"
      description="Our beauticians directory is under construction. Soon you'll be able to browse and book beauty artists through The Walk."
    />
  );
}
