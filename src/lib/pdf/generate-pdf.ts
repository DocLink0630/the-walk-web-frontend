import { readFileSync } from "fs";
import path from "path";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import type { ReactElement } from "react";

import { InquiryModelsDocument } from "./inquiry-models-document";
import { ModelProfileDocument } from "./model-profile-document";
import { fetchImageDataUri, resolveImageDataUris } from "./fetch-image-data-uri";
import type { InquiryModelsPdfData, ModelProfilePdfData } from "./types";

function slugify(value: string): string {
  return value.replace(/[^a-zA-Z0-9-_]+/g, "_").replace(/_+/g, "_").slice(0, 80);
}

function loadLogoDataUri(): string | null {
  const candidates = [
    { relativePath: "public/logo.jpeg", mime: "image/jpeg" },
    { relativePath: "src/assets/images/logo.png", mime: "image/png" },
  ] as const;

  for (const candidate of candidates) {
    try {
      const logoPath = path.join(process.cwd(), candidate.relativePath);
      const buffer = readFileSync(logoPath);
      return `data:${candidate.mime};base64,${buffer.toString("base64")}`;
    } catch {
      // try next candidate
    }
  }

  return null;
}

export async function generateModelProfilePdf(
  data: ModelProfilePdfData,
): Promise<{ buffer: Buffer; filename: string }> {
  const profileImage = data.profileImage
    ? await fetchImageDataUri(data.profileImage)
    : null;
  const portfolioImages = await resolveImageDataUris(data.portfolioImages);

  const workExperience = await Promise.all(
    data.workExperience.map(async (entry) => ({
      title: entry.title,
      images: await resolveImageDataUris(entry.images),
    })),
  );

  const logoSrc = loadLogoDataUri();

  const element = React.createElement(ModelProfileDocument, {
    data: {
      ...data,
      profileImage,
      portfolioImages,
      workExperience,
    },
    logoSrc,
  }) as ReactElement;

  const buffer = await renderToBuffer(
    element as Parameters<typeof renderToBuffer>[0],
  );

  return {
    buffer: Buffer.from(buffer),
    filename: `${slugify(data.fullName || "model")}-profile.pdf`,
  };
}

export async function generateInquiryModelsPdf(
  data: InquiryModelsPdfData,
): Promise<{ buffer: Buffer; filename: string }> {
  const talents = await Promise.all(
    data.talents.map(async (talent) => ({
      ...talent,
      images: await resolveImageDataUris(talent.images),
      workExperience: await Promise.all(
        talent.workExperience.map(async (entry) => ({
          title: entry.title,
          images: await resolveImageDataUris(entry.images),
        })),
      ),
    })),
  );

  const element = React.createElement(InquiryModelsDocument, {
    data: { ...data, talents },
  }) as ReactElement;

  const buffer = await renderToBuffer(
    element as Parameters<typeof renderToBuffer>[0],
  );

  const shortId = data.inquiry.id.slice(0, 8);
  const count = talents.length;
  return {
    buffer: Buffer.from(buffer),
    filename: `inquiry-${shortId}-${count}-model${count === 1 ? "" : "s"}.pdf`,
  };
}
