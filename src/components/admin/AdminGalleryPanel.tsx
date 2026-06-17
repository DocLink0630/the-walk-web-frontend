"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { GALLERY_PAGE } from "@/data/gallery-page";
import {
  createAdminGalleryItem,
  deleteAdminGalleryItem,
  fetchAdminSiteContent,
  saveGalleryOrder,
  saveHiddenGalleryIds,
  updateAdminGalleryItem,
} from "@/lib/admin/site-content-api";
import { uploadFloatingImage } from "@/lib/registration/upload-floating-image";
import type { SiteContentOverrides } from "@/lib/site-content/types";
import type { GalleryAspectRatio, GalleryCategory, GalleryItem } from "@/types/gallery-page";
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
} from "./admin-ui";

type ListedItem = GalleryItem & { source: "hardcoded" | "admin" };

const CATEGORIES: GalleryCategory[] = [
  "Runway",
  "Editorial",
  "Academy",
  "Events",
  "Behind the Scenes",
  "Campaigns",
];

const ASPECTS: GalleryAspectRatio[] = ["portrait", "landscape", "square"];

const EMPTY_FORM = {
  title: "",
  category: "Editorial" as GalleryCategory,
  aspectRatio: "portrait" as GalleryAspectRatio,
};

function buildDefaultOrder(content: SiteContentOverrides): string[] {
  if (content.galleryOrder.length > 0) return content.galleryOrder;
  return [
    ...GALLERY_PAGE.items.map((item) => item.id),
    ...content.galleryItems.map((item) => item.id),
  ];
}

function buildListedItems(content: SiteContentOverrides): ListedItem[] {
  const hardcoded = GALLERY_PAGE.items.map((item) => ({
    ...item,
    source: "hardcoded" as const,
  }));
  const admin = content.galleryItems.map((item) => ({
    id: item.id,
    url: item.url,
    title: item.title,
    category: item.category,
    aspectRatio: item.aspectRatio,
    source: "admin" as const,
  }));
  const byId = new Map<string, ListedItem>();
  for (const item of [...hardcoded, ...admin]) {
    byId.set(item.id, item);
  }
  const order = buildDefaultOrder(content);
  const ordered: ListedItem[] = [];
  const seen = new Set<string>();
  for (const id of order) {
    const item = byId.get(id);
    if (item) {
      ordered.push(item);
      seen.add(id);
    }
  }
  for (const item of byId.values()) {
    if (!seen.has(item.id)) ordered.push(item);
  }
  return ordered;
}

export default function AdminGalleryPanel() {
  const [content, setContent] = useState<SiteContentOverrides | null>(null);
  const [order, setOrder] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageToken, setImageToken] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
    setOrder(buildDefaultOrder(result.data));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const listedItems = useMemo(() => {
    if (!content) return [];
    const byId = new Map(buildListedItems(content).map((item) => [item.id, item]));
    return order.map((id) => byId.get(id)).filter(Boolean) as ListedItem[];
  }, [content, order]);

  const hiddenSet = useMemo(
    () => new Set(content?.hiddenGalleryIds ?? []),
    [content?.hiddenGalleryIds],
  );

  async function persistOrder(nextOrder: string[]) {
    setOrder(nextOrder);
    const result = await saveGalleryOrder(nextOrder);
    if (!result.ok) {
      setMessage({ type: "err", text: result.message });
      return;
    }
    setContent(result.data);
  }

  function moveItem(id: string, direction: -1 | 1) {
    const index = order.indexOf(id);
    if (index < 0) return;
    const target = index + direction;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[index], next[target]] = [next[target], next[index]];
    void persistOrder(next);
  }

  async function toggleHidden(id: string) {
    if (!content) return;
    const next = hiddenSet.has(id)
      ? content.hiddenGalleryIds.filter((hid) => hid !== id)
      : [...content.hiddenGalleryIds, id];
    const result = await saveHiddenGalleryIds(next);
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
    setImageToken(null);
    setImagePreview(null);
    setFormOpen(true);
  }

  function openEdit(item: ListedItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      category: item.category,
      aspectRatio: item.aspectRatio,
    });
    setImageToken(null);
    setImagePreview(item.url);
    setFormOpen(true);
  }

  async function handleImageUpload(file: File) {
    const upload = await uploadFloatingImage(file);
    if (!upload.ok) {
      setMessage({ type: "err", text: upload.message });
      return;
    }
    setImageToken(upload.token);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    if (!form.title.trim()) {
      setMessage({ type: "err", text: "Title is required." });
      return;
    }

    setSaving(true);
    setMessage(null);

    if (editingId) {
      const payload: Record<string, unknown> = { ...form };
      if (imageToken) payload.imageToken = imageToken;
      const result = await updateAdminGalleryItem(editingId, payload);
      setSaving(false);
      if (!result.ok) {
        setMessage({ type: "err", text: result.message });
        return;
      }
      setContent(result.data);
      setFormOpen(false);
      setMessage({ type: "ok", text: "Gallery image updated." });
      return;
    }

    if (!imageToken) {
      setSaving(false);
      setMessage({ type: "err", text: "Image is required." });
      return;
    }

    const result = await createAdminGalleryItem({ ...form, imageToken });
    setSaving(false);
    if (!result.ok) {
      setMessage({ type: "err", text: result.message });
      return;
    }
    setContent(result.data);
    setOrder(buildDefaultOrder(result.data));
    setFormOpen(false);
    setMessage({ type: "ok", text: "Gallery image added." });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this gallery image?")) return;
    const result = await deleteAdminGalleryItem(id);
    if (!result.ok) {
      setMessage({ type: "err", text: result.message });
      return;
    }
    setContent(result.data);
    setOrder(buildDefaultOrder(result.data));
    setMessage({ type: "ok", text: "Gallery image deleted." });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className={adminSectionTitle}>Gallery</h2>
          <p className="text-sm text-gray-500 mt-1">
            Add images, reorder the grid, or hide hardcoded photos.
          </p>
        </div>
        <button type="button" onClick={openCreate} className={adminBtnPrimary}>
          <Plus className="size-4 mr-1.5" />
          Add image
        </button>
      </div>

      {message && (
        <p className={message.type === "ok" ? adminAlertOk : adminAlertErr}>{message.text}</p>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading gallery…</p>
      ) : (
        <div className="space-y-3">
          {listedItems.map((item) => {
            const hidden = hiddenSet.has(item.id);
            return (
              <div key={item.id} className={`${adminCard} flex flex-col sm:flex-row gap-4`}>
                <div className="relative h-24 w-full sm:w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={item.url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="96px"
                    unoptimized={item.url.startsWith("http")}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900 truncate">{item.title}</p>
                    <span className="text-xs rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">
                      {item.source}
                    </span>
                    {hidden && (
                      <span className="text-xs rounded-full bg-red-50 px-2 py-0.5 text-red-700">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveItem(item.id, -1)}
                    className={adminBtnSecondary}
                    aria-label="Move up"
                  >
                    <ArrowUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(item.id, 1)}
                    className={adminBtnSecondary}
                    aria-label="Move down"
                  >
                    <ArrowDown className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleHidden(item.id)}
                    className={adminBtnSecondary}
                  >
                    {hidden ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                  </button>
                  {item.source === "admin" && (
                    <>
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className={adminBtnSecondary}
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
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
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-5 sm:p-6 shadow-xl">
            <h3 className={`${adminSectionTitle} mb-4`}>
              {editingId ? "Edit gallery image" : "New gallery image"}
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
              <div>
                <label className={adminLabel}>Category</label>
                <select
                  className={adminInput}
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value as GalleryCategory })
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
                <label className={adminLabel}>Aspect ratio</label>
                <select
                  className={adminInput}
                  value={form.aspectRatio}
                  onChange={(e) =>
                    setForm({ ...form, aspectRatio: e.target.value as GalleryAspectRatio })
                  }
                >
                  {ASPECTS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={adminLabel}>
                  Image{editingId ? " (optional on edit)" : ""}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="text-sm"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleImageUpload(file);
                  }}
                />
                {imagePreview && (
                  <div className="relative mt-2 h-40 w-full overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={imagePreview}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <p className={adminHint}>Images upload to cloud storage automatically.</p>
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
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
