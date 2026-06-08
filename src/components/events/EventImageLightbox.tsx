"use client";

import Lightbox from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";

interface EventImageLightboxProps {
  images: string[];
  open: boolean;
  index: number;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
}

export default function EventImageLightbox({
  images,
  open,
  index,
  onClose,
  onIndexChange,
}: EventImageLightboxProps) {
  const slides = images.map((src) => ({ src }));

  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      slides={slides}
      plugins={[Counter, Zoom]}
      carousel={{ finite: images.length <= 1 }}
      animation={{ fade: 280 }}
      controller={{ closeOnBackdropClick: true }}
      on={{ view: ({ index: nextIndex }) => onIndexChange?.(nextIndex) }}
      styles={{
        container: { backgroundColor: "rgba(0, 0, 0, 0.96)" },
      }}
    />
  );
}
