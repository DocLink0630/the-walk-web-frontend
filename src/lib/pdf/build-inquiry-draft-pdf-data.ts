import { uniqueUrls } from "@/lib/pdf/normalize-inquiry-talent";
import type { InquiryModelsPdfData } from "@/lib/pdf/types";
import type { BookingItem } from "@/types/talents";

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
    talents: input.cart.map(({ talent }) => {
      const profileImage =
        talent.mainImage || talent.images?.[0] || talent.portfolio?.[0] || null;
      const portfolioImages = uniqueUrls([
        ...(talent.portfolio ?? []),
        ...(talent.images ?? []),
      ]).filter((url) => url !== profileImage);
      const workImages = uniqueUrls(talent.workGallery ?? []).filter(
        (url) => url !== profileImage,
      );

      return {
        modelUserId: talent.id,
        modelName: talent.name,
        modelType: talent.type,
        category: talent.category ?? null,
        priceRate: talent.priceRate ?? null,
        fullName: talent.name,
        email: null,
        gender: talent.gender ?? null,
        shortBio: talent.bio?.trim() || null,
        tier: null,
        rate: talent.priceRate ?? null,
        height: talent.height ?? null,
        weight: talent.weight ?? null,
        chest: talent.measurements ?? null,
        shoulder: null,
        waist: null,
        eyeColor: talent.eyeColor ?? null,
        hairColor: talent.hairColor ?? null,
        specialties: talent.specialty ? [talent.specialty] : [],
        location: null,
        yearsOfExperience: null,
        equipmentOverview: null,
        profileImage,
        portfolioImages,
        images: uniqueUrls([profileImage, ...portfolioImages]),
        workExperience:
          workImages.length > 0
            ? [{ title: "Work Experience", images: workImages }]
            : [],
      };
    }),
  };
}
