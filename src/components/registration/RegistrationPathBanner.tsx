import Link from "next/link";

interface RegistrationPathBannerProps {
  variant: "model" | "student" | "beautician" | "photographer";
}

const CONFIG = {
  model: {
    label: "The Walk Agency · Model application",
    className: "bg-[#0A0A0A] text-white",
    linkClass: "text-[#C8A97A] hover:text-white",
  },
  student: {
    label: "The Walk Academy · Student application",
    className: "bg-[#C8A97A] text-[#0A0A0A]",
    linkClass: "text-[#0A0A0A]/70 hover:text-[#0A0A0A] underline underline-offset-2",
  },
  beautician: {
    label: "The Walk · Beautician application",
    className: "bg-[#0A0A0A] text-white",
    linkClass: "text-[#C8A97A] hover:text-white",
  },
  photographer: {
    label: "The Walk · Photographer application",
    className: "bg-[#0A0A0A] text-white",
    linkClass: "text-[#C8A97A] hover:text-white",
  },
} as const;

export default function RegistrationPathBanner({ variant }: RegistrationPathBannerProps) {
  const { label, className, linkClass } = CONFIG[variant];

  return (
    <div className={`w-full ${className}`}>
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-0 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="font-ui text-[10px] md:text-[11px] tracking-[0.2em] uppercase">
          {label}
        </p>
        <Link href="/" className={`font-ui text-[9px] tracking-[0.15em] uppercase shrink-0 ${linkClass}`}>
          Choose a different path
        </Link>
      </div>
    </div>
  );
}
