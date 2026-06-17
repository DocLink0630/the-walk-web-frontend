import type { NextRequest } from "next/server";
import { adminInquiriesProxy } from "@/lib/admin/inquiries-route";

export async function GET(request: NextRequest) {
  return adminInquiriesProxy(request, "");
}
