/** Mirrors walk-web-backend StudentProfileDto + Prisma enums */

import type { AssignableModelTier } from "./model-profile";

export type StudentSource = "WALK_IN" | "ONLINE" | "REFERRAL" | "OTHER";

/** Student registration tier — same assignable set as model profiles */
export type ModelTier = AssignableModelTier;

/** JSON body for multipart `studentProfile` when role is STUDENT */
export interface StudentProfilePayload {
  modelCode: string;
  fullName: string;
  gender?: string;
  age?: number;
  nicEnc?: string;
  dobEnc?: string;
  addressEnc?: string;
  contactNumberEnc: string;
  whatsappNumberEnc?: string;
  tier: ModelTier;
  isLoginEnabled: boolean;
  source?: StudentSource;
  heightEnc?: string;
  weightEnc?: string;
  chestEnc?: string;
  shoulderEnc?: string;
  waistEnc?: string;
  shoeSizeEnc?: string;
  eyeColorEnc?: string;
  hairColorEnc?: string;
  talentsEnc?: string;
  shortBio?: string;
  skinColorOptionId?: string;
  preferredBranchRaw?: string;
  preferredDate?: string;
}
