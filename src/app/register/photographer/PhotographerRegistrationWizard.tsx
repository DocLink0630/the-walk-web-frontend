"use client";

import RegistrationPathBanner from "@/components/registration/RegistrationPathBanner";
import ServiceRegistrationWizard from "@/components/registration/ServiceRegistrationWizard";
import { usePhotographerRegistrationStore } from "@/stores/serviceRegistrationStore";

export default function PhotographerRegistrationWizard() {
  const store = usePhotographerRegistrationStore();
  return (
    <>
      <RegistrationPathBanner variant="photographer" />
      <ServiceRegistrationWizard store={store} variant="photographer" idPrefix="pho" />
    </>
  );
}
