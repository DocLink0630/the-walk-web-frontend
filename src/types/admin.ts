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
  | "REJECTED"
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED"
  | "DELETED";

export type ModelTier =
  | "PENDING"
  | "FRESHER"
  | "EXPERIENCED"
  | "SUPERMODEL";

/** Admin-assigned tiers (excludes PENDING) */
export type AssignableModelTier = Exclude<ModelTier, "PENDING">;

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

export interface AdminModelProfile {
  id?: string;
  userId?: string;
  fullName?: string;
  gender?: string;
  modelCode?: string;
  source?: string;
  age?: number;
  tier?: ModelTier;
  rate?: string | null;
  shortBio?: string | null;
  isFeatured?: boolean;
  heightEnc?: string | null;
  weightEnc?: string | null;
  chestEnc?: string | null;
  shoulderEnc?: string | null;
  waistEnc?: string | null;
  shoeSizeEnc?: string | null;
  eyeColorEnc?: string | null;
  hairColorEnc?: string | null;
  talentsEnc?: string | null;
  skinColorOptionId?: string | null;
  preferredBranchRaw?: string | null;
  preferredDate?: string | null;
  contactNumberEnc?: string | null;
  whatsappNumberEnc?: string | null;
  addressEnc?: string | null;
}

export interface AdminModelExpectations {
  id?: string;
  modelProfileId?: string;
  /** Applicant-submitted rate (decrypted from rateEnc) */
  rateEnc?: string | null;
  tier?: ModelTier;
  /** Applicant-submitted talents (decrypted from talentsEnc) */
  talentsEnc?: string | null;
}

export interface AdminUserDetail extends AdminUser {
  modelProfile?: AdminModelProfile;
  model_expectations?: AdminModelExpectations | null;
}

export interface ModelApprovalPayload {
  rate: string;
  tier: AssignableModelTier;
  talents: string;
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
