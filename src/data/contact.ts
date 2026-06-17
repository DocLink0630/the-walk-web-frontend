import type { ContactDetail } from "@/types/contact";

export const CONTACT_PHONE = "0769242088";
export const CONTACT_PHONE_DISPLAY = "076 924 2088";
export const CONTACT_EMAIL = "thewalkmodelagency@gmail.com";

export const CONTACT_DETAILS: ContactDetail[] = [
  {
    label: "LOCATION",
    lines: [
      "THE WALK MODEL ACADEMY",
      "Colombo Road, Pepiliyane",
      "Sri Lanka",
    ],
  },
  {
    label: "CONTACT",
    lines: [CONTACT_PHONE_DISPLAY, CONTACT_EMAIL],
  },
  {
    label: "HOURS",
    lines: ["Monday – Friday", "9:00 AM – 6:00 PM"],
  },
];
