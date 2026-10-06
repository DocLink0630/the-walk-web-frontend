"use client";

import { useEffect, useRef, useState } from "react";
import {
  formatVideoSize,
  uploadPortfolioVideoMultipart,
  validatePortfolioVideo,
  type PortfolioVideoMeta,
} from "@/lib/registration/upload-portfolio-video";

const ACCEPT = "video/mp4,video/webm,video/quicktime";

export interface PortfolioVideoUploadProps {
  token: string | null;
  meta: PortfolioVideoMeta | null;
  /** Server URL for an already-attached video (profile/admin). */
  existingUrl?: string | null;
  onUploaded: (payload: { token: string; fileName: string; size: number }) => void;
  onCleared: () => void;
  onUploadingChange?: (uploading: boolean) => void;
  disabled?: boolean;
  label?: string;
  hint?: string;
  /** When true, use admin typography (smaller uppercase labels). */
  variant?: "registration" | "admin" | "profile";
}

export default function PortfolioVideoUpload({
  token,
  meta,
  existingUrl = null,
  onUploaded,
  onCleared,
  onUploadingChange,
  disabled = false,
  label = "Intro / portfolio video",
  hint = "Optional. MP4, WebM, or MOV — max 200 MB.",
  variant = "registration",
}: PortfolioVideoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [localMeta, setLocalMeta] = useState<PortfolioVideoMeta | null>(meta);

  useEffect(() => {
    setLocalMeta(meta);
  }, [meta]);

  useEffect(() => {
    onUploadingChange?.(uploading);
  }, [uploading, onUploadingChange]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  function clearPreview() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
  }

  function setPreviewFromFile(file: File) {
    clearPreview();
    const url = URL.createObjectURL(file);
    previewUrlRef.current = url;
    setPreviewUrl(url);
  }

  async function startUpload(file: File) {
    const validation = validatePortfolioVideo(file);
    if (!validation.ok) {
      setError(validation.message);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setError(null);
    setUploading(true);
    setProgress(0);
    setLocalMeta({ fileName: file.name, size: file.size });
    setPreviewFromFile(file);

    const result = await uploadPortfolioVideoMultipart(file, {
      signal: controller.signal,
      onProgress: (uploaded, total) => {
        setProgress(total > 0 ? Math.round((uploaded / total) * 100) : 0);
      },
    });

    if (controller.signal.aborted) {
      setUploading(false);
      setProgress(0);
      return;
    }

    setUploading(false);

    if (!result.ok) {
      if (result.message !== "Upload cancelled") {
        setError(result.message);
      }
      clearPreview();
      setLocalMeta(null);
      setProgress(0);
      return;
    }

    setProgress(100);
    onUploaded({
      token: result.token,
      fileName: file.name,
      size: file.size,
    });
  }

  function handleCancel() {
    abortRef.current?.abort();
    abortRef.current = null;
    setUploading(false);
    setProgress(0);
    clearPreview();
    setLocalMeta(null);
    setError(null);
    onCleared();
  }

  function handleRemove() {
    abortRef.current?.abort();
    abortRef.current = null;
    setUploading(false);
    setProgress(0);
    clearPreview();
    setLocalMeta(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    onCleared();
  }

  function handlePick() {
    if (disabled || uploading) return;
    inputRef.current?.click();
  }

  const displayMeta = localMeta ?? meta;
  const playbackUrl = previewUrl ?? existingUrl;
  const hasVideo = Boolean(token || previewUrl || displayMeta || existingUrl);
  const labelClass =
    variant === "registration"
      ? "block font-ui text-[11px] font-normal tracking-[0.12em] uppercase text-[#0A0A0A] mb-1.5"
      : "font-ui text-[9px] tracking-[0.25em] uppercase text-[#0A0A0A]";
  const hintClass =
    variant === "registration"
      ? "font-ui text-[11px] text-[#6B6B6B] tracking-normal normal-case mt-1"
      : "font-ui text-[10px] text-[#6B6B6B] leading-relaxed";

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <p className={labelClass}>
          {label}
          <span className="text-[#6B6B6B] normal-case tracking-normal font-normal ml-2">
            (optional)
          </span>
        </p>
      </div>
      {hint && <p className={hintClass}>{hint}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        disabled={disabled || uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void startUpload(file);
        }}
      />

      {!hasVideo && !uploading && (
        <button
          type="button"
          onClick={handlePick}
          disabled={disabled}
          data-cursor="button"
          className="w-full border border-dashed border-[#E0E0E0] hover:border-[#C8A97A] transition-colors px-4 py-6 flex flex-col items-center justify-center gap-1 disabled:opacity-50"
        >
          <span className="text-[#C8A97A] text-2xl leading-none">+</span>
          <span className="font-ui text-[11px] tracking-[0.1em] uppercase text-[#6B6B6B]">
            Upload video
          </span>
        </button>
      )}

      {(hasVideo || uploading) && (
        <div className="border border-[#E0E0E0] bg-white p-3 space-y-3">
          {playbackUrl && (
            <video
              src={playbackUrl}
              controls
              className="w-full max-h-48 bg-black object-contain"
              preload="metadata"
            />
          )}

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-ui text-sm text-[#0A0A0A] truncate">
                {displayMeta?.fileName ?? "Video"}
              </p>
              {displayMeta && displayMeta.size > 0 && (
                <p className="font-ui text-[11px] text-[#6B6B6B]">
                  {formatVideoSize(displayMeta.size)}
                  {token && !uploading ? " · Ready" : null}
                </p>
              )}
              {existingUrl && !uploading && !displayMeta?.size && (
                <p className="font-ui text-[11px] text-[#6B6B6B]">Attached</p>
              )}
            </div>
            <div className="flex shrink-0 gap-2">
              {uploading ? (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="font-ui text-[10px] tracking-[0.1em] uppercase text-red-600 hover:underline"
                >
                  Cancel
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handlePick}
                    disabled={disabled}
                    className="font-ui text-[10px] tracking-[0.1em] uppercase text-[#0A0A0A] hover:underline disabled:opacity-40"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    disabled={disabled}
                    className="font-ui text-[10px] tracking-[0.1em] uppercase text-red-600 hover:underline disabled:opacity-40"
                  >
                    Remove
                  </button>
                </>
              )}
            </div>
          </div>

          {uploading && (
            <div className="space-y-1.5">
              <div className="h-1.5 w-full bg-[#F0F0F0] overflow-hidden">
                <div
                  className="h-full bg-[#C8A97A] transition-[width] duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="font-ui text-[10px] text-[#6B6B6B]">
                Uploading… {progress}%
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="font-ui text-[11px] text-red-600 leading-relaxed">{error}</p>
      )}
    </div>
  );
}
