import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getBackendUrl } from "@/lib/backend/fetch";
import { buildModelProfilePdfData } from "@/lib/pdf/build-model-profile-pdf-data";
import { generateModelProfilePdf } from "@/lib/pdf/generate-pdf";

type RouteContext = { params: Promise<{ userId: string }> };

function getToken(request: NextRequest): string | null {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    getBackendUrl();
  } catch {
    return NextResponse.json({ message: "BACKEND_URL is not configured" }, { status: 500 });
  }

  const token = getToken(request);
  if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const { userId } = await context.params;
  const { status, data } = await backendFetch(`/v1/users/${userId}`, { token });

  if (status !== 200 || !data || typeof data !== "object") {
    return NextResponse.json(
      data ?? { message: "Failed to load model profile" },
      { status: status === 200 ? 500 : status },
    );
  }

  try {
    const pdfData = buildModelProfilePdfData(
      data as Parameters<typeof buildModelProfilePdfData>[0],
    );
    const { buffer, filename } = await generateModelProfilePdf(pdfData);

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
