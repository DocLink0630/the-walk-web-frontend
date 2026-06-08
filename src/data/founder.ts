import type { FounderProfile, FounderQuoteParagraph } from "@/types/founder";

export const FOUNDER_PROFILE: FounderProfile = {
  name: "Dasun Wijesinghe",
  title: "Founder & Creative Director",
  image: "/images/dasun.jpg",
  imageAlt: "Dasun Wijesinghe",
};

export const FOUNDER_QUOTE_PARAGRAPHS: FounderQuoteParagraph[] = [
  {
    text: "When I founded The Walk Academy in 2019, my goal was simple: give aspiring models in Sri Lanka structured training, real industry insight, and the confidence to pursue work here at home.",
    variant: "lead",
  },
  {
    text: "Too many talented people were learning in fragments — without mentorship, without standards, and without a clear path forward. I wanted a place where discipline, professionalism, and creativity are taught together.",
    variant: "body",
  },
  {
    text: "The Walk Academy is that place. We focus on runway technique, portfolio development, and the everyday habits that help students stand out in castings and client projects across Sri Lanka.",
    variant: "body",
  },
  {
    text: "Every cohort reminds me why we started: Sri Lankan talent deserves an academy that takes their ambition seriously.",
    variant: "muted",
  },
];

export const FOUNDER_SECTION_COPY = {
  eyebrow: "FROM OUR FOUNDER",
} as const;
