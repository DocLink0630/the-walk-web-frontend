import type { PublicModel } from "@/types/public-model";
import type {
  PublicInfluencer,
  PublicInfluencersPageResponse,
} from "@/types/public-influencer";

const PUBLIC_PAGE_LIMIT = 100;

async function fetchPublicInfluencersPage(
  page: number,
  search?: string,
): Promise<
  | { ok: true; data: PublicInfluencersPageResponse }
  | { ok: false; message: string; status: number }
> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(PUBLIC_PAGE_LIMIT),
  });
  if (search?.trim()) params.set("search", search.trim());

  try {
    const res = await fetch(`/api/public/influencers?${params.toString()}`);

    if (!res.ok) {
      let message = "Failed to load influencers";
      try {
        const body = await res.json();
        if (body?.message) message = String(body.message);
      } catch {
        /* ignore */
      }
      return { ok: false, message, status: res.status };
    }

    const payload = (await res.json()) as PublicInfluencersPageResponse;
    return { ok: true, data: payload };
  } catch {
    return { ok: false, message: "Unable to connect to the server.", status: 502 };
  }
}

/** GET /v1/public/influencers — available to guests and signed-in users */
export async function fetchPublicInfluencerRoster(options?: {
  search?: string;
}): Promise<
  | { ok: true; data: PublicInfluencer[] }
  | { ok: false; message: string; status: number }
> {
  const allInfluencers: PublicInfluencer[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const result = await fetchPublicInfluencersPage(page, options?.search);
    if (!result.ok) {
      return result;
    }

    const { data, meta } = result.data;
    allInfluencers.push(...(data ?? []));
    totalPages = meta?.totalPages ?? 1;
    page += 1;
  }

  return { ok: true, data: allInfluencers };
}

export function mapInfluencerToPublicModel(influencer: PublicInfluencer): PublicModel {
  const portfolioImages =
    influencer.portfolioImages && influencer.portfolioImages.length > 0
      ? influencer.portfolioImages
      : influencer.imageUrl
        ? [influencer.imageUrl]
        : [];

  return {
    id: influencer.userId,
    userId: influencer.userId,
    name: influencer.name,
    imageUrl: portfolioImages[0] ?? influencer.imageUrl,
    category: "Influencer",
    portfolioImages,
    portfolioCount: portfolioImages.length,
    isInfluencer: true,
  };
}
