"use client";

import { useCallback, useRef, useState } from "react";

export function useAdminUserSelection(pageUsers: { id: string }[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const pageUsersRef = useRef(pageUsers);
  pageUsersRef.current = pageUsers;

  const pageIds = pageUsers.map((user) => user.id);
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));

  const toggleSelect = useCallback((userId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  }, []);

  const toggleSelectAllOnPage = useCallback(() => {
    const ids = pageUsersRef.current.map((user) => user.id);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const pageFullySelected =
        ids.length > 0 && ids.every((id) => next.has(id));
      if (pageFullySelected) {
        for (const id of ids) next.delete(id);
      } else {
        for (const id of ids) next.add(id);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  return {
    selectedIds,
    toggleSelect,
    toggleSelectAllOnPage,
    clearSelection,
    allPageSelected,
  };
}
