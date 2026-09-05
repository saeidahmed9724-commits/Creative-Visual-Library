import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  TrashItem,
  TrashItemType,
  LibrarySnapshot,
} from '../types';
import { INITIAL_CAMERA_ANGLES, INITIAL_CREATIVE_REFERENCES } from '../data/initialData';
import { Language, translations } from '../i18n/translations';
import {
  isSupabaseConfigured,
  fetchBrandsFromSupabase,
  insertBrandToSupabase,
  updateBrandInSupabase,
  deleteBrandFromSupabase,
  testSupabaseConnection,
  fetchLibrarySnapshot,
  saveLibrarySnapshot,
} from '../lib/supabase';

export type CloudSyncState = 'idle' | 'syncing' | 'synced' | 'unavailable' | 'error';

interface LibraryContextType {
  // Language & Theme
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.en;
  isRTL: boolean;
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Layout
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;

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
  trash: TrashItem[];

  // Active Brand Helper
  activeBrand: Brand | undefined;

  // CRUD Operations
  addBrand: (brand: Omit<Brand, 'id' | 'createdAt'>) => Promise<Brand>;
  updateBrand: (id: string, updates: Partial<Brand>) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;
  toggleStarBrand: (id: string) => void;
  syncBrandToSupabase: (id: string) => Promise<boolean>;
  isBrandSavedInSupabase: (id: string) => boolean;
  supabaseBrandIds: Set<string>;
  isSyncingBrandId: string | null;

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

  // Trash
  restoreFromTrash: (trashId: string) => void;
  purgeTrashItem: (trashId: string) => void;
  emptyTrash: () => void;

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
  lastSavedAt: string | null;

  // Supabase Integration
  isSupabaseModalOpen: boolean;
  setIsSupabaseModalOpen: (open: boolean) => void;
  isSupabaseConfigured: boolean;
  isSupabaseSyncing: boolean;
  supabaseStatus: { connected: boolean; message: string; tableExists: boolean } | null;
  syncWithSupabase: () => Promise<void>;
  pushBrandsToSupabase: () => Promise<{ success: number; failed: number }>;
  checkSupabaseHealth: () => Promise<{ connected: boolean; message: string; tableExists: boolean }>;
  cloudSyncState: CloudSyncState;
  pushLibraryToCloud: () => Promise<boolean>;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

const STORAGE_KEY = 'cvl_library_v2';
const STORAGE_SAVED_AT_KEY = 'cvl_library_v2_saved_at';
const LEGACY_STORAGE_KEY = 'cvl_library_data_v1';
const LANG_STORAGE_KEY = 'cvl_language_pref';
const THEME_STORAGE_KEY = 'cvl_theme_pref';

const EMPTY_BRAND_CORE: Brand['brandCore'] = {
  personality: '',
  positioning: '',
  generalVisualIdentity: '',
  generalColors: '',
  typography: '',
  materials: '',
  generalPhotographyPrinciples: '',
  thingsToAvoid: '',
  notes: '',
};

const nowISO = () => new Date().toISOString();
const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

/* ------------------------------------------------------------------ */
/*  Local persistence helpers                                          */
/* ------------------------------------------------------------------ */

interface PersistedLibrary {
  brands: Brand[];
  directions: VisualDirection[];
  analyses: VisualAnalysis[];
  products: Product[];
  prompts: PromptItem[];
  cameraAngles: CameraAngle[];
  creativeReferences: CreativeReference[];
  galleryReferences: ReferenceImageItem[];
  trash: TrashItem[];
  activeBrandId: string;
}

const asArray = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

function normalizeSnapshot(raw: any, fallbackSeed = false): PersistedLibrary {
  const hasCamera = Array.isArray(raw?.cameraAngles);
  const hasCref = Array.isArray(raw?.creativeReferences);
  return {
    brands: asArray<Brand>(raw?.brands).map((b) => ({
      ...b,
      brandColors: Array.isArray(b.brandColors) ? b.brandColors : [],
      brandCore: { ...EMPTY_BRAND_CORE, ...(b.brandCore || {}) },
    })),
    directions: asArray<VisualDirection>(raw?.directions),
    analyses: asArray<VisualAnalysis>(raw?.analyses),
    products: asArray<Product>(raw?.products),
    prompts: asArray<PromptItem>(raw?.prompts),
    cameraAngles: hasCamera ? raw.cameraAngles : fallbackSeed ? INITIAL_CAMERA_ANGLES : [],
    creativeReferences: hasCref ? raw.creativeReferences : fallbackSeed ? INITIAL_CREATIVE_REFERENCES : [],
    galleryReferences: asArray<ReferenceImageItem>(raw?.galleryReferences),
    trash: asArray<TrashItem>(raw?.trash),
    activeBrandId: typeof raw?.activeBrandId === 'string' ? raw.activeBrandId : '',
  };
}

function loadLocalLibrary(): PersistedLibrary {
  if (typeof window === 'undefined') return normalizeSnapshot(null, true);
  try {
    const rawV2 = localStorage.getItem(STORAGE_KEY);
    if (rawV2) return normalizeSnapshot(JSON.parse(rawV2), true);
    const rawV1 = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (rawV1) return normalizeSnapshot(JSON.parse(rawV1), true);
  } catch (err) {
    console.warn('Failed to read local library, starting fresh:', err);
  }
  return normalizeSnapshot(null, true);
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

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
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  // Layout
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Navigation State
  const [activeNav, setActiveNavState] = useState<ActiveNavSection>('dashboard');
  const [brandSubTab, setBrandSubTab] = useState<BrandSubTab>('overview');
  const [selectedDirectionId, setSelectedDirectionId] = useState<string | null>(null);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);

  const setActiveNav = useCallback((nav: ActiveNavSection) => {
    setActiveNavState(nav);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0 });
  }, []);

  // Entities — loaded from local storage (persisted), merged with Supabase when available.
  const initial = useMemo(loadLocalLibrary, []);
  const [brands, setBrands] = useState<Brand[]>(initial.brands);
  const [directions, setDirections] = useState<VisualDirection[]>(initial.directions);
  const [analyses, setAnalyses] = useState<VisualAnalysis[]>(initial.analyses);
  const [products, setProducts] = useState<Product[]>(initial.products);
  const [prompts, setPrompts] = useState<PromptItem[]>(initial.prompts);
  const [cameraAngles, setCameraAngles] = useState<CameraAngle[]>(initial.cameraAngles);
  const [creativeReferences, setCreativeReferences] = useState<CreativeReference[]>(initial.creativeReferences);
  const [galleryReferences, setGalleryReferences] = useState<ReferenceImageItem[]>(initial.galleryReferences);
  const [trash, setTrash] = useState<TrashItem[]>(initial.trash);
  const [activeBrandId, setActiveBrandId] = useState<string>(initial.activeBrandId);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(() => localStorage.getItem(STORAGE_SAVED_AT_KEY));

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
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isSupabaseSyncing, setIsSupabaseSyncing] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<{ connected: boolean; message: string; tableExists: boolean } | null>(null);
  const [supabaseBrandIds, setSupabaseBrandIds] = useState<Set<string>>(new Set());
  const [isSyncingBrandId, setIsSyncingBrandId] = useState<string | null>(null);
  const [cloudSyncState, setCloudSyncState] = useState<CloudSyncState>(isSupabaseConfigured ? 'idle' : 'unavailable');

  // Edit states
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [editingDirection, setEditingDirection] = useState<VisualDirection | null>(null);
  const [editingAnalysis, setEditingAnalysis] = useState<VisualAnalysis | null>(null);
  const [editingPrompt, setEditingPrompt] = useState<PromptItem | null>(null);
  const [editingAngle, setEditingAngle] = useState<CameraAngle | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCreativeRef, setEditingCreativeRef] = useState<CreativeReference | null>(null);

  /* ---------------------------- snapshot helpers ---------------------------- */

  const buildSnapshot = useCallback((): LibrarySnapshot => ({
    version: '2.0',
    exportedAt: nowISO(),
    appName: 'Creative Visual Library',
    brands,
    directions,
    analyses,
    products,
    prompts,
    cameraAngles,
    creativeReferences,
    galleryReferences,
    trash,
    activeBrandId,
  }), [brands, directions, analyses, products, prompts, cameraAngles, creativeReferences, galleryReferences, trash, activeBrandId]);

  const applySnapshot = useCallback((raw: unknown, seed = false) => {
    const snap = normalizeSnapshot(raw, seed);
    setBrands(snap.brands);
    setDirections(snap.directions);
    setAnalyses(snap.analyses);
    setProducts(snap.products);
    setPrompts(snap.prompts);
    setCameraAngles(snap.cameraAngles);
    setCreativeReferences(snap.creativeReferences);
    setGalleryReferences(snap.galleryReferences);
    setTrash(snap.trash);
    setActiveBrandId((curr) => {
      if (curr && snap.brands.some((b) => b.id === curr)) return curr;
      if (snap.activeBrandId && snap.brands.some((b) => b.id === snap.activeBrandId)) return snap.activeBrandId;
      return snap.brands[0]?.id || '';
    });
  }, []);

  /* --------------------------- local auto-persist --------------------------- */

  const hydratedRef = useRef(false);
  const brandsRef = useRef<Brand[]>(brands);
  useEffect(() => {
    brandsRef.current = brands;
  }, [brands]);
  const skipNextCloudPushRef = useRef(false);
  const cloudTimerRef = useRef<number | null>(null);
  const cloudAvailableRef = useRef<boolean>(false);

  useEffect(() => {
    if (!hydratedRef.current) {
      hydratedRef.current = true;
      return;
    }
    const snapshot = buildSnapshot();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      localStorage.setItem(STORAGE_SAVED_AT_KEY, snapshot.exportedAt);
      setLastSavedAt(snapshot.exportedAt);
    } catch (err) {
      console.warn('Failed to persist library locally (quota?):', err);
    }

    // Debounced push to cloud
    if (skipNextCloudPushRef.current) {
      skipNextCloudPushRef.current = false;
      return;
    }
    if (!isSupabaseConfigured || !cloudAvailableRef.current) return;
    if (cloudTimerRef.current) window.clearTimeout(cloudTimerRef.current);
    cloudTimerRef.current = window.setTimeout(async () => {
      setCloudSyncState('syncing');
      const res = await saveLibrarySnapshot(snapshot);
      if (res.ok) setCloudSyncState('synced');
      else if (res.missingTable) {
        cloudAvailableRef.current = false;
        setCloudSyncState('unavailable');
      } else setCloudSyncState('error');
    }, 1500);
    return () => {
      if (cloudTimerRef.current) window.clearTimeout(cloudTimerRef.current);
    };
  }, [buildSnapshot]);

  const pushLibraryToCloud = async (): Promise<boolean> => {
    if (!isSupabaseConfigured) return false;
    setCloudSyncState('syncing');
    const res = await saveLibrarySnapshot(buildSnapshot());
    if (res.ok) {
      cloudAvailableRef.current = true;
      setCloudSyncState('synced');
      return true;
    }
    setCloudSyncState(res.missingTable ? 'unavailable' : 'error');
    return false;
  };

  /* ------------------------------ supabase sync ----------------------------- */

  const isBrandSavedInSupabase = (id: string): boolean => supabaseBrandIds.has(id);

  const checkSupabaseHealth = async () => {
    const status = await testSupabaseConnection();
    setSupabaseStatus(status);
    return status;
  };

  /**
   * Merge remote brand rows into local brands WITHOUT losing local rich data.
   * - Remote rows that exist locally: mark as saved, fill missing cover image.
   * - Remote rows unknown locally: create a brand skeleton.
   * - Local brands not in remote: kept (marked as local-only).
   */
  const mergeRemoteBrands = (local: Brand[], remote: { id: string; name: string; image_url: string | null; created_at: string }[]): Brand[] => {
    const remoteMap = new Map(remote.map((r) => [r.id, r]));
    const merged: Brand[] = local.map((b) => {
      const r = remoteMap.get(b.id);
      if (!r) return { ...b, isSavedInSupabase: false };
      return {
        ...b,
        name: b.name || r.name,
        coverImage: b.coverImage || r.image_url || '',
        isSavedInSupabase: true,
        lastSyncedAt: nowISO(),
      };
    });
    const localIds = new Set(local.map((b) => b.id));
    for (const r of remote) {
      if (localIds.has(r.id)) continue;
      merged.push({
        id: r.id,
        name: r.name,
        category: 'Brand',
        founded: r.created_at ? new Date(r.created_at).getFullYear().toString() : new Date().getFullYear().toString(),
        personality: '',
        visualStyle: '',
        description: '',
        coverImage: r.image_url || '',
        brandColors: ['#7C3AED', '#0A0A0A', '#FFFFFF'],
        brandCore: { ...EMPTY_BRAND_CORE },
        createdAt: r.created_at || nowISO(),
        isSavedInSupabase: true,
        lastSyncedAt: nowISO(),
      });
    }
    return merged;
  };

  const syncWithSupabase = async () => {
    if (!isSupabaseConfigured) return;
    setIsSupabaseSyncing(true);
    try {
      const status = await testSupabaseConnection();
      setSupabaseStatus(status);
      if (!status.connected) return;

      // 1) Full library snapshot (optional table)
      let baseBrands: Brand[] = brandsRef.current;
      const snap = await fetchLibrarySnapshot();
      if (snap.status === 'ok') {
        cloudAvailableRef.current = true;
        const localSavedAt = localStorage.getItem(STORAGE_SAVED_AT_KEY);
        if (snap.row && snap.row.data && (!localSavedAt || new Date(snap.row.updated_at) > new Date(localSavedAt))) {
          skipNextCloudPushRef.current = true;
          applySnapshot(snap.row.data, false);
          baseBrands = normalizeSnapshot(snap.row.data).brands;
        } else {
          // Local is newer or remote empty → push local
          const res = await saveLibrarySnapshot(buildSnapshot());
          if (!res.ok && res.missingTable) cloudAvailableRef.current = false;
        }
        setCloudSyncState(cloudAvailableRef.current ? 'synced' : 'unavailable');
      } else if (snap.status === 'missing-table') {
        cloudAvailableRef.current = false;
        setCloudSyncState('unavailable');
      } else {
        setCloudSyncState('error');
      }

      // 2) Brands table (merge, never overwrite)
      if (status.tableExists) {
        const remoteBrands = await fetchBrandsFromSupabase();
        if (remoteBrands) {
          const remoteIds = new Set(remoteBrands.map((rb) => rb.id));
          setSupabaseBrandIds(remoteIds);
          const merged = mergeRemoteBrands(baseBrands, remoteBrands);
          setBrands(merged);
          setActiveBrandId((curr) => (curr && merged.some((b) => b.id === curr) ? curr : merged[0]?.id || ''));
        }
      }
    } catch (err) {
      console.error('Failed to sync with Supabase:', err);
      setCloudSyncState('error');
    } finally {
      setIsSupabaseSyncing(false);
    }
  };

  const pushBrandsToSupabase = async (): Promise<{ success: number; failed: number }> => {
    if (!isSupabaseConfigured) return { success: 0, failed: 0 };
    let success = 0;
    let failed = 0;
    const newSyncedIds = new Set(supabaseBrandIds);
    for (const b of brands) {
      const res = await insertBrandToSupabase({
        id: b.id,
        name: b.name,
        image_url: b.coverImage || '',
        created_at: b.createdAt,
      });
      if (res) {
        success++;
        newSyncedIds.add(b.id);
      } else {
        failed++;
      }
    }
    setSupabaseBrandIds(newSyncedIds);
    setBrands((prev) =>
      prev.map((b) => (newSyncedIds.has(b.id) ? { ...b, isSavedInSupabase: true, lastSyncedAt: nowISO() } : b))
    );
    await pushLibraryToCloud();
    return { success, failed };
  };

  const syncBrandToSupabase = async (id: string): Promise<boolean> => {
    const brand = brands.find((b) => b.id === id);
    if (!brand || !isSupabaseConfigured) return false;
    setIsSyncingBrandId(id);
    try {
      const res = await insertBrandToSupabase({
        id: brand.id,
        name: brand.name,
        image_url: brand.coverImage || '',
        created_at: brand.createdAt || nowISO(),
      });
      if (res) {
        setSupabaseBrandIds((prev) => new Set([...prev, id]));
        setBrands((prev) => prev.map((b) => (b.id === id ? { ...b, isSavedInSupabase: true, lastSyncedAt: nowISO() } : b)));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to sync brand to Supabase:', err);
      return false;
    } finally {
      setIsSyncingBrandId(null);
    }
  };

  // Sync on startup if configured
  useEffect(() => {
    if (isSupabaseConfigured) {
      syncWithSupabase();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep activeBrandId valid
  useEffect(() => {
    if (brands.length === 0) {
      if (activeBrandId) setActiveBrandId('');
      return;
    }
    if (!activeBrandId || !brands.some((b) => b.id === activeBrandId)) {
      setActiveBrandId(brands[0].id);
    }
  }, [brands, activeBrandId]);

  const activeBrand = brands.find((b) => b.id === activeBrandId) || brands[0];

  /* ------------------------------ trash helpers ----------------------------- */

  const pushToTrash = (type: TrashItemType, title: string, payload: unknown, children?: TrashItem['children']) => {
    const item: TrashItem = { id: uid('trash'), type, title, deletedAt: nowISO(), payload, children };
    setTrash((prev) => [item, ...prev].slice(0, 200));
  };

  const restoreFromTrash = (trashId: string) => {
    const item = trash.find((t) => t.id === trashId);
    if (!item) return;
    const restoreOne = (type: TrashItemType, payload: any) => {
      switch (type) {
        case 'brand':
          setBrands((prev) => (prev.some((b) => b.id === payload.id) ? prev : [payload, ...prev]));
          break;
        case 'direction':
          setDirections((prev) => (prev.some((d) => d.id === payload.id) ? prev : [payload, ...prev]));
          break;
        case 'analysis':
          setAnalyses((prev) => (prev.some((a) => a.id === payload.id) ? prev : [payload, ...prev]));
          break;
        case 'product':
          setProducts((prev) => (prev.some((p) => p.id === payload.id) ? prev : [payload, ...prev]));
          break;
        case 'prompt':
          setPrompts((prev) => (prev.some((p) => p.id === payload.id) ? prev : [payload, ...prev]));
          break;
        case 'cameraAngle':
          setCameraAngles((prev) => (prev.some((a) => a.id === payload.id) ? prev : [payload, ...prev]));
          break;
        case 'creativeReference':
          setCreativeReferences((prev) => (prev.some((r) => r.id === payload.id) ? prev : [payload, ...prev]));
          break;
        case 'galleryReference':
          setGalleryReferences((prev) => (prev.some((r) => r.id === payload.id) ? prev : [payload, ...prev]));
          break;
      }
    };
    restoreOne(item.type, item.payload);
    item.children?.forEach((group) => group.items.forEach((child) => restoreOne(group.type, child)));
    if (item.type === 'brand') {
      const b = item.payload as Brand;
      setActiveBrandId(b.id);
      if (isSupabaseConfigured) {
        insertBrandToSupabase({ id: b.id, name: b.name, image_url: b.coverImage || '', created_at: b.createdAt }).catch(() => undefined);
      }
    }
    setTrash((prev) => prev.filter((t) => t.id !== trashId));
  };

  const purgeTrashItem = (trashId: string) => setTrash((prev) => prev.filter((t) => t.id !== trashId));
  const emptyTrash = () => setTrash([]);

  /* -------------------------------- Brand CRUD ------------------------------ */

  const addBrand = async (brandData: Omit<Brand, 'id' | 'createdAt'>): Promise<Brand> => {
    const newId = uid('brand');
    let savedInSupabase = false;

    if (isSupabaseConfigured) {
      try {
        const res = await insertBrandToSupabase({
          id: newId,
          name: brandData.name,
          image_url: brandData.coverImage || '',
          created_at: nowISO(),
        });
        if (res) {
          savedInSupabase = true;
          setSupabaseBrandIds((prev) => new Set([...prev, newId]));
        }
      } catch (e) {
        console.warn('Supabase brand insert error:', e);
      }
    }

    const newBrand: Brand = {
      ...brandData,
      brandCore: { ...EMPTY_BRAND_CORE, ...(brandData.brandCore || {}) },
      brandColors: brandData.brandColors || [],
      id: newId,
      createdAt: nowISO(),
      updatedAt: nowISO(),
      isSavedInSupabase: savedInSupabase,
      lastSyncedAt: savedInSupabase ? nowISO() : undefined,
    };

    setBrands((prev) => [newBrand, ...prev]);
    setActiveBrandId(newBrand.id);
    return newBrand;
  };

  const updateBrand = async (id: string, updates: Partial<Brand>): Promise<void> => {
    // Optimistic local update first so the UI never waits on the network
    setBrands((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates, updatedAt: nowISO() } : b)));

    if (isSupabaseConfigured && (updates.name !== undefined || updates.coverImage !== undefined)) {
      try {
        const payload: { name?: string; image_url?: string } = {};
        if (updates.name !== undefined) payload.name = updates.name;
        if (updates.coverImage !== undefined) payload.image_url = updates.coverImage;
        const res = await updateBrandInSupabase(id, payload);
        if (res) {
          setSupabaseBrandIds((prev) => new Set([...prev, id]));
          setBrands((prev) => prev.map((b) => (b.id === id ? { ...b, isSavedInSupabase: true, lastSyncedAt: nowISO() } : b)));
        }
      } catch (e) {
        console.warn('Supabase brand update error:', e);
      }
    }
  };

  const deleteBrand = async (id: string): Promise<void> => {
    const brand = brands.find((b) => b.id === id);
    if (!brand) return;

    const childDirections = directions.filter((d) => d.brandId === id);
    const childAnalyses = analyses.filter((a) => a.brandId === id);
    const childProducts = products.filter((p) => p.brandId === id);
    pushToTrash('brand', brand.name, brand, [
      { type: 'direction', items: childDirections },
      { type: 'analysis', items: childAnalyses },
      { type: 'product', items: childProducts },
    ]);

    if (isSupabaseConfigured) {
      try {
        await deleteBrandFromSupabase(id);
      } catch (e) {
        console.warn('Supabase brand delete error:', e);
      }
    }

    setSupabaseBrandIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

    setBrands((prev) => prev.filter((b) => b.id !== id));
    setDirections((prev) => prev.filter((d) => d.brandId !== id));
    setAnalyses((prev) => prev.filter((a) => a.brandId !== id));
    setProducts((prev) => prev.filter((p) => p.brandId !== id));
    if (activeBrandId === id) {
      const remaining = brands.filter((b) => b.id !== id);
      setActiveBrandId(remaining[0]?.id || '');
    }
  };

  const toggleStarBrand = (id: string) => {
    setBrands((prev) => prev.map((b) => (b.id === id ? { ...b, starred: !b.starred } : b)));
  };

  /* ------------------------------ Direction CRUD ---------------------------- */

  const addDirection = (data: Omit<VisualDirection, 'id' | 'createdAt'>): VisualDirection => {
    const newDir: VisualDirection = { ...data, id: uid('dir'), createdAt: nowISO(), updatedAt: nowISO(), analysesCount: 0 };
    setDirections((prev) => [newDir, ...prev]);
    return newDir;
  };

  const updateDirection = (id: string, updates: Partial<VisualDirection>) => {
    setDirections((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates, updatedAt: nowISO() } : d)));
  };

  const deleteDirection = (id: string) => {
    const dir = directions.find((d) => d.id === id);
    if (!dir) return;
    const childAnalyses = analyses.filter((a) => a.directionId === id);
    pushToTrash('direction', dir.name, dir, [{ type: 'analysis', items: childAnalyses }]);
    setDirections((prev) => prev.filter((d) => d.id !== id));
    setAnalyses((prev) => prev.filter((a) => a.directionId !== id));
    if (selectedDirectionId === id) setSelectedDirectionId(null);
  };

  const toggleStarDirection = (id: string) => {
    setDirections((prev) => prev.map((d) => (d.id === id ? { ...d, starred: !d.starred } : d)));
  };

  /* ------------------------------ Analysis CRUD ----------------------------- */

  const addAnalysis = (data: Omit<VisualAnalysis, 'id' | 'createdAt'>): VisualAnalysis => {
    const newAna: VisualAnalysis = { ...data, id: uid('ana'), createdAt: nowISO(), updatedAt: nowISO() };
    setAnalyses((prev) => [newAna, ...prev]);
    setDirections((prev) =>
      prev.map((d) => (d.id === data.directionId ? { ...d, analysesCount: (d.analysesCount || 0) + 1 } : d))
    );
    return newAna;
  };

  const updateAnalysis = (id: string, updates: Partial<VisualAnalysis>) => {
    setAnalyses((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates, updatedAt: nowISO() } : a)));
  };

  const deleteAnalysis = (id: string) => {
    const target = analyses.find((a) => a.id === id);
    if (!target) return;
    pushToTrash('analysis', target.title, target);
    setAnalyses((prev) => prev.filter((a) => a.id !== id));
    setDirections((prev) =>
      prev.map((d) => (d.id === target.directionId ? { ...d, analysesCount: Math.max(0, (d.analysesCount || 1) - 1) } : d))
    );
    if (selectedAnalysisId === id) setSelectedAnalysisId(null);
  };

  const toggleStarAnalysis = (id: string) => {
    setAnalyses((prev) => prev.map((a) => (a.id === id ? { ...a, starred: !a.starred } : a)));
  };

  /* ------------------------------- Product CRUD ----------------------------- */

  const addProduct = (data: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProd: Product = { ...data, id: uid('prod'), createdAt: nowISO(), updatedAt: nowISO() };
    setProducts((prev) => [newProd, ...prev]);
    return newProd;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: nowISO() } : p)));
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    pushToTrash('product', target.name, target);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  /* -------------------------------- Prompt CRUD ----------------------------- */

  const addPrompt = (data: Omit<PromptItem, 'id' | 'createdAt'>): PromptItem => {
    const newP: PromptItem = { ...data, id: uid('prompt'), createdAt: nowISO(), updatedAt: nowISO() };
    setPrompts((prev) => [newP, ...prev]);
    return newP;
  };

  const updatePrompt = (id: string, updates: Partial<PromptItem>) => {
    setPrompts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: nowISO() } : p)));
  };

  const deletePrompt = (id: string) => {
    const target = prompts.find((p) => p.id === id);
    if (!target) return;
    pushToTrash('prompt', target.name, target);
    setPrompts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleStarPrompt = (id: string) => {
    setPrompts((prev) => prev.map((p) => (p.id === id ? { ...p, starred: !p.starred } : p)));
  };

  /* ----------------------------- Camera Angle CRUD -------------------------- */

  const addCameraAngle = (data: Omit<CameraAngle, 'id' | 'createdAt'>): CameraAngle => {
    const newAngle: CameraAngle = { ...data, tags: data.tags || [], id: uid('angle'), createdAt: nowISO(), updatedAt: nowISO() };
    setCameraAngles((prev) => [newAngle, ...prev]);
    return newAngle;
  };

  const updateCameraAngle = (id: string, updates: Partial<CameraAngle>) => {
    setCameraAngles((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates, updatedAt: nowISO() } : a)));
  };

  const deleteCameraAngle = (id: string) => {
    const target = cameraAngles.find((a) => a.id === id);
    if (!target) return;
    pushToTrash('cameraAngle', target.name, target);
    setCameraAngles((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleStarCameraAngle = (id: string) => {
    setCameraAngles((prev) => prev.map((a) => (a.id === id ? { ...a, starred: !a.starred } : a)));
  };

  /* -------------------------- Creative Reference CRUD ----------------------- */

  const addCreativeReference = (data: Omit<CreativeReference, 'id' | 'createdAt'>): CreativeReference => {
    const newRef: CreativeReference = { ...data, id: uid('cref'), createdAt: nowISO(), updatedAt: nowISO() };
    setCreativeReferences((prev) => [newRef, ...prev]);
    return newRef;
  };

  const updateCreativeReference = (id: string, updates: Partial<CreativeReference>) => {
    setCreativeReferences((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates, updatedAt: nowISO() } : r)));
  };

  const deleteCreativeReference = (id: string) => {
    const target = creativeReferences.find((r) => r.id === id);
    if (!target) return;
    pushToTrash('creativeReference', target.title, target);
    setCreativeReferences((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleStarCreativeReference = (id: string) => {
    setCreativeReferences((prev) => prev.map((r) => (r.id === id ? { ...r, starred: !r.starred } : r)));
  };

  /* --------------------------- Gallery Reference CRUD ----------------------- */

  const addGalleryReference = (data: Omit<ReferenceImageItem, 'id' | 'createdAt'>): ReferenceImageItem => {
    const newRef: ReferenceImageItem = { ...data, id: uid('ref'), createdAt: nowISO(), updatedAt: nowISO() };
    setGalleryReferences((prev) => [newRef, ...prev]);
    return newRef;
  };

  const deleteGalleryReference = (id: string) => {
    const target = galleryReferences.find((r) => r.id === id);
    if (!target) return;
    pushToTrash('galleryReference', target.title || 'Reference', target);
    setGalleryReferences((prev) => prev.filter((r) => r.id !== id));
  };

  /* ---------------------------- Export / Import ----------------------------- */

  const exportLibraryJSON = () => {
    const blob = new Blob([JSON.stringify(buildSnapshot(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CVL-Backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importLibraryJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') return false;
      const hasAnyCollection = ['brands', 'directions', 'analyses', 'products', 'prompts', 'cameraAngles', 'creativeReferences', 'galleryReferences'].some(
        (k) => Array.isArray((data as any)[k])
      );
      if (!hasAnyCollection) return false;
      applySnapshot(data, false);
      return true;
    } catch (err) {
      console.error('Import failed', err);
      return false;
    }
  };

  const resetToDemoData = () => {
    applySnapshot({ cameraAngles: INITIAL_CAMERA_ANGLES, creativeReferences: INITIAL_CREATIVE_REFERENCES }, true);
    setActiveBrandId('');
    setSelectedDirectionId(null);
    setSelectedAnalysisId(null);
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
        isSidebarOpen,
        setIsSidebarOpen,

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
        trash,

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

        restoreFromTrash,
        purgeTrashItem,
        emptyTrash,

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
        lastSavedAt,

        isSupabaseModalOpen,
        setIsSupabaseModalOpen,
        isSupabaseConfigured,
        isSupabaseSyncing,
        supabaseStatus,
        supabaseBrandIds,
        isBrandSavedInSupabase,
        syncBrandToSupabase,
        isSyncingBrandId,
        syncWithSupabase,
        pushBrandsToSupabase,
        checkSupabaseHealth,
        cloudSyncState,
        pushLibraryToCloud,
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
