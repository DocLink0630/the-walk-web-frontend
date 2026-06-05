export function decodeJwtPayload(
  token: string,
): { iss?: string; aud?: string | string[]; exp?: number; sub?: string } | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const padded = part + "=".repeat((4 - (part.length % 4)) % 4);
    const json = Buffer.from(
      padded.replace(/-/g, "+").replace(/_/g, "/"),
      "base64",
    ).toString("utf8");
    return JSON.parse(json) as {
      iss?: string;
      aud?: string | string[];
      exp?: number;
      sub?: string;
    };
  } catch {
    return null;
  }
}

export function isJwt(token: string): boolean {
  return token.split(".").length === 3;
}
