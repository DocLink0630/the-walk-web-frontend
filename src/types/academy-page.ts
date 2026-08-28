export interface AcademyStat {
  value: string;
  label: string;
}

export interface AcademyWhyItem {
  title: string;
  body: string;
}

export interface AcademyCourseMonth {
  number: string;
  title: string;
  items: string[];
}

export interface AcademyCourse {
  title: string;
  duration: string;
  level: string;
  description: string;
  months: AcademyCourseMonth[];
  image: string;
}

export interface AcademyTestimonial {
  quote: string;
  name: string;
  course?: string;
  year?: string;
  image?: string;
}

export interface AcademyFeeInstallment {
  label: string;
  amount: string;
}

export interface AcademyFees {
  eyebrow: string;
  heading: string;
  registration: { label: string; note: string; amount: string };
  installments: AcademyFeeInstallment[];
  installmentTotal: string;
  fullPayment: {
    badge: string;
    note: string;
    regular: string;
    amount: string;
    savings: string;
  };
  summary: string;
}

export interface AcademySkillCategory {
  title: string;
  items: string[];
}

export interface AcademyOutcomes {
  eyebrow: string;
  heading: string;
  assessmentIntro: string;
  assessmentItems: string[];
  developmentIntro: string;
  developmentItems: string[];
}

export type AcademyCourseId = "normal" | "advanced";

export interface AcademyCourseVariant {
  hero: { description: string };
  programme: {
    course: AcademyCourse;
    classTimes?: {
      description?: string;
    };
  };
  fees: AcademyFees;
  cta: { description: string };
  meta: { title: string; description: string };
  skills?: AcademySkillCategory[];
  outcomes?: AcademyOutcomes;
}

export interface AcademyPageContent {
  hero: {
    eyebrow: string;
    heading: string;
    description: string;
    image: string;
  };
  stats: AcademyStat[];
  why: {
    eyebrow: string;
    heading: string;
    items: AcademyWhyItem[];
    images: { src: string; alt: string }[];
  };
  programme: {
    eyebrow: string;
    heading: string;
    course: AcademyCourse;
    classTimes: {
      eyebrow: string;
      heading: string;
      description: string;
      slots: { day: string; time: string; label: string }[];
    };
  };
  fees: AcademyFees;
  testimonials: {
    eyebrow: string;
    heading: string;
    items: AcademyTestimonial[];
  };
  cta: {
    eyebrow: string;
    heading: string;
    description: string;
    href: string;
    label: string;
  };
}
