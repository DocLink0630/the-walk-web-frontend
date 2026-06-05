import type { Metadata } from "next";
import ModelRegistrationWizard from "./ModelRegistrationWizard";

export const metadata: Metadata = {
  title: "Model Registration — The Walk Agency",
  description:
    "Register as a model with The Walk Agency. Create your profile, upload your portfolio, and join Sri Lanka's talent roster.",
};

export default function ModelRegisterPage() {
  return <ModelRegistrationWizard />;
}
