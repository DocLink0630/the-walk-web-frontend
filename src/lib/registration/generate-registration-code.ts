/** Unique application reference — not chosen by the applicant. */
export function generateRegistrationCode(prefix: "STU" | "MOD"): string {
  const now = new Date();
  const date =
    String(now.getFullYear()) +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const rand = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

  return `${prefix}-${date}-${rand}`;
}
