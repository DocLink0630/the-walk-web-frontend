import { createRegistrationStore } from "./createRegistrationStore";

export const useRegistrationStore = createRegistrationStore("STU");

export type { RegistrationStore } from "@/types/registration-form";
