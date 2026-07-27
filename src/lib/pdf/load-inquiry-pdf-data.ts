import { backendFetch } from "@/lib/backend/fetch";
import { buildInquiryDraftPdfData } from "@/lib/pdf/build-inquiry-draft-pdf-data";
import type { InquiryModelsPdfData, InquiryTalentPdfData } from "@/lib/pdf/types";
import type { BookingItem } from "@/types/talents";
import type { AdminModelRegistrationMedia } from "@/types/admin";

type ExportPackageBody = {
  inquiryId?: string;
  phone?: string;
  eventDate?: string;
  message?: string;
  clientName?: string;
  clientEmail?: string;
  cart: BookingItem[];
};

function isRouteMissing(status: number, data: unknown): boolean {
  if (status === 404) return true;
  if (data && typeof data === "object" && "message" in data) {
    const message = String((data as { message: unknown }).message);
    return message.includes("Cannot POST") || message.includes("Cannot GET");
  }
  return false;
}

function collectMediaUrls(media?: AdminModelRegistrationMedia | null): string[] {
  if (!media) return [];
  const urls: string[] = [];
  if (media.profilePhoto?.url) urls.push(media.profilePhoto.url);
  for (const photo of media.portfolioPhotos ?? []) {
    if (photo.url) urls.push(photo.url);
  }
  for (const entry of media.workExperience ?? []) {
    for (const image of entry.images ?? []) {
      if (image.url) urls.push(image.url);
    }
  }
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const url of urls) {
    if (seen.has(url)) continue;
    seen.add(url);
    unique.push(url);
  }
  return unique.slice(0, 16);
}

type UserExportPayload = {
  modelProfile?: {
    fullName?: string;
    shortBio?: string | null;
    tier?: string | null;
    rate?: string | null;
    heightEnc?: string | null;
    weightEnc?: string | null;
    chestEnc?: string | null;
    shoulderEnc?: string | null;
    waistEnc?: string | null;
    eyeColorEnc?: string | null;
    hairColorEnc?: string | null;
  } | null;
  beauticianProfile?: {
    fullName?: string;
    shortBio?: string | null;
    rateCard?: string | null;
    specialties?: string[];
    location?: string | null;
    yearsOfExperience?: number | null;
  } | null;
  photographerProfile?: {
    fullName?: string;
    shortBio?: string | null;
    rateCard?: string | null;
    specialties?: string[];
    location?: string | null;
    yearsOfExperience?: number | null;
    equipmentOverview?: string | null;
  } | null;
  registrationMedia?: AdminModelRegistrationMedia | null;
};

function mapUserToTalent(
  user: UserExportPayload,
  item: {
    modelUserId: string;
    modelName: string;
    modelType: string;
    category?: string | null;
    priceRate?: string | null;
  },
): InquiryTalentPdfData {
  const model = user.modelProfile;
  const beautician = user.beauticianProfile;
  const photographer = user.photographerProfile;
  const media = user.registrationMedia;

  return {
    modelUserId: item.modelUserId,
    modelName: item.modelName,
    modelType: item.modelType,
    category: item.category ?? null,
    priceRate: item.priceRate ?? null,
    fullName:
      model?.fullName?.trim() ||
      beautician?.fullName?.trim() ||
      photographer?.fullName?.trim() ||
      item.modelName,
    shortBio:
      model?.shortBio?.trim() ||
      beautician?.shortBio?.trim() ||
      photographer?.shortBio?.trim() ||
      null,
    tier: model?.tier ?? null,
    rate:
      model?.rate?.trim() ||
      beautician?.rateCard?.trim() ||
      photographer?.rateCard?.trim() ||
      null,
    height: model?.heightEnc?.trim() || null,
    weight: model?.weightEnc?.trim() || null,
    chest: model?.chestEnc?.trim() || null,
    shoulder: model?.shoulderEnc?.trim() || null,
    waist: model?.waistEnc?.trim() || null,
    eyeColor: model?.eyeColorEnc?.trim() || null,
    hairColor: model?.hairColorEnc?.trim() || null,
    specialties: beautician?.specialties ?? photographer?.specialties ?? [],
    location: beautician?.location?.trim() || photographer?.location?.trim() || null,
    yearsOfExperience:
      beautician?.yearsOfExperience ?? photographer?.yearsOfExperience ?? null,
    equipmentOverview: photographer?.equipmentOverview?.trim() || null,
    images: collectMediaUrls(media),
    workExperience:
      media?.workExperience?.map((entry) => ({
        title: entry.title,
        images: entry.images.map((img) => img.url).filter(Boolean).slice(0, 4),
      })) ?? [],
  };
}

async function buildFromCart(
  token: string,
  input: ExportPackageBody,
): Promise<InquiryModelsPdfData> {
  const items = input.cart.map(({ talent }) => ({
    modelUserId: talent.id,
    modelName: talent.name,
    modelType: talent.type,
    category: talent.category ?? null,
    priceRate: talent.priceRate ?? null,
  }));

  const talents = await Promise.all(
    items.map(async (item) => {
      const { status, data } = await backendFetch(
        `/v1/public/talent/${item.modelUserId}/profile-export`,
        { token },
      );
      if (status === 200 && data && typeof data === "object") {
        return mapUserToTalent(data as UserExportPayload, item);
      }
      return mapUserToTalent({}, item);
    }),
  );

  const draft = buildInquiryDraftPdfData({
    phone: input.phone ?? "",
    eventDate: input.eventDate,
    message: input.message,
    cart: input.cart,
    clientName: input.clientName,
    clientEmail: input.clientEmail,
    inquiryId: input.inquiryId,
  });

  return {
    inquiry: draft.inquiry,
    talents,
  };
}

export async function loadInquiryModelsPdfData(
  token: string,
  input: ExportPackageBody,
): Promise<{ data: InquiryModelsPdfData } | { error: string; status: number }> {
  const inquiryId = input.inquiryId?.trim();
  const cart = input.cart;

  const packageBody = {
    inquiryId: inquiryId || undefined,
    phone: input.phone,
    eventDate: input.eventDate,
    message: input.message,
    items:
      cart.length > 0
        ? cart.map(({ talent }) => ({
            modelUserId: talent.id,
            modelName: talent.name,
            modelType: talent.type,
            category: talent.category,
            priceRate: talent.priceRate,
          }))
        : undefined,
  };

  const post = await backendFetch("/v1/inquiries/export-package", {
    method: "POST",
    token,
    body: packageBody,
  });

  if (post.status === 200 && post.data && typeof post.data === "object") {
    return { data: post.data as InquiryModelsPdfData };
  }

  if (inquiryId && isRouteMissing(post.status, post.data)) {
    const get = await backendFetch(`/v1/inquiries/${inquiryId}/export`, { token });
    if (get.status === 200 && get.data && typeof get.data === "object") {
      return { data: get.data as InquiryModelsPdfData };
    }
    const message =
      get.data && typeof get.data === "object" && "message" in get.data
        ? String((get.data as { message: unknown }).message)
        : "Failed to load inquiry export data";
    return { error: message, status: get.status === 200 ? 500 : get.status };
  }

  if (isRouteMissing(post.status, post.data) && cart.length > 0) {
    return { data: await buildFromCart(token, input) };
  }

  const message =
    post.data && typeof post.data === "object" && "message" in post.data
      ? String((post.data as { message: unknown }).message)
      : "Failed to load inquiry export data";

  return { error: message, status: post.status === 200 ? 500 : post.status };
}
