import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Brand,
  VisualDirection,
  VisualAnalysis,
  Product,
  PromptItem,
  CameraAngle,
  CreativeReference,
  ActiveNavSection,
  BrandSubTab,
  ReferenceImageItem,
} from '../types';
import {
  INITIAL_BRANDS,
  INITIAL_DIRECTIONS,
  INITIAL_ANALYSES,
  INITIAL_PRODUCTS,
  INITIAL_PROMPTS,
  INITIAL_CAMERA_ANGLES,
  INITIAL_CREATIVE_REFERENCES,
  INITIAL_GALLERY_REFERENCES,
} from '../data/initialData';
import { Language, translations } from '../i18n/translations';

interface LibraryContextType {
  // Language & Theme
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.en;
  isRTL: boolean;
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Navigation State
  activeNav: ActiveNavSection;
  setActiveNav: (nav: ActiveNavSection) => void;
  activeBrandId: string;
  setActiveBrandId: (id: string) => void;
  brandSubTab: BrandSubTab;
  setBrandSubTab: (tab: BrandSubTab) => void;
  selectedDirectionId: string | null;
  setSelectedDirectionId: (id: string | null) => void;
  selectedAnalysisId: string | null;
  setSelectedAnalysisId: (id: string | null) => void;

  // Data Collections
  brands: Brand[];
  directions: VisualDirection[];
  analyses: VisualAnalysis[];
  products: Product[];
  prompts: PromptItem[];
  cameraAngles: CameraAngle[];
  creativeReferences: CreativeReference[];
  galleryReferences: ReferenceImageItem[];

  // Active Brand Helper
  activeBrand: Brand | undefined;

  // CRUD Operations
  addBrand: (brand: Omit<Brand, 'id' | 'createdAt'>) => Brand;
  updateBrand: (id: string, updates: Partial<Brand>) => void;
  deleteBrand: (id: string) => void;
  toggleStarBrand: (id: string) => void;

  addDirection: (direction: Omit<VisualDirection, 'id' | 'createdAt'>) => VisualDirection;
  updateDirection: (id: string, updates: Partial<VisualDirection>) => void;
  deleteDirection: (id: string) => void;
  toggleStarDirection: (id: string) => void;

  addAnalysis: (analysis: Omit<VisualAnalysis, 'id' | 'createdAt'>) => VisualAnalysis;
  updateAnalysis: (id: string, updates: Partial<VisualAnalysis>) => void;
  deleteAnalysis: (id: string) => void;
  toggleStarAnalysis: (id: string) => void;

  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  addPrompt: (prompt: Omit<PromptItem, 'id' | 'createdAt'>) => PromptItem;
  updatePrompt: (id: string, updates: Partial<PromptItem>) => void;
  deletePrompt: (id: string) => void;
  toggleStarPrompt: (id: string) => void;

  addCameraAngle: (angle: Omit<CameraAngle, 'id' | 'createdAt'>) => CameraAngle;
  updateCameraAngle: (id: string, updates: Partial<CameraAngle>) => void;
  deleteCameraAngle: (id: string) => void;
  toggleStarCameraAngle: (id: string) => void;

  addCreativeReference: (ref: Omit<CreativeReference, 'id' | 'createdAt'>) => CreativeReference;
  updateCreativeReference: (id: string, updates: Partial<CreativeReference>) => void;
  deleteCreativeReference: (id: string) => void;
  toggleStarCreativeReference: (id: string) => void;

  addGalleryReference: (ref: Omit<ReferenceImageItem, 'id' | 'createdAt'>) => ReferenceImageItem;
  deleteGalleryReference: (id: string) => void;

  // Universal Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isCommandSearchOpen: boolean;
  setIsCommandSearchOpen: (open: boolean) => void;

  // Modals & Editing Items
  isImportModalOpen: boolean;
  setIsImportModalOpen: (open: boolean) => void;
  isAddBrandModalOpen: boolean;
  setIsAddBrandModalOpen: (open: boolean) => void;
  isAddDirectionModalOpen: boolean;
  setIsAddDirectionModalOpen: (open: boolean) => void;
  isAddAnalysisModalOpen: boolean;
  setIsAddAnalysisModalOpen: (open: boolean) => void;
  isAddPromptModalOpen: boolean;
  setIsAddPromptModalOpen: (open: boolean) => void;
  isAddAngleModalOpen: boolean;
  setIsAddAngleModalOpen: (open: boolean) => void;
  isAddProductModalOpen: boolean;
  setIsAddProductModalOpen: (open: boolean) => void;
  isAddCreativeRefModalOpen: boolean;
  setIsAddCreativeRefModalOpen: (open: boolean) => void;
  isBackupModalOpen: boolean;
  setIsBackupModalOpen: (open: boolean) => void;

  // Selected for Edit
  editingBrand: Brand | null;
  setEditingBrand: (brand: Brand | null) => void;
  editingDirection: VisualDirection | null;
  setEditingDirection: (dir: VisualDirection | null) => void;
  editingAnalysis: VisualAnalysis | null;
  setEditingAnalysis: (ana: VisualAnalysis | null) => void;
  editingPrompt: PromptItem | null;
  setEditingPrompt: (p: PromptItem | null) => void;
  editingAngle: CameraAngle | null;
  setEditingAngle: (a: CameraAngle | null) => void;
  editingProduct: Product | null;
  setEditingProduct: (p: Product | null) => void;
  editingCreativeRef: CreativeReference | null;
  setEditingCreativeRef: (r: CreativeReference | null) => void;

  // Export / Import / Reset
  exportLibraryJSON: () => void;
  importLibraryJSON: (jsonString: string) => boolean;
  resetToDemoData: () => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

const STORAGE_KEY = 'cvl_library_data_v1';
const LANG_STORAGE_KEY = 'cvl_language_pref';
const THEME_STORAGE_KEY = 'cvl_theme_pref';

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language & RTL
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    return saved === 'ar' ? 'ar' : 'en';
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === 'light' ? 'light' : 'dark';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(LANG_STORAGE_KEY, newLang);
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
  };

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Navigation State
  const [activeNav, setActiveNav] = useState<ActiveNavSection>('dashboard');
  const [activeBrandId, setActiveBrandId] = useState<string>('mabelle');
  const [brandSubTab, setBrandSubTab] = useState<BrandSubTab>('overview');
  const [selectedDirectionId, setSelectedDirectionId] = useState<string | null>(null);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);

  // Entities loaded from localStorage or defaults
  const [brands, setBrands] = useState<Brand[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY + '_brands');
      return stored ? JSON.parse(stored) : INITIAL_BRANDS;
    } catch {
      return INITIAL_BRANDS;
    }
  });

  const [directions, setDirections] = useState<VisualDirection[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY + '_directions');
      return stored ? JSON.parse(stored) : INITIAL_DIRECTIONS;
    } catch {
      return INITIAL_DIRECTIONS;
    }
  });

  const [analyses, setAnalyses] = useState<VisualAnalysis[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY + '_analyses');
      return stored ? JSON.parse(stored) : INITIAL_ANALYSES;
    } catch {
      return INITIAL_ANALYSES;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY + '_products');
      return stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [prompts, setPrompts] = useState<PromptItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY + '_prompts');
      return stored ? JSON.parse(stored) : INITIAL_PROMPTS;
    } catch {
      return INITIAL_PROMPTS;
    }
  });

  const [cameraAngles, setCameraAngles] = useState<CameraAngle[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY + '_angles');
      return stored ? JSON.parse(stored) : INITIAL_CAMERA_ANGLES;
    } catch {
      return INITIAL_CAMERA_ANGLES;
    }
  });

  const [creativeReferences, setCreativeReferences] = useState<CreativeReference[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY + '_cref');
      return stored ? JSON.parse(stored) : INITIAL_CREATIVE_REFERENCES;
    } catch {
      return INITIAL_CREATIVE_REFERENCES;
    }
  });

  const [galleryReferences, setGalleryReferences] = useState<ReferenceImageItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY + '_gallery');
      return stored ? JSON.parse(stored) : (INITIAL_GALLERY_REFERENCES as unknown as ReferenceImageItem[]);
    } catch {
      return INITIAL_GALLERY_REFERENCES as unknown as ReferenceImageItem[];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_brands', JSON.stringify(brands));
      localStorage.setItem(STORAGE_KEY + '_directions', JSON.stringify(directions));
      localStorage.setItem(STORAGE_KEY + '_analyses', JSON.stringify(analyses));
      localStorage.setItem(STORAGE_KEY + '_products', JSON.stringify(products));
      localStorage.setItem(STORAGE_KEY + '_prompts', JSON.stringify(prompts));
      localStorage.setItem(STORAGE_KEY + '_angles', JSON.stringify(cameraAngles));
      localStorage.setItem(STORAGE_KEY + '_cref', JSON.stringify(creativeReferences));
      localStorage.setItem(STORAGE_KEY + '_gallery', JSON.stringify(galleryReferences));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [brands, directions, analyses, products, prompts, cameraAngles, creativeReferences, galleryReferences]);

  // Search & Modals
  const [searchQuery, setSearchQuery] = useState('');
  const [isCommandSearchOpen, setIsCommandSearchOpen] = useState(false);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAddBrandModalOpen, setIsAddBrandModalOpen] = useState(false);
  const [isAddDirectionModalOpen, setIsAddDirectionModalOpen] = useState(false);
  const [isAddAnalysisModalOpen, setIsAddAnalysisModalOpen] = useState(false);
  const [isAddPromptModalOpen, setIsAddPromptModalOpen] = useState(false);
  const [isAddAngleModalOpen, setIsAddAngleModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isAddCreativeRefModalOpen, setIsAddCreativeRefModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Edit states
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [editingDirection, setEditingDirection] = useState<VisualDirection | null>(null);
  const [editingAnalysis, setEditingAnalysis] = useState<VisualAnalysis | null>(null);
  const [editingPrompt, setEditingPrompt] = useState<PromptItem | null>(null);
  const [editingAngle, setEditingAngle] = useState<CameraAngle | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCreativeRef, setEditingCreativeRef] = useState<CreativeReference | null>(null);

  // Active Brand Helper
  const activeBrand = brands.find((b) => b.id === activeBrandId) || brands[0];

  // Brand CRUD
  const addBrand = (brandData: Omit<Brand, 'id' | 'createdAt'>): Brand => {
    const newBrand: Brand = {
      ...brandData,
      id: 'brand-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setBrands((prev) => [newBrand, ...prev]);
    setActiveBrandId(newBrand.id);
    return newBrand;
  };

  const updateBrand = (id: string, updates: Partial<Brand>) => {
    setBrands((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBrand = (id: string) => {
    setBrands((prev) => prev.filter((b) => b.id !== id));
    if (activeBrandId === id) {
      const remaining = brands.filter((b) => b.id !== id);
      if (remaining.length > 0) {
        setActiveBrandId(remaining[0].id);
      }
    }
  };

  const toggleStarBrand = (id: string) => {
    setBrands((prev) => prev.map((b) => (b.id === id ? { ...b, starred: !b.starred } : b)));
  };

  // Direction CRUD
  const addDirection = (data: Omit<VisualDirection, 'id' | 'createdAt'>): VisualDirection => {
    const newDir: VisualDirection = {
      ...data,
      id: 'dir-' + Date.now(),
      createdAt: new Date().toISOString(),
      analysesCount: 0,
    };
    setDirections((prev) => [newDir, ...prev]);
    return newDir;
  };

  const updateDirection = (id: string, updates: Partial<VisualDirection>) => {
    setDirections((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  const deleteDirection = (id: string) => {
    setDirections((prev) => prev.filter((d) => d.id !== id));
    setAnalyses((prev) => prev.filter((a) => a.directionId !== id));
  };

  const toggleStarDirection = (id: string) => {
    setDirections((prev) => prev.map((d) => (d.id === id ? { ...d, starred: !d.starred } : d)));
  };

  // Analysis CRUD
  const addAnalysis = (data: Omit<VisualAnalysis, 'id' | 'createdAt'>): VisualAnalysis => {
    const newAna: VisualAnalysis = {
      ...data,
      id: 'ana-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setAnalyses((prev) => [newAna, ...prev]);
    // increment direction counter
    setDirections((prev) =>
      prev.map((d) => (d.id === data.directionId ? { ...d, analysesCount: (d.analysesCount || 0) + 1 } : d))
    );
    return newAna;
  };

  const updateAnalysis = (id: string, updates: Partial<VisualAnalysis>) => {
    setAnalyses((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const deleteAnalysis = (id: string) => {
    const target = analyses.find((a) => a.id === id);
    setAnalyses((prev) => prev.filter((a) => a.id !== id));
    if (target) {
      setDirections((prev) =>
        prev.map((d) => (d.id === target.directionId ? { ...d, analysesCount: Math.max(0, (d.analysesCount || 1) - 1) } : d))
      );
    }
  };

  const toggleStarAnalysis = (id: string) => {
    setAnalyses((prev) => prev.map((a) => (a.id === id ? { ...a, starred: !a.starred } : a)));
  };

  // Product CRUD
  const addProduct = (data: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProd: Product = {
      ...data,
      id: 'prod-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProd, ...prev]);
    return newProd;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Prompt CRUD
  const addPrompt = (data: Omit<PromptItem, 'id' | 'createdAt'>): PromptItem => {
    const newP: PromptItem = {
      ...data,
      id: 'prompt-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setPrompts((prev) => [newP, ...prev]);
    return newP;
  };

  const updatePrompt = (id: string, updates: Partial<PromptItem>) => {
    setPrompts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePrompt = (id: string) => {
    setPrompts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleStarPrompt = (id: string) => {
    setPrompts((prev) => prev.map((p) => (p.id === id ? { ...p, starred: !p.starred } : p)));
  };

  // Camera Angle CRUD
  const addCameraAngle = (data: Omit<CameraAngle, 'id' | 'createdAt'>): CameraAngle => {
    const newAngle: CameraAngle = {
      ...data,
      id: 'angle-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setCameraAngles((prev) => [newAngle, ...prev]);
    return newAngle;
  };

  const updateCameraAngle = (id: string, updates: Partial<CameraAngle>) => {
    setCameraAngles((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const deleteCameraAngle = (id: string) => {
    setCameraAngles((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleStarCameraAngle = (id: string) => {
    setCameraAngles((prev) => prev.map((a) => (a.id === id ? { ...a, starred: !a.starred } : a)));
  };

  // Creative Reference CRUD
  const addCreativeReference = (data: Omit<CreativeReference, 'id' | 'createdAt'>): CreativeReference => {
    const newRef: CreativeReference = {
      ...data,
      id: 'cref-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setCreativeReferences((prev) => [newRef, ...prev]);
    return newRef;
  };

  const updateCreativeReference = (id: string, updates: Partial<CreativeReference>) => {
    setCreativeReferences((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const deleteCreativeReference = (id: string) => {
    setCreativeReferences((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleStarCreativeReference = (id: string) => {
    setCreativeReferences((prev) => prev.map((r) => (r.id === id ? { ...r, starred: !r.starred } : r)));
  };

  // Gallery Reference CRUD
  const addGalleryReference = (data: Omit<ReferenceImageItem, 'id' | 'createdAt'>): ReferenceImageItem => {
    const newRef: ReferenceImageItem = {
      ...data,
      id: 'ref-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setGalleryReferences((prev) => [newRef, ...prev]);
    return newRef;
  };

  const deleteGalleryReference = (id: string) => {
    setGalleryReferences((prev) => prev.filter((r) => r.id !== id));
  };

  // Export JSON
  const exportLibraryJSON = () => {
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      appName: 'Creative Visual Library',
      brands,
      directions,
      analyses,
      products,
      prompts,
      cameraAngles,
      creativeReferences,
      galleryReferences,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CVL-Backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const importLibraryJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.brands && Array.isArray(data.brands)) {
        setBrands(data.brands);
      }
      if (data.directions && Array.isArray(data.directions)) {
        setDirections(data.directions);
      }
      if (data.analyses && Array.isArray(data.analyses)) {
        setAnalyses(data.analyses);
      }
      if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
      }
      if (data.prompts && Array.isArray(data.prompts)) {
        setPrompts(data.prompts);
      }
      if (data.cameraAngles && Array.isArray(data.cameraAngles)) {
        setCameraAngles(data.cameraAngles);
      }
      if (data.creativeReferences && Array.isArray(data.creativeReferences)) {
        setCreativeReferences(data.creativeReferences);
      }
      if (data.galleryReferences && Array.isArray(data.galleryReferences)) {
        setGalleryReferences(data.galleryReferences);
      }
      return true;
    } catch (err) {
      console.error('Import failed', err);
      return false;
    }
  };

  // Reset to Demo Data
  const resetToDemoData = () => {
    setBrands(INITIAL_BRANDS);
    setDirections(INITIAL_DIRECTIONS);
    setAnalyses(INITIAL_ANALYSES);
    setProducts(INITIAL_PRODUCTS);
    setPrompts(INITIAL_PROMPTS);
    setCameraAngles(INITIAL_CAMERA_ANGLES);
    setCreativeReferences(INITIAL_CREATIVE_REFERENCES);
    setGalleryReferences(INITIAL_GALLERY_REFERENCES as unknown as ReferenceImageItem[]);
    setActiveBrandId('mabelle');
  };

  const t = translations[lang];
  const isRTL = lang === 'ar';

  return (
    <LibraryContext.Provider
      value={{
        lang,
        setLang,
        t,
        isRTL,
        theme,
        toggleTheme,

        activeNav,
        setActiveNav,
        activeBrandId,
        setActiveBrandId,
        brandSubTab,
        setBrandSubTab,
        selectedDirectionId,
        setSelectedDirectionId,
        selectedAnalysisId,
        setSelectedAnalysisId,

        brands,
        directions,
        analyses,
        products,
        prompts,
        cameraAngles,
        creativeReferences,
        galleryReferences,

        activeBrand,

        addBrand,
        updateBrand,
        deleteBrand,
        toggleStarBrand,

        addDirection,
        updateDirection,
        deleteDirection,
        toggleStarDirection,

        addAnalysis,
        updateAnalysis,
        deleteAnalysis,
        toggleStarAnalysis,

        addProduct,
        updateProduct,
        deleteProduct,

        addPrompt,
        updatePrompt,
        deletePrompt,
        toggleStarPrompt,

        addCameraAngle,
        updateCameraAngle,
        deleteCameraAngle,
        toggleStarCameraAngle,

        addCreativeReference,
        updateCreativeReference,
        deleteCreativeReference,
        toggleStarCreativeReference,

        addGalleryReference,
        deleteGalleryReference,

        searchQuery,
        setSearchQuery,
        isCommandSearchOpen,
        setIsCommandSearchOpen,

        isImportModalOpen,
        setIsImportModalOpen,
        isAddBrandModalOpen,
        setIsAddBrandModalOpen,
        isAddDirectionModalOpen,
        setIsAddDirectionModalOpen,
        isAddAnalysisModalOpen,
        setIsAddAnalysisModalOpen,
        isAddPromptModalOpen,
        setIsAddPromptModalOpen,
        isAddAngleModalOpen,
        setIsAddAngleModalOpen,
        isAddProductModalOpen,
        setIsAddProductModalOpen,
        isAddCreativeRefModalOpen,
        setIsAddCreativeRefModalOpen,
        isBackupModalOpen,
        setIsBackupModalOpen,

        editingBrand,
        setEditingBrand,
        editingDirection,
        setEditingDirection,
        editingAnalysis,
        setEditingAnalysis,
        editingPrompt,
        setEditingPrompt,
        editingAngle,
        setEditingAngle,
        editingProduct,
        setEditingProduct,
        editingCreativeRef,
        setEditingCreativeRef,

        exportLibraryJSON,
        importLibraryJSON,
        resetToDemoData,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
