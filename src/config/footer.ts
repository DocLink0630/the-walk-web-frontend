export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterSocialLink {
  label: string;
  href: string;
}

export const DEFAULT_FOOTER_BRAND = "THE WALK ACADEMY";

export const DEFAULT_FOOTER_TAGLINE =
  "Sri Lanka's platform connecting creative talent with the clients who need them.";

export const DEFAULT_FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "EXPLORE",
    links: [
      { label: "Models", href: "/models" },
      { label: "Beauty Artists", href: "/beauticians" },
      { label: "Photographers", href: "/photographers" },
      { label: "The Academy", href: "/academy" },
    ],
  },
  {
    title: "FOR TALENT",
    links: [
      { label: "List as Model", href: "/register/model" },
      { label: "List as Artist", href: "/register?role=beautician" },
      { label: "List as Photographer", href: "/register?role=photographer" },
      { label: "Academy Enrolment", href: "/register" },
    ],
  },
  {
    title: "FOR CLIENTS",
    links: [
      { label: "Register as Client", href: "/register/client" },
      { label: "Booking Inquiry", href: "/inquiry" },
      { label: "Browse Models", href: "/models" },
    ],
  },
  {
    title: "COMPANY",
    links: [
      { label: "About", href: "/about" },
      { label: "Gallery", href: "/gallery" },
      { label: "Events", href: "/events" },
    ],
  },
];

export const DEFAULT_FOOTER_SOCIAL_LINKS: FooterSocialLink[] = [
  { label: "Instagram", href: "https://www.instagram.com/the_walk_model_academy/" },
  { label: "Facebook", href: "https://www.facebook.com/TheWalkModelAcademy/" },
  { label: "TikTok", href: "https://www.tiktok.com/@the_walk_model_academy" },
];

export const DEFAULT_FOOTER_SOCIAL_HANDLE = "@thewalkacademy";
export const DEFAULT_FOOTER_SOCIAL_CTA = "Follow our journey";

export function getFooterCopyright(
  brand = DEFAULT_FOOTER_BRAND,
  year = new Date().getFullYear(),
) {
  return `© ${year} ${brand}. ALL RIGHTS RESERVED.`;
}

export const DEFAULT_FOOTER_LEGAL_LINKS: FooterLink[] = [
  { label: "PRIVACY POLICY", href: "#" },
  { label: "TERMS OF SERVICE", href: "#" },
];
