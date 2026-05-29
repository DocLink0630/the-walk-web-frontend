import type { ModelRegistrationImage } from "@/types/model-registration";
import FramedImage from "@/components/ui/FramedImage";

const IMAGE_LAYOUT: Record<
  ModelRegistrationImage["variant"],
  { className: string; style?: React.CSSProperties; showGoldAccent?: boolean }
> = {
  main: {
    className: "relative w-full aspect-[3/4] lg:aspect-[4/5]",
    style: { marginLeft: "10%" },
  },
  "accent-top": {
    className:
      "absolute top-[-5%] left-0 w-[35%] aspect-[3/4] z-10",
  },
  "accent-bottom": {
    className:
      "absolute bottom-[-8%] right-0 w-[45%] aspect-[3/4] z-10",
    showGoldAccent: true,
  },
};

export interface AsymmetricImageCompositionProps {
  images: ModelRegistrationImage[];
  decorativeText?: string;
  onImageRef?: (index: number, element: HTMLDivElement | null) => void;
}

export default function AsymmetricImageComposition({
  images,
  decorativeText,
  onImageRef,
}: AsymmetricImageCompositionProps) {
  return (
    <>
      {images.map((image, index) => {
        const layout = IMAGE_LAYOUT[image.variant];

        return (
          <FramedImage
            key={`${image.variant}-${index}`}
            ref={(element) => onImageRef?.(index, element)}
            src={image.src}
            alt={image.alt}
            className={layout.className}
            style={layout.style}
            showGoldAccent={layout.showGoldAccent}
            priority={image.variant === "main"}
          />
        );
      })}

      {decorativeText && (
        <div
          className="absolute top-[40%] right-[-5%] z-0 opacity-5 pointer-events-none"
          aria-hidden
        >
          <p className="font-display text-[180px] font-light text-[#0A0A0A] leading-none rotate-90">
            {decorativeText}
          </p>
        </div>
      )}
    </>
  );
}
