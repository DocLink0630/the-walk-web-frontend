import type { WorkExperienceDraft } from "@/types/registration-form";
import type { WorkExperiencePayload } from "@/types/work-experience";
import { uploadFloatingImage } from "./upload-floating-image";

export function validateWorkExperienceDrafts(
  entries: WorkExperienceDraft[],
): string | null {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const title = entry.title.trim();
    const hasImages = entry.images.length > 0;

    if (!title && !hasImages) continue;

    if (!title) {
      return `Work experience ${i + 1}: enter a title for the project or show.`;
    }
    if (!hasImages) {
      return `Work experience ${i + 1}: add at least one photo.`;
    }
  }

  return null;
}

export function getCompleteWorkExperienceDrafts(
  entries: WorkExperienceDraft[],
): WorkExperienceDraft[] {
  return entries.filter(
    (entry) => entry.title.trim().length > 0 && entry.images.length > 0,
  );
}

export async function buildWorkExperiencePayload(
  entries: WorkExperienceDraft[],
  onProgress?: () => void,
): Promise<
  | { ok: true; payload: WorkExperiencePayload[] }
  | { ok: false; message: string }
> {
  const complete = getCompleteWorkExperienceDrafts(entries);
  const payload: WorkExperiencePayload[] = [];

  for (const entry of complete) {
    const images: WorkExperiencePayload["images"] = [];

    for (const image of entry.images) {
      const upload = await uploadFloatingImage(image.file, onProgress);
      if (!upload.ok) {
        return {
          ok: false,
          message: `Failed to upload work photo for "${entry.title.trim()}": ${upload.message}`,
        };
      }

      images.push({
        token: upload.token,
        ...(image.alt?.trim() ? { alt: image.alt.trim() } : {}),
      });
    }

    payload.push({
      title: entry.title.trim(),
      images,
    });
  }

  return { ok: true, payload };
}
