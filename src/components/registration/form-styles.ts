/** Shared registration form styles — readable contrast, consistent alignment */

export const formLabel =
  "block font-ui text-[11px] font-normal tracking-[0.12em] uppercase text-[#0A0A0A] mb-1.5";

export const formRequiredMark = "text-[#9A7329] font-normal";

export const formSubtitle =
  "font-ui text-xs text-[#4A4A4A] normal-case tracking-normal leading-relaxed";

export const formInput =
  "w-full border border-[#D4D4D4] bg-white px-4 py-3 font-ui text-sm text-[#0A0A0A] placeholder:text-[#9A9A9A] outline-none transition-colors focus:border-[#C8A97A] focus:ring-1 focus:ring-[#C8A97A]/30";

export const formSelect =
  "w-full border border-[#D4D4D4] bg-white px-4 py-3.5 font-ui text-base md:text-[17px] leading-snug text-[#0A0A0A] outline-none transition-colors focus:border-[#C8A97A] focus:ring-1 focus:ring-[#C8A97A]/30 cursor-pointer";

export const formSelectError = formSelect + " border-red-500";

export const formInputError =
  "w-full border border-red-500 bg-white px-4 py-3 font-ui text-sm text-[#0A0A0A] outline-none";

export const formInputReadOnly =
  "w-full border border-[#E0E0E0] bg-[#F5F5F5] px-4 py-3 font-ui text-sm text-[#0A0A0A] outline-none cursor-default";

export const formTextarea = formInput + " resize-none min-h-[88px]";

export const formSectionTitle =
  "font-ui text-[11px] font-normal tracking-[0.2em] uppercase text-[#0A0A0A] pt-4 pb-2 border-b-2 border-[#C8A97A] w-full";

export const formSectionHint = "text-[#6B6B6B] normal-case tracking-normal font-normal";

export const formHeading =
  "font-display text-3xl md:text-[2.75rem] font-light text-[#0A0A0A] tracking-normal leading-[1.1] mb-2 border-b-2 border-[#C8A97A] pb-3";

export const formHint =
  "font-ui text-[11px] text-[#6B6B6B] tracking-normal normal-case mt-1";

export const formActions =
  "flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:items-stretch";

export const formBackBtn =
  "font-ui text-[10px] tracking-[0.2em] uppercase px-8 py-4 border border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-all duration-300 sm:flex-none";

export const formCard =
  "w-full max-w-xl mx-auto px-4 sm:px-6 lg:px-0";

export const formPanel =
  "bg-white border border-[#E8E8E8] px-6 py-8 sm:px-8 sm:py-10 shadow-[0_1px_0_rgba(0,0,0,0.04)]";

export const formEyebrow =
  "font-display text-3xl sm:text-4xl md:text-5xl font-light text-[#0A0A0A] tracking-[0.06em] uppercase mb-6 pb-3 border-b-2 border-[#C8A97A]";

export const formDisclaimer =
  "font-ui text-xs text-[#4A4A4A] leading-relaxed text-center mt-8";

export const formDisclaimerLink =
  "text-[#0A0A0A] underline underline-offset-2 hover:text-[#9A7329] transition-colors";

export const progressLabel =
  "font-ui text-[11px] tracking-[0.15em] uppercase transition-colors duration-300";

export const progressLabelActive = "text-[#0A0A0A] font-normal";

export const progressLabelInactive = "text-[#6B6B6B]";

export const progressStepCounter =
  "font-ui text-[11px] tracking-[0.12em] uppercase text-[#4A4A4A]";
