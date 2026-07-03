"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { X } from "lucide-react";
import { getCroppedImageFile } from "@/lib/images/get-cropped-image-file";

interface ImageCropModalProps {
  imageSrc: string;
  fileName: string;
  onConfirm: (file: File) => void;
  onCancel: () => void;
}

export default function ImageCropModal({
  imageSrc,
  fileName,
  onConfirm,
  onCancel,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  async function handleConfirm() {
    if (!croppedAreaPixels) return;
    setSaving(true);
    setError(null);
    try {
      const file = await getCroppedImageFile(imageSrc, croppedAreaPixels, fileName);
      onConfirm(file);
    } catch {
      setError("Could not process the image. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-lg bg-white flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#E0E0E0] px-5 py-4 shrink-0">
          <div>
            <h2 className="font-display text-lg font-light text-[#0A0A0A]">Adjust your photo</h2>
            <p className="font-ui text-[11px] text-[#6B6B6B] mt-0.5">
              Drag to reposition, use the slider to zoom
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="text-[#9A9A9A] hover:text-[#0A0A0A] disabled:opacity-50"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="relative h-72 sm:h-80 bg-[#0A0A0A] shrink-0">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={undefined}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="px-5 py-4 space-y-4 shrink-0">
          <div className="space-y-2">
            <label
              htmlFor="crop-zoom"
              className="font-ui text-[10px] tracking-[0.15em] uppercase text-[#0A0A0A]"
            >
              Zoom
            </label>
            <input
              id="crop-zoom"
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-[#C8A97A]"
            />
          </div>

          {error && <p className="font-ui text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="flex-1 font-ui text-[10px] tracking-[0.15em] uppercase px-4 py-3 border border-[#E0E0E0] text-[#4A4A4A] hover:border-[#0A0A0A] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleConfirm()}
              disabled={saving || !croppedAreaPixels}
              className="flex-1 font-ui text-[10px] tracking-[0.15em] uppercase px-4 py-3 bg-[#0A0A0A] text-white hover:bg-[#C8A97A] transition-colors disabled:opacity-50"
            >
              {saving ? "Processing…" : "Use photo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
