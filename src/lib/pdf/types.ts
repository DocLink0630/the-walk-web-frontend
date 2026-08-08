export type PdfWorkExperience = {
  title: string;
  images: string[];
};

export type ModelProfilePdfData = {
  fullName: string;
  email: string;
  tier?: string | null;
  gender?: string | null;
  shortBio?: string | null;
  height?: string | null;
  weight?: string | null;
  chest?: string | null;
  shoulder?: string | null;
  waist?: string | null;
  eyeColor?: string | null;
  hairColor?: string | null;
  viewCount?: number;
  profileImage?: string | null;
  portfolioImages: string[];
  workExperience: PdfWorkExperience[];
};

export type InquiryTalentPdfData = {
  modelUserId?: string;
  modelName: string;
  modelType: string;
  category?: string | null;
  priceRate?: string | null;
  fullName: string;
  shortBio?: string | null;
  tier?: string | null;
  rate?: string | null;
  height?: string | null;
  weight?: string | null;
  chest?: string | null;
  shoulder?: string | null;
  waist?: string | null;
  eyeColor?: string | null;
  hairColor?: string | null;
  specialties?: string[];
  location?: string | null;
  yearsOfExperience?: number | null;
  equipmentOverview?: string | null;
  images: string[];
  workExperience: PdfWorkExperience[];
};

export type InquiryModelsPdfData = {
  inquiry: {
    id: string;
    phone: string;
    eventDate?: string | null;
    message: string;
    status: string;
    createdAt: string;
    clientName?: string;
    clientEmail?: string;
  };
  talents: InquiryTalentPdfData[];
};
