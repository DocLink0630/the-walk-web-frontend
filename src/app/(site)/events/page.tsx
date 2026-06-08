import type { Metadata } from "next";
import UnderConstructionPage from "@/components/UnderConstructionPage";

export const metadata: Metadata = {
  title: "Events — The Walk",
  description: "The Walk events page is coming soon.",
};

export default function EventsPage() {
  return (
    <UnderConstructionPage
      title="Events"
      description="Our events section is being built. Check back soon for showcases, runway shows, and academy highlights."
    />
  );
}
