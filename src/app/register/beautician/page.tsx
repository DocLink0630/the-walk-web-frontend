import type { Metadata } from "next";
import BeauticianRegistrationWizard from "./BeauticianRegistrationWizard";

export const metadata: Metadata = {
  title: "Beautician Registration — The Walk",
  description:
    "Register as a beautician with The Walk. Share your specialties, experience, and rates to join our talent network.",
};

export default function BeauticianRegisterPage() {
  return <BeauticianRegistrationWizard />;
}
