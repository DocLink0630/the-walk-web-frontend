import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/backend/fetch";
import { generateInquiryModelsPdf } from "@/lib/pdf/generate-pdf";
import { loadInquiryModelsPdfData } from "@/lib/pdf/load-inquiry-pdf-data";
import type { BookingItem } from "@/types/talents";

function getToken(request: NextRequest): string | null {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

type DraftExportBody = {
  phone?: string;
  eventDate?: string;
  message?: string;
  clientName?: string;
  clientEmail?: string;
  inquiryId?: string;
  cart?: BookingItem[];
};

export async function POST(request: NextRequest) {
  try {
    getBackendUrl();
  } catch {
    return NextResponse.json({ message: "BACKEND_URL is not configured" }, { status: 500 });
  }

  const token = getToken(request);
  if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  let body: DraftExportBody;
  try {
    body = (await request.json()) as DraftExportBody;
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const cart = Array.isArray(body.cart) ? body.cart : [];
  const inquiryId = body.inquiryId?.trim();

  if (!inquiryId && cart.length === 0) {
    return NextResponse.json(
      { message: "Add talent to your cart before exporting." },
      { status: 400 },
    );
  }

  const loaded = await loadInquiryModelsPdfData(token, {
    inquiryId,
    phone: body.phone,
    eventDate: body.eventDate,
    message: body.message,
    clientName: body.clientName,
    clientEmail: body.clientEmail,
    cart,
  });

  if ("error" in loaded) {
    return NextResponse.json({ message: loaded.error }, { status: loaded.status });
  }

  try {
    const { buffer, filename } = await generateInquiryModelsPdf(loaded.data);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "PDF generation failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}
