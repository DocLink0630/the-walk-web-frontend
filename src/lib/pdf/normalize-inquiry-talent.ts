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

export function inquiryExtraMeasurements(
  talent: InquiryTalentPdfData,
): ExtraMeasurement[] {
  const items: ExtraMeasurement[] = [];
  if (talent.rate?.trim()) items.push({ label: "Rate", value: talent.rate });
  if (talent.location?.trim()) {
    items.push({ label: "Location", value: talent.location });
  }
  if (talent.yearsOfExperience != null) {
    items.push({
      label: "Experience",
      value: String(talent.yearsOfExperience),
    });
  }
  if (talent.specialties && talent.specialties.length > 0) {
    items.push({ label: "Specialties", value: talent.specialties.join(", ") });
  }
  const equipment = talent.equipmentOverview?.trim();
  if (equipment && equipment.length <= 80) {
    items.push({ label: "Equipment", value: equipment });
  }
  return items;
}

export function talentToModelProfilePdfData(
  talent: InquiryTalentPdfData,
): ModelProfilePdfData {
  const equipment = talent.equipmentOverview?.trim();
  const bioParts = [talent.shortBio?.trim()];
  if (equipment && equipment.length > 80) {
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
