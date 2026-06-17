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

export default function AdminEventsPanel() {
  const [content, setContent] = useState<SiteContentOverrides | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [coverToken, setCoverToken] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryTokens, setGalleryTokens] = useState<string[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

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

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setCoverToken(null);
    setCoverPreview(null);
    setGalleryTokens([]);
    setGalleryPreviews([]);
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
    setGalleryTokens([]);
    setGalleryPreviews(event.gallery);
    setFormOpen(true);
  }

  async function handleCoverUpload(file: File) {
    const upload = await uploadFloatingImage(file);
    if (!upload.ok) {
      setMessage({ type: "err", text: upload.message });
      return;
    }
    setCoverToken(upload.token);
    setCoverPreview(URL.createObjectURL(file));
  }

  async function handleGalleryUpload(file: File) {
    const upload = await uploadFloatingImage(file);
    if (!upload.ok) {
      setMessage({ type: "err", text: upload.message });
      return;
    }
    setGalleryTokens((prev) => [...prev, upload.token]);
    setGalleryPreviews((prev) => [...prev, URL.createObjectURL(file)]);
  }

  async function handleSave() {
    if (!form.title.trim()) {
      setMessage({ type: "err", text: "Title is required." });
      return;
    }

    setSaving(true);
    setMessage(null);

    const payload: Record<string, unknown> = { ...form };

    if (editingId) {
      if (coverToken) payload.coverImageToken = coverToken;
      if (galleryTokens.length > 0) payload.galleryImageTokens = galleryTokens;
      const result = await updateAdminEvent(editingId, payload);
      setSaving(false);
      if (!result.ok) {
        setMessage({ type: "err", text: result.message });
        return;
      }
      setContent(result.data);
      setFormOpen(false);
      setMessage({ type: "ok", text: "Event updated." });
      return;
    }

    if (!coverToken) {
      setSaving(false);
      setMessage({ type: "err", text: "Cover image is required for new events." });
      return;
    }

    payload.coverImageToken = coverToken;
    payload.galleryImageTokens = galleryTokens;

    const result = await createAdminEvent(payload);
    setSaving(false);
    if (!result.ok) {
      setMessage({ type: "err", text: result.message });
      return;
    }
    setContent(result.data);
    setFormOpen(false);
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-5 sm:p-6 shadow-xl">
            <h3 className={`${adminSectionTitle} mb-4`}>
              {editingId ? "Edit event" : "New event"}
            </h3>

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
                <label className={adminLabel}>
                  Cover image{editingId ? " (optional on edit)" : ""}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="text-sm"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleCoverUpload(file);
                  }}
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
                <label className={adminLabel}>Gallery images</label>
                <input
                  type="file"
                  accept="image/*"
                  className="text-sm"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleGalleryUpload(file);
                    e.target.value = "";
                  }}
                />
                <p className={adminHint}>
                  {editingId
                    ? "Upload new images to replace the gallery on save."
                    : "Add one or more gallery images."}
                </p>
                {galleryPreviews.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {galleryPreviews.map((src, i) => (
                      <div
                        key={src}
                        className="relative aspect-square overflow-hidden rounded-lg bg-gray-100"
                      >
                        <Image src={src} alt="" fill className="object-cover" unoptimized />
                      </div>
                    ))}
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
