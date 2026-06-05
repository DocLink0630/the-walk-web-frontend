import type { AcademyPageContent } from "@/types/academy-page";

export const ACADEMY_PAGE: AcademyPageContent = {
  hero: {
    eyebrow: "EDUCATION & TRAINING",
    heading: "ACADEMY",
    description:
      "Comprehensive professional training designed to launch and elevate modelling careers — led by industry veterans in a world-class environment.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1920&q=80",
  },
  stats: [
    { value: "200+", label: "Graduates" },
    { value: "85%", label: "Agency Placement" },
    { value: "12", label: "Industry Partners" },
    { value: "10", label: "Years Training" },
  ],
  why: {
    eyebrow: "WHY THE WALK ACADEMY",
    heading: "The standard that sets our graduates apart.",
    items: [
      {
        title: "INDUSTRY CONNECTIONS",
        body: "Direct pathways to Sri Lanka's leading fashion agencies, designers, and international scouts. Our graduates work with top brands across South Asia and beyond.",
      },
      {
        title: "PROFESSIONAL FACILITIES",
        body: "Train in purpose-built studios featuring professional runways, photography equipment, and styling resources that mirror real industry settings.",
      },
      {
        title: "EXPERIENCED FACULTY",
        body: "Learn from working professionals including international runway coaches, fashion photographers, and agency directors with decades of combined experience.",
      },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
        alt: "Academy training",
      },
      {
        src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
        alt: "Training facility",
      },
      {
        src: "https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=400&q=80",
        alt: "Runway practice",
      },
    ],
  },
  programme: {
    eyebrow: "OUR PROGRAMME",
    heading: "What We Teach",
    course: {
      title: "Professional Modelling Programme",
      duration: "3 Months",
      level: "All Levels",
      intake: "Next intake: July 7, 2025",
      description:
        "A comprehensive end-to-end programme covering everything a working professional model needs. From runway technique and editorial posing to portfolio development, personal branding, and direct agency connections — this is the complete foundation for a serious modelling career.",
      months: [
        {
          number: "MONTH 1",
          title: "Foundation",
          items: [
            "Introduction to Modeling & Industry Overview",
            "Posture, Balance & Stage Confidence",
            "Basic Catwalk Training (Straight Walk, Rhythm, Turns)",
            "Basic Posing for Camera & Stage",
            "Grooming Essentials: Personal Care, Styling, Etiquette",
            "Fitness & Body Awareness for Models",
          ],
        },
        {
          number: "MONTH 2",
          title: "Development",
          items: [
            "Advanced Catwalk Training (Zig-Zag, Triangle, Crossing, Pageant Walk)",
            "Facial Expressions & Stage Presence",
            "Dress Codes & Fashion Segments (Casual, Formal, Swimwear, Evening Wear)",
            "Photo Posing Techniques (Angles, Expressions, Body Language)",
            "Acting & Personality Development Workshop",
            "Voice Training & Public Speaking Basics",
          ],
        },
        {
          number: "MONTH 3",
          title: "Professional Exposure",
          items: [
            "Runway Choreography & Show Flow Training",
            "Advanced Poses & Transitions",
            "Confidence-Building & Interview Skills",
            "Branding & Social Media for Models",
            "Portfolio Photoshoot",
            "Final Rehearsals + Fashion Show",
          ],
        },
      ],
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80",
    },
  },
  fees: {
    eyebrow: "INVESTMENT",
    heading: "Programme Fees",
    registration: {
      label: "Registration Fee",
      note: "One-time, non-refundable",
      amount: "1,000",
    },
    installments: [
      { label: "1st Payment", amount: "20,000" },
      { label: "2nd Payment", amount: "15,000" },
      { label: "3rd Payment", amount: "15,000" },
    ],
    installmentTotal: "50,000",
    fullPayment: {
      badge: "SAVE 5,000 LKR",
      note: "Pay the full course fee upfront and save 10%",
      regular: "Regular: 50,000 LKR",
      amount: "45,000",
      savings: "5,000 LKR",
    },
    summary:
      "Total Investment: 1,000 LKR (Registration) + Course Fee Option",
  },
  testimonials: {
    eyebrow: "ALUMNI VOICES",
    heading: "What our graduates say.",
    items: [
      {
        quote:
          "The Walk Academy didn't just teach me how to walk a runway — it gave me the confidence to own a room. Within three months of graduating I was signed to an agency in Singapore.",
        name: "Amara Perera",
        course: "Professional Runway Mastery",
        year: "Class of 2024",
        image:
          "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80",
      },
      {
        quote:
          "I came in knowing nothing. The Foundation programme broke everything down, rebuilt it properly, and when I walked into my first agency casting I felt completely prepared.",
        name: "Kavindya Senanayake",
        course: "Foundation Modelling Course",
        year: "Class of 2024",
        image:
          "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&q=80",
      },
      {
        quote:
          "The editorial programme was exactly what my portfolio needed. Shooting with professional photographers in a real studio environment changed the quality of my book entirely.",
        name: "Dilini Fernando",
        course: "Editorial & Campaign Modelling",
        year: "Class of 2023",
        image:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
      },
    ],
  },
  cta: {
    eyebrow: "START YOUR JOURNEY",
    heading: "Ready to become part of the story?",
    description:
      "Applications are now open for our upcoming intake. Submit your registration and take the first step toward a professional modelling career.",
    href: "/register",
    label: "APPLY NOW",
  },
};

export const ACADEMY_PAGE_CONTAINER =
  "max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px]";
