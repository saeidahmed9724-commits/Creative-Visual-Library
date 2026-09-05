import React, { useEffect } from 'react';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { BrandHeader } from './components/BrandHeader';

// Views
import { DashboardView } from './components/views/DashboardView';
import { BrandDnaView } from './components/views/BrandDnaView';
import { VisualDirectionsView } from './components/views/VisualDirectionsView';
import { PromptLibraryView } from './components/views/PromptLibraryView';
import { CameraAnglesView } from './components/views/CameraAnglesView';
import { CreativeReferencesView } from './components/views/CreativeReferencesView';
import { AllReferencesView } from './components/views/AllReferencesView';
import { ProductsView } from './components/views/ProductsView';
import { StarredView } from './components/views/StarredView';
import { BrandsOverviewView } from './components/views/BrandsOverviewView';
import { NotesView } from './components/views/NotesView';
import { RecentlyUsedView } from './components/views/RecentlyUsedView';
import { TrashView } from './components/views/TrashView';

// Modals
import { ImportAnalysisModal } from './components/modals/ImportAnalysisModal';
import { CommandSearchModal } from './components/modals/CommandSearchModal';
import { BrandModal } from './components/modals/BrandModal';
import { DirectionModal } from './components/modals/DirectionModal';
import { AnalysisModal } from './components/modals/AnalysisModal';
import { PromptModal } from './components/modals/PromptModal';
import { CameraAngleModal } from './components/modals/CameraAngleModal';
import { ProductModal } from './components/modals/ProductModal';
import { CreativeRefModal } from './components/modals/CreativeRefModal';
import { SupabaseModal } from './components/modals/SupabaseModal';
import { BackupModal } from './components/modals/BackupModal';

const MainLayout: React.FC = () => {
  const { activeNav, setActiveNav, brandSubTab, activeBrand, isSidebarOpen, setIsSidebarOpen, setIsBackupModalOpen } = useLibrary();

  // Escape closes the mobile sidebar (⌘K search shortcut lives in TopBar)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSidebarOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setIsSidebarOpen]);

  // 'settings' nav → open the Settings & Backup modal and go back to the dashboard
  useEffect(() => {
    if (activeNav === 'settings') {
      setIsBackupModalOpen(true);
      setActiveNav('dashboard');
    }
  }, [activeNav, setIsBackupModalOpen, setActiveNav]);

  // Lock body scroll when the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  const renderContent = () => {
    switch (activeNav) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <BrandHeader />
            {brandSubTab === 'overview' && <DashboardView />}
            {brandSubTab === 'brand-dna' && <BrandDnaView key={activeBrand?.id || 'none'} />}
            {brandSubTab === 'visual-directions' && <VisualDirectionsView />}
            {brandSubTab === 'references' && <AllReferencesView />}
            {brandSubTab === 'products' && <ProductsView />}
            {brandSubTab === 'creative-references' && <CreativeReferencesView />}
            {brandSubTab === 'notes' && <NotesView key={activeBrand?.id || 'none'} />}
          </div>
        );

      case 'brands':
        return <BrandsOverviewView />;

      case 'brand-dna':
        return (
          <div className="space-y-6">
            <BrandHeader />
            <BrandDnaView key={activeBrand?.id || 'none'} />
          </div>
        );

      case 'visual-directions':
      case 'analyses':
        return (
          <div className="space-y-6">
            <BrandHeader />
            <VisualDirectionsView />
          </div>
        );

      case 'promptLibrary':
      case 'prompt-library':
        return <PromptLibraryView />;

      case 'cameraAngles':
      case 'camera-angles':
        return <CameraAnglesView />;

      case 'creativeReferences':
      case 'creative-references':
        return <CreativeReferencesView />;

      case 'allReferences':
      case 'all-references':
        return <AllReferencesView />;

      case 'products':
        return <ProductsView />;

      case 'starred':
        return <StarredView />;

      case 'recentlyUsed':
      case 'recently-used':
        return <RecentlyUsedView />;

      case 'trash':
        return <TrashView />;

      case 'settings':
      default:
        return (
          <div className="space-y-6">
            <BrandHeader />
            <DashboardView />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-[#050505] text-[#E0E0E0] font-sans selection:bg-violet-600 selection:text-white relative">
      {/* Ambient atmospheric backdrop glows */}
      <div className="fixed bottom-10 right-10 w-80 h-80 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed top-20 left-1/3 w-96 h-96 bg-violet-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Mobile drawer backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar navigation (drawer on mobile, sticky column on desktop) */}
      <Sidebar />

      {/* Main viewport */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <TopBar />
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full relative z-0">{renderContent()}</main>
      </div>

      {/* Global Modals */}
      <ImportAnalysisModal />
      <CommandSearchModal />
      <BrandModal />
      <DirectionModal />
      <AnalysisModal />
      <PromptModal />
      <CameraAngleModal />
      <ProductModal />
      <CreativeRefModal />
      <SupabaseModal />
      <BackupModal />
    </div>
  );
};

export default function App() {
  return (
    <LibraryProvider>
      <MainLayout />
    </LibraryProvider>
  );
}
