"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { updateModelMediaOrder } from "@/lib/admin/users-api";
import type {
  AdminModelMediaItem,
  AdminModelRegistrationMedia,
  MediaOrderUpdateItem,
} from "@/types/admin";

interface DraftMediaState {
  profilePhoto: AdminModelMediaItem | null;
  nicFront: AdminModelMediaItem | null;
  nicBack: AdminModelMediaItem | null;
  portfolioPhotos: AdminModelMediaItem[];
  workExperience: {
    id: string;
    title: string;
    images: AdminModelMediaItem[];
  }[];
}

function cloneMedia(media: AdminModelRegistrationMedia): DraftMediaState {
  return {
    profilePhoto: media.profilePhoto ?? null,
    nicFront: media.nicFront ?? null,
    nicBack: media.nicBack ?? null,
    portfolioPhotos: [...(media.portfolioPhotos ?? [])],
    workExperience: (media.workExperience ?? []).map((entry) => ({
      id: entry.id,
      title: entry.title,
      images: [...entry.images],
    })),
  };
}

function normalizeOrders(items: AdminModelMediaItem[]): AdminModelMediaItem[] {
  return items.map((item, index) => ({ ...item, order: index }));
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function collectOrderPayload(draft: DraftMediaState): MediaOrderUpdateItem[] {
  const payload: MediaOrderUpdateItem[] = [];

  const groups: AdminModelMediaItem[][] = [
    draft.profilePhoto ? [draft.profilePhoto] : [],
    draft.nicFront ? [draft.nicFront] : [],
    draft.nicBack ? [draft.nicBack] : [],
    draft.portfolioPhotos,
    ...draft.workExperience.map((entry) => entry.images),
  ];

  for (const group of groups) {
    normalizeOrders(group).forEach((item, index) => {
      payload.push({ storageFileId: item.storageFileId, order: index });
    });
  }

  return payload;
}

function hasDraftChanges(
  draft: DraftMediaState,
  original: AdminModelRegistrationMedia,
): boolean {
  const draftPayload = collectOrderPayload(draft);
  const originalPayload = collectOrderPayload(cloneMedia(original));
  const baseline = new Map(
    originalPayload.map((item) => [item.storageFileId, item.order]),
  );

  return draftPayload.some(
    (item) => baseline.get(item.storageFileId) !== item.order,
  );
}

function MediaThumb({
  item,
  alt,
  label,
  isCover,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
}: {
  item: AdminModelMediaItem;
  alt: string;
  label?: string;
  isCover?: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="space-y-1">
      {label && (
        <p className="font-ui text-[8px] tracking-[0.15em] uppercase text-[#9A9A9A]">
          {label}
        </p>
      )}
      <div className="relative">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative aspect-[3/4] border border-[#E0E0E0] overflow-hidden bg-[#F5F5F5] hover:border-[#C8A97A] transition-colors"
        >
          <Image
            src={item.url}
            alt={alt}
            fill
            className="object-contain"
            sizes="160px"
            unoptimized
          />
        </a>
        {isCover && (
          <span className="absolute top-1 left-1 font-ui text-[7px] tracking-[0.12em] uppercase px-1.5 py-0.5 bg-[#C8A97A] text-white">
            Public cover
          </span>
        )}
        <div className="absolute top-1 right-1 flex flex-col gap-0.5">
          <button
            type="button"
            disabled={!canMoveUp}
            onClick={onMoveUp}
            className="p-1 bg-white/90 border border-[#E0E0E0] hover:border-[#C8A97A] disabled:opacity-30 transition-colors"
            aria-label="Move up"
          >
            <ChevronUp className="size-3" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            disabled={!canMoveDown}
            onClick={onMoveDown}
            className="p-1 bg-white/90 border border-[#E0E0E0] hover:border-[#C8A97A] disabled:opacity-30 transition-colors"
            aria-label="Move down"
          >
            <ChevronDown className="size-3" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

interface ModelReviewMediaSectionProps {
  userId: string;
  media?: AdminModelRegistrationMedia | null;
  onMediaUpdated: (media: AdminModelRegistrationMedia) => void;
}

export default function ModelReviewMediaSection({
  userId,
  media,
  onMediaUpdated,
}: ModelReviewMediaSectionProps) {
  const [draft, setDraft] = useState<DraftMediaState | null>(
    media ? cloneMedia(media) : null,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (media) {
      setDraft(cloneMedia(media));
      setError(null);
      setSaved(false);
    }
  }, [media]);

  const isDirty = useMemo(() => {
    if (!draft || !media) return false;
    return hasDraftChanges(draft, media);
  }, [draft, media]);

  const hasAny =
    draft &&
    (draft.profilePhoto ||
      draft.nicFront ||
      draft.nicBack ||
      draft.portfolioPhotos.length > 0 ||
      draft.workExperience.some((entry) => entry.images.length > 0));

  if (!hasAny) {
    return (
      <section className="space-y-3 border border-dashed border-[#E0E0E0] p-4">
        <p className="font-ui text-[9px] tracking-[0.15em] uppercase text-[#9A9A9A]">
          Work samples
        </p>
        <p className="font-ui text-[10px] text-[#4A4A4A] leading-relaxed">
          No registration images were found for this model.
        </p>
      </section>
    );
  }

  async function handleSave() {
    if (!draft || !isDirty) return;

    setSaving(true);
    setError(null);
    setSaved(false);

    const result = await updateModelMediaOrder(userId, collectOrderPayload(draft));
    setSaving(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setDraft(cloneMedia(result.registrationMedia));
    onMediaUpdated(result.registrationMedia);
    setSaved(true);
  }

  function updatePortfolio(next: AdminModelMediaItem[]) {
    setDraft((prev) => (prev ? { ...prev, portfolioPhotos: next } : prev));
    setSaved(false);
  }

  function updateWorkImages(entryId: string, next: AdminModelMediaItem[]) {
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            workExperience: prev.workExperience.map((entry) =>
              entry.id === entryId ? { ...entry, images: next } : entry,
            ),
          }
        : prev,
    );
    setSaved(false);
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-ui text-[9px] tracking-[0.25em] uppercase text-[#0A0A0A]">
          Work samples
        </h3>
        {isDirty && (
          <button
            type="button"
            disabled={saving}
            onClick={() => void handleSave()}
            className="font-ui text-[8px] tracking-[0.2em] uppercase px-4 py-2 bg-[#0A0A0A] text-white hover:bg-[#C8A97A] disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving…" : "Save order"}
          </button>
        )}
      </div>

      {error && (
        <p className="font-ui text-[10px] text-red-700 border border-red-300 bg-red-50 px-3 py-2">
          {error}
        </p>
      )}
      {saved && !isDirty && (
        <p className="font-ui text-[10px] text-[#4A4A4A] border border-[#C8A97A] bg-[#C8A97A]/10 px-3 py-2">
          Image order saved.
        </p>
      )}

      {(draft?.profilePhoto || draft?.nicFront || draft?.nicBack) && (
        <div className="space-y-2">
          <p className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A]">
            Profile &amp; NIC
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {draft.profilePhoto && (
              <MediaThumb
                item={draft.profilePhoto}
                alt="Profile photo"
                label="Profile"
                canMoveUp={false}
                canMoveDown={false}
                onMoveUp={() => {}}
                onMoveDown={() => {}}
              />
            )}
            {draft.nicFront && (
              <MediaThumb
                item={draft.nicFront}
                alt="NIC front"
                label="NIC front"
                canMoveUp={false}
                canMoveDown={false}
                onMoveUp={() => {}}
                onMoveDown={() => {}}
              />
            )}
            {draft.nicBack && (
              <MediaThumb
                item={draft.nicBack}
                alt="NIC back"
                label="NIC back"
                canMoveUp={false}
                canMoveDown={false}
                onMoveUp={() => {}}
                onMoveDown={() => {}}
              />
            )}
          </div>
        </div>
      )}

      {draft && draft.portfolioPhotos.length > 0 && (
        <div className="space-y-2">
          <p className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A]">
            Portfolio ({draft.portfolioPhotos.length})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {draft.portfolioPhotos.map((item, index) => (
              <MediaThumb
                key={item.storageFileId}
                item={item}
                alt={`Portfolio ${index + 1}`}
                isCover={index === 0}
                canMoveUp={index > 0}
                canMoveDown={index < draft.portfolioPhotos.length - 1}
                onMoveUp={() =>
                  updatePortfolio(moveItem(draft.portfolioPhotos, index, -1))
                }
                onMoveDown={() =>
                  updatePortfolio(moveItem(draft.portfolioPhotos, index, 1))
                }
              />
            ))}
          </div>
        </div>
      )}

      {draft?.workExperience.map((entry) =>
        entry.images.length > 0 ? (
          <div key={entry.id} className="space-y-2">
            <p className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A]">
              {entry.title}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {entry.images.map((item, index) => (
                <MediaThumb
                  key={item.storageFileId}
                  item={item}
                  alt={`${entry.title} ${index + 1}`}
                  canMoveUp={index > 0}
                  canMoveDown={index < entry.images.length - 1}
                  onMoveUp={() =>
                    updateWorkImages(entry.id, moveItem(entry.images, index, -1))
                  }
                  onMoveDown={() =>
                    updateWorkImages(entry.id, moveItem(entry.images, index, 1))
                  }
                />
              ))}
            </div>
          </div>
        ) : null,
      )}
    </section>
  );
}
