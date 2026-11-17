import React from 'react';
import { X } from 'lucide-react';
import {
  AvailabilityStatus,
  Brand,
  ColourFamily,
  CoverageLevel,
  FilterState,
  FinishType,
  ProductCategory,
  SkinType,
} from '../types/catalogue';
import { formatINR } from '../data/catalogueSeed';

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  brands: Brand[];
  onReset: () => void;
  showCoverageFilter: boolean;
  maxCatalogPrice: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const CATEGORIES: ProductCategory[] = ['Face', 'Eyes', 'Lips', 'Cheeks'];
const COLOURS: ColourFamily[] = ['Red', 'Nude', 'Pink', 'Brown', 'Berry', 'Coral', 'Gold', 'Neutral'];
const FINISHES: FinishType[] = ['Matte', 'Satin', 'Glossy', 'Shimmer', 'Natural'];
const COVERAGES: CoverageLevel[] = ['Light', 'Medium', 'Full', 'Buildable'];
const SKIN_TYPES: SkinType[] = ['Normal', 'Dry', 'Oily', 'Combination', 'All Skin Types'];
const AVAILABILITIES: AvailabilityStatus[] = ['Available', 'Limited', 'Unavailable'];

function toggleValue<T>(list: T[], val: T): T[] {
  return list.includes(val) ? list.filter((item) => item !== val) : [...list, val];
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  setFilters,
  brands,
  onReset,
  showCoverageFilter,
  maxCatalogPrice,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const activeFilterCount =
    filters.brands.length +
    filters.categories.length +
    filters.colourFamilies.length +
    filters.finishes.length +
    filters.coverages.length +
    filters.skinTypes.length +
    filters.availability.length +
    (filters.maxPrice < maxCatalogPrice ? 1 : 0);

  const content = (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#092147]/12">
        <span className="text-xs tracking-[0.08em] font-semibold text-[#092147]">
          Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
        </span>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-[#1D4E9E] hover:text-[#092147] transition-colors underline underline-offset-4"
          >
            Reset All
          </button>
        )}
      </div>

      {/* Brand */}
      <div className="space-y-2.5">
        <h4 className="text-xs tracking-[0.08em] font-semibold text-[#092147]/70">Brand</h4>
        <div className="space-y-1.5">
          {brands.map((brand) => {
            const checked = filters.brands.includes(brand.id);
            return (
              <label
                key={brand.id}
                className="flex items-center gap-2.5 text-sm text-[#092147]/85 cursor-pointer py-0.5 hover:text-[#092147]"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    setFilters((prev) => ({
                      ...prev,
                      brands: toggleValue(prev.brands, brand.id),
                    }))
                  }
                  className="accent-[#092147] w-3.5 h-3.5"
                />
                <span>{brand.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2.5 pt-4 border-t border-[#092147]/10">
        <h4 className="text-xs tracking-[0.08em] font-semibold text-[#092147]/70">Category</h4>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => {
            const checked = filters.categories.includes(cat);
            return (
              <label
                key={cat}
                className="flex items-center gap-2.5 text-sm text-[#092147]/85 cursor-pointer py-0.5 hover:text-[#092147]"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    setFilters((prev) => ({
                      ...prev,
                      categories: toggleValue(prev.categories, cat),
                    }))
                  }
                  className="accent-[#092147] w-3.5 h-3.5"
                />
                <span>{cat}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Ceiling */}
      <div className="space-y-2.5 pt-4 border-t border-[#092147]/10">
        <div className="flex items-center justify-between">
          <h4 className="text-xs tracking-[0.08em] font-semibold text-[#092147]/70">Max Price</h4>
          <span className="text-xs font-medium text-[#092147] tabular-nums">
            {formatINR(filters.maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min={1000}
          max={maxCatalogPrice}
          step={500}
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
          }
          aria-label="Maximum price filter"
          className="w-full accent-[#092147]"
        />
        <div className="flex justify-between text-[11px] text-[#092147]/50 tabular-nums">
          <span>₹1,000</span>
          <span>{formatINR(maxCatalogPrice)}</span>
        </div>
      </div>

      {/* Shade Colour Family */}
      <div className="space-y-2.5 pt-4 border-t border-[#092147]/10">
        <h4 className="text-xs tracking-[0.08em] font-semibold text-[#092147]/70">
          Colour Family
        </h4>
        <div className="grid grid-cols-2 gap-1.5">
          {COLOURS.map((colour) => {
            const active = filters.colourFamilies.includes(colour);
            return (
              <button
                key={colour}
                type="button"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    colourFamilies: toggleValue(prev.colourFamilies, colour),
                  }))
                }
                className={`px-2.5 py-1.5 text-xs text-left border transition-colors ${
                  active
                    ? 'bg-[#092147] text-[#D7E5F5] border-[#092147]'
                    : 'bg-[#E9F1FB] text-[#092147]/80 border-[#092147]/12 hover:border-[#092147]'
                }`}
              >
                {colour}
              </button>
            );
          })}
        </div>
      </div>

      {/* Finish */}
      <div className="space-y-2.5 pt-4 border-t border-[#092147]/10">
        <h4 className="text-xs tracking-[0.08em] font-semibold text-[#092147]/70">Finish</h4>
        <div className="space-y-1.5">
          {FINISHES.map((finish) => {
            const checked = filters.finishes.includes(finish);
            return (
              <label
                key={finish}
                className="flex items-center gap-2.5 text-sm text-[#092147]/85 cursor-pointer py-0.5 hover:text-[#092147]"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    setFilters((prev) => ({
                      ...prev,
                      finishes: toggleValue(prev.finishes, finish),
                    }))
                  }
                  className="accent-[#092147] w-3.5 h-3.5"
                />
                <span>{finish}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Coverage (shown when relevant) */}
      {showCoverageFilter && (
        <div className="space-y-2.5 pt-4 border-t border-[#092147]/10">
          <h4 className="text-xs tracking-[0.08em] font-semibold text-[#092147]/70">Coverage</h4>
          <div className="space-y-1.5">
            {COVERAGES.map((cov) => {
              const checked = filters.coverages.includes(cov);
              return (
                <label
                  key={cov}
                  className="flex items-center gap-2.5 text-sm text-[#092147]/85 cursor-pointer py-0.5 hover:text-[#092147]"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      setFilters((prev) => ({
                        ...prev,
                        coverages: toggleValue(prev.coverages, cov),
                      }))
                    }
                    className="accent-[#092147] w-3.5 h-3.5"
                  />
                  <span>{cov}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Skin Type */}
      <div className="space-y-2.5 pt-4 border-t border-[#092147]/10">
        <h4 className="text-xs tracking-[0.08em] font-semibold text-[#092147]/70">Skin Type</h4>
        <div className="space-y-1.5">
          {SKIN_TYPES.map((st) => {
            const checked = filters.skinTypes.includes(st);
            return (
              <label
                key={st}
                className="flex items-center gap-2.5 text-sm text-[#092147]/85 cursor-pointer py-0.5 hover:text-[#092147]"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    setFilters((prev) => ({
                      ...prev,
                      skinTypes: toggleValue(prev.skinTypes, st),
                    }))
                  }
                  className="accent-[#092147] w-3.5 h-3.5"
                />
                <span>{st}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-2.5 pt-4 border-t border-[#092147]/10">
        <h4 className="text-xs tracking-[0.08em] font-semibold text-[#092147]/70">
          Availability
        </h4>
        <div className="space-y-1.5">
          {AVAILABILITIES.map((av) => {
            const checked = filters.availability.includes(av);
            return (
              <label
                key={av}
                className="flex items-center gap-2.5 text-sm text-[#092147]/85 cursor-pointer py-0.5 hover:text-[#092147]"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    setFilters((prev) => ({
                      ...prev,
                      availability: toggleValue(prev.availability, av),
                    }))
                  }
                  className="accent-[#092147] w-3.5 h-3.5"
                />
                <span>{av}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 pr-8 border-r border-[#092147]/10">
        {content}
      </aside>

      {/* Mobile Slide-Over Filter Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-[#092147]/40 backdrop-blur-[2px]"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-[85%] max-w-sm bg-[#D7E5F5] h-full overflow-y-auto p-6">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#092147]/15">
              <span className="font-editorial text-xl font-semibold">Refine Catalogue</span>
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close filters"
                className="p-2 text-[#092147]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
            <div className="sticky bottom-0 pt-4 mt-6 bg-[#D7E5F5] border-t border-[#092147]/10">
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-full py-3 bg-[#092147] text-[#D7E5F5] text-xs tracking-[0.08em] font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
