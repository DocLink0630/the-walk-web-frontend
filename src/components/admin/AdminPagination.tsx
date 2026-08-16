"use client";

import { adminBtnPrimary, adminBtnSecondary } from "./admin-ui";

type PageItem = number | "ellipsis";

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

function getPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const siblingCount = 1;
  const leftSibling = Math.max(page - siblingCount, 1);
  const rightSibling = Math.min(page + siblingCount, totalPages);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    return [...Array.from({ length: 5 }, (_, i) => i + 1), "ellipsis", totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    return [1, "ellipsis", ...Array.from({ length: 5 }, (_, i) => totalPages - 4 + i)];
  }

  const middle: number[] = [];
  for (let i = leftSibling; i <= rightSibling; i++) {
    middle.push(i);
  }
  return [1, "ellipsis", ...middle, "ellipsis", totalPages];
}

const navBtn = adminBtnSecondary + " !py-2 text-xs";
const pageBtn = " !min-w-9 !h-9 !px-2.5 !py-0 tabular-nums";

export default function AdminPagination({
  page,
  totalPages,
  onPageChange,
  disabled = false,
}: AdminPaginationProps) {
  if (totalPages <= 1) return null;

  const items = getPageItems(page, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
      <button
        type="button"
        disabled={page <= 1 || disabled}
        onClick={() => onPageChange(Math.max(1, page - 1))}
        className={navBtn}
      >
        Previous
      </button>

      <nav aria-label="Pagination" className="flex items-center gap-1.5">
        {items.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-1.5 text-sm text-gray-400 select-none"
              aria-hidden
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              disabled={disabled}
              aria-current={item === page ? "page" : undefined}
              onClick={() => {
                if (item !== page) onPageChange(item);
              }}
              className={
                (item === page ? adminBtnPrimary + " pointer-events-none" : adminBtnSecondary) +
                pageBtn
              }
            >
              {item}
            </button>
          ),
        )}
      </nav>

      <button
        type="button"
        disabled={page >= totalPages || disabled}
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        className={navBtn}
      >
        Next
      </button>
    </div>
  );
}
