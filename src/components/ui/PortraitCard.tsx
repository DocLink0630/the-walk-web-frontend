import Image, { type StaticImageData } from "next/image";
import { forwardRef } from "react";

export interface PortraitCardProps {
  title: string;
  subtitle?: string;
  image?: string | StaticImageData | null;
  imageAlt?: string;
  offset?: number;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

const PortraitCard = forwardRef<HTMLDivElement, PortraitCardProps>(
  (
    {
      title,
      subtitle,
      image,
      imageAlt,
      offset = 0,
      className = "",
      onClick,
      interactive = false,
    },
    ref,
  ) => {
    const isClickable = interactive || !!onClick;

    const inner = (
      <div
        className="portrait-card-inner relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="portrait-card-image relative aspect-[3/4] overflow-hidden border border-[#E0E0E0] bg-[#F5F5F5]"
          data-cursor={image ? "image" : undefined}
        >
          {image ? (
            <Image
              src={image}
              alt={imageAlt ?? title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
              unoptimized={typeof image === "string" && image.startsWith("http")}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-ui text-[9px] tracking-[0.2em] uppercase text-[#9A9A9A]">
                Coming soon
              </span>
            </div>
          )}
          <div
            className={`absolute inset-x-0 bottom-0 px-4 pb-4 pt-16 ${
              image
                ? "bg-gradient-to-t from-black via-black/70 to-transparent"
                : ""
            }`}
          >
            <h3
              className={`font-ui text-[22px] md:text-[26px] font-bold tracking-[0.06em] uppercase leading-[1.1] ${
                image
                  ? "text-white [text-shadow:0_2px_16px_rgba(0,0,0,1),0_1px_3px_rgba(0,0,0,0.9)]"
                  : "text-[#0A0A0A]"
              }`}
            >
              {title}
            </h3>
            {subtitle && (
              <p className="font-ui text-[10px] md:text-[11px] font-semibold tracking-[0.14em] uppercase text-[#E8D5B5] mt-1.5 [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    );

    const wrapperStyle = {
      perspective: "1000px" as const,
      marginTop: offset > 0 ? `${offset}px` : undefined,
    };

    if (isClickable) {
      return (
        <div ref={ref} className={`group ${className}`} style={wrapperStyle}>
          <button type="button" onClick={onClick} className="text-left w-full">
            {inner}
          </button>
        </div>
      );
    }

    return (
      <div ref={ref} className={`group ${className}`} style={wrapperStyle}>
        {inner}
      </div>
    );
  },
);

PortraitCard.displayName = "PortraitCard";

export default PortraitCard;
