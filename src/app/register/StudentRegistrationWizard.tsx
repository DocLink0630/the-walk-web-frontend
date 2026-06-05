"use client";

import RegistrationWizard from "@/components/registration/RegistrationWizard";
import { useRegistrationStore } from "@/stores/registrationStore";

export default function StudentRegistrationWizard() {
  const store = useRegistrationStore();
  return <RegistrationWizard store={store} variant="student" idPrefix="stu" />;
}
