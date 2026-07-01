"use client";

import RegistrationPathBanner from "@/components/registration/RegistrationPathBanner";
import InfluencerRegistrationWizard from "@/components/registration/InfluencerRegistrationWizard";
import { useInfluencerRegistrationStore } from "@/stores/influencerRegistrationStore";

export default function InfluencerRegistrationPageWizard() {
  const store = useInfluencerRegistrationStore();
  return (
    <>
      <RegistrationPathBanner variant="influencer" />
      <InfluencerRegistrationWizard store={store} idPrefix="inf" />
    </>
  );
}
