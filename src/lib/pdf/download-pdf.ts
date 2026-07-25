import { getClientToken } from "@/lib/client/token";

async function downloadPdfResponse(
  url: string,
  fallbackFilename: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const token = getClientToken();
  if (!token) {
    return { ok: false, message: "Your session has expired. Please sign in again." };
  }

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    let message = "Failed to generate PDF";
    try {
      const body = await res.json();
      if (body?.message) message = String(body.message);
    } catch {
      /* ignore */
    }
    return { ok: false, message };
  }

  const blob = await res.blob();
  const disposition = res.headers.get("content-disposition") ?? "";
  const match = disposition.match(/filename="([^"]+)"/);
  const filename = match?.[1] ?? fallbackFilename;

  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(objectUrl);

  return { ok: true };
}

export async function downloadModelProfilePdf(): Promise<
  { ok: true } | { ok: false; message: string }
> {
  return downloadPdfResponse(
    "/api/model/profile/export-pdf",
    "model-profile.pdf",
  );
}

export async function downloadModelProfilePdfForUser(
  userId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  return downloadPdfResponse(
    `/api/client/models/${encodeURIComponent(userId)}/export-pdf`,
    "model-profile.pdf",
  );
}

export async function downloadInquiryModelsPdf(
  inquiryId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  return downloadPdfResponse(
    `/api/client/inquiries/${encodeURIComponent(inquiryId)}/export-pdf`,
    `inquiry-${inquiryId.slice(0, 8)}-talent.pdf`,
  );
}

export async function downloadInquiryCartPdf(input: {
  phone: string;
  eventDate?: string;
  message?: string;
  cart: import("@/types/talents").BookingItem[];
  clientName?: string;
  clientEmail?: string;
  inquiryId?: string;
}): Promise<{ ok: true } | { ok: false; message: string }> {
  const token = getClientToken();
  if (!token) {
    return { ok: false, message: "Your session has expired. Please sign in again." };
  }

  const res = await fetch("/api/client/inquiries/export-pdf", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    let message = "Failed to generate PDF";
    try {
      const body = await res.json();
      if (body?.message) message = String(body.message);
    } catch {
      /* ignore */
    }
    return { ok: false, message };
  }

  const blob = await res.blob();
  const disposition = res.headers.get("content-disposition") ?? "";
  const match = disposition.match(/filename="([^"]+)"/);
  const filename = match?.[1] ?? "inquiry-talent.pdf";

  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(objectUrl);

  return { ok: true };
}
