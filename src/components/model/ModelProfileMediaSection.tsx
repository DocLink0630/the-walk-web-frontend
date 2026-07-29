"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Trash2, Upload } from "lucide-react";
import type { AdminModelRegistrationMedia } from "@/types/admin";
import { uploadFloatingImage } from "@/lib/registration/upload-floating-image";
import {
  attachModelMedia,
  createModelWorkExperience,
  deleteModelMedia,
  deleteModelWorkExperience,
  updateModelWorkExperienceTitle,
} from "@/lib/model/profile-api";

interface ModelProfileMediaSectionProps {
  media: AdminModelRegistrationMedia | null | undefined;
  onMediaChange: (media: AdminModelRegistrationMedia) => void;
  onError: (message: string) => void;
}

export default function ModelProfileMediaSection({
  media,
  onMediaChange,
  onError,
}: ModelProfileMediaSectionProps) {
  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const workInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [newWorkTitle, setNewWorkTitle] = useState("");
  const [uploadTargetWorkId, setUploadTargetWorkId] = useState<string | null>(null);

  const portfolio = media?.portfolioPhotos ?? [];
  const workExperience = media?.workExperience ?? [];
  const profilePhoto = media?.profilePhoto ?? null;

  async function handleProfilePhotoUpload(file: File) {
    setBusy(true);
    const upload = await uploadFloatingImage(file);
    if (!upload.ok) {
      onError(upload.message);
      setBusy(false);
      return;
    }
    const result = await attachModelMedia({ token: upload.token, type: "PROFILE" });
    setBusy(false);
    if (!result.ok) {
      onError(result.message);
      return;
    }
    onMediaChange(result.registrationMedia);
  }

  async function handlePortfolioUpload(file: File) {
    setBusy(true);
    const upload = await uploadFloatingImage(file);
    if (!upload.ok) {
      onError(upload.message);
      setBusy(false);
      return;
    }
    const result = await attachModelMedia({ token: upload.token, type: "PORTFOLIO" });
    setBusy(false);
    if (!result.ok) {
      onError(result.message);
      return;
    }
    onMediaChange(result.registrationMedia);
  }

  async function handleDeletePhoto(storageFileId: string) {
    if (!window.confirm("Remove this photo?")) return;
    setBusy(true);
    const result = await deleteModelMedia(storageFileId);
    setBusy(false);
    if (!result.ok) {
      onError(result.message);
      return;
    }
    onMediaChange(result.registrationMedia);
  }

  async function handleWorkPhotoUpload(workExperienceId: string, file: File) {
    setBusy(true);
    const upload = await uploadFloatingImage(file);
    if (!upload.ok) {
      onError(upload.message);
      setBusy(false);
      return;
    }
    const result = await attachModelMedia({
      token: upload.token,
      type: "WORK_EXPERIENCE",
      workExperienceId,
    });
    setBusy(false);
    if (!result.ok) {
      onError(result.message);
      return;
    }
    onMediaChange(result.registrationMedia);
  }

  async function handleCreateWorkExperience(file: File) {
    if (!newWorkTitle.trim()) {
      onError("Work experience title is required");
      return;
    }
    setBusy(true);
    const upload = await uploadFloatingImage(file);
    if (!upload.ok) {
      onError(upload.message);
      setBusy(false);
      return;
    }
    const result = await createModelWorkExperience(newWorkTitle.trim(), [upload.token]);
    setBusy(false);
    if (!result.ok) {
      onError(result.message);
      return;
    }
    setNewWorkTitle("");
    onMediaChange(result.registrationMedia);
  }

  async function handleUpdateWorkTitle(id: string, title: string) {
    if (!title.trim()) return;
    setBusy(true);
    const result = await updateModelWorkExperienceTitle(id, title.trim());
    setBusy(false);
    if (!result.ok) {
      onError(result.message);
      return;
    }
    onMediaChange(result.registrationMedia);
  }

  async function handleDeleteWorkEntry(id: string) {
    if (!window.confirm("Delete this work experience entry and all its photos?")) return;
    setBusy(true);
    const result = await deleteModelWorkExperience(id);
    setBusy(false);
    if (!result.ok) {
      onError(result.message);
      return;
    }
    onMediaChange(result.registrationMedia);
  }

  return (
    <div className="space-y-6">
      <section className="bg-white border border-[#E0E0E0] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative w-28 h-36 shrink-0 border border-[#E0E0E0] bg-[#F5F5F5] overflow-hidden">
            {profilePhoto?.url ? (
              <Image
                src={profilePhoto.url}
                alt="Profile"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center font-ui text-[8px] tracking-[0.15em] uppercase text-[#9A9A9A] text-center px-2">
                No photo
              </div>
            )}
          </div>
          <div className="space-y-2">
            <h2 className="font-ui text-[9px] tracking-[0.25em] uppercase text-[#0A0A0A]">
              Profile picture
            </h2>
            <p className="font-ui text-[10px] text-[#6B6B6B] leading-relaxed max-w-xs">
              This is your main headshot on listings and PDF exports.
            </p>
            <input
              ref={profileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleProfilePhotoUpload(file);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => profileInputRef.current?.click()}
              className="inline-flex items-center gap-1 font-ui text-[8px] tracking-[0.15em] uppercase border border-[#C8A97A] px-4 py-2 hover:bg-[#FFFBF5] disabled:opacity-50"
            >
              <Upload className="size-3" />
              {profilePhoto ? "Change photo" : "Upload photo"}
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white border border-[#E0E0E0] p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-ui text-[9px] tracking-[0.25em] uppercase text-[#0A0A0A]">
            Portfolio photos ({portfolio.length}/5)
          </h2>
          {portfolio.length < 5 && (
            <>
              <input
                ref={portfolioInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handlePortfolioUpload(file);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                disabled={busy}
                onClick={() => portfolioInputRef.current?.click()}
                className="inline-flex items-center gap-1 font-ui text-[8px] tracking-[0.15em] uppercase border border-[#E0E0E0] px-3 py-1.5 hover:border-[#C8A97A] disabled:opacity-50"
              >
                <Upload className="size-3" />
                Add photo
              </button>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {portfolio.map((item, index) => (
            <div key={item.storageFileId} className="relative aspect-[3/4] border border-[#E0E0E0] overflow-hidden">
              <Image src={item.url} alt={`Portfolio ${index + 1}`} fill className="object-cover" unoptimized />
              {index === 0 && (
                <span className="absolute top-1 left-1 bg-[#C8A97A] text-white font-ui text-[7px] px-1.5 py-0.5 uppercase">
                  Cover
                </span>
              )}
              <button
                type="button"
                disabled={busy || portfolio.length <= 1}
                onClick={() => void handleDeletePhoto(item.storageFileId)}
                className="absolute top-1 right-1 p-1 bg-black/60 text-white hover:bg-red-600 disabled:opacity-40"
                aria-label="Delete photo"
              >
                <Trash2 className="size-3" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border border-[#E0E0E0] p-6 space-y-4">
        <h2 className="font-ui text-[9px] tracking-[0.25em] uppercase text-[#0A0A0A]">
          Work experience
        </h2>

        {workExperience.map((entry) => (
          <div key={entry.id} className="border border-[#E8E8E8] p-4 space-y-3">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                defaultValue={entry.title}
                onBlur={(e) => void handleUpdateWorkTitle(entry.id, e.target.value)}
                className="flex-1 border border-[#E0E0E0] px-2 py-1.5 font-ui text-[10px] outline-none focus:border-[#C8A97A]"
              />
              <button
                type="button"
                disabled={busy}
                onClick={() => void handleDeleteWorkEntry(entry.id)}
                className="p-1.5 border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                aria-label="Delete entry"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {entry.images.map((item) => (
                <div key={item.storageFileId} className="relative aspect-[3/4] border border-[#E0E0E0] overflow-hidden">
                  <Image src={item.url} alt={entry.title} fill className="object-cover" unoptimized />
                  <button
                    type="button"
                    disabled={busy || entry.images.length <= 1}
                    onClick={() => void handleDeletePhoto(item.storageFileId)}
                    className="absolute top-1 right-1 p-1 bg-black/60 text-white hover:bg-red-600 disabled:opacity-40"
                    aria-label="Delete photo"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              ))}
            </div>

            {entry.images.length < 5 && (
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setUploadTargetWorkId(entry.id);
                  workInputRef.current?.click();
                }}
                className="inline-flex items-center gap-1 font-ui text-[8px] tracking-[0.15em] uppercase border border-[#E0E0E0] px-3 py-1.5 hover:border-[#C8A97A] disabled:opacity-50"
              >
                <Upload className="size-3" />
                Add photo
              </button>
            )}
          </div>
        ))}

        <input
          ref={workInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && uploadTargetWorkId) {
              void handleWorkPhotoUpload(uploadTargetWorkId, file);
            }
            e.target.value = "";
            setUploadTargetWorkId(null);
          }}
        />

        <div className="border border-dashed border-[#E0E0E0] p-4 space-y-3">
          <p className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A]">
            Add work experience
          </p>
          <input
            type="text"
            value={newWorkTitle}
            onChange={(e) => setNewWorkTitle(e.target.value)}
            placeholder="e.g. Fashion Week 2024"
            className="w-full border border-[#E0E0E0] px-3 py-2 font-ui text-[10px] outline-none focus:border-[#C8A97A]"
          />
          <input
            type="file"
            accept="image/*"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleCreateWorkExperience(file);
              e.target.value = "";
            }}
            className="font-ui text-[9px] text-[#6B6B6B]"
          />
        </div>
      </section>
    </div>
  );
}
