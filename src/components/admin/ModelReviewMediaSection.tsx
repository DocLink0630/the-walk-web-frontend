"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Trash2, Upload } from "lucide-react";
import {
  attachAdminModelMedia,
  createAdminWorkExperience,
  deleteAdminWorkExperience,
  deleteModelMedia,
  updateAdminWorkExperienceTitle,
  updateModelMediaOrder,
  type AdminAttachMediaType,
} from "@/lib/admin/users-api";
import { uploadFloatingImage } from "@/lib/registration/upload-floating-image";
import {
  adminAlertErr,
  adminAlertOk,
  adminBtnPrimary,
  adminBtnSecondary,
  adminInput,
  adminSectionTitle,
} from "./admin-ui";
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
  onDelete,
  canDelete = true,
  onReplace,
}: {
  item: AdminModelMediaItem;
  alt: string;
  label?: string;
  isCover?: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete?: () => void;
  canDelete?: boolean;
  onReplace?: () => void;
}) {
  return (
    <div className="space-y-1">
      {label && (
        <p className="text-xs font-medium text-gray-500">
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
          <span className="absolute top-1 left-1 text-[10px] font-medium px-1.5 py-0.5 bg-amber-500 text-white rounded">
            Cover
          </span>
        )}
        <div className="absolute top-1 right-1 flex flex-col gap-0.5">
          {onReplace && (
            <button
              type="button"
              onClick={onReplace}
              className="p-1 bg-white/90 border border-[#E0E0E0] hover:border-[#C8A97A] transition-colors"
              aria-label="Replace photo"
            >
              <Upload className="size-3" strokeWidth={1.5} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              disabled={!canDelete}
              onClick={onDelete}
              className="p-1 bg-white/90 border border-[#E0E0E0] hover:border-red-400 hover:text-red-600 disabled:opacity-30 transition-colors"
              aria-label="Delete photo"
            >
              <Trash2 className="size-3" strokeWidth={1.5} />
            </button>
          )}
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
  onError?: (message: string) => void;
}

export default function ModelReviewMediaSection({
  userId,
  media,
  onMediaUpdated,
  onError,
}: ModelReviewMediaSectionProps) {
  const [draft, setDraft] = useState<DraftMediaState | null>(
    media ? cloneMedia(media) : null,
  );
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [newWorkTitle, setNewWorkTitle] = useState("");
  const [uploadTargetWorkId, setUploadTargetWorkId] = useState<string | null>(null);
  const [pendingReplaceType, setPendingReplaceType] = useState<AdminAttachMediaType | null>(
    null,
  );

  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const workInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

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

  function applyMediaUpdate(registrationMedia: AdminModelRegistrationMedia) {
    setDraft(cloneMedia(registrationMedia));
    onMediaUpdated(registrationMedia);
    setSaved(false);
  }

  function reportError(message: string) {
    setError(message);
    onError?.(message);
  }

  async function handleSaveOrder() {
    if (!draft || !isDirty) return;

    setSaving(true);
    setError(null);
    setSaved(false);

    const result = await updateModelMediaOrder(userId, collectOrderPayload(draft));
    setSaving(false);

    if (!result.ok) {
      reportError(result.message);
      return;
    }

    applyMediaUpdate(result.registrationMedia);
    setSaved(true);
  }

  async function handleDelete(storageFileId: string) {
    if (!window.confirm("Remove this photo?")) return;
    setBusy(true);
    setError(null);
    const result = await deleteModelMedia(userId, storageFileId);
    setBusy(false);
    if (!result.ok) {
      reportError(result.message);
      return;
    }
    applyMediaUpdate(result.registrationMedia);
  }

  async function handleAttach(
    type: AdminAttachMediaType,
    file: File,
    workExperienceId?: string,
  ) {
    setBusy(true);
    setError(null);
    const upload = await uploadFloatingImage(file);
    if (!upload.ok) {
      reportError(upload.message);
      setBusy(false);
      return;
    }
    const result = await attachAdminModelMedia(userId, {
      token: upload.token,
      type,
      workExperienceId,
    });
    setBusy(false);
    if (!result.ok) {
      reportError(result.message);
      return;
    }
    applyMediaUpdate(result.registrationMedia);
  }

  async function handleCreateWorkExperience(file: File) {
    if (!newWorkTitle.trim()) {
      reportError("Work experience title is required");
      return;
    }
    setBusy(true);
    setError(null);
    const upload = await uploadFloatingImage(file);
    if (!upload.ok) {
      reportError(upload.message);
      setBusy(false);
      return;
    }
    const result = await createAdminWorkExperience(userId, {
      title: newWorkTitle.trim(),
      imageTokens: [upload.token],
    });
    setBusy(false);
    if (!result.ok) {
      reportError(result.message);
      return;
    }
    setNewWorkTitle("");
    applyMediaUpdate(result.registrationMedia);
  }

  async function handleUpdateWorkTitle(id: string, title: string) {
    if (!title.trim()) return;
    setBusy(true);
    setError(null);
    const result = await updateAdminWorkExperienceTitle(userId, id, title.trim());
    setBusy(false);
    if (!result.ok) {
      reportError(result.message);
      return;
    }
    applyMediaUpdate(result.registrationMedia);
  }

  async function handleDeleteWorkEntry(id: string) {
    if (!window.confirm("Delete this work experience entry and all its photos?")) return;
    setBusy(true);
    setError(null);
    const result = await deleteAdminWorkExperience(userId, id);
    setBusy(false);
    if (!result.ok) {
      reportError(result.message);
      return;
    }
    applyMediaUpdate(result.registrationMedia);
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

  function triggerReplace(type: AdminAttachMediaType) {
    setPendingReplaceType(type);
    replaceInputRef.current?.click();
  }

  const hasAny =
    draft &&
    (draft.profilePhoto ||
      draft.nicFront ||
      draft.nicBack ||
      draft.portfolioPhotos.length > 0 ||
      draft.workExperience.some((entry) => entry.images.length > 0));

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className={adminSectionTitle}>Work samples</h3>
        {isDirty && (
          <button
            type="button"
            disabled={saving || busy}
            onClick={() => void handleSaveOrder()}
            className={adminBtnPrimary + " !py-2 text-xs"}
          >
            {saving ? "Saving…" : "Save order"}
          </button>
        )}
      </div>

      {error && <div className={adminAlertErr}>{error}</div>}
      {saved && !isDirty && <div className={adminAlertOk}>Image order saved.</div>}

      <input
        ref={replaceInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && pendingReplaceType) {
            void handleAttach(pendingReplaceType, file);
          }
          e.target.value = "";
          setPendingReplaceType(null);
        }}
      />

      <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Profile &amp; NIC
          </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {draft?.profilePhoto ? (
            <MediaThumb
              item={draft.profilePhoto}
              alt="Profile photo"
              label="Profile"
              canMoveUp={false}
              canMoveDown={false}
              onMoveUp={() => {}}
              onMoveDown={() => {}}
              onDelete={() => void handleDelete(draft.profilePhoto!.storageFileId)}
              onReplace={() => triggerReplace("PROFILE")}
            />
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={() => triggerReplace("PROFILE")}
              className="aspect-[3/4] border border-dashed border-[#E0E0E0] flex flex-col items-center justify-center gap-1 hover:border-[#C8A97A] disabled:opacity-50"
            >
              <Upload className="size-4 text-[#9A9A9A]" />
              <span className="font-ui text-[8px] uppercase tracking-[0.1em] text-[#9A9A9A]">
                Profile
              </span>
            </button>
          )}

          {draft?.nicFront ? (
            <MediaThumb
              item={draft.nicFront}
              alt="NIC front"
              label="NIC front"
              canMoveUp={false}
              canMoveDown={false}
              onMoveUp={() => {}}
              onMoveDown={() => {}}
              onDelete={() => void handleDelete(draft.nicFront!.storageFileId)}
              onReplace={() => triggerReplace("NIC_FRONT")}
            />
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={() => triggerReplace("NIC_FRONT")}
              className="aspect-[3/4] border border-dashed border-[#E0E0E0] flex flex-col items-center justify-center gap-1 hover:border-[#C8A97A] disabled:opacity-50"
            >
              <Upload className="size-4 text-[#9A9A9A]" />
              <span className="font-ui text-[8px] uppercase tracking-[0.1em] text-[#9A9A9A]">
                NIC front
              </span>
            </button>
          )}

          {draft?.nicBack ? (
            <MediaThumb
              item={draft.nicBack}
              alt="NIC back"
              label="NIC back"
              canMoveUp={false}
              canMoveDown={false}
              onMoveUp={() => {}}
              onMoveDown={() => {}}
              onDelete={() => void handleDelete(draft.nicBack!.storageFileId)}
              onReplace={() => triggerReplace("NIC_BACK")}
            />
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={() => triggerReplace("NIC_BACK")}
              className="aspect-[3/4] border border-dashed border-[#E0E0E0] flex flex-col items-center justify-center gap-1 hover:border-[#C8A97A] disabled:opacity-50"
            >
              <Upload className="size-4 text-[#9A9A9A]" />
              <span className="font-ui text-[8px] uppercase tracking-[0.1em] text-[#9A9A9A]">
                NIC back
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A]">
            Portfolio ({draft?.portfolioPhotos.length ?? 0}/5)
          </p>
          {(draft?.portfolioPhotos.length ?? 0) < 5 && (
            <>
              <input
                ref={portfolioInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleAttach("PORTFOLIO", file);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                disabled={busy}
                onClick={() => portfolioInputRef.current?.click()}
                className={adminBtnSecondary + " inline-flex items-center gap-1 !py-1.5 text-xs"}
              >
                <Upload className="size-3" />
                Add photo
              </button>
            </>
          )}
        </div>

        {draft && draft.portfolioPhotos.length > 0 ? (
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
                onDelete={() => void handleDelete(item.storageFileId)}
                canDelete={draft.portfolioPhotos.length > 1}
              />
            ))}
          </div>
        ) : (
          !hasAny && (
            <p className="font-ui text-[10px] text-[#4A4A4A] leading-relaxed border border-dashed border-[#E0E0E0] p-4">
              No registration images were found for this model.
            </p>
          )
        )}
      </div>

      <div className="space-y-3">
        <p className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A]">
          Work experience
        </p>

        {draft?.workExperience.map((entry) => (
          <div key={entry.id} className="border border-[#E8E8E8] p-4 space-y-3">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                defaultValue={entry.title}
                onBlur={(e) => void handleUpdateWorkTitle(entry.id, e.target.value)}
                className={`flex-1 ${adminInput} !py-2`}
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

            {entry.images.length > 0 && (
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
                    onDelete={() => void handleDelete(item.storageFileId)}
                    canDelete={entry.images.length > 1}
                  />
                ))}
              </div>
            )}

            {entry.images.length < 5 && (
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setUploadTargetWorkId(entry.id);
                  workInputRef.current?.click();
                }}
                className={adminBtnSecondary + " inline-flex items-center gap-1 !py-1.5 text-xs"}
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
              void handleAttach("WORK_EXPERIENCE", file, uploadTargetWorkId);
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
            className={adminInput}
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
      </div>
    </section>
  );
}
