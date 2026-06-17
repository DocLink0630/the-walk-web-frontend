import Image, { StaticImageData } from "next/image";
import NavLinkWithStatus from "@/components/ui/NavLinkWithStatus";

const IMAGE_SIZE = {
  large: "aspect-[4/5] md:aspect-[3/4] max-h-[360px] md:max-h-[400px] lg:max-h-[420px]",
  small: "aspect-[4/5] md:aspect-[4/5] max-h-[300px] md:max-h-[340px] lg:max-h-[360px]",
} as const;

export interface ShowcaseCardProps {
  index?: string;
  eyebrow?: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  image: string | StaticImageData;
  imagePosition?: string;
  size?: keyof typeof IMAGE_SIZE;
  className?: string;
}

export default function ShowcaseCard({
  index,
  eyebrow,
  title,
  description,
  href,
  ctaLabel,
  image,
  imagePosition = "center",
  size = "small",
  className = "",
}: ShowcaseCardProps) {
  return (
    <article
      className={`relative group overflow-hidden bg-[#0A0A0A] ${className}`}
    >
      <div
        className={`relative w-full overflow-hidden ${IMAGE_SIZE[size]}`}
        data-cursor="image"
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ objectPosition: imagePosition }}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/45 to-transparent" />
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {index && (
        <div className="absolute top-4 md:top-6 left-4 md:left-6">
          <span className="font-ui text-[11px] md:text-[12px] font-semibold tracking-[0.2em] text-white/70">
            {index}
          </span>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7 lg:p-9">
        {eyebrow && (
          <p className="font-ui text-[10px] md:text-[11px] font-semibold tracking-[0.18em] uppercase text-[#E8D5B5] mb-2 [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
            {eyebrow}
          </p>
        )}
        <h3 className="font-ui text-[28px] md:text-[34px] lg:text-[38px] font-bold tracking-[0.05em] uppercase text-white leading-[1.05] mb-3 [text-shadow:0_2px_20px_rgba(0,0,0,1),0_1px_4px_rgba(0,0,0,0.9)]">
          {title}
        </h3>
        <p className="font-display text-[15px] md:text-[16px] font-normal text-white/90 leading-[1.6] mb-4 md:mb-5 max-w-[380px] md:opacity-0 md:translate-y-3 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-400 [text-shadow:0_1px_10px_rgba(0,0,0,0.8)]">
          {description}
        </p>
        <NavLinkWithStatus
          href={href}
          data-cursor="button"
          className="inline-block font-ui text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-white border-b-2 border-white/60 pb-[2px] hover:border-[#C8A97A] hover:text-[#C8A97A] transition-colors duration-300 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0"
          style={{ transitionDelay: "60ms" }}
        >
          {ctaLabel}
        </NavLinkWithStatus>
      </div>
    </article>
  );
}