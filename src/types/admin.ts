export type UserRole =
  | "SUPER_ADMIN"
  | "MODEL"
  | "STUDENT"
  | "GUEST"
  | "INFLUENCER"
  | "BEAUTICIAN"
  | "PHOTOGRAPHER"
  | "CORPORATE_CLIENT";

export type UserStatus =
  | "PENDING_EMAIL_VERIFICATION"
  | "PENDING_ADMIN_REVIEW"
  | "PENDING_PAYMENT"
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED"
  | "DELETED";

export interface AdminUser {
  id: string;
  email: string;
  roles: UserRole[];
  status: UserStatus;
  onboardingStep: number;
  createdAt: string;
  updatedAt?: string;
  emailVerified?: boolean;
}

export interface AdminSession {
  email: string;
  roles: UserRole[];
  status: UserStatus;
  auth0UserId?: string;
  internalUserId?: string;
}

export interface PaginatedUsersMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedUsersResponse {
  data: AdminUser[];
  meta: PaginatedUsersMeta;
}

export interface LoginResponse {
  access_token?: string;
  id_token?: string;
  token_type?: string;
  expires_in?: number;
  user?: AdminUser;
  message?: string;
}
