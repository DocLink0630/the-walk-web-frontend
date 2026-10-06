import { getClientToken } from "@/lib/client/token";
import type {
  AdminModelRegistrationMedia,
  AdminStudentProfile,
  UserRole,
  UserStatus,
} from "@/types/admin";

function authHeaders(): Record<string, string> {
  const token = getClientToken();
  if (!token) throw new Error("Not authenticated");
  return { Authorization: `Bearer ${token}` };
}

export interface StudentOwnProfile {
  id: string;
  email: string;
  status: UserStatus | string;
  roles?: UserRole[];
  studentProfile?: AdminStudentProfile | null;
  registrationMedia?: AdminModelRegistrationMedia | null;
}

export async function fetchOwnStudentProfile(): Promise<StudentOwnProfile | null> {
  try {
    const res = await fetch("/api/student/profile", {
      headers: authHeaders(),
    });
    if (!res.ok) return null;
    return (await res.json()) as StudentOwnProfile;
  } catch {
    return null;
  }
}
