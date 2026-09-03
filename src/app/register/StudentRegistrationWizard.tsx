"use client";

import { useRouter } from "next/navigation";
import RegistrationPathBanner from "@/components/registration/RegistrationPathBanner";
import RegistrationWizard from "@/components/registration/RegistrationWizard";
import { useRegistrationStore } from "@/stores/registrationStore";

export default function StudentRegistrationWizard() {
  const store = useRegistrationStore();
  const router = useRouter();
  return (
    <>
      <RegistrationPathBanner variant="student" />
      <RegistrationWizard
        store={store}
        variant="student"
        idPrefix="stu"
        onSuccess={() => router.push("/models")}
      />
    </>
  );
}
