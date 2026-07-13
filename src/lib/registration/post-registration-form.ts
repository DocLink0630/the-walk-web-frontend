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

function extractServerMessage(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;
  const d = data as Record<string, unknown>;

  const fromValue = (value: unknown): string | undefined => {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (Array.isArray(value)) {
      const parts = value
        .map((item) => fromValue(item))
        .filter((item): item is string => Boolean(item));
      return parts.length ? parts.join(" ") : undefined;
    }
    if (value && typeof value === "object") {
      const obj = value as Record<string, unknown>;
      return (
        fromValue(obj.message) ||
        fromValue(obj.error) ||
        fromValue(obj.detail) ||
        fromValue(obj.title)
      );
    }
    return undefined;
  };

  return fromValue(d.message) || fromValue(d.error) || fromValue(d.errors);
}

function friendlyConflictMessage(raw?: string): string {
  const msg = (raw ?? "").toLowerCase();
  if (msg.includes("nic")) {
    return (
      raw ||
      "This NIC is already registered. If you already applied, wait for review or contact THE WALK Agency at WhatsApp 0772117088."
    );
  }
  if (msg.includes("email")) {
    return (
      raw ||
      "An account with this email already exists. Try logging in, or use a different email."
    );
  }
  return (
    raw ||
    "An account with this email or NIC already exists. If you already applied, wait for review or contact THE WALK Agency."
  );
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

    let data: unknown = {};
    try {
      data = await res.json();
    } catch {
      return {
        ok: false,
        message: `Server returned an invalid response (HTTP ${res.status}). Please try again.`,
      };
    }

    if (res.status === 201) return { ok: true };

    const msg = extractServerMessage(data);

    if (res.status === 429) {
      return { ok: false, message: "Too many requests. Please wait a moment and try again." };
    }
    if (res.status === 409) {
      return { ok: false, message: friendlyConflictMessage(msg) };
    }
    if (res.status === 502) {
      return {
        ok: false,
        message: msg ?? "Could not reach the registration server. Please try again.",
      };
    }

    const payload = data as {
      errors?: { field: string; constraints: Record<string, string> }[];
    };
    if (payload.errors && payload.errors.length > 0) {
      const details = payload.errors
        .map(({ field, constraints }) => {
          const msgs = Object.values(constraints).join("; ");
          return `${field}: ${msgs}`;
        })
        .join("\n");
      return { ok: false, message: `Validation failed:\n${details}` };
    }

    return {
      ok: false,
      message: msg ?? "Registration failed. Please check your details and try again.",
    };
  } catch (err) {
    return { ok: false, message: formatNetworkError(err) };
  }
}
