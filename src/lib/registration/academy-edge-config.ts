/** Supabase edge functions base URL — server-side only (never NEXT_PUBLIC). */
export function getAcademyFunctionsUrl(): string {
  const raw =
    process.env.ACADEMY_REGISTRATION_API_URL?.trim() ||
    process.env.SUPABASE_FUNCTIONS_URL?.trim();
  if (!raw) {
    throw new Error(
      "ACADEMY_REGISTRATION_API_URL (or SUPABASE_FUNCTIONS_URL) is not configured",
    );
  }
  return raw.replace(/\/$/, "");
}

export function getAcademyRegistrationApiKey(): string {
  const key =
    process.env.ACADEMY_REGISTRATION_API_KEY?.trim() ||
    process.env.REGISTRATION_API_KEY?.trim();
  if (!key) {
    throw new Error(
      "ACADEMY_REGISTRATION_API_KEY (or REGISTRATION_API_KEY) is not configured",
    );
  }
  return key;
}
