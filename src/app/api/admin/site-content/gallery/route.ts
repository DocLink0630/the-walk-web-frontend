import type { NextRequest } from "next/server";
import { adminSiteContentProxy } from "@/lib/admin/site-content-route";

export async function POST(request: NextRequest) {
  return adminSiteContentProxy(request, "/gallery", { method: "POST" });
}
