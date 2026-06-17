import type { NextRequest } from "next/server";
import { adminSiteContentProxy } from "@/lib/admin/site-content-route";

export async function PATCH(request: NextRequest) {
  return adminSiteContentProxy(request, "/gallery/visibility", { method: "PATCH" });
}
