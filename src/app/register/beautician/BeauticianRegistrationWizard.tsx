"use client";

import RegistrationPathBanner from "@/components/registration/RegistrationPathBanner";
import ServiceRegistrationWizard from "@/components/registration/ServiceRegistrationWizard";
import { useBeauticianRegistrationStore } from "@/stores/serviceRegistrationStore";

export default function BeauticianRegistrationWizard() {
  const store = useBeauticianRegistrationStore();
  return (
    <>
      <RegistrationPathBanner variant="beautician" />
      <ServiceRegistrationWizard store={store} variant="beautician" idPrefix="bea" />
    </>
  );
}
