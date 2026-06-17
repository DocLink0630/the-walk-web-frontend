import type { NextRequest } from "next/server";
import { adminSiteContentProxy } from "@/lib/admin/site-content-route";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return adminSiteContentProxy(request, `/events/${id}`, { method: "PATCH" });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return adminSiteContentProxy(request, `/events/${id}`, { method: "DELETE" });
}
