export async function checkEmailAvailable(
  email: string,
  role?: string,
): Promise<{ available: boolean; message?: string }> {
  try {
    const res = await fetch("/api/auth/check-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        ...(role ? { role } : {}),
      }),
    });

    const data = (await res.json()) as {
      available?: boolean;
      message?: string;
    };

    if (!res.ok) {
      return {
        available: false,
        message:
          data.message ?? "Unable to verify email. Please try again.",
      };
    }

    if (data.available === true) {
      return { available: true };
    }

    return {
      available: false,
      message: data.message ?? "Email already registered",
    };
  } catch {
    return {
      available: false,
      message: "Unable to verify email. Please try again.",
    };
  }
}
