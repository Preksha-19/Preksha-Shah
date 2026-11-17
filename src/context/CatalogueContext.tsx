import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  INITIAL_BRANDS,
  INITIAL_COLLECTIONS,
  INITIAL_HOMEPAGE_CONFIG,
  INITIAL_PRODUCTS,
} from '../data/catalogueSeed';
import {
  AppRoute,
  Brand,
  Collection,
  HomepageConfig,
  Product,
  WishlistItem,
} from '../types/catalogue';

const STORAGE_KEYS = {
  products: 'maison_edit_products_v1',
  brands: 'maison_edit_brands_v1',
  collections: 'maison_edit_collections_v1',
  homepage: 'maison_edit_homepage_v1',
  wishlist: 'maison_edit_wishlist_v1',
  compare: 'maison_edit_compare_v1',
  recentSearches: 'maison_edit_searches_v1',
  recentlyViewed: 'maison_edit_viewed_v1',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

interface CatalogueContextValue {
  route: AppRoute;
  navigate: (nextRoute: AppRoute) => void;
  products: Product[];
  activeProducts: Product[];
  brands: Brand[];
  activeBrands: Brand[];
  collections: Collection[];
  publishedCollections: Collection[];
  homepageConfig: HomepageConfig;
  wishlist: WishlistItem[];
  compareIds: string[];
  recentSearches: string[];
  recentlyViewedIds: string[];
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  wishlistOpen: boolean;
  setWishlistOpen: (open: boolean) => void;
  compareOpen: boolean;
  setCompareOpen: (open: boolean) => void;
  toggleWishlist: (productId: string, shadeId?: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleCompare: (productId: string) => void;
  clearCompare: () => void;
  addRecentSearch: (term: string) => void;
  recordProductView: (productId: string) => void;
  getBrandById: (brandId: string) => Brand | undefined;
  // Admin mutations
  upsertProduct: (product: Product) => void;
  toggleArchiveProduct: (productId: string) => void;
  updateBrand: (brand: Brand) => void;
  updateCollection: (collection: Collection) => void;
  updateHomepageConfig: (config: HomepageConfig) => void;
  resetCatalogueToSeed: () => void;
}

const CatalogueContext = createContext<CatalogueContextValue | null>(null);

export const CatalogueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<AppRoute>({ view: 'home' });

  const [products, setProducts] = useState<Product[]>(() =>
    loadFromStorage(STORAGE_KEYS.products, INITIAL_PRODUCTS)
  );
  const [brands, setBrands] = useState<Brand[]>(() =>
    loadFromStorage(STORAGE_KEYS.brands, INITIAL_BRANDS)
  );
  const [collections, setCollections] = useState<Collection[]>(() =>
    loadFromStorage(STORAGE_KEYS.collections, INITIAL_COLLECTIONS)
  );
  const [homepageConfig, setHomepageConfig] = useState<HomepageConfig>(() =>
    loadFromStorage(STORAGE_KEYS.homepage, INITIAL_HOMEPAGE_CONFIG)
  );
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() =>
    loadFromStorage(STORAGE_KEYS.wishlist, [])
  );
  const [compareIds, setCompareIds] = useState<string[]>(() =>
    loadFromStorage(STORAGE_KEYS.compare, [])
  );
  const [recentSearches, setRecentSearches] = useState<string[]>(() =>
    loadFromStorage(STORAGE_KEYS.recentSearches, ['Nude Lipstick', 'Dior Blush', 'Fenty Gloss'])
  );
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() =>
    loadFromStorage(STORAGE_KEYS.recentlyViewed, [])
  );

  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
    } catch {
      // ignore storage quota errors
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.brands, JSON.stringify(brands));
    } catch {}
  }, [brands]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.collections, JSON.stringify(collections));
    } catch {}
  }, [collections]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.homepage, JSON.stringify(homepageConfig));
    } catch {}
  }, [homepageConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.compare, JSON.stringify(compareIds));
    } catch {}
  }, [compareIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.recentSearches, JSON.stringify(recentSearches));
    } catch {}
  }, [recentSearches]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.recentlyViewed, JSON.stringify(recentlyViewedIds));
    } catch {}
  }, [recentlyViewedIds]);

  const navigate = useCallback((nextRoute: AppRoute) => {
    setRoute(nextRoute);
    setSearchOpen(false);
    setWishlistOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Keyboard shortcut Cmd/Ctrl + K for search
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
        setWishlistOpen(false);
        setCompareOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const activeBrands = useMemo(() => brands.filter((b) => b.active), [brands]);
  const activeBrandIdSet = useMemo(() => new Set(activeBrands.map((b) => b.id)), [activeBrands]);

  const activeProducts = useMemo(
    () => products.filter((p) => !p.archived && activeBrandIdSet.has(p.brandId)),
    [products, activeBrandIdSet]
  );

  const publishedCollections = useMemo(
    () => collections.filter((c) => c.published),
    [collections]
  );

  const getBrandById = useCallback(
    (brandId: string) => brands.find((b) => b.id === brandId),
    [brands]
  );

  const toggleWishlist = useCallback((productId: string, shadeId?: string) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.productId === productId);
      if (exists) {
        return prev.filter((item) => item.productId !== productId);
      }
      return [{ productId, shadeId, addedAt: new Date().toISOString() }, ...prev];
    });
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => wishlist.some((item) => item.productId === productId),
    [wishlist]
  );

  const toggleCompare = useCallback((productId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), productId];
      }
      return [...prev, productId];
    });
  }, []);

  const clearCompare = useCallback(() => {
    setCompareIds([]);
    setCompareOpen(false);
  }, []);

  const addRecentSearch = useCallback((term: string) => {
    const cleaned = term.trim();
    if (!cleaned) return;
    setRecentSearches((prev) => [cleaned, ...prev.filter((t) => t.toLowerCase() !== cleaned.toLowerCase())].slice(0, 6));
  }, []);

  const recordProductView = useCallback((productId: string) => {
    setRecentlyViewedIds((prev) => [productId, ...prev.filter((id) => id !== productId)].slice(0, 8));
  }, []);

  const upsertProduct = useCallback((product: Product) => {
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...product, updatedAt: new Date().toISOString().slice(0, 10) };
        return next;
      }
      return [{ ...product, createdAt: new Date().toISOString().slice(0, 10), updatedAt: new Date().toISOString().slice(0, 10) }, ...prev];
    });
  }, []);

  const toggleArchiveProduct = useCallback((productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, archived: !p.archived, updatedAt: new Date().toISOString().slice(0, 10) }
          : p
      )
    );
  }, []);

  const updateBrand = useCallback((brand: Brand) => {
    setBrands((prev) => prev.map((b) => (b.id === brand.id ? brand : b)));
  }, []);

  const updateCollection = useCallback((collection: Collection) => {
    setCollections((prev) => prev.map((c) => (c.id === collection.id ? collection : c)));
  }, []);

  const updateHomepageConfig = useCallback((config: HomepageConfig) => {
    setHomepageConfig(config);
  }, []);

  const resetCatalogueToSeed = useCallback(() => {
    setProducts(INITIAL_PRODUCTS);
    setBrands(INITIAL_BRANDS);
    setCollections(INITIAL_COLLECTIONS);
    setHomepageConfig(INITIAL_HOMEPAGE_CONFIG);
  }, []);

  return (
    <CatalogueContext.Provider
      value={{
        route,
        navigate,
        products,
        activeProducts,
        brands,
        activeBrands,
        collections,
        publishedCollections,
        homepageConfig,
        wishlist,
        compareIds,
        recentSearches,
        recentlyViewedIds,
        searchOpen,
        setSearchOpen,
        wishlistOpen,
        setWishlistOpen,
        compareOpen,
        setCompareOpen,
        toggleWishlist,
        isInWishlist,
        toggleCompare,
        clearCompare,
        addRecentSearch,
        recordProductView,
        getBrandById,
        upsertProduct,
        toggleArchiveProduct,
        updateBrand,
        updateCollection,
        updateHomepageConfig,
        resetCatalogueToSeed,
      }}
    >
      {children}
    </CatalogueContext.Provider>
  );
};

export function useCatalogue(): CatalogueContextValue {
  const ctx = useContext(CatalogueContext);
  if (!ctx) throw new Error('useCatalogue must be used inside CatalogueProvider');
  return ctx;
}
