"use client";

import { useRef } from "react";
import type { WorkExperienceDraft } from "@/types/registration-form";
import { ACCEPTED_IMAGE_MIME } from "@/lib/registration/accepted-image-types";
import { formHint, formLabel, formRequiredMark } from "./form-styles";
const MAX_IMAGES_PER_ENTRY = 5;

function createEntry(): WorkExperienceDraft {
  return {
    id: crypto.randomUUID(),
    title: "",
    images: [],
  };
}

interface WorkExperienceSectionProps {
  entries: WorkExperienceDraft[];
  onChange: (entries: WorkExperienceDraft[]) => void;
  errors?: Record<string, string | null>;
}

export default function WorkExperienceSection({
  entries,
  onChange,
  errors = {},
}: WorkExperienceSectionProps) {
  function updateEntry(id: string, patch: Partial<WorkExperienceDraft>) {
    onChange(entries.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)));
  }

  function removeEntry(id: string) {
    onChange(entries.filter((entry) => entry.id !== id));
  }

  function addEntry() {
    onChange([...entries, createEntry()]);
  }

  return (
    <div className="space-y-4">
      <div>
        <p className={formLabel}>Previous work experience</p>
        <p className={formHint}>
          Optional. Add past shows, campaigns, or projects — each entry needs a title and at least
          one photo.
        </p>
      </div>

      {entries.map((entry, index) => (
        <WorkExperienceEntryCard
          key={entry.id}
          index={index}
          entry={entry}
          titleError={errors[`title-${entry.id}`]}
          imagesError={errors[`images-${entry.id}`]}
          onUpdate={(patch) => updateEntry(entry.id, patch)}
          onRemove={() => removeEntry(entry.id)}
        />
      ))}

      <button
        type="button"
        onClick={addEntry}
        data-cursor="button"
        className="font-ui text-[9px] tracking-[0.2em] uppercase px-5 py-2.5 border border-[#E0E0E0] text-[#4A4A4A] hover:border-[#0A0A0A] transition-colors"
      >
        + Add work experience
      </button>
    </div>
  );
}

function WorkExperienceEntryCard({
  index,
  entry,
  titleError,
  imagesError,
  onUpdate,
  onRemove,
}: {
  index: number;
  entry: WorkExperienceDraft;
  titleError?: string | null;
  imagesError?: string | null;
  onUpdate: (patch: Partial<WorkExperienceDraft>) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function addImages(files: FileList) {
    const toAdd = Array.from(files).slice(0, MAX_IMAGES_PER_ENTRY - entry.images.length);
    onUpdate({
      images: [
        ...entry.images,
        ...toAdd.map((file) => ({ file })),
      ],
    });
  }

  function removeImage(imageIndex: number) {
    onUpdate({
      images: entry.images.filter((_, i) => i !== imageIndex),
    });
  }

  return (
    <div className="border border-[#E0E0E0] p-4 md:p-5 space-y-4 bg-[#FAFAFA]">
      <div className="flex items-start justify-between gap-4">
        <p className="font-ui text-[9px] tracking-[0.25em] uppercase text-[#9A7329]">
          Experience {index + 1}
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="font-ui text-[9px] tracking-[0.15em] uppercase text-[#9A9A9A] hover:text-red-600 transition-colors"
        >
          Remove
        </button>
      </div>

      <div className="space-y-1">
        <label className={formLabel} htmlFor={`work-title-${entry.id}`}>
          Title <span className={formRequiredMark}>*</span>
        </label>
        <input
          id={`work-title-${entry.id}`}
          type="text"
          value={entry.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="e.g. Colombo Fashion Week 2024"
          className={[
            "w-full border px-3 py-2.5 font-ui text-sm text-[#0A0A0A] bg-white outline-none transition-colors",
            titleError ? "border-red-400" : "border-[#E0E0E0] focus:border-[#C8A97A]",
          ].join(" ")}
        />
        {titleError && <p className={formHint + " text-red-600"}>{titleError}</p>}
      </div>

      <div className="space-y-2">
        <p className={formLabel}>
          Photos <span className={formRequiredMark}>*</span>
          <span className="text-[#6B6B6B] normal-case tracking-normal font-normal ml-2">
            ({entry.images.length}/{MAX_IMAGES_PER_ENTRY})
          </span>
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {entry.images.map((image, imageIndex) => {
            const url = URL.createObjectURL(image.file);
            return (
              <div
                key={`${image.file.name}-${imageIndex}`}
                className="relative group"
                style={{ aspectRatio: "3/4" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Work ${imageIndex + 1}`}
                  className="w-full h-full object-cover border border-[#E0E0E0]"
                />
                <button
                  type="button"
                  onClick={() => removeImage(imageIndex)}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white font-ui text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            );
          })}
          {entry.images.length < MAX_IMAGES_PER_ENTRY && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              data-cursor="button"
              className="border border-dashed border-[#E0E0E0] hover:border-[#C8A97A] transition-colors flex flex-col items-center justify-center gap-1"
              style={{ aspectRatio: "3/4" }}
            >
              <span className="text-[#C8A97A] text-2xl">+</span>
              <span className="font-ui text-[11px] tracking-[0.1em] uppercase text-[#6B6B6B]">
                Add
              </span>
            </button>
          )}
        </div>
        {imagesError && <p className={formHint + " text-red-600"}>{imagesError}</p>}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_IMAGE_MIME}
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addImages(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
