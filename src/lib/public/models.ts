import type { AdminUser, AdminUserDetail, ModelTier, PaginatedUsersResponse } from "@/types/admin";
import type {
  PublicApiModel,
  PublicFeaturedModel,
  PublicModel,
  PublicModelsPageResponse,
} from "@/types/public-model";
import type { ModelCategory, TalentProfile } from "@/types/talents";
import { clientAuthHeaders } from "@/lib/client/auth-request";
import { fetchFeaturedModels, getFirstName } from "@/lib/public/featured-models";

const DETAIL_CONCURRENCY = 5;
const PUBLIC_PAGE_LIMIT = 100;

/** Swagger GET /v1/users — filter by UserRole.MODEL (authenticated enrichment) */
export const MODEL_ROSTER_ROLES = JSON.stringify(["MODEL"]);

export function getGuestDisplayName(name: string): string {
  return getFirstName(name).toUpperCase();
}

export function normalizeModelName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

export function mapTierToCategory(tier?: ModelTier | null): ModelCategory | undefined {
  switch (tier) {
    case "SUPERMODEL":
      return "Super Model";
    case "EXPERIENCED":
      return "Experienced";
    case "FRESHER":
      return "Freshers";
    case "INFLUENCER":
      return "Influencer";
    default:
      return undefined;
  }
}

export function parseHeightCm(height?: string | null): number | null {
  if (!height?.trim()) return null;
  const cmMatch = height.match(/(\d+)\s*cm/i);
  if (cmMatch) return parseInt(cmMatch[1], 10);

  const feetMatch = height.match(/(\d+)'(\d+)"/);
  if (feetMatch) {
    const feet = parseInt(feetMatch[1], 10);
    const inches = parseInt(feetMatch[2], 10);
    return Math.round((feet * 12 + inches) * 2.54);
  }

  const numeric = parseInt(height.replace(/\D/g, ""), 10);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

function formatMeasurements(profile?: AdminUserDetail["modelProfile"]): string | undefined {
  if (!profile) return undefined;
  const parts = [profile.chestEnc, profile.waistEnc].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : undefined;
}

function makePublicModelId(name: string, index: number): string {
  const slug = normalizeModelName(name).replace(/\s+/g, "-") || "model";
  return `public-${slug}-${index}`;
}

/** Loads profile + portfolio gallery for guests (no auth). */
export async function fetchPublicModelGallery(
  name: string,
): Promise<Pick<PublicModel, "portfolioImages" | "imageUrl" | "height"> | null> {
  try {
    const params = new URLSearchParams({ name });
    const res = await fetch(`/api/public/models/gallery?${params.toString()}`);
    if (!res.ok) return null;

    const data = (await res.json()) as {
      portfolioImages?: string[];
      imageUrl?: string | null;
      height?: string | null;
    };

    const portfolioImages = Array.isArray(data.portfolioImages)
      ? data.portfolioImages.filter(Boolean)
      : data.imageUrl
        ? [data.imageUrl]
        : [];

    return {
      portfolioImages,
      imageUrl: portfolioImages[0] ?? data.imageUrl ?? null,
      height: data.height?.trim() || undefined,
    };
  } catch {
    return null;
  }
}

export function mapPublicApiModelToPublicModel(
  item: PublicApiModel,
  index: number,
): PublicModel {
  const portfolioImages =
    item.portfolioImages && item.portfolioImages.length > 0
      ? item.portfolioImages
      : item.imageUrl
        ? [item.imageUrl]
        : [];
  return {
    id: makePublicModelId(item.name, index),
    name: item.name,
    imageUrl: portfolioImages[0] ?? item.imageUrl,
    height: item.height?.trim() || undefined,
    portfolioImages,
  };
}

export function buildFeaturedImageMap(
  featured: PublicFeaturedModel[],
): Map<string, string | null> {
  const map = new Map<string, string | null>();
  for (const item of featured) {
    map.set(normalizeModelName(item.name), item.imageUrl);
  }
  return map;
}

export function mergeFeaturedImages(
  models: PublicModel[],
  featured: PublicFeaturedModel[],
): PublicModel[] {
  const imageMap = buildFeaturedImageMap(featured);
  return models.map((model) => {
    const imageUrl = imageMap.get(normalizeModelName(model.name)) ?? model.imageUrl;
    const portfolioImages =
      imageUrl && !model.portfolioImages.includes(imageUrl)
        ? [imageUrl, ...model.portfolioImages]
        : model.portfolioImages.length > 0
          ? model.portfolioImages
          : imageUrl
            ? [imageUrl]
            : [];
    return { ...model, imageUrl, portfolioImages };
  });
}

export function featuredModelToPublicModel(
  model: PublicFeaturedModel,
  index = 0,
): PublicModel {
  const portfolioImages =
    model.portfolioImages && model.portfolioImages.length > 0
      ? model.portfolioImages
      : model.imageUrl
        ? [model.imageUrl]
        : [];
  return {
    id: `featured-${index}-${normalizeModelName(model.name).replace(/\s/g, "-")}`,
    name: model.name,
    imageUrl: portfolioImages[0] ?? model.imageUrl,
    height: model.height?.trim() || undefined,
    portfolioImages,
    isFeaturedOnly: true,
  };
}

export function featuredToPublicModels(featured: PublicFeaturedModel[]): PublicModel[] {
  return featured.map((item, index) => featuredModelToPublicModel(item, index));
}

function mapDetailToPublicModel(detail: AdminUserDetail): PublicModel {
  const profile = detail.modelProfile;
  const name = profile?.fullName?.trim() || detail.email;

  const portfolioImages: string[] =
    detail.registrationMedia?.portfolioPhotos
      ?.map((p) => p.url)
      .filter(Boolean) ?? [];

  const profilePhotoUrl = detail.registrationMedia?.profilePhoto?.url ?? null;
  const imageUrl = portfolioImages[0] ?? profilePhotoUrl ?? null;

  const workExperienceImages: string[] =
    detail.registrationMedia?.workExperience
      ?.flatMap((entry) => entry.images.map((img) => img.url))
      .filter(Boolean) ?? [];

  return {
    id: detail.id,
    name,
    imageUrl,
    tier: profile?.tier,
    category: mapTierToCategory(profile?.tier),
    gender: profile?.gender,
    height: profile?.heightEnc ?? undefined,
    weight: profile?.weightEnc ?? undefined,
    chest: profile?.chestEnc ?? undefined,
    waist: profile?.waistEnc ?? undefined,
    rate: profile?.rate ?? undefined,
    measurements: formatMeasurements(profile),
    eyeColor: profile?.eyeColorEnc ?? undefined,
    hairColor: profile?.hairColorEnc ?? undefined,
    bio: profile?.shortBio ?? profile?.talentsEnc ?? undefined,
    portfolioImages,
    workExperienceImages,
  };
}

function mergePublicWithDetail(
  publicModel: PublicModel,
  detail: PublicModel,
): PublicModel {
  return {
    ...publicModel,
    ...detail,
    id: detail.id,
    name: detail.name || publicModel.name,
    height: detail.height || publicModel.height,
    imageUrl: publicModel.imageUrl ?? detail.imageUrl,
    portfolioImages:
      detail.portfolioImages.length > 0
        ? detail.portfolioImages
        : publicModel.portfolioImages,
    workExperienceImages:
      detail.workExperienceImages && detail.workExperienceImages.length > 0
        ? detail.workExperienceImages
        : publicModel.workExperienceImages,
  };
}

function isSyntheticModelId(id: string): boolean {
  return id.startsWith("public-") || id.startsWith("featured-");
}

/** Loads full profile fields (e.g. height) via existing authenticated user APIs. */
export async function resolveModelProfileForModal(
  model: PublicModel,
  token: string,
): Promise<PublicModel> {
  // Always fetch detail for authenticated users so weight/chest/rate/images are populated.
  if (!isSyntheticModelId(model.id)) {
    const detail = await fetchModelDetail(model.id, token);
    if (detail) return mergePublicWithDetail(model, mapDetailToPublicModel(detail));
  }

  const usersResult = await fetchAllModelUsers(token);
  if (!usersResult.ok) return model;

  const targetName = normalizeModelName(model.name);
  const details = await mapWithConcurrency(
    usersResult.users,
    (user) => fetchModelDetail(user.id, token),
    DETAIL_CONCURRENCY,
  );

  for (const detail of details) {
    if (!detail) continue;
    const mapped = mapDetailToPublicModel(detail);
    if (normalizeModelName(mapped.name) === targetName) {
      return mergePublicWithDetail(model, mapped);
    }
  }

  return model;
}

async function fetchModelDetail(
  userId: string,
  token: string,
): Promise<AdminUserDetail | null> {
  try {
    const res = await fetch(`/api/models/${userId}`, {
      headers: clientAuthHeaders(token),
    });
    if (!res.ok) return null;
    return (await res.json()) as AdminUserDetail;
  } catch {
    return null;
  }
}

async function mapWithConcurrency<T, R>(
  items: T[],
  mapper: (item: T) => Promise<R>,
  limit: number,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const current = index++;
      results[current] = await mapper(items[current]);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker()),
  );
  return results;
}

async function fetchPublicModelsPage(
  page: number,
): Promise<
  | { ok: true; data: PublicModelsPageResponse }
  | { ok: false; message: string; status: number }
> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(PUBLIC_PAGE_LIMIT),
    status: "ACTIVE",
    roles: MODEL_ROSTER_ROLES,
  });

  try {
    const res = await fetch(`/api/public/models?${params.toString()}`);

    if (!res.ok) {
      let message = "Failed to load models";
      try {
        const body = await res.json();
        if (body?.message) message = String(body.message);
      } catch {
        /* ignore */
      }
      return { ok: false, message, status: res.status };
    }

    const payload = (await res.json()) as PublicModelsPageResponse;
    return { ok: true, data: payload };
  } catch {
    return { ok: false, message: "Unable to connect to the server.", status: 502 };
  }
}

/** GET /v1/public/models — available to guests and signed-in users */
export async function fetchPublicModelRoster(): Promise<
  | { ok: true; data: PublicModel[] }
  | { ok: false; message: string; status: number }
> {
  const allModels: PublicApiModel[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const result = await fetchPublicModelsPage(page);
    if (!result.ok) {
      return result;
    }

    const { data, meta } = result.data;
    allModels.push(...(data ?? []));
    totalPages = meta?.totalPages ?? 1;
    page += 1;
  }

  const models = allModels.map((item, index) => mapPublicApiModelToPublicModel(item, index));
  return { ok: true, data: models };
}

async function fetchModelUsersPage(
  page: number,
  token: string,
): Promise<
  | { ok: true; data: PaginatedUsersResponse }
  | { ok: false; message: string; status: number }
> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(PUBLIC_PAGE_LIMIT),
    status: "ACTIVE",
    roles: MODEL_ROSTER_ROLES,
  });

  try {
    const res = await fetch(`/api/models?${params.toString()}`, {
      headers: clientAuthHeaders(token),
    });

    if (!res.ok) {
      let message = "Failed to load model profiles";
      try {
        const body = await res.json();
        if (body?.message) message = String(body.message);
      } catch {
        /* ignore */
      }
      return { ok: false, message, status: res.status };
    }

    const payload = (await res.json()) as PaginatedUsersResponse;
    return { ok: true, data: payload };
  } catch {
    return { ok: false, message: "Unable to connect to the server.", status: 502 };
  }
}

async function fetchAllModelUsers(
  token: string,
): Promise<
  | { ok: true; users: AdminUser[] }
  | { ok: false; message: string; status: number }
> {
  const allUsers: AdminUser[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const result = await fetchModelUsersPage(page, token);
    if (!result.ok) {
      return result;
    }

    const { data, meta } = result.data;
    allUsers.push(...(data ?? []));
    totalPages = meta?.totalPages ?? 1;
    page += 1;
  }

  return { ok: true, users: allUsers };
}

/** Enriches public roster with full profiles when the client is authenticated. */
async function enrichModelsWithProfiles(
  models: PublicModel[],
  token: string,
): Promise<PublicModel[]> {
  const usersResult = await fetchAllModelUsers(token);
  if (!usersResult.ok || usersResult.users.length === 0) {
    return models;
  }

  const details = await mapWithConcurrency(
    usersResult.users,
    (user: AdminUser) => fetchModelDetail(user.id, token),
    DETAIL_CONCURRENCY,
  );

  const detailById = new Map<string, PublicModel>();
  const detailByName = new Map<string, PublicModel>();
  for (const detail of details) {
    if (!detail) continue;
    const mapped = mapDetailToPublicModel(detail);
    detailById.set(mapped.id, mapped);
    detailByName.set(normalizeModelName(mapped.name), mapped);
  }

  let enrichedCount = 0;
  const enriched = models.map((model) => {
    const detail =
      detailById.get(model.id) ?? detailByName.get(normalizeModelName(model.name));
    if (!detail) return model;
    enrichedCount += 1;
    return mergePublicWithDetail(model, detail);
  });

  return enrichedCount > 0 ? enriched : models;
}

function hasProfileFields(model: PublicModel): boolean {
  return Boolean(model.tier || model.gender || model.height || model.rate);
}

export async function loadModelsPageData(options: {
  token: string | null;
}): Promise<{
  models: PublicModel[];
  restricted: boolean;
  notice?: string;
  error?: string;
}> {
  const rosterResult = await fetchPublicModelRoster();

  if (!rosterResult.ok) {
    const featuredResult = await fetchFeaturedModels();
    const fallback = featuredResult.ok ? featuredToPublicModels(featuredResult.data) : [];

    return {
      models: fallback,
      restricted: true,
      notice: fallback.length > 0 ? rosterResult.message : undefined,
      error: fallback.length === 0 ? rosterResult.message : undefined,
    };
  }

  let models = rosterResult.data;

  if (options.token) {
    models = await enrichModelsWithProfiles(models, options.token);
  }

  const hasFullProfiles = models.some(hasProfileFields);

  return {
    models,
    restricted: !hasFullProfiles,
    notice:
      options.token && !hasFullProfiles
        ? "Sign in with a client account to view full model profiles, measurements, and filters."
        : undefined,
  };
}

export function mapToTalentProfile(model: PublicModel): TalentProfile {
  const mainImage = model.imageUrl ?? "";
  const images =
    model.portfolioImages.length > 0
      ? model.portfolioImages
      : mainImage
        ? [mainImage]
        : [];

  return {
    id: model.id,
    name: model.name,
    type: "model",
    category: model.category,
    gender: model.gender,
    height: model.height,
    weight: model.weight,
    measurements: model.measurements,
    images,
    mainImage,
    portfolio: images,
    bio: model.bio ?? "",
    available: true,
    priceRate: model.rate,
    workGallery: images,
  };
}

export type ModelFilterCategory = ModelCategory | "All";

export interface ModelFilters {
  category: ModelFilterCategory;
  heightMin: number | null;
  heightMax: number | null;
  gender: "All" | "Male" | "Female";
}

export const DEFAULT_MODEL_FILTERS: ModelFilters = {
  category: "All",
  heightMin: null,
  heightMax: null,
  gender: "All",
};

export function filterModels(models: PublicModel[], filters: ModelFilters): PublicModel[] {
  return models.filter((model) => {
    if (filters.category !== "All" && model.category !== filters.category) {
      return false;
    }

    if (filters.heightMin !== null || filters.heightMax !== null) {
      const heightCm = parseHeightCm(model.height);
      if (heightCm === null) return false;
      if (filters.heightMin !== null && heightCm < filters.heightMin) return false;
      if (filters.heightMax !== null && heightCm > filters.heightMax) return false;
    }

    if (filters.gender !== "All") {
      const gender = model.gender?.toLowerCase() ?? "";
      const target = filters.gender.toLowerCase();
      if (!gender.includes(target)) return false;
    }

    return true;
  });
}
