export type ModelCategory = "Super Model" | "Experienced" | "Freshers" | "Influencer";
export type TalentType = "model" | "beautician" | "photographer";
export type SkinTone = "Fair" | "Medium" | "Olive" | "Tan" | "Brown" | "Dark";
export type HairColor = "Blonde" | "Brown" | "Black" | "Red" | "Grey" | "Other";
export type EyeColor = "Blue" | "Green" | "Brown" | "Hazel" | "Grey" | "Other";

export interface Review {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  projectType?: string;
}

export interface GalleryCategory {
  name: string;
  images: string[];
}

export interface TalentProfile {
  id: string;
  name: string;
  type: TalentType;
  category?: ModelCategory;
  gender?: string;
  height?: string;
  weight?: string;
  measurements?: string;
  experience?: string;
  specialty?: string;
  images: string[];
  mainImage: string;
  portfolio?: string[];
  bio: string;
  instagram?: string;
  available: boolean;
  rating?: number;
  ratingCount?: number;
  priceRate?: string;
  workGallery?: string[];
  categorizedGallery?: GalleryCategory[];
  reviews?: Review[];
  skinTone?: SkinTone;
  hairColor?: HairColor;
  eyeColor?: EyeColor;
  age?: number;
  nationality?: string;
  languages?: string[];
  skills?: string[];
}

export interface BookingItem {
  talent: TalentProfile;
  notes?: string;
}
