import type { BookingItem } from "@/types/talents";
import type { InquiryModelsPdfData } from "@/lib/pdf/types";

export function buildInquiryDraftPdfData(input: {
  phone: string;
  eventDate?: string;
  message?: string;
  cart: BookingItem[];
  clientName?: string;
  clientEmail?: string;
  inquiryId?: string;
}): InquiryModelsPdfData {
  const now = new Date().toISOString();

  return {
    inquiry: {
      id: input.inquiryId ?? "draft",
      phone: input.phone.trim() || "—",
      eventDate: input.eventDate?.trim() || null,
      message: input.message?.trim() || "",
      status: input.inquiryId ? "NEW" : "DRAFT",
      createdAt: now,
      clientName: input.clientName,
      clientEmail: input.clientEmail,
    },
    talents: input.cart.map(({ talent }) => ({
      modelUserId: talent.id,
      modelName: talent.name,
      modelType: talent.type,
      category: talent.category ?? null,
      priceRate: talent.priceRate ?? null,
      fullName: talent.name,
      shortBio: talent.bio?.trim() || null,
      tier: null,
      rate: talent.priceRate ?? null,
      height: talent.height ?? null,
      weight: talent.weight ?? null,
      chest: talent.measurements ?? null,
      shoulder: null,
      waist: null,
      eyeColor: null,
      hairColor: null,
      specialties: talent.specialty ? [talent.specialty] : [],
      location: null,
      yearsOfExperience: null,
      equipmentOverview: null,
      images: [
        talent.mainImage,
        ...(talent.images ?? []),
        ...(talent.portfolio ?? []),
      ].filter(Boolean),
      workExperience: [],
    })),
  };
}
