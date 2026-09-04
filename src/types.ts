export interface BrandCore {
  personality: string;
  positioning: string;
  generalVisualIdentity: string;
  generalColors: string;
  typography: string;
  materials: string;
  generalPhotographyPrinciples: string;
  thingsToAvoid: string;
  notes: string;
}

export interface Brand {
  id: string;
  name: string;
  category: string;
  founded: string;
  personality: string;
  visualStyle: string;
  description: string;
  logoText?: string;
  coverImage?: string;
  brandColors: string[];
  brandCore: BrandCore;
  notes?: string;
  starred?: boolean;
  isSavedInSupabase?: boolean;
  lastSyncedAt?: string;
  createdAt: string;
}

export interface VisualDirection {
  id: string;
  brandId: string;
  name: string;
  subtitle: string;
  image: string;
  colors?: string[];
  lighting?: string;
  environment?: string;
  mood?: string;
  composition?: string;
  analysesCount?: number;
  starred?: boolean;
  createdAt: string;
}

export interface VisualAnalysis {
  id: string;
  directionId: string;
  brandId: string;
  title: string;
  visualStyle: string;
  composition: string;
  camera: string;
  lensPerspective: string;
  lighting: string;
  colorPalette: string;
  environment: string;
  materials: string;
  subject: string;
  styling: string;
  mood: string;
  photography: string;
  usefulElements: string;
  avoid: string;
  notes: string;
  references: string[];
  starred?: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  brandId: string;
  name: string;
  category: string;
  mainImage: string;
  additionalImages?: string[];
  description: string;
  notes?: string;
  starred?: boolean;
  createdAt: string;
}

export interface PromptItem {
  id: string;
  name: string;
  prompt: string;
  description: string;
  tags: string[];
  category: string; // e.g. "Editorial", "Product", "Motion", "Portrait", "Minimal"
  style?: string;
  usage?: string;
  imageUrl?: string;
  referenceImages?: string[];
  brandId?: string;
  notes?: string;
  starred?: boolean;
  createdAt: string;
}

export interface CameraAngle {
  id: string;
  name: string;
  shotType: string;
  diagramType?: '45-degree' | 'low-angle' | 'top-down' | 'close-up' | 'eye-level' | 'wide' | 'over-shoulder' | 'custom';
  image?: string;
  prompt: string;
  description: string;
  notes?: string;
  tags: string[];
  starred?: boolean;
  createdAt: string;
}

export interface CreativeReference {
  id: string;
  title: string;
  image: string;
  whatILike: string;
  usefulFor: string;
  tags: string[];
  notes?: string;
  starred?: boolean;
  createdAt: string;
}

export interface ReferenceImageItem {
  id: string;
  url: string;
  title: string;
  tags: string[];
  brandId?: string;
  directionId?: string;
  analysisId?: string;
  starred?: boolean;
  createdAt: string;
}

export type ActiveNavSection = 
  | 'dashboard'
  | 'brands'
  | 'brand-dna'
  | 'visual-directions'
  | 'analyses'
  | 'prompt-library'
  | 'promptLibrary'
  | 'camera-angles'
  | 'cameraAngles'
  | 'creative-references'
  | 'creativeReferences'
  | 'all-references'
  | 'allReferences'
  | 'products'
  | 'starred'
  | 'recently-used'
  | 'recentlyUsed'
  | 'trash'
  | 'settings';

export type BrandSubTab = 
  | 'overview'
  | 'brand-dna'
  | 'visual-directions'
  | 'references'
  | 'products'
  | 'creative-references'
  | 'notes';

export interface LibraryState {
  brands: Brand[];
  directions: VisualDirection[];
  analyses: VisualAnalysis[];
  products: Product[];
  prompts: PromptItem[];
  cameraAngles: CameraAngle[];
  creativeReferences: CreativeReference[];
  activeBrandId: string;
  activeDirectionId?: string;
  activeAnalysisId?: string;
}
