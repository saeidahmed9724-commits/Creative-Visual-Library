import React from 'react';
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

const MainLayout: React.FC = () => {
  const { activeNav, brandSubTab } = useLibrary();

  // Render the proper view based on active navigation and subtab
  const renderContent = () => {
    switch (activeNav) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <BrandHeader />
            {brandSubTab === 'overview' && <DashboardView />}
            {brandSubTab === 'brand-dna' && <BrandDnaView />}
            {brandSubTab === 'visual-directions' && <VisualDirectionsView />}
            {brandSubTab === 'references' && <AllReferencesView />}
            {brandSubTab === 'products' && <ProductsView />}
            {brandSubTab === 'creative-references' && <CreativeReferencesView />}
            {brandSubTab === 'notes' && <NotesView />}
          </div>
        );

      case 'brands':
        return <BrandsOverviewView />;

      case 'promptLibrary':
        return <PromptLibraryView />;

      case 'cameraAngles':
        return <CameraAnglesView />;

      case 'creativeReferences':
        return <CreativeReferencesView />;

      case 'allReferences':
        return <AllReferencesView />;

      case 'starred':
        return <StarredView />;

      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#050505] text-[#E0E0E0] font-sans selection:bg-violet-600 selection:text-white overflow-x-hidden relative">
      {/* Ambient atmospheric backdrop glows */}
      <div className="fixed bottom-10 right-10 w-80 h-80 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="fixed top-20 left-1/3 w-96 h-96 bg-violet-900/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative">
        <TopBar />
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full relative z-0">
          {renderContent()}
        </main>
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
