import type { Metadata } from "next";
import PhotographerRegistrationWizard from "./PhotographerRegistrationWizard";

export const metadata: Metadata = {
  title: "Photographer Registration — The Walk",
  description:
    "Register as a photographer with The Walk. Share your specialties, experience, and rates to join our talent network.",
};

export default function PhotographerRegisterPage() {
  return <PhotographerRegistrationWizard />;
}
