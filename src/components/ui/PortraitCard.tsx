import Image, { type StaticImageData } from "next/image";
import { forwardRef } from "react";

export interface PortraitCardProps {
  title: string;
  subtitle?: string;
  image: string | StaticImageData;
  imageAlt?: string;
  offset?: number;
  className?: string;
}

const PortraitCard = forwardRef<HTMLDivElement, PortraitCardProps>(
  ({ title, subtitle, image, imageAlt, offset = 0, className = "" }, ref) => {
    return (
      <div
        ref={ref}
        className={`group ${className}`}
        style={{ perspective: "1000px", marginTop: offset > 0 ? `${offset}px` : undefined }}
      >
        <div
          className="portrait-card-inner relative"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="portrait-card-image relative aspect-[3/4] overflow-hidden border border-[#E0E0E0]"
            data-cursor="image"
          >
            <Image
              src={image}
              alt={imageAlt ?? title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="mt-3 md:mt-4">
            <h3 className="font-ui text-[9px] md:text-[10px] lg:text-[11px] font-light tracking-[0.2em] md:tracking-[0.25em] uppercase text-[#0A0A0A]">
              {title}
            </h3>
            {subtitle && (
              <p className="font-ui text-[8px] md:text-[9px] font-light tracking-[0.25em] md:tracking-[0.3em] uppercase text-[#9A9A9A] mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  },
);

PortraitCard.displayName = "PortraitCard";

export default PortraitCard;