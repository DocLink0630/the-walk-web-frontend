import type { Metadata } from "next";
import StudentRegistrationWizard from "./StudentRegistrationWizard";

export const metadata: Metadata = {
  title: "Register — The Walk Academy",
  description:
    "Apply to join The Walk Academy as a student. Complete your profile and submit your portfolio to get started.",
};

export default function RegisterPage() {
  return <StudentRegistrationWizard />;
}
