import React from 'react';
import { AnnouncementBar } from './components/AnnouncementBar';
import { CompareTrayAndModal } from './components/CompareTrayAndModal';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { SearchOverlay } from './components/SearchOverlay';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CatalogueProvider, useCatalogue } from './context/CatalogueContext';
import { AdminView } from './views/AdminView';
import { BrandDetailView, BrandsDirectoryView } from './views/BrandsViews';
import { CatalogueView } from './views/CatalogueView';
import { CollectionDetailView, CollectionsView } from './views/CollectionsViews';
import { HomeView } from './views/HomeView';
import { ProductDetailView } from './views/ProductDetailView';

const AppContent: React.FC = () => {
  const { route } = useCatalogue();

  const renderView = () => {
    switch (route.view) {
      case 'home':
        return <HomeView />;
      case 'shop':
        return <CatalogueView initialCategory={route.category} mode="all" />;
      case 'new-arrivals':
        return <CatalogueView mode="new-arrivals" />;
      case 'bestsellers':
        return <CatalogueView mode="bestsellers" />;
      case 'brands':
        return <BrandsDirectoryView />;
      case 'brand':
        return <BrandDetailView slug={route.slug} />;
      case 'collections':
        return <CollectionsView />;
      case 'collection':
        return <CollectionDetailView slug={route.slug} />;
      case 'product':
        return <ProductDetailView slug={route.slug} />;
      case 'admin':
        return <AdminView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#D7E5F5] text-[#092147]">
      <AnnouncementBar />
      <Header />
      <div className="flex-1">{renderView()}</div>
      <Footer />
      <SearchOverlay />
      <WishlistDrawer />
      <CompareTrayAndModal />
    </div>
  );
};

export default function App() {
  return (
    <CatalogueProvider>
      <AppContent />
    </CatalogueProvider>
  );
}
