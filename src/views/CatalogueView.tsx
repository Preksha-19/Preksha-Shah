import React, { useEffect, useMemo, useState } from 'react';
import { LayoutGrid, Layers, SlidersHorizontal, X } from 'lucide-react';
import { FilterSidebar } from '../components/FilterSidebar';
import { ProductBounceShowcase } from '../components/ProductBounceShowcase';
import { ProductCard } from '../components/ProductCard';
import { useCatalogue } from '../context/CatalogueContext';
import { FilterState, ProductCategory, SortOption } from '../types/catalogue';

interface CatalogueViewProps {
  initialCategory?: ProductCategory;
  mode?: 'all' | 'new-arrivals' | 'bestsellers';
}

export const CatalogueView: React.FC<CatalogueViewProps> = ({
  initialCategory,
  mode = 'all',
}) => {
  const { activeProducts, activeBrands } = useCatalogue();

  const maxCatalogPrice = useMemo(() => {
    const prices = activeProducts.map((p) => p.price);
    return Math.max(15000, ...(prices.length ? prices : [15000]));
  }, [activeProducts]);

  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    categories: initialCategory ? [initialCategory] : [],
    subcategories: [],
    colourFamilies: [],
    finishes: [],
    coverages: [],
    skinTypes: [],
    availability: [],
    minPrice: 0,
    maxPrice: maxCatalogPrice,
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      categories: initialCategory ? [initialCategory] : [],
      maxPrice: maxCatalogPrice,
    }));
  }, [initialCategory, maxCatalogPrice]);

  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [viewMode, setViewMode] = useState<'bounce' | 'grid'>('bounce');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(28);

  const resetFilters = () => {
    setFilters({
      brands: [],
      categories: [],
      subcategories: [],
      colourFamilies: [],
      finishes: [],
      coverages: [],
      skinTypes: [],
      availability: [],
      minPrice: 0,
      maxPrice: maxCatalogPrice,
    });
  };

  const filteredProducts = useMemo(() => {
    let list = [...activeProducts];

    if (mode === 'new-arrivals') {
      list = list.filter((p) => p.isNewArrival);
    } else if (mode === 'bestsellers') {
      list = list.filter((p) => p.isBestseller);
    }

    if (filters.brands.length > 0) {
      list = list.filter((p) => filters.brands.includes(p.brandId));
    }
    if (filters.categories.length > 0) {
      list = list.filter((p) => filters.categories.includes(p.category));
    }
    if (filters.colourFamilies.length > 0) {
      list = list.filter((p) =>
        p.shades.some((s) => filters.colourFamilies.includes(s.colourFamily))
      );
    }
    if (filters.finishes.length > 0) {
      list = list.filter((p) => filters.finishes.includes(p.finish));
    }
    if (filters.coverages.length > 0) {
      list = list.filter((p) => filters.coverages.includes(p.coverage));
    }
    if (filters.skinTypes.length > 0) {
      list = list.filter((p) =>
        p.skinTypes.some((st) => filters.skinTypes.includes(st) || st === 'All Skin Types')
      );
    }
    if (filters.availability.length > 0) {
      list = list.filter((p) => filters.availability.includes(p.availability));
    }
    list = list.filter((p) => p.price <= filters.maxPrice);

    switch (sortBy) {
      case 'newest':
        list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'alphabetical':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        list.sort((a, b) => Number(b.isBestseller) - Number(a.isBestseller));
        break;
    }

    return list;
  }, [activeProducts, filters, mode, sortBy]);

  const showCoverageFilter =
    filters.categories.length === 0 ||
    filters.categories.includes('Face') ||
    filters.categories.includes('Cheeks');

  const pageTitle =
    mode === 'new-arrivals'
      ? 'New Arrivals'
      : mode === 'bestsellers'
      ? 'House Bestsellers'
      : initialCategory
      ? `${initialCategory} Makeup`
      : 'Shop All Makeup';

  const activeTags: { label: string; onRemove: () => void }[] = [
    ...filters.brands.map((id) => ({
      label: activeBrands.find((b) => b.id === id)?.name ?? id,
      onRemove: () =>
        setFilters((p) => ({ ...p, brands: p.brands.filter((x) => x !== id) })),
    })),
    ...filters.categories.map((cat) => ({
      label: cat,
      onRemove: () =>
        setFilters((p) => ({ ...p, categories: p.categories.filter((x) => x !== cat) })),
    })),
    ...filters.colourFamilies.map((col) => ({
      label: col,
      onRemove: () =>
        setFilters((p) => ({
          ...p,
          colourFamilies: p.colourFamilies.filter((x) => x !== col),
        })),
    })),
    ...filters.finishes.map((fin) => ({
      label: fin,
      onRemove: () =>
        setFilters((p) => ({ ...p, finishes: p.finishes.filter((x) => x !== fin) })),
    })),
  ];

  return (
    <main className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 py-10 sm:py-12">
      {/* Page Heading */}
      <div className="pb-8 border-b border-[#092147]/10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-xs tracking-[0.12em] text-[#092147]/55">
            Curated Multi-Brand Catalogue
          </p>
          <h1 className="font-editorial text-4xl sm:text-5xl font-semibold text-[#092147]">
            {pageTitle}
          </h1>
          <p className="text-sm text-[#092147]/70 max-w-2xl">
            Browse verified iconic formulations across CHANEL, KIKO MILANO, Charlotte Tilbury,
            Fenty Beauty, Kylie Cosmetics, Dior Beauty, and TOM FORD Beauty.
          </p>
        </div>

        {/* Category quick pills */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-[#BDD4EE]/60">
            {(['All', 'Face', 'Eyes', 'Lips', 'Cheeks'] as const).map((cat) => {
              const active =
                cat === 'All'
                  ? filters.categories.length === 0
                  : filters.categories.length === 1 && filters.categories[0] === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      categories: cat === 'All' ? [] : [cat],
                    }))
                  }
                  className={`px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-[#E9F1FB] text-[#092147]'
                      : 'text-[#092147]/65 hover:text-[#092147]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Toolbar: Count, Mobile Filter Trigger, Layout Mode & Sort */}
      <div className="py-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#092147]/8 mb-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 border border-[#092147]/20 bg-[#E9F1FB] text-xs font-medium text-[#092147]"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
          <span className="text-xs text-[#092147]/65 tabular-nums">
            Showing {Math.min(visibleCount, filteredProducts.length)} of {filteredProducts.length}{' '}
            {filteredProducts.length === 1 ? 'product' : 'products'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Bounce Cards vs Grid Switch */}
          <div className="flex items-center gap-1 p-1 bg-[#BDD4EE]/60">
            <button
              type="button"
              onClick={() => setViewMode('bounce')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                viewMode === 'bounce'
                  ? 'bg-[#E9F1FB] text-[#092147]'
                  : 'text-[#092147]/65 hover:text-[#092147]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Bounce Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                viewMode === 'grid'
                  ? 'bg-[#E9F1FB] text-[#092147]'
                  : 'text-[#092147]/65 hover:text-[#092147]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="catalogue-sort" className="text-xs text-[#092147]/60">
              Sort by:
            </label>
            <select
              id="catalogue-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-[#E9F1FB] border border-[#092147]/15 px-3 py-1.5 text-xs font-medium text-[#092147] focus:outline-none focus:border-[#092147]"
            >
              <option value="featured">Featured Icons</option>
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="alphabetical">Alphabetical (A–Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active filter strip */}
      {activeTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {activeTags.map((tag) => (
            <button
              key={tag.label}
              type="button"
              onClick={tag.onRemove}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#E9F1FB] border border-[#092147]/15 text-xs text-[#092147] hover:border-[#092147]"
            >
              <span>{tag.label}</span>
              <X className="w-3 h-3" />
            </button>
          ))}
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs text-[#1D4E9E] hover:text-[#092147] underline underline-offset-4 ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Layout: Sidebar + Product Showcase */}
      <div className="flex items-start">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          brands={activeBrands}
          onReset={resetFilters}
          showCoverageFilter={showCoverageFilter}
          maxCatalogPrice={maxCatalogPrice}
          mobileOpen={mobileFilterOpen}
          onCloseMobile={() => setMobileFilterOpen(false)}
        />

        <div className="flex-1 lg:pl-8 min-w-0">
          {filteredProducts.length === 0 ? (
            <div className="bg-[#E9F1FB] border border-[#092147]/10 p-12 text-center space-y-4">
              <p className="font-editorial text-2xl text-[#092147]">
                No makeup items match your selected filters
              </p>
              <p className="text-sm text-[#092147]/65 max-w-md mx-auto">
                Adjust your finish, colour family, or brand filters to explore the full curated
                catalogue.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-5 py-2.5 bg-[#092147] text-[#D7E5F5] text-xs tracking-[0.06em]"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'bounce' ? (
            <ProductBounceShowcase
              products={filteredProducts.slice(0, visibleCount)}
              groupByBrand={sortBy === 'featured'}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.slice(0, visibleCount).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {visibleCount < filteredProducts.length && (
                <div className="mt-10 text-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((c) => c + 12)}
                    className="px-6 py-3 border border-[#092147] text-xs tracking-[0.08em] font-medium hover:bg-[#092147] hover:text-[#D7E5F5] transition-colors"
                  >
                    Load More Products ({filteredProducts.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
};
