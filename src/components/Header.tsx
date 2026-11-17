import React, { useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { useCatalogue } from '../context/CatalogueContext';

export const Header: React.FC = () => {
  const { route, navigate, wishlist, setWishlistOpen, setSearchOpen } = useCatalogue();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClass = (active: boolean) =>
    `relative py-1.5 text-[13px] tracking-[0.06em] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#092147] ${
      active
        ? 'text-[#071936] font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-[#60A5FA]'
        : 'text-[#092147]/65 hover:text-[#071936] font-normal'
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#D7E5F5]/92 backdrop-blur-md border-b border-[#092147]/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 h-[68px] flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="md:hidden p-2 -ml-2 text-[#092147] hover:bg-[#BDD4EE]/50 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => navigate({ view: 'home' })}
              className="font-editorial text-2xl sm:text-[28px] font-medium tracking-[0.22em] text-[#071936] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#092147]"
            >
              MAISON ÉDIT
            </button>
          </div>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-8 lg:gap-10">
            <button
              type="button"
              onClick={() => navigate({ view: 'shop' })}
              className={navLinkClass(route.view === 'shop')}
            >
              Catalogue
            </button>
            <button
              type="button"
              onClick={() => navigate({ view: 'brands' })}
              className={navLinkClass(route.view === 'brands' || route.view === 'brand')}
            >
              Houses
            </button>
            <button
              type="button"
              onClick={() => navigate({ view: 'collections' })}
              className={navLinkClass(route.view === 'collections' || route.view === 'collection')}
            >
              Edits
            </button>
            <button
              type="button"
              onClick={() => setWishlistOpen(true)}
              className={navLinkClass(false)}
            >
              Wishlist{wishlist.length > 0 ? ` · ${wishlist.length}` : ''}
            </button>
            <button
              type="button"
              onClick={() => navigate({ view: 'admin' })}
              className={navLinkClass(route.view === 'admin')}
            >
              Atelier Admin
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex items-center gap-2.5 px-5 py-2 text-xs tracking-[0.12em] font-medium bg-[#071936] text-[#D7E5F5] border border-[#071936] hover:bg-transparent hover:text-[#071936] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#071936]"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-[#071936]/45 backdrop-blur-[2px]"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-[82%] max-w-xs bg-[#D7E5F5] h-full flex flex-col justify-between p-6 border-r border-[#092147]/10 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-[#092147]/10">
                <span className="font-editorial text-xl font-medium tracking-[0.2em]">
                  MAISON ÉDIT
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="p-2 text-[#092147]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-6 flex flex-col gap-1">
                {[
                  { label: 'Home', action: () => navigate({ view: 'home' }) },
                  { label: 'Full Catalogue', action: () => navigate({ view: 'shop' }) },
                  { label: 'Face Complexion', action: () => navigate({ view: 'shop', category: 'Face' }) },
                  { label: 'Eye Artistry', action: () => navigate({ view: 'shop', category: 'Eyes' }) },
                  { label: 'Lip Couture', action: () => navigate({ view: 'shop', category: 'Lips' }) },
                  { label: 'Cheek Radiance', action: () => navigate({ view: 'shop', category: 'Cheeks' }) },
                  { label: 'The Seven Houses', action: () => navigate({ view: 'brands' }) },
                  { label: 'Curated Edits', action: () => navigate({ view: 'collections' }) },
                  {
                    label: `Wishlist (${wishlist.length})`,
                    action: () => {
                      setMobileMenuOpen(false);
                      setWishlistOpen(true);
                    },
                  },
                  { label: 'Atelier Admin', action: () => navigate({ view: 'admin' }) },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      item.action();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-3 px-2 text-sm font-medium text-[#092147] border-b border-[#092147]/8 hover:bg-[#BDD4EE]/40 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-8 text-xs text-[#092147]/55 tracking-[0.06em]">
              Luxury Beauty Index · India (INR ₹)
            </p>
          </div>
        </div>
      )}
    </>
  );
};
