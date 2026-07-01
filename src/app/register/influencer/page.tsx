import type { Metadata } from "next";
import InfluencerRegistrationPageWizard from "./InfluencerRegistrationWizard";

export const metadata: Metadata = {
  title: "Influencer Registration — The Walk",
  description:
    "Apply to join The Walk as an influencer — share your social channels and content categories for brand partnerships.",
};

export default function InfluencerRegisterPage() {
  return <InfluencerRegistrationPageWizard />;
}
