import type { Metadata } from "next";
import AcademyPageContent from "@/components/academy/AcademyPageContent";

export const metadata: Metadata = {
  title: "Academy — The Walk",
  description:
    "Professional modelling training at The Walk Academy. Three-month and four-month advanced programmes covering runway, portfolio, and agency placement in Sri Lanka.",
};

export default function AcademyPage() {
  return <AcademyPageContent />;
}
