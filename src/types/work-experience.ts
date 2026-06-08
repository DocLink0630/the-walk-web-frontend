/** Matches backend WorkExperienceDto / WorkExperienceImageDto */
export interface WorkExperienceImagePayload {
  token: string;
  alt?: string;
}

export interface WorkExperiencePayload {
  title: string;
  images: WorkExperienceImagePayload[];
}
