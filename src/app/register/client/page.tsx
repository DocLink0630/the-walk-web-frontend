import type { Metadata } from "next";
import ClientRegistrationPage from "./ClientRegistrationPage";

export const metadata: Metadata = {
  title: "Client Registration — The Walk Agency",
  description:
    "Register as a corporate client to book models, beauticians, and photographers through The Walk Agency.",
};

export default function RegisterClientPage() {
  return <ClientRegistrationPage />;
}
