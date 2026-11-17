import React, { useMemo, useState } from 'react';
import { Archive, Edit3, Plus, RotateCcw, Search, X } from 'lucide-react';
import { useCatalogue } from '../context/CatalogueContext';
import { formatINR, IMAGES } from '../data/catalogueSeed';
import {
  AvailabilityStatus,
  CoverageLevel,
  FinishType,
  Product,
  ProductCategory,
} from '../types/catalogue';

type AdminTab = 'products' | 'brands' | 'collections' | 'homepage';

export const AdminView: React.FC = () => {
  const {
    products,
    brands,
    collections,
    homepageConfig,
    wishlist,
    upsertProduct,
    toggleArchiveProduct,
    updateBrand,
    updateCollection,
    updateHomepageConfig,
    resetCatalogueToSeed,
    getBrandById,
    navigate,
  } = useCatalogue();

  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [adminSearch, setAdminSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [hpDraft, setHpDraft] = useState(homepageConfig);
  const [savedToast, setSavedToast] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setSavedToast(msg);
    setTimeout(() => setSavedToast(null), 2600);
  };

  const activeCount = products.filter((p) => !p.archived).length;
  const archivedCount = products.filter((p) => p.archived).length;

  const filteredAdminProducts = useMemo(() => {
    const q = adminSearch.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => {
      const brand = getBrandById(p.brandId);
      return (
        p.name.toLowerCase().includes(q) ||
        (brand?.name.toLowerCase().includes(q) ?? false) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [adminSearch, getBrandById, products]);

  const handleCreateNewProduct = () => {
    const now = new Date().toISOString().slice(0, 10);
    setEditingProduct({
      id: `custom-${Date.now()}`,
      brandId: brands[0]?.id ?? 'chanel',
      name: '',
      slug: `product-${Date.now()}`,
      category: 'Lips',
      subcategory: 'Lipstick',
      description: '',
      price: 3500,
      currency: 'INR',
      mainImage: IMAGES.lipstick,
      galleryImages: [IMAGES.lipstick],
      shades: [
        {
          id: `sh-${Date.now()}`,
          name: 'Signature Shade',
          code: '01',
          hex: '#1D4E9E',
          undertone: 'Neutral',
          colourFamily: 'Pink',
          available: true,
        },
      ],
      finish: 'Matte',
      formulaType: 'Cream Formula',
      coverage: 'Full',
      skinTypes: ['All Skin Types'],
      size: '3.5 g',
      ingredients: 'Verified ingredients pending publication.',
      howToUse: 'Apply evenly.',
      claims: ['Verified catalogue addition'],
      availability: 'Available',
      purchaseUrl: brands[0]?.officialUrl ?? 'https://www.chanel.com/in/',
      isBestseller: false,
      isNewArrival: true,
      archived: false,
      createdAt: now,
      updatedAt: now,
    });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name.trim()) return;
    const slug =
      editingProduct.slug.trim() ||
      editingProduct.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    upsertProduct({ ...editingProduct, slug });
    setEditingProduct(null);
    showNotice('Product saved to catalogue.');
  };

  return (
    <main className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 py-10 sm:py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#092147]/10">
        <div>
          <p className="text-xs tracking-[0.12em] text-[#1D4E9E] font-medium">
            Catalogue Management
          </p>
          <h1 className="font-editorial text-4xl font-semibold text-[#092147] mt-1">
            Admin Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {savedToast && (
            <span className="text-xs font-medium text-[#092147] bg-[#BDD4EE] px-3 py-1.5">
              {savedToast}
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              resetCatalogueToSeed();
              showNotice('Catalogue restored to verified defaults.');
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#092147]/20 bg-[#E9F1FB] text-xs text-[#092147] hover:border-[#092147] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Seed Data</span>
          </button>
        </div>
      </div>

      {/* Overview KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 py-6 border-b border-[#092147]/10">
        {[
          { label: 'Active Products', value: activeCount },
          { label: 'Archived Items', value: archivedCount },
          { label: 'Active Houses', value: brands.filter((b) => b.active).length },
          { label: 'Collections', value: collections.filter((c) => c.published).length },
          { label: 'Wishlist Saves', value: wishlist.length },
        ].map((metric) => (
          <div key={metric.label} className="bg-[#E9F1FB] border border-[#092147]/10 p-4">
            <span className="text-xs text-[#092147]/60 block">{metric.label}</span>
            <span className="font-editorial text-3xl font-semibold text-[#092147] tabular-nums mt-1 block">
              {metric.value}
            </span>
          </div>
        ))}
      </div>

      {/* Tab Bar */}
      <div className="flex items-center gap-1 p-1 bg-[#BDD4EE]/60 my-8 w-fit">
        {(
          [
            { key: 'products', label: 'Products' },
            { key: 'brands', label: 'Brands' },
            { key: 'collections', label: 'Collections' },
            { key: 'homepage', label: 'Homepage' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-[#E9F1FB] text-[#092147]'
                : 'text-[#092147]/65 hover:text-[#092147]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#092147]/45 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="Filter by product name, brand, or category..."
                className="w-full bg-[#E9F1FB] border border-[#092147]/15 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#092147]"
              />
            </div>
            <button
              type="button"
              onClick={handleCreateNewProduct}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#092147] text-[#D7E5F5] text-xs font-medium hover:bg-[#13366B] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="bg-[#E9F1FB] border border-[#092147]/10 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[780px]">
              <thead>
                <tr className="border-b border-[#092147]/10 text-[11px] tracking-[0.06em] text-[#092147]/60">
                  <th className="py-3 px-4 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold">House</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Price (INR)</th>
                  <th className="py-3 px-4 font-semibold">Shades</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#092147]/8 text-xs">
                {filteredAdminProducts.map((p) => {
                  const brand = getBrandById(p.brandId);
                  return (
                    <tr key={p.id} className={p.archived ? 'opacity-55 bg-[#D7E5F5]/50' : ''}>
                      <td className="py-3 px-4 font-medium text-[#092147]">
                        <button
                          type="button"
                          onClick={() => navigate({ view: 'product', slug: p.slug })}
                          className="hover:underline text-left"
                        >
                          {p.name}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-[#092147]/75">{brand?.name}</td>
                      <td className="py-3 px-4 text-[#092147]/75">
                        {p.category} · {p.subcategory}
                      </td>
                      <td className="py-3 px-4 tabular-nums font-medium">
                        {formatINR(p.price)}
                      </td>
                      <td className="py-3 px-4 tabular-nums text-[#092147]/70">
                        {p.shades.length}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[#092147]/75">
                          {p.archived ? 'Archived' : p.availability}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(p)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 border border-[#092147]/15 hover:border-[#092147]"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            toggleArchiveProduct(p.id);
                            showNotice(p.archived ? 'Product restored.' : 'Product archived.');
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 border border-[#092147]/15 hover:border-[#1D4E9E] hover:text-[#1D4E9E]"
                        >
                          <Archive className="w-3 h-3" />
                          <span>{p.archived ? 'Restore' : 'Archive'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BRANDS */}
      {activeTab === 'brands' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="bg-[#E9F1FB] border border-[#092147]/10 p-6 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-editorial text-2xl font-semibold">{brand.wordmark}</h3>
                  <button
                    type="button"
                    onClick={() => {
                      updateBrand({ ...brand, active: !brand.active });
                      showNotice(`${brand.name} updated.`);
                    }}
                    className={`px-3 py-1 text-xs border ${
                      brand.active
                        ? 'bg-[#092147] text-[#D7E5F5] border-[#092147]'
                        : 'bg-[#D7E5F5] text-[#092147]/60 border-[#092147]/20'
                    }`}
                  >
                    {brand.active ? 'Active' : 'Inactive'}
                  </button>
                </div>
                <p className="text-xs text-[#092147]/60">{brand.origin}</p>
                <p className="text-sm text-[#092147]/80">{brand.tagline}</p>
              </div>
              <div className="pt-3 border-t border-[#092147]/8 flex items-center justify-between text-xs">
                <span className="text-[#092147]/60 truncate max-w-[260px]">
                  {brand.officialUrl}
                </span>
                <button
                  type="button"
                  onClick={() => navigate({ view: 'brand', slug: brand.slug })}
                  className="underline underline-offset-4 hover:text-[#1D4E9E]"
                >
                  Preview Page
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: COLLECTIONS */}
      {activeTab === 'collections' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {collections.map((col) => (
            <div key={col.id} className="bg-[#E9F1FB] border border-[#092147]/10 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-editorial text-2xl font-semibold">{col.title}</h3>
                <button
                  type="button"
                  onClick={() => {
                    updateCollection({ ...col, published: !col.published });
                    showNotice(`${col.title} updated.`);
                  }}
                  className={`px-3 py-1 text-xs border ${
                    col.published
                      ? 'bg-[#092147] text-[#D7E5F5] border-[#092147]'
                      : 'bg-[#D7E5F5] text-[#092147]/60 border-[#092147]/20'
                  }`}
                >
                  {col.published ? 'Published' : 'Hidden'}
                </button>
              </div>
              <p className="text-xs text-[#1D4E9E]">{col.subtitle}</p>
              <p className="text-sm text-[#092147]/75">{col.description}</p>
              <p className="text-xs text-[#092147]/55 tabular-nums">
                {col.productIds.length} products linked
              </p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: HOMEPAGE */}
      {activeTab === 'homepage' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateHomepageConfig(hpDraft);
            showNotice('Homepage configuration published.');
          }}
          className="bg-[#E9F1FB] border border-[#092147]/10 p-6 sm:p-8 max-w-2xl space-y-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-2xl font-semibold">Homepage Editorial Copy</h2>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={hpDraft.announcementVisible}
                onChange={(e) =>
                  setHpDraft((p) => ({ ...p, announcementVisible: e.target.checked }))
                }
                className="accent-[#092147]"
              />
              <span>Show Announcement Bar</span>
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#092147]/70 block">
              Announcement Text
            </label>
            <input
              type="text"
              value={hpDraft.announcementText}
              onChange={(e) =>
                setHpDraft((p) => ({ ...p, announcementText: e.target.value }))
              }
              className="w-full border border-[#092147]/20 px-3 py-2 text-sm focus:outline-none focus:border-[#092147]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#092147]/70 block">Hero Headline</label>
            <input
              type="text"
              value={hpDraft.heroTitle}
              onChange={(e) => setHpDraft((p) => ({ ...p, heroTitle: e.target.value }))}
              className="w-full border border-[#092147]/20 px-3 py-2 text-sm focus:outline-none focus:border-[#092147]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#092147]/70 block">Hero Subtitle</label>
            <textarea
              rows={3}
              value={hpDraft.heroSubtitle}
              onChange={(e) => setHpDraft((p) => ({ ...p, heroSubtitle: e.target.value }))}
              className="w-full border border-[#092147]/20 px-3 py-2 text-sm focus:outline-none focus:border-[#092147]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#092147]/70 block">
              Dark Editorial Title
            </label>
            <input
              type="text"
              value={hpDraft.editorialTitle}
              onChange={(e) =>
                setHpDraft((p) => ({ ...p, editorialTitle: e.target.value }))
              }
              className="w-full border border-[#092147]/20 px-3 py-2 text-sm focus:outline-none focus:border-[#092147]"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-[#092147] text-[#D7E5F5] text-xs tracking-[0.08em] font-medium hover:bg-[#13366B]"
          >
            Save Homepage Changes
          </button>
        </form>
      )}

      {/* Edit / Add Product Modal */}
      {editingProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#092147]/50 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={handleSaveProduct}
            className="bg-[#D7E5F5] border border-[#092147]/15 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#092147]/10">
              <h2 className="font-editorial text-2xl font-semibold">
                {editingProduct.name ? `Edit ${editingProduct.name}` : 'Add New Product'}
              </h2>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-2 text-[#092147]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#092147]/70 block mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct((p) => (p ? { ...p, name: e.target.value } : null))
                  }
                  className="w-full bg-[#E9F1FB] border border-[#092147]/20 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#092147]/70 block mb-1">
                  House / Brand
                </label>
                <select
                  value={editingProduct.brandId}
                  onChange={(e) =>
                    setEditingProduct((p) => (p ? { ...p, brandId: e.target.value } : null))
                  }
                  className="w-full bg-[#E9F1FB] border border-[#092147]/20 px-3 py-2 text-sm"
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#092147]/70 block mb-1">
                  Category
                </label>
                <select
                  value={editingProduct.category}
                  onChange={(e) =>
                    setEditingProduct((p) =>
                      p ? { ...p, category: e.target.value as ProductCategory } : null
                    )
                  }
                  className="w-full bg-[#E9F1FB] border border-[#092147]/20 px-3 py-2 text-sm"
                >
                  {(['Face', 'Eyes', 'Lips', 'Cheeks'] as ProductCategory[]).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#092147]/70 block mb-1">
                  Subcategory
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.subcategory}
                  onChange={(e) =>
                    setEditingProduct((p) =>
                      p ? { ...p, subcategory: e.target.value } : null
                    )
                  }
                  className="w-full bg-[#E9F1FB] border border-[#092147]/20 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#092147]/70 block mb-1">
                  Price (INR ₹)
                </label>
                <input
                  type="number"
                  min={100}
                  required
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct((p) =>
                      p ? { ...p, price: Number(e.target.value) } : null
                    )
                  }
                  className="w-full bg-[#E9F1FB] border border-[#092147]/20 px-3 py-2 text-sm tabular-nums"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#092147]/70 block mb-1">
                  Finish
                </label>
                <select
                  value={editingProduct.finish}
                  onChange={(e) =>
                    setEditingProduct((p) =>
                      p ? { ...p, finish: e.target.value as FinishType } : null
                    )
                  }
                  className="w-full bg-[#E9F1FB] border border-[#092147]/20 px-3 py-2 text-sm"
                >
                  {(['Matte', 'Satin', 'Glossy', 'Shimmer', 'Natural'] as FinishType[]).map(
                    (f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#092147]/70 block mb-1">
                  Coverage
                </label>
                <select
                  value={editingProduct.coverage}
                  onChange={(e) =>
                    setEditingProduct((p) =>
                      p ? { ...p, coverage: e.target.value as CoverageLevel } : null
                    )
                  }
                  className="w-full bg-[#E9F1FB] border border-[#092147]/20 px-3 py-2 text-sm"
                >
                  {(['Light', 'Medium', 'Full', 'Buildable'] as CoverageLevel[]).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#092147]/70 block mb-1">
                  Availability
                </label>
                <select
                  value={editingProduct.availability}
                  onChange={(e) =>
                    setEditingProduct((p) =>
                      p ? { ...p, availability: e.target.value as AvailabilityStatus } : null
                    )
                  }
                  className="w-full bg-[#E9F1FB] border border-[#092147]/20 px-3 py-2 text-sm"
                >
                  {(['Available', 'Limited', 'Unavailable'] as AvailabilityStatus[]).map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#092147]/70 block mb-1">
                Product Description
              </label>
              <textarea
                rows={3}
                required
                value={editingProduct.description}
                onChange={(e) =>
                  setEditingProduct((p) =>
                    p ? { ...p, description: e.target.value } : null
                  )
                }
                className="w-full bg-[#E9F1FB] border border-[#092147]/20 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#092147]/70 block mb-1">
                Official Purchase URL
              </label>
              <input
                type="url"
                required
                value={editingProduct.purchaseUrl}
                onChange={(e) =>
                  setEditingProduct((p) =>
                    p ? { ...p, purchaseUrl: e.target.value } : null
                  )
                }
                className="w-full bg-[#E9F1FB] border border-[#092147]/20 px-3 py-2 text-sm"
              />
            </div>

            <div className="flex items-center gap-6 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingProduct.isBestseller}
                  onChange={(e) =>
                    setEditingProduct((p) =>
                      p ? { ...p, isBestseller: e.target.checked } : null
                    )
                  }
                  className="accent-[#092147]"
                />
                <span>Mark as House Icon / Bestseller</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingProduct.isNewArrival}
                  onChange={(e) =>
                    setEditingProduct((p) =>
                      p ? { ...p, isNewArrival: e.target.checked } : null
                    )
                  }
                  className="accent-[#092147]"
                />
                <span>Mark as New Arrival</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#092147]/10">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2.5 border border-[#092147]/20 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#092147] text-[#D7E5F5] text-xs font-medium"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
};
