import type { Metadata } from "next";
import InquiryPageContent from "@/components/inquiry/InquiryPageContent";

export const metadata: Metadata = {
  title: "Booking Inquiry — The Walk Agency",
  description:
    "Submit a booking inquiry for models, beauticians, and photographers through The Walk Agency.",
};

export default function InquiryPage() {
  return (
    <main className="flex-1 w-full bg-[#FAFAFA] pt-[88px] md:pt-[96px] pb-16">
      <InquiryPageContent />
    </main>
  );
}
