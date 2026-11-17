export type ProductCategory = 'Face' | 'Eyes' | 'Lips' | 'Cheeks';

export type FinishType = 'Matte' | 'Satin' | 'Glossy' | 'Shimmer' | 'Natural';

export type CoverageLevel = 'Light' | 'Medium' | 'Full' | 'Buildable' | 'Not Applicable';

export type SkinType = 'Normal' | 'Dry' | 'Oily' | 'Combination' | 'All Skin Types';

export type ColourFamily = 'Red' | 'Nude' | 'Pink' | 'Brown' | 'Berry' | 'Coral' | 'Neutral' | 'Gold';

export type AvailabilityStatus = 'Available' | 'Limited' | 'Unavailable';

export interface ProductShade {
  id: string;
  name: string;
  code: string;
  hex: string;
  undertone?: string;
  colourFamily: ColourFamily;
  available: boolean;
}

export interface Product {
  id: string;
  brandId: string;
  name: string;
  slug: string;
  category: ProductCategory;
  subcategory: string;
  description: string;
  price: number;
  currency: 'INR';
  mainImage: string;
  galleryImages: string[];
  shades: ProductShade[];
  finish: FinishType;
  formulaType: string;
  coverage: CoverageLevel;
  skinTypes: SkinType[];
  size: string;
  ingredients: string;
  howToUse: string;
  claims: string[];
  availability: AvailabilityStatus;
  purchaseUrl: string;
  isBestseller: boolean;
  isNewArrival: boolean;
  archived?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  wordmark: string;
  origin: string;
  tagline: string;
  description: string;
  inspirationNote: string;
  bannerImage: string;
  officialUrl: string;
  categories: ProductCategory[];
  active: boolean;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  bannerImage: string;
  theme: 'light' | 'dark';
  productIds: string[];
  published: boolean;
}

export interface HomepageConfig {
  announcementText: string;
  announcementVisible: boolean;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroImage: string;
  editorialTitle: string;
  editorialSubtitle: string;
  editorialImage: string;
}

export interface WishlistItem {
  productId: string;
  shadeId?: string;
  addedAt: string;
}

export type SortOption =
  | 'featured'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'alphabetical';

export interface FilterState {
  brands: string[];
  categories: ProductCategory[];
  subcategories: string[];
  colourFamilies: ColourFamily[];
  finishes: FinishType[];
  coverages: CoverageLevel[];
  skinTypes: SkinType[];
  availability: AvailabilityStatus[];
  minPrice: number;
  maxPrice: number;
}

export type AppRoute =
  | { view: 'home' }
  | { view: 'shop'; category?: ProductCategory }
  | { view: 'brands' }
  | { view: 'brand'; slug: string }
  | { view: 'collections' }
  | { view: 'collection'; slug: string }
  | { view: 'product'; slug: string }
  | { view: 'new-arrivals' }
  | { view: 'bestsellers' }
  | { view: 'admin' };
