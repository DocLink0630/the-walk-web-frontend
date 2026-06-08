"use client";

import ClientRegistrationWizard from "@/components/registration/ClientRegistrationWizard";
import { useClientRegistrationStore } from "@/stores/clientRegistrationStore";

export default function ClientRegistrationPage() {
  const store = useClientRegistrationStore();
  return <ClientRegistrationWizard store={store} />;
}
