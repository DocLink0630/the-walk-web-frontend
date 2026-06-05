/** Mirrors walk-web-backend ModelProfileDto + Prisma enums */

export type ModelSource = "WALK_IN" | "ONLINE" | "REFERRAL" | "OTHER";

export type ModelTier = "FRESHER" | "EXPERIENCED" | "SUPERMODEL";

/** JSON body for multipart `modelProfile` when role is MODEL */
export interface ModelProfilePayload {
  modelCode: string;
  fullName: string;
  gender: string;
  age: number;
  nicEnc: string;
  dobEnc: string;
  addressEnc: string;
  contactNumberEnc: string;
  whatsappNumberEnc: string;
  tier: ModelTier;
  isLoginEnabled: boolean;
  source?: ModelSource;
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
}
