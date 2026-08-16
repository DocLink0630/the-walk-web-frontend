const AES_PAYLOAD = /^[0-9a-f]{16,}:[0-9a-f]{16,}:[0-9a-f]{16,}$/i;
const HEX_HASH = /^[0-9a-f]{32,}$/i;

/** Returns trimmed plaintext, or null when the value looks like AES ciphertext / a hex hash. */
export function plaintextOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (AES_PAYLOAD.test(trimmed) || HEX_HASH.test(trimmed)) return null;
  return trimmed;
}

export function sanitizePublicServiceProviderFields<T extends Record<string, unknown>>(
  item: T,
): T {
  return {
    ...item,
    shortBio: plaintextOrNull(item.shortBio),
    rateCard: plaintextOrNull(item.rateCard),
  };
}

export function sanitizePublicServiceProvidersPayload(data: unknown): unknown {
  if (!data || typeof data !== "object") return data;
  const payload = data as { data?: unknown };
  if (!Array.isArray(payload.data)) return data;
  return {
    ...payload,
    data: payload.data.map((item) => {
      if (!item || typeof item !== "object") return item;
      return sanitizePublicServiceProviderFields(item as Record<string, unknown>);
    }),
  };
}
