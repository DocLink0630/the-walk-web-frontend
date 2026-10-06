import { NextRequest } from "next/server";
import { proxyMultipartPost } from "../_proxy";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  return proxyMultipartPost(request, "/v1/public/uploads/multipart/presign");
}
