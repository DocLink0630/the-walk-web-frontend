export function sortByCreatedAtDesc<T extends { createdAt?: string }>(
  items: T[] | null | undefined,
): T[] {
  if (!items?.length) return items ?? [];
  return [...items].sort((a, b) => {
    const aTime = Date.parse(a.createdAt ?? "") || 0;
    const bTime = Date.parse(b.createdAt ?? "") || 0;
    return bTime - aTime;
  });
}
