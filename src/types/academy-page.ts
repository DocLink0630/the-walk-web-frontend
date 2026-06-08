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
  };
  fees: {
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
  };
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
