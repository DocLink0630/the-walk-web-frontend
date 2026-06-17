import type { NextRequest } from "next/server";
import { adminSiteContentProxy } from "@/lib/admin/site-content-route";

export async function GET(request: NextRequest) {
  return adminSiteContentProxy(request, "");
}
