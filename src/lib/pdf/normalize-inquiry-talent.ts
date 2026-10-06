import type { ExtraMeasurement } from "./portfolio-layout";
import type { InquiryTalentPdfData, ModelProfilePdfData } from "./types";

export function uniqueUrls(urls: Array<string | null | undefined>): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const url of urls) {
    const value = url?.trim();
    if (!value || seen.has(value)) continue;
    seen.add(value);
    out.push(value);
  }
  return out;
}

export function normalizeInquiryTalent(
  raw: InquiryTalentPdfData,
): InquiryTalentPdfData {
  const workUrls = new Set(
    (raw.workExperience ?? []).flatMap((entry) =>
      uniqueUrls(entry.images ?? []),
    ),
  );

  const mixed = uniqueUrls(raw.images ?? []);
  let portfolioImages = uniqueUrls(raw.portfolioImages ?? []);
  let profileImage = raw.profileImage?.trim() || null;

  if (!profileImage && portfolioImages.length === 0 && mixed.length > 0) {
    profileImage = mixed[0] ?? null;
    portfolioImages = mixed
      .slice(1)
      .filter((url) => url !== profileImage && !workUrls.has(url));
  } else {
    if (!profileImage) {
      profileImage = portfolioImages[0] ?? mixed[0] ?? null;
    }
    portfolioImages = portfolioImages.filter(
      (url) => url !== profileImage && !workUrls.has(url),
    );
    if (portfolioImages.length === 0 && mixed.length > 0) {
      portfolioImages = mixed.filter(
        (url) => url !== profileImage && !workUrls.has(url),
      );
    }
  }

  const images = uniqueUrls([profileImage, ...portfolioImages]);

  return {
    ...raw,
    email: raw.email?.trim() || null,
    gender: raw.gender?.trim() || null,
    profileImage,
    portfolioImages,
    images,
    workExperience: (raw.workExperience ?? []).map((entry) => ({
      title: entry.title,
      images: uniqueUrls(entry.images ?? []),
    })),
  };
}

export type TalentPdfKind =
  | "model"
  | "beautician"
  | "photographer"
  | "influencer";

function hasInfluencerFields(talent: InquiryTalentPdfData): boolean {
  return Boolean(
    (talent.contentCategories && talent.contentCategories.length > 0) ||
      talent.instagramFollowers?.trim() ||
      talent.tiktokFollowers?.trim() ||
      talent.youtubeSubscribers?.trim() ||
      talent.facebookFollowers?.trim() ||
      talent.instagramUrl?.trim() ||
      talent.tiktokUrl?.trim() ||
      talent.youtubeUrl?.trim() ||
      talent.facebookUrl?.trim() ||
      talent.pastBrandWork?.trim(),
  );
}

export function resolveTalentPdfKind(
  talent: InquiryTalentPdfData,
): TalentPdfKind {
  const type = talent.modelType?.trim().toLowerCase() ?? "";
  const category = talent.category?.trim().toLowerCase() ?? "";

  if (type === "influencer" || category === "influencer" || hasInfluencerFields(talent)) {
    return "influencer";
  }
  if (type === "photographer") return "photographer";
  if (type === "beautician") return "beautician";
  return "model";
}

function pushIfValue(
  items: ExtraMeasurement[],
  label: string,
  value?: string | null,
) {
  const trimmed = value?.trim();
  if (trimmed) items.push({ label, value: trimmed });
}

export function talentDetailsSectionTitle(talent: InquiryTalentPdfData): string {
  switch (resolveTalentPdfKind(talent)) {
    case "influencer":
      return "Influencer details";
    case "photographer":
    case "beautician":
      return "Professional details";
    default:
      return "Measurements & Details";
  }
}

export function talentDetailCells(
  talent: InquiryTalentPdfData,
): ExtraMeasurement[] {
  const kind = resolveTalentPdfKind(talent);
  const items: ExtraMeasurement[] = [];

  if (kind === "model") {
    items.push(
      { label: "Gender", value: talent.gender },
      { label: "Height", value: talent.height },
      { label: "Weight", value: talent.weight },
      { label: "Chest", value: talent.chest },
      { label: "Shoulder", value: talent.shoulder },
      { label: "Waist", value: talent.waist },
      { label: "Eyes", value: talent.eyeColor },
      { label: "Hair", value: talent.hairColor },
    );
    pushIfValue(items, "Rate", talent.rate);
    return items;
  }

  if (kind === "beautician" || kind === "photographer") {
    if (talent.specialties && talent.specialties.length > 0) {
      items.push({ label: "Specialties", value: talent.specialties.join(", ") });
    }
    if (talent.yearsOfExperience != null) {
      items.push({
        label: "Experience",
        value: String(talent.yearsOfExperience),
      });
    }
    pushIfValue(items, "Location", talent.location);
    pushIfValue(items, "Rate", talent.rate);
    if (kind === "photographer") {
      const equipment = talent.equipmentOverview?.trim();
      // Long equipment text goes into bio via talentToModelProfilePdfData
      if (equipment && equipment.length <= 80) {
        items.push({ label: "Equipment", value: equipment });
      }
    }
    return items;
  }

  // influencer
  if (talent.contentCategories && talent.contentCategories.length > 0) {
    items.push({
      label: "Categories",
      value: talent.contentCategories.join(", "),
    });
  }
  pushIfValue(items, "Rate", talent.rate);
  pushIfValue(items, "Instagram", talent.instagramFollowers);
  pushIfValue(items, "TikTok", talent.tiktokFollowers);
  pushIfValue(items, "YouTube", talent.youtubeSubscribers);
  pushIfValue(items, "Facebook", talent.facebookFollowers);
  pushIfValue(items, "Past brand work", talent.pastBrandWork);
  return items;
}

export function talentToModelProfilePdfData(
  talent: InquiryTalentPdfData,
): ModelProfilePdfData {
  const kind = resolveTalentPdfKind(talent);
  const equipment = talent.equipmentOverview?.trim();
  const bioParts = [talent.shortBio?.trim()];
  if (kind === "photographer" && equipment && equipment.length > 80) {
    bioParts.push(`Equipment: ${equipment}`);
  }

  return {
    fullName: talent.fullName,
    email: talent.email?.trim() || "",
    tier: talent.tier ?? null,
    gender: talent.gender ?? null,
    shortBio: bioParts.filter(Boolean).join("\n\n") || null,
    height: talent.height ?? null,
    weight: talent.weight ?? null,
    chest: talent.chest ?? null,
    shoulder: talent.shoulder ?? null,
    waist: talent.waist ?? null,
    eyeColor: talent.eyeColor ?? null,
    hairColor: talent.hairColor ?? null,
    profileImage: talent.profileImage ?? null,
    portfolioImages: talent.portfolioImages ?? [],
    workExperience: talent.workExperience,
  };
}

export function talentSubtitle(talent: InquiryTalentPdfData): string {
  return [talent.modelType, talent.category].filter(Boolean).join(" · ");
}
