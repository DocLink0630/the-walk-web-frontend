"use client";

import RegistrationWizard from "@/components/registration/RegistrationWizard";
import { useModelRegistrationStore } from "@/stores/modelRegistrationStore";

export default function ModelRegistrationWizard() {
  const store = useModelRegistrationStore();
  return <RegistrationWizard store={store} variant="model" idPrefix="mod" />;
}
