import Image, { type StaticImageData } from "next/image";
import { forwardRef } from "react";

export interface FramedImageProps {
  src: string | StaticImageData;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  showGoldAccent?: boolean;
  showGoldCorner?: boolean;
  sizes?: string;
  priority?: boolean;
  /** cover = photo fill; contain = logos and artwork */
  fit?: "cover" | "contain";
  imageClassName?: string;
}

const FramedImage = forwardRef<HTMLDivElement, FramedImageProps>(
  (
    {
      src,
      alt = "",
      className = "",
      style,
      showGoldAccent = false,
      showGoldCorner = false,
      sizes = "(max-width: 1024px) 100vw, 50vw",
      priority = false,
      fit = "cover",
      imageClassName = "",
    },
    ref,
  ) => {
    const fitClass =
      fit === "contain"
        ? "object-contain p-12 md:p-16"
        : "object-cover transition-transform duration-700 group-hover:scale-105";

    return (
      <div
        ref={ref}
        className={`overflow-hidden group ${className}`}
        style={style}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={`${fitClass} ${imageClassName}`.trim()}
          sizes={sizes}
        />
        <div
          className="absolute inset-0 border border-[#E0E0E0] pointer-events-none"
          aria-hidden
        />
        {showGoldAccent && (
          <div
            className="absolute inset-0 border-2 border-[#C8A97A] translate-x-3 translate-y-3 pointer-events-none"
            aria-hidden
          />
        )}
        {showGoldCorner && (
          <div
            className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-[#C8A97A] pointer-events-none"
            aria-hidden
          />
        )}
      </div>
    );
  },
);

FramedImage.displayName = "FramedImage";

export default FramedImage;
