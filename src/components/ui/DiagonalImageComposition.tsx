import type { AcademyImage } from "@/types/academy";
import FramedImage from "@/components/ui/FramedImage";

const IMAGE_LAYOUT: Record<
  AcademyImage["variant"],
  {
    className: string;
    style?: React.CSSProperties;
    showGoldCorner?: boolean;
  }
> = {
  main: {
    className: "relative aspect-[3/4]",
    style: { width: "75%", marginLeft: "0" },
  },
  "accent-overlap": {
    className:
      "absolute top-[15%] right-0 w-[40%] aspect-[3/4] z-10",
    showGoldCorner: true,
  },
};

export interface DiagonalImageCompositionProps {
  images: AcademyImage[];
  onImageRef?: (index: number, element: HTMLDivElement | null) => void;
}

export default function DiagonalImageComposition({
  images,
  onImageRef,
}: DiagonalImageCompositionProps) {
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
            showGoldCorner={layout.showGoldCorner}
            priority={image.variant === "main"}
          />
        );
      })}
    </>
  );
}
