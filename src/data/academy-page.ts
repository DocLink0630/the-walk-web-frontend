import type { AcademyCourseId, AcademyCourseVariant, AcademyPageContent } from "@/types/academy-page";

const SHARED_CLASS_TIMES: AcademyPageContent["programme"]["classTimes"] = {
  eyebrow: "SCHEDULE",
  heading: "Class times",
  description: "Choose the session that fits your week when you apply. Limited seats per class.",
  slots: [
    { day: "Saturday", time: "10:00am – 12:30pm", label: "Saturday 10:00am – 12:30pm" },
    { day: "Saturday", time: "1:30pm – 4:00pm", label: "Saturday 1:30pm – 4:00pm" },
    { day: "Sunday", time: "10:00am – 12:30pm", label: "Sunday 10:00am – 12:30pm" },
  ],
};

export const ACADEMY_COURSES: Record<AcademyCourseId, AcademyCourseVariant> = {
  normal: {
    hero: {
      description:
        "Comprehensive professional training designed to launch and elevate modelling careers — led by industry veterans in a world-class environment.",
    },
    programme: {
      course: {
        title: "Professional Modelling Programme",
        duration: "3 Months",
        level: "All Levels",
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
        image: "/images/Gallery/DSC09790%20copy.webp",
      },
    },
    fees: {
      eyebrow: "INVESTMENT",
      heading: "Programme Fees",
      registration: {
        label: "Registration Fee",
        note: "One-time, non-refundable",
        amount: "2,000",
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
      summary: "Total Investment: 2,000 LKR (Registration) + Course Fee Option",
    },
    cta: {
      description:
        "Applications are now open for our upcoming intake. Submit your registration and take the first step toward a professional modelling career.",
    },
    meta: {
      title: "Academy — The Walk",
      description:
        "Professional modelling training at The Walk Academy. Three-month and four-month advanced programmes covering runway, portfolio, and agency placement in Sri Lanka.",
    },
  },
  advanced: {
    hero: {
      description:
        "From basic walk to professional runway performance. A 4-month advanced programme developing confident, disciplined models with emphasis on catwalk technique, runway presence, posing, and fashion-show performance.",
    },
    programme: {
      course: {
        title: "4-Month Advanced Modelling & Personality Development Course",
        duration: "4 Months",
        level: "Advanced",
        description:
          "From Basic Walk to Professional Runway Performance. This 4-month program is designed to develop students into confident, disciplined and professionally presented models, with particular emphasis on catwalk technique, runway presence, posing and fashion-show performance.",
        months: [
          {
            number: "MONTH 01",
            title: "Catwalk Foundation",
            items: [
              "Session 01 — Catwalk Fundamentals: Correct Posture, Basic Model Walk, Arm Positioning, Head and Eye Position, Pace and Rhythm, Starting and Stopping, Individual Walk Corrections",
              "Session 02 — Catwalk Turns & Poses: Half Turn, Side Pose, Basic Runway Pose, Girls' Arm Positions, Transition from Walk → Pose → Walk, Individual Correction",
              "Session 03 — Casual Wear Catwalk 1: Casual Wear Presentation, Natural Walk, Relaxed Body Movement, Attitude and Confidence, Music and Rhythm, Casual Runway Poses",
              "Session 04 — Casual Wear Catwalk 2: Advanced Casual Walk, Full Turn, Cross Turn, Different Runway Attitudes, Arm and Hand Control, Individual Runway Development",
            ],
          },
          {
            number: "MONTH 02",
            title: "Advanced Catwalk & Bridal",
            items: [
              "Session 05 — Advanced Turns: Full Turn, Cross Turn, Half Turn, Side Turn, Turn Combinations, Maintaining Balance and Posture, Smooth Transitions",
              "Session 06 — Bridal Catwalk 1: Bridal Posture, Elegant Walking, Slow Runway Movement, Hand Positioning, Dress Awareness, Bridal Poses, Elegant Turns",
              "Session 07 — Bridal Catwalk 2: Walking with Bridal Dress, Veil Awareness, Train/Dress Movement, Bridal Entrance, Bridal Turns, Bridal Poses, Working with Music",
              "Session 08 — Bridal Catwalk 3: Advanced Bridal Presentation, Complete Bridal Runway, Bride & Groom Coordination, Final Bridal Pose, Individual Corrections, Full Bridal Runway Practice",
            ],
          },
          {
            number: "MONTH 03",
            title: "Model Presentation & Camera",
            items: [
              "Session 09 — Posing Training: Basic Model Poses, Standing Poses, Side Poses, Full-Body Poses, Facial Expressions, Hand Positioning, Creating Pose Sequences",
              "Session 10 — Camera Posing & Equipment: Understanding the Camera, Working with Photographers, Posing for Different Camera Angles, Lighting Awareness, Movement in Front of Camera, Using Studio Equipment, Professional Photoshoot Behavior",
              "Session 11 — Make-up & Grooming: Professional Grooming, Basic Makeup Knowledge, Skin Preparation, Hair Presentation, Grooming for Fashion Shows, Grooming for Photoshoots, Choosing the Correct Look for Different Occasions",
              "Session 12 — Fitness, Posture & Body Movement: Model Posture, Flexibility, Body Control, Balance, Movement Training, Core Stability, Healthy Fitness Habits, Improving Runway Stamina",
            ],
          },
          {
            number: "MONTH 04",
            title: "Advanced Personality & Professional Development",
            items: [
              "Session 13 — Advanced Dining & Table Etiquette: Formal Table Setting, Cutlery Usage, Dining Posture, Restaurant Etiquette, Formal Dining Behavior, Business/Social Dinner Etiquette",
              "Session 14 — Advanced Catwalk Performance: Combining Turns, Cross Turns, Side Poses, Full Turns, Arm Movements, Walk → Turn → Pose → Walk Combinations, Music Interpretation, Individual Runway Style",
              "Session 15 — Fashion Show Simulation: Full Runway Rehearsal, Model Lineup, Entrances and Exits, Group Choreography, Spacing Between Models, Music Timing, Backstage Discipline, Designer/Show Coordination",
              "Session 16 — The Walk Final Runway: Fashion Show Simulation, The Walk Final Runway",
            ],
          },
        ],
        image: "/images/Gallery/DSC09790%20copy.webp",
      },
      classTimes: {
        description:
          "16 sessions · 2½ hours per session · 40 hours total training. Choose the session that fits your week when you apply. Limited seats per class.",
      },
    },
    fees: {
      eyebrow: "INVESTMENT",
      heading: "Programme Fees",
      registration: {
        label: "Registration Fee",
        note: "One-time, non-refundable",
        amount: "2,000",
      },
      installments: [
        { label: "Month 1", amount: "20,000" },
        { label: "Month 2", amount: "15,000" },
        { label: "Month 3", amount: "15,000" },
        { label: "Month 4", amount: "10,000" },
      ],
      installmentTotal: "60,000",
      fullPayment: {
        badge: "SAVE 5,000 LKR",
        note: "Pay the full course fee upfront and save",
        regular: "Regular: 60,000 LKR",
        amount: "55,000",
        savings: "5,000 LKR",
      },
      summary: "Total Investment: 2,000 LKR (Registration) + Course Fee Option",
    },
    cta: {
      description:
        "Applications are now open for our 4-month advanced programme. Submit your registration and take the next step toward professional runway performance.",
    },
    meta: {
      title: "Advanced Academy — The Walk",
      description:
        "4-month advanced modelling and personality development at The Walk Academy. Catwalk, bridal runway, camera posing, and fashion-show performance training in Sri Lanka.",
    },
    skills: [
      {
        title: "Catwalk",
        items: [
          "Basic Walk",
          "Casual Wear Walk",
          "Bridal Walk",
          "Half Turn",
          "Side Turn",
          "Full Turn",
          "Cross Turn",
          "Girls' Arm Positions",
          "Runway Posing",
          "Music & Rhythm",
          "Runway Confidence",
          "Fashion Show Choreography",
        ],
      },
      {
        title: "Camera & Presentation",
        items: [
          "Professional Posing",
          "Camera Posing",
          "Studio Equipment Awareness",
          "Facial Expressions",
          "Photographer Communication",
        ],
      },
      {
        title: "Personal Development",
        items: [
          "Make-up & Grooming",
          "Fitness & Posture",
          "Dining & Table Etiquette",
          "Professional Behavior",
          "Confidence & Presentation",
        ],
      },
    ],
    outcomes: {
      eyebrow: "FINAL DEVELOPMENT",
      heading: "Assessment & Individual Feedback",
      assessmentIntro: "Students will be assessed on:",
      assessmentItems: [
        "Casual wear catwalk",
        "Bridal catwalk",
        "Turns",
        "Poses",
        "Arm movements",
        "Runway confidence",
        "Facial expressions",
        "Body posture",
        "Music & rhythm",
        "Individual runway personality",
      ],
      developmentIntro: "Each student receives:",
      developmentItems: [
        "Individual performance feedback",
        "Strength identification",
        "Areas for improvement",
        "Professional guidance for future modeling opportunities",
      ],
    },
  },
};

/** Shared academy page content (course-agnostic sections). */
export const ACADEMY_PAGE: AcademyPageContent = {
  hero: {
    eyebrow: "EDUCATION & TRAINING",
    heading: "THE WALK ACADEMY",
    description: ACADEMY_COURSES.normal.hero.description,
    image: "/images/abothero.jpeg",
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
        src: "/images/Gallery/DSC09537copy.webp",
        alt: "Academy training",
      },
      {
        src: "/images/Gallery/DSC09407.webp",
        alt: "Training facility",
      },
      {
        src: "/images/Gallery/DSC09427copy.webp",
        alt: "Runway practice",
      },
    ],
  },
  programme: {
    eyebrow: "OUR PROGRAMME",
    heading: "What We Teach",
    course: ACADEMY_COURSES.normal.programme.course,
    classTimes: SHARED_CLASS_TIMES,
  },
  fees: ACADEMY_COURSES.normal.fees,
  testimonials: {
    eyebrow: "ALUMNI VOICES",
    heading: "What our graduates say.",
    items: [
      {
        quote:
          "Joining THE WALK Model Academy was one of the best decisions I made. The training improved my confidence, posture, and stage presence. The lessons are well-structured, and the guidance from the trainers helped me develop both personally and professionally. I highly recommend this academy to anyone interested in modeling.",
        name: "Rashmi",
      },
      {
        quote:
          "THE WALK Model Academy provided me with amazing opportunities to learn and grow in the fashion industry. From catwalk training to grooming and confidence-building, every session was valuable. The supportive environment made learning enjoyable and helped me become more confident on stage.",
        name: "Nethmi",
      },
      {
        quote:
          "My experience at THE WALK Model Academy has been incredible. The training sessions are professional, practical, and engaging. I learned proper runway techniques, posing skills, and how to present myself with confidence. I am grateful for the knowledge and opportunities I received through this academy.",
        name: "Lakshitha",
      },
    ],
  },
  cta: {
    eyebrow: "START YOUR JOURNEY",
    heading: "Ready to become part of the story?",
    description: ACADEMY_COURSES.normal.cta.description,
    href: "/register",
    label: "APPLY NOW",
  },
};

export const ACADEMY_PAGE_CONTAINER =
  "max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px]";
