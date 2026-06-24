"use client";

import RegistrationPathBanner from "@/components/registration/RegistrationPathBanner";
import RegistrationWizard from "@/components/registration/RegistrationWizard";
import { useModelRegistrationStore } from "@/stores/modelRegistrationStore";

export default function ModelRegistrationWizard() {
  const store = useModelRegistrationStore();
  return (
    <>
      <RegistrationPathBanner variant="model" />
      <RegistrationWizard store={store} variant="model" idPrefix="mod" />
    </>
  );
}
