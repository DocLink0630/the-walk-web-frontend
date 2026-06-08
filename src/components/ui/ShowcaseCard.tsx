import Image, { StaticImageData } from "next/image";
import Link from "next/link";

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

      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {index && (
        <div className="absolute top-4 md:top-6 left-4 md:left-6">
          <span className="font-ui text-[9px] md:text-[10px] font-light tracking-[0.3em] text-white/50">
            {index}
          </span>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7 lg:p-9">
        {eyebrow && (
          <p className="font-ui text-[8px] md:text-[9px] font-light tracking-[0.25em] md:tracking-[0.3em] uppercase text-[#C8A97A] mb-2">
            {eyebrow}
          </p>
        )}
        <h3 className="font-display text-[22px] md:text-[26px] lg:text-[30px] font-light tracking-[0.08em] text-white leading-[1.1] mb-3">
          {title}
        </h3>
        <p className="font-display italic text-[14px] md:text-[15px] font-light text-white/70 leading-[1.6] mb-4 md:mb-5 max-w-[380px] md:opacity-0 md:translate-y-3 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-400">
          {description}
        </p>
        <Link
          href={href}
          data-cursor="button"
          className="inline-block font-ui text-[8px] md:text-[9px] font-light tracking-[0.25em] md:tracking-[0.3em] uppercase text-white border-b border-white/40 pb-[2px] hover:border-[#C8A97A] hover:text-[#C8A97A] transition-colors duration-300 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0"
          style={{ transitionDelay: "60ms" }}
        >
          {ctaLabel}
        </Link>
      </div>
    </article>
  );
}