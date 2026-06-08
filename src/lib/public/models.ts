import type { AdminUser, AdminUserDetail, ModelTier, PaginatedUsersResponse } from "@/types/admin";
import type { PublicFeaturedModel, PublicModel } from "@/types/public-model";
import type { ModelCategory, TalentProfile } from "@/types/talents";
import { clientAuthHeaders } from "@/lib/client/auth-request";
import { fetchFeaturedModels, getFirstName } from "@/lib/public/featured-models";

const DETAIL_CONCURRENCY = 5;
const ROSTER_PAGE_LIMIT = 100;

/** Swagger GET /v1/users — filter by UserRole.MODEL */
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
  return {
    id: `featured-${index}-${normalizeModelName(model.name).replace(/\s/g, "-")}`,
    name: model.name,
    imageUrl: model.imageUrl,
    portfolioImages: model.imageUrl ? [model.imageUrl] : [],
    isFeaturedOnly: true,
  };
}

export function featuredToPublicModels(featured: PublicFeaturedModel[]): PublicModel[] {
  return featured.map((item, index) => ({
    id: `featured-${index}-${normalizeModelName(item.name).replace(/\s/g, "-")}`,
    name: item.name,
    imageUrl: item.imageUrl,
    portfolioImages: item.imageUrl ? [item.imageUrl] : [],
    isFeaturedOnly: true,
  }));
}

function mapDetailToPublicModel(
  detail: AdminUserDetail,
  imageMap: Map<string, string | null>,
): PublicModel {
  const profile = detail.modelProfile;
  const name = profile?.fullName?.trim() || detail.email;
  const imageUrl = imageMap.get(normalizeModelName(name)) ?? null;

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
    portfolioImages: imageUrl ? [imageUrl] : [],
  };
}

async function fetchModelDetail(
  userId: string,
  token: string | null,
): Promise<AdminUserDetail | null> {
  try {
    const res = await fetch(`/api/models/${userId}`, {
      headers: clientAuthHeaders(token ?? undefined),
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

async function fetchModelUsersPage(
  page: number,
  token: string | null,
): Promise<
  | { ok: true; data: PaginatedUsersResponse }
  | { ok: false; message: string; status: number }
> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(ROSTER_PAGE_LIMIT),
    status: "ACTIVE",
    roles: MODEL_ROSTER_ROLES,
  });

  try {
    const res = await fetch(`/api/public/models?${params.toString()}`, {
      headers: clientAuthHeaders(token ?? undefined),
    });

    if (!res.ok) {
      let message = "Failed to load models from GET /v1/users";
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
  token: string | null,
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

/**
 * Loads ACTIVE models via Swagger GET /v1/users?roles=["MODEL"]&status=ACTIVE,
 * then enriches each row with GET /v1/users/:id for modelProfile fields.
 */
export async function fetchModelRoster(
  token: string | null,
): Promise<
  | { ok: true; data: PublicModel[] }
  | { ok: false; message: string; status: number }
> {
  const usersResult = await fetchAllModelUsers(token);
  if (!usersResult.ok) {
    return usersResult;
  }

  const featuredResult = await fetchFeaturedModels();
  const featured = featuredResult.ok ? featuredResult.data : [];
  const imageMap = buildFeaturedImageMap(featured);

  if (usersResult.users.length === 0) {
    return { ok: true, data: [] };
  }

  const details = await mapWithConcurrency(
    usersResult.users,
    (user: AdminUser) => fetchModelDetail(user.id, token),
    DETAIL_CONCURRENCY,
  );

  const models = details
    .filter((detail): detail is AdminUserDetail => detail !== null)
    .map((detail) => mapDetailToPublicModel(detail, imageMap));

  return { ok: true, data: mergeFeaturedImages(models, featured) };
}

export async function loadModelsPageData(options: {
  token: string | null;
}): Promise<{
  models: PublicModel[];
  restricted: boolean;
  notice?: string;
  error?: string;
}> {
  const featuredResult = await fetchFeaturedModels();
  const featured = featuredResult.ok ? featuredResult.data : [];

  const rosterResult = await fetchModelRoster(options.token);

  if (rosterResult.ok && rosterResult.data.length > 0) {
    return { models: rosterResult.data, restricted: false };
  }

  if (rosterResult.ok && rosterResult.data.length === 0) {
    return {
      models: featuredToPublicModels(featured),
      restricted: true,
      notice:
        "No ACTIVE models returned from GET /v1/users yet. Showing featured models.",
    };
  }

  if (!rosterResult.ok) {
    const fallback = featuredToPublicModels(featured);
    let notice: string;

    if (!options.token) {
      notice =
        "Sign in to load the full roster from GET /v1/users (roles=MODEL). Showing featured models.";
    } else if (rosterResult.status === 401) {
      notice = "Session expired. Sign in again to load models from GET /v1/users.";
    } else if (rosterResult.status === 403) {
      notice =
        "Your account needs user:read:any permission for GET /v1/users. Showing featured models.";
    } else {
      notice = rosterResult.message;
    }

    return {
      models: fallback,
      restricted: true,
      notice,
      error: fallback.length === 0 ? rosterResult.message : undefined,
    };
  }

  return {
    models: featuredToPublicModels(featured),
    restricted: true,
    notice: "Unable to load roster. Showing featured models.",
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
