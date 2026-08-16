"use client";

import { ChevronDown } from "lucide-react";
import {
  HEIGHT_FILTER_OPTIONS,
  type ModelFilterCategory,
  type ModelFilters,
} from "@/lib/public/models";

const CATEGORIES: ModelFilterCategory[] = [
  "All",
  "Super Model",
  "Experienced",
  "Freshers",
  "Influencer",
];

interface ModelsFilterBarProps {
  filters: ModelFilters;
  onChange: (filters: ModelFilters) => void;
  count: number;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
  showAdvancedFilters?: boolean;
}

export default function ModelsFilterBar({
  filters,
  onChange,
  count,
  showAdvanced,
  onToggleAdvanced,
  showAdvancedFilters = true,
}: ModelsFilterBarProps) {
  function resetFilters() {
    onChange({
      category: "All",
      heightMin: null,
      heightMax: null,
      gender: "All",
    });
  }

  return (
    <section className="border-y border-[#E0E0E0] py-3 md:py-8 bg-white/95 backdrop-blur-md sticky top-[60px] z-40">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px]">
        <div className="flex flex-col lg:flex-row lg:items-center gap-2 md:gap-4 lg:gap-6 mb-0">
          <div className="flex items-center gap-3 md:gap-6 overflow-x-auto md:overflow-visible md:flex-wrap pb-1 md:pb-0">
            <span className="font-ui text-[9px] tracking-[0.3em] uppercase text-[#9A9A9A] shrink-0">
              FILTER:
            </span>
            <div className="flex gap-2 md:gap-3 flex-nowrap md:flex-wrap">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => onChange({ ...filters, category })}
                  data-cursor="button"
                  className={[
                    "font-ui text-[9px] tracking-[0.25em] uppercase px-4 md:px-5 py-2 border transition-colors duration-300 shrink-0",
                    filters.category === category
                      ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                      : "text-[#0A0A0A] border-[#E0E0E0] hover:border-[#0A0A0A]",
                  ].join(" ")}
                >
                  {category}
                </button>
              ))}
            </div>
            {showAdvancedFilters && (
              <button
                type="button"
                onClick={onToggleAdvanced}
                className="font-ui text-[9px] tracking-[0.25em] uppercase px-4 md:px-5 py-2 border border-[#C8A97A] text-[#C8A97A] hover:bg-[#C8A97A] hover:text-white transition-colors duration-300 flex items-center gap-2 shrink-0"
              >
                More Filters
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-300 ${showAdvanced ? "rotate-180" : ""}`}
                />
              </button>
            )}
          </div>
          <span className="font-ui text-[9px] tracking-[0.3em] uppercase text-[#9A9A9A] lg:ml-auto">
            {count} {count === 1 ? "MODEL" : "MODELS"}
          </span>
        </div>

        {showAdvanced && showAdvancedFilters && (
          <div className="pt-6 mt-6 border-t border-[#E0E0E0] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="font-ui text-[8px] tracking-[0.3em] uppercase text-[#9A9A9A] mb-3 block">
                Height Min
              </label>
              <select
                value={filters.heightMin ?? ""}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    heightMin: e.target.value ? parseInt(e.target.value, 10) : null,
                  })
                }
                className="w-full font-ui text-[10px] px-3 py-2 border border-[#E0E0E0] focus:border-[#C8A97A] focus:outline-none bg-white"
              >
                <option value="">Any</option>
                {HEIGHT_FILTER_OPTIONS.map((option) => (
                  <option key={option.inches} value={option.inches}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-ui text-[8px] tracking-[0.3em] uppercase text-[#9A9A9A] mb-3 block">
                Height Max
              </label>
              <select
                value={filters.heightMax ?? ""}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    heightMax: e.target.value ? parseInt(e.target.value, 10) : null,
                  })
                }
                className="w-full font-ui text-[10px] px-3 py-2 border border-[#E0E0E0] focus:border-[#C8A97A] focus:outline-none bg-white"
              >
                <option value="">Any</option>
                {HEIGHT_FILTER_OPTIONS.map((option) => (
                  <option key={option.inches} value={option.inches}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-ui text-[8px] tracking-[0.3em] uppercase text-[#9A9A9A] mb-3 block">
                Gender
              </label>
              <select
                value={filters.gender}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    gender: e.target.value as ModelFilters["gender"],
                  })
                }
                className="w-full font-ui text-[10px] px-3 py-2 border border-[#E0E0E0] focus:border-[#C8A97A] focus:outline-none bg-white"
              >
                <option value="All">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-2 flex items-end">
              <button
                type="button"
                onClick={resetFilters}
                className="w-full font-ui text-[9px] tracking-[0.25em] uppercase px-4 py-2 border border-[#E0E0E0] text-[#4A4A4A] hover:border-[#0A0A0A] hover:text-[#0A0A0A] transition-colors duration-300"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
