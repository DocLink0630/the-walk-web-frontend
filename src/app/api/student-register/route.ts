import { NextRequest, NextResponse } from "next/server";
import {
  getAcademyFunctionsUrl,
  getAcademyRegistrationApiKey,
} from "@/lib/registration/academy-edge-config";

type UploadSlot = { signedUrl: string; path: string; sortOrder?: number };

type UploadUrlData = {
  registrationId: string;
  uploads: {
    photo?: UploadSlot;
    nicFront?: UploadSlot;
    nicBack?: UploadSlot;
    professionalPhotos?: UploadSlot[];
  };
};

function edgeHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "x-api-key": getAcademyRegistrationApiKey(),
  };
}

function errorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    if (typeof record.error === "string") return record.error;
    if (typeof record.message === "string") return record.message;
  }
  return fallback;
}

async function putToSignedUrl(
  signedUrl: string,
  file: File,
): Promise<void> {
  const res = await fetch(signedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "image/jpeg" },
    body: file,
  });
  if (!res.ok) {
    throw new Error(`Image upload failed (${res.status})`);
  }
}

/** Academy student registration — proxies to Supabase edge functions (not walk-web-backend). */
export async function POST(request: NextRequest) {
  let baseUrl: string;
  try {
    baseUrl = getAcademyFunctionsUrl();
    getAcademyRegistrationApiKey();
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server configuration error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: "Invalid form data" }, { status: 400 });
  }

  const payloadRaw = formData.get("payload");
  if (typeof payloadRaw !== "string") {
    return NextResponse.json({ message: "Missing registration payload" }, { status: 400 });
  }

  let registerPayload: Record<string, unknown>;
  try {
    registerPayload = JSON.parse(payloadRaw) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "Invalid registration payload" }, { status: 400 });
  }

  const profilePhoto = formData.get("profilePhoto");
  const nicFront = formData.get("nicFront");
  const nicBack = formData.get("nicBack");
  const portfolioPhotos = formData.getAll("portfolioPhotos");

  if (!(profilePhoto instanceof File) || !(nicFront instanceof File) || !(nicBack instanceof File)) {
    return NextResponse.json(
      { message: "Profile photo and NIC images are required" },
      { status: 400 },
    );
  }

  const professionalFiles = portfolioPhotos.filter((f): f is File => f instanceof File);
  if (professionalFiles.length === 0) {
    return NextResponse.json(
      { message: "At least one portfolio photo is required" },
      { status: 400 },
    );
  }

  const mime = (file: File) => file.type || "image/jpeg";

  const uploadSpec: Record<string, unknown> = {
    photo: { contentType: mime(profilePhoto) },
    nicFront: { contentType: mime(nicFront) },
    nicBack: { contentType: mime(nicBack) },
    professionalPhotos: professionalFiles.map((file) => ({
      contentType: mime(file),
    })),
  };

  try {
    const uploadUrlRes = await fetch(`${baseUrl}/student-register-upload-url`, {
      method: "POST",
      headers: edgeHeaders(),
      body: JSON.stringify(uploadSpec),
      signal: AbortSignal.timeout(60_000),
    });

    const uploadUrlBody = await uploadUrlRes.json();
    if (!uploadUrlRes.ok) {
      return NextResponse.json(
        uploadUrlBody ?? { message: errorMessage(uploadUrlBody, "Failed to prepare uploads") },
        { status: uploadUrlRes.status },
      );
    }

    const uploadData = (uploadUrlBody as { data: UploadUrlData }).data;
    registerPayload.registrationId = uploadData.registrationId;

    if (uploadData.uploads.photo) {
      await putToSignedUrl(uploadData.uploads.photo.signedUrl, profilePhoto);
      registerPayload.photoPath = uploadData.uploads.photo.path;
    }

    if (uploadData.uploads.nicFront) {
      await putToSignedUrl(uploadData.uploads.nicFront.signedUrl, nicFront);
      registerPayload.nicFrontPath = uploadData.uploads.nicFront.path;
      registerPayload.nicFrontMimeType = mime(nicFront);
    }

    if (uploadData.uploads.nicBack) {
      await putToSignedUrl(uploadData.uploads.nicBack.signedUrl, nicBack);
      registerPayload.nicBackPath = uploadData.uploads.nicBack.path;
      registerPayload.nicBackMimeType = mime(nicBack);
    }

    if (uploadData.uploads.professionalPhotos?.length) {
      const paths: string[] = [];
      const mimeTypes: string[] = [];
      for (let i = 0; i < uploadData.uploads.professionalPhotos.length; i++) {
        const slot = uploadData.uploads.professionalPhotos[i];
        const file = professionalFiles[i];
        await putToSignedUrl(slot.signedUrl, file);
        paths.push(slot.path);
        mimeTypes.push(mime(file));
      }
      registerPayload.professionalPhotoPaths = paths;
      registerPayload.professionalPhotoMimeTypes = mimeTypes;
    }

    const registerRes = await fetch(`${baseUrl}/student-register`, {
      method: "POST",
      headers: edgeHeaders(),
      body: JSON.stringify(registerPayload),
      signal: AbortSignal.timeout(120_000),
    });

    const registerBody = await registerRes.json();
    if (!registerRes.ok) {
      return NextResponse.json(
        {
          message: errorMessage(registerBody, "Registration failed"),
          ...(typeof registerBody === "object" ? registerBody : {}),
        },
        { status: registerRes.status },
      );
    }

    return NextResponse.json(registerBody, { status: 201 });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "Request failed";
    return NextResponse.json(
      { message: `Could not complete student registration (${detail}).` },
      { status: 502 },
    );
  }
}
