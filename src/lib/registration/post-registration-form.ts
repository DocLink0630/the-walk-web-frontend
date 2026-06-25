export type RegistrationPostResult =
  | { ok: true }
  | { ok: false; message: string };

function formatNetworkError(err: unknown): string {
  const msg = err instanceof Error ? err.message : "Unknown error";
  if (/timeout|timed out|aborted/i.test(msg)) {
    return "Request timed out — your connection may be slow. Stay on this page and try again.";
  }
  if (/failed to fetch|network|load failed/i.test(msg)) {
    return "Network error — check your connection and try again.";
  }
  return `Unable to connect to the server (${msg}). Please try again.`;
}

/** POST multipart registration to /api/register (small payload when using image tokens). */
export async function postRegistrationForm(
  formData: FormData,
): Promise<RegistrationPostResult> {
  try {
    const res = await fetch("/api/register", {
      method: "POST",
      body: formData,
      signal: AbortSignal.timeout(180_000),
    });

    let data: {
      message?: string | string[];
      errors?: { field: string; constraints: Record<string, string> }[];
    } = {};
    try {
      data = (await res.json()) as typeof data;
    } catch {
      return {
        ok: false,
        message: `Server returned an invalid response (HTTP ${res.status}). Please try again.`,
      };
    }

    if (res.status === 201) return { ok: true };

    if (res.status === 429) {
      return { ok: false, message: "Too many requests. Please wait a moment and try again." };
    }
    if (res.status === 409) {
      const msg = Array.isArray(data.message) ? data.message.join(" ") : data.message;
      return {
        ok: false,
        message: msg ?? "An account with this email or NIC already exists.",
      };
    }
    if (res.status === 502) {
      const msg = Array.isArray(data.message) ? data.message.join(" ") : data.message;
      return {
        ok: false,
        message: msg ?? "Could not reach the registration server. Please try again.",
      };
    }

    if (data.errors && data.errors.length > 0) {
      const details = data.errors
        .map(({ field, constraints }) => {
          const msgs = Object.values(constraints).join("; ");
          return `${field}: ${msgs}`;
        })
        .join("\n");
      return { ok: false, message: `Validation failed:\n${details}` };
    }

    const msg = Array.isArray(data.message) ? data.message.join(" ") : data.message;
    return {
      ok: false,
      message: msg ?? "Registration failed. Please check your details and try again.",
    };
  } catch (err) {
    return { ok: false, message: formatNetworkError(err) };
  }
}
