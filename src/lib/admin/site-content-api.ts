import type { SiteContentOverrides } from "@/lib/site-content/types";
import { adminAuthHeaders } from "@/lib/admin/token";

async function parseError(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    if (body?.message) return String(body.message);
  } catch {
    /* ignore */
  }
  return fallback;
}

export async function fetchAdminSiteContent(): Promise<
  { ok: true; data: SiteContentOverrides } | { ok: false; message: string }
> {
  const res = await fetch("/api/admin/site-content", { headers: adminAuthHeaders() });
  if (!res.ok) return { ok: false, message: await parseError(res, "Failed to load site content") };
  return { ok: true, data: (await res.json()) as SiteContentOverrides };
}

export async function saveHiddenEventIds(
  hiddenIds: string[],
): Promise<{ ok: true; data: SiteContentOverrides } | { ok: false; message: string }> {
  const res = await fetch("/api/admin/site-content/events/visibility", {
    method: "PATCH",
    headers: adminAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ hiddenIds }),
  });
  if (!res.ok) return { ok: false, message: await parseError(res, "Failed to update visibility") };
  return { ok: true, data: (await res.json()) as SiteContentOverrides };
}

export async function saveHiddenGalleryIds(
  hiddenIds: string[],
): Promise<{ ok: true; data: SiteContentOverrides } | { ok: false; message: string }> {
  const res = await fetch("/api/admin/site-content/gallery/visibility", {
    method: "PATCH",
    headers: adminAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ hiddenIds }),
  });
  if (!res.ok) return { ok: false, message: await parseError(res, "Failed to update visibility") };
  return { ok: true, data: (await res.json()) as SiteContentOverrides };
}

export async function createAdminEvent(
  payload: Record<string, unknown>,
): Promise<{ ok: true; data: SiteContentOverrides } | { ok: false; message: string }> {
  const res = await fetch("/api/admin/site-content/events", {
    method: "POST",
    headers: adminAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!res.ok) return { ok: false, message: await parseError(res, "Failed to create event") };
  return { ok: true, data: (await res.json()) as SiteContentOverrides };
}

export async function updateAdminEvent(
  id: string,
  payload: Record<string, unknown>,
): Promise<{ ok: true; data: SiteContentOverrides } | { ok: false; message: string }> {
  const res = await fetch(`/api/admin/site-content/events/${id}`, {
    method: "PATCH",
    headers: adminAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!res.ok) return { ok: false, message: await parseError(res, "Failed to update event") };
  return { ok: true, data: (await res.json()) as SiteContentOverrides };
}

export async function deleteAdminEvent(
  id: string,
): Promise<{ ok: true; data: SiteContentOverrides } | { ok: false; message: string }> {
  const res = await fetch(`/api/admin/site-content/events/${id}`, {
    method: "DELETE",
    headers: adminAuthHeaders(),
  });
  if (!res.ok) return { ok: false, message: await parseError(res, "Failed to delete event") };
  return { ok: true, data: (await res.json()) as SiteContentOverrides };
}

export async function createAdminGalleryItem(
  payload: Record<string, unknown>,
): Promise<{ ok: true; data: SiteContentOverrides } | { ok: false; message: string }> {
  const res = await fetch("/api/admin/site-content/gallery", {
    method: "POST",
    headers: adminAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!res.ok) return { ok: false, message: await parseError(res, "Failed to add gallery image") };
  return { ok: true, data: (await res.json()) as SiteContentOverrides };
}

export async function updateAdminGalleryItem(
  id: string,
  payload: Record<string, unknown>,
): Promise<{ ok: true; data: SiteContentOverrides } | { ok: false; message: string }> {
  const res = await fetch(`/api/admin/site-content/gallery/${id}`, {
    method: "PATCH",
    headers: adminAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!res.ok) return { ok: false, message: await parseError(res, "Failed to update gallery image") };
  return { ok: true, data: (await res.json()) as SiteContentOverrides };
}

export async function deleteAdminGalleryItem(
  id: string,
): Promise<{ ok: true; data: SiteContentOverrides } | { ok: false; message: string }> {
  const res = await fetch(`/api/admin/site-content/gallery/${id}`, {
    method: "DELETE",
    headers: adminAuthHeaders(),
  });
  if (!res.ok) return { ok: false, message: await parseError(res, "Failed to delete gallery image") };
  return { ok: true, data: (await res.json()) as SiteContentOverrides };
}

export async function saveGalleryOrder(
  order: string[],
): Promise<{ ok: true; data: SiteContentOverrides } | { ok: false; message: string }> {
  const res = await fetch("/api/admin/site-content/gallery/order", {
    method: "PATCH",
    headers: adminAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ order }),
  });
  if (!res.ok) return { ok: false, message: await parseError(res, "Failed to save gallery order") };
  return { ok: true, data: (await res.json()) as SiteContentOverrides };
}
