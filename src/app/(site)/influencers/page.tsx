import type { Metadata } from "next";
import InfluencersPageContent from "@/components/influencer/InfluencersPageContent";

export const metadata: Metadata = {
  title: "Influencers — The Walk",
  description: "Browse influencers available for brand partnerships and collaborations through The Walk.",
};

export default function InfluencersPage() {
  return <InfluencersPageContent />;
}
