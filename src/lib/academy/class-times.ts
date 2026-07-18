/** Shared class-time options for Academy registration + academy page */
export const ACADEMY_CLASS_TIMES = [
  {
    id: "sat-morning",
    label: "Saturday 10:00am – 12:30pm",
    day: "Saturday",
    time: "10:00am – 12:30pm",
  },
  {
    id: "sat-afternoon",
    label: "Saturday 1:30pm – 4:00pm",
    day: "Saturday",
    time: "1:30pm – 4:00pm",
  },
  {
    id: "sun-morning",
    label: "Sunday 10:00am – 12:30pm",
    day: "Sunday",
    time: "10:00am – 12:30pm",
  },
] as const;

export type AcademyClassTimeId = (typeof ACADEMY_CLASS_TIMES)[number]["id"];
