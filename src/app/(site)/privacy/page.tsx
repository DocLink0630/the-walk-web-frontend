import type { Metadata } from "next";
import PrivacyPolicyContent from "@/components/privacy/PrivacyPolicyContent";

export const metadata: Metadata = {
  title: "Privacy Policy — The Walk Agency",
  description:
    "How The Walk Agency collects, encrypts, stores, and protects your personal information — and how to request deletion of your data.",
};

export default function PrivacyPage() {
  return <PrivacyPolicyContent />;
}
