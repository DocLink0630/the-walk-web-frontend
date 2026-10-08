"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { EVENTS_PAGE } from "@/data/events-page";
import {
  createAdminEvent,
  deleteAdminEvent,
  fetchAdminSiteContent,
  saveHiddenEventIds,
  updateAdminEvent,
} from "@/lib/admin/site-content-api";
import { uploadFloatingImage } from "@/lib/registration/upload-floating-image";
import type { SiteContentOverrides } from "@/lib/site-content/types";
import type { AgencyEvent, EventCategory, EventStatus } from "@/types/events-page";
import AdminImageFilePicker from "./AdminImageFilePicker";
import {
  adminAlertErr,
  adminAlertOk,
  adminBtnDanger,
  adminBtnPrimary,
  adminBtnSecondary,
  adminCard,
  adminHint,
  adminInput,
  adminLabel,
  adminSectionTitle,
  adminTextarea,
} from "./admin-ui";

type ListedEvent = AgencyEvent & { source: "hardcoded" | "admin" };

type GalleryFormItem =
  | { kind: "existing"; url: string }
  | { kind: "new"; token: string; preview: string; fileName: string };

const CATEGORIES: EventCategory[] = ["RUNWAY", "ACADEMY EVENT", "EDITORIAL", "GALA"];
const STATUSES: EventStatus[] = ["UPCOMING", "PAST"];

const EMPTY_FORM = {
  title: "",
  date: "",
  location: "",
  category: "RUNWAY" as EventCategory,
  status: "UPCOMING" as EventStatus,
  description: "",
  fullDescription: "",
  highlight: "",
};

function galleryTokensFromItems(items: GalleryFormItem[]): string[] {
  return items
    .filter((item): item is Extract<GalleryFormItem, { kind: "new" }> => item.kind === "new")
    .map((item) => item.token);
}

export default function AdminEventsPanel() {
  const [content, setContent] = useState<SiteContentOverrides | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [coverToken, setCoverToken] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFileName, setCoverFileName] = useState<string | null>(null);
  const [originalCoverUrl, setOriginalCoverUrl] = useState<string | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryFormItem[]>([]);
  const [galleryLastFileName, setGalleryLastFileName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await fetchAdminSiteContent();
    setLoading(false);
    if (!result.ok) {
      setMessage({ type: "err", text: result.message });
      return;
    }
    setContent(result.data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setFormOpen(false);
      }
    }
    if (formOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [formOpen]);

  const listedEvents = useMemo((): ListedEvent[] => {
    if (!content) return [];
    const hardcoded = EVENTS_PAGE.events.map((event) => ({
      ...event,
      source: "hardcoded" as const,
    }));
    const admin = content.events.map((event) => ({
      ...event,
      source: "admin" as const,
    }));
    return [...hardcoded, ...admin];
  }, [content]);

  const hiddenSet = useMemo(
    () => new Set(content?.hiddenEventIds ?? []),
    [content?.hiddenEventIds],
  );

  async function toggleHidden(id: string) {
    if (!content) return;
    const next = hiddenSet.has(id)
      ? content.hiddenEventIds.filter((hid) => hid !== id)
      : [...content.hiddenEventIds, id];
    const result = await saveHiddenEventIds(next);
    if (!result.ok) {
      setMessage({ type: "err", text: result.message });
      return;
    }
    setContent(result.data);
    setMessage({ type: "ok", text: "Visibility updated." });
  }

  function resetImageState() {
    setCoverToken(null);
    setCoverPreview(null);
    setCoverFileName(null);
    setOriginalCoverUrl(null);
    setGalleryItems([]);
    setGalleryLastFileName(null);
  }

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    resetImageState();
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(event: ListedEvent) {
    setEditingId(event.id);
    setForm({
      title: event.title,
      date: event.date,
      location: event.location,
      category: event.category,
      status: event.status,
      description: event.description,
      fullDescription: event.fullDescription,
      highlight: event.highlight,
    });
    setCoverToken(null);
    setCoverPreview(event.image);
    setCoverFileName(null);
    setOriginalCoverUrl(event.image);
    setGalleryItems(event.gallery.map((url) => ({ kind: "existing" as const, url })));
    setGalleryLastFileName(null);
    setFormError(null);
    setFormOpen(true);
  }

  async function handleCoverUpload(file: File) {
    const upload = await uploadFloatingImage(file);
    if (!upload.ok) {
      setMessage({ type: "err", text: upload.message });
      return;
    }
    if (coverPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }
    setCoverToken(upload.token);
    setCoverPreview(URL.createObjectURL(file));
    setCoverFileName(file.name);
  }

  function handleCoverRemove() {
    if (coverPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }
    setCoverToken(null);
    setCoverFileName(null);
    setCoverPreview(originalCoverUrl);
  }

  async function handleGalleryUpload(file: File) {
    const upload = await uploadFloatingImage(file);
    if (!upload.ok) {
      setMessage({ type: "err", text: upload.message });
      return;
    }
    const preview = URL.createObjectURL(file);
    setGalleryItems((prev) => [
      ...prev,
      { kind: "new", token: upload.token, preview, fileName: file.name },
    ]);
    setGalleryLastFileName((prev) => prev?.includes("files selected") ? prev : file.name);
  }

  function handleGalleryRemove(index: number) {
    setGalleryItems((prev) => {
      const item = prev[index];
      if (!item || item.kind !== "new") return prev;
      URL.revokeObjectURL(item.preview);
      const next = prev.filter((_, i) => i !== index);
      const lastNew = [...next].reverse().find((g) => g.kind === "new");
      setGalleryLastFileName(lastNew && lastNew.kind === "new" ? lastNew.fileName : null);
      return next;
    });
  }

  async function handleSave() {
    if (!form.title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!form.date.trim()) {
      setFormError("Date is required.");
      return;
    }
    if (!form.location.trim()) {
      setFormError("Location is required.");
      return;
    }
    if (!editingId && !coverToken) {
      setFormError("Cover image is required.");
      return;
    }

    setSaving(true);
    setFormError(null);
    setMessage(null);

    const payload: Record<string, unknown> = { ...form };
    const galleryTokens = galleryTokensFromItems(galleryItems);

    if (editingId) {
      if (coverToken) payload.coverImageToken = coverToken;
      if (galleryTokens.length > 0) payload.galleryImageTokens = galleryTokens;
      const result = await updateAdminEvent(editingId, payload);
      setSaving(false);
      if (!result.ok) {
        setFormError(result.message);
        return;
      }
      setContent(result.data);
      setFormOpen(false);
      setFormError(null);
      setMessage({ type: "ok", text: "Event updated." });
      return;
    }

    payload.coverImageToken = coverToken;
    payload.galleryImageTokens = galleryTokens;

    const result = await createAdminEvent(payload);
    setSaving(false);
    if (!result.ok) {
      setFormError(result.message);
      return;
    }
    setContent(result.data);
    setFormOpen(false);
    setFormError(null);
    setMessage({ type: "ok", text: "Event created." });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    const result = await deleteAdminEvent(id);
    if (!result.ok) {
      setMessage({ type: "err", text: result.message });
      return;
    }
    setContent(result.data);
    setMessage({ type: "ok", text: "Event deleted." });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className={adminSectionTitle}>Events</h2>
          <p className="text-sm text-gray-500 mt-1">
            Add events or hide hardcoded ones from the public site.
          </p>
        </div>
        <button type="button" onClick={openCreate} className={adminBtnPrimary}>
          <Plus className="size-4 mr-1.5" />
          Add event
        </button>
      </div>

      {message && (
        <p className={message.type === "ok" ? adminAlertOk : adminAlertErr}>{message.text}</p>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading events…</p>
      ) : (
        <div className="space-y-3">
          {listedEvents.map((event) => {
            const hidden = hiddenSet.has(event.id);
            return (
              <div key={event.id} className={`${adminCard} flex flex-col sm:flex-row gap-4`}>
                <div className="relative h-24 w-full sm:w-32 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={event.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="128px"
                    unoptimized={event.image.startsWith("http")}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900 truncate">{event.title}</p>
                    <span className="text-xs rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">
                      {event.source}
                    </span>
                    {hidden && (
                      <span className="text-xs rounded-full bg-red-50 px-2 py-0.5 text-red-700">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {event.date} · {event.location}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleHidden(event.id)}
                    className={adminBtnSecondary}
                    title={hidden ? "Show on site" : "Hide from site"}
                  >
                    {hidden ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                  </button>
                  {event.source === "admin" && (
                    <>
                      <button
                        type="button"
                        onClick={() => openEdit(event)}
                        className={adminBtnSecondary}
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(event.id)}
                        className={adminBtnDanger}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setFormOpen(false);
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-5 sm:p-6 shadow-xl">
            <h3 className={`${adminSectionTitle} mb-4`}>
              {editingId ? "Edit event" : "New event"}
            </h3>

            {formError && <p className={`${adminAlertErr} mb-4`}>{formError}</p>}

            <div className="space-y-4">
              <div>
                <label className={adminLabel}>Title</label>
                <input
                  className={adminInput}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={adminLabel}>Date</label>
                  <input
                    type="date"
                    className={adminInput}
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className={adminLabel}>Location</label>
                  <input
                    className={adminInput}
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={adminLabel}>Category</label>
                  <select
                    className={adminInput}
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value as EventCategory })
                    }
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={adminLabel}>Status</label>
                  <select
                    className={adminInput}
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value as EventStatus })
                    }
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={adminLabel}>Short description</label>
                <textarea
                  className={adminTextarea}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  maxLength={150}
                />
              </div>
              <div>
                <label className={adminLabel}>Full description</label>
                <textarea
                  className={adminTextarea}
                  value={form.fullDescription}
                  onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
                />
              </div>
              <div>
                <label className={adminLabel}>Highlight</label>
                <input
                  className={adminInput}
                  value={form.highlight}
                  onChange={(e) => setForm({ ...form, highlight: e.target.value })}
                />
              </div>
              <div>
                <AdminImageFilePicker
                  label={`Cover image${editingId ? " (optional on edit)" : ""}`}
                  fileName={coverFileName}
                  onPick={(file) => void handleCoverUpload(file)}
                  onClear={handleCoverRemove}
                  showClear={Boolean(coverToken)}
                />
                {coverPreview && (
                  <div className="relative mt-2 h-32 w-full overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={coverPreview}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
              </div>
              <div>
                <AdminImageFilePicker
                  label="Gallery images"
                  fileName={galleryLastFileName}
                  multiple
                  onPickMultiple={(files) => {
                    if (files.length > 1) {
                      setGalleryLastFileName(`${files.length} files selected`);
                    }
                    for (const file of files) {
                      void handleGalleryUpload(file);
                    }
                  }}
                  onPick={(file) => void handleGalleryUpload(file)}
                />
                <p className={adminHint}>
                  {editingId
                    ? "Upload new images to replace the gallery on save. Use × to remove unsaved picks."
                    : "Add one or more gallery images. Use × to remove unsaved picks."}
                </p>
                {galleryItems.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {galleryItems.map((item, i) => {
                      const src = item.kind === "existing" ? item.url : item.preview;
                      return (
                        <div
                          key={item.kind === "existing" ? item.url : item.token}
                          className="relative aspect-square overflow-hidden rounded-lg bg-gray-100"
                        >
                          <Image src={src} alt="" fill className="object-cover" unoptimized />
                          {item.kind === "new" && (
                            <button
                              type="button"
                              onClick={() => handleGalleryRemove(i)}
                              className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white font-ui text-[10px] flex items-center justify-center hover:bg-red-600"
                              aria-label={`Remove ${item.fileName}`}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 justify-end">
              <button
                type="button"
                className={adminBtnSecondary}
                onClick={() => setFormOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={adminBtnPrimary}
                disabled={saving}
                onClick={() => void handleSave()}
              >
                {saving ? "Saving…" : "Save event"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
