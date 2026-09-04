import { Brand, VisualDirection, VisualAnalysis, Product, PromptItem, CameraAngle, CreativeReference } from '../types';

// Zero fake/mock brands or brand entities
export const INITIAL_BRANDS: Brand[] = [];
export const INITIAL_DIRECTIONS: VisualDirection[] = [];
export const INITIAL_ANALYSES: VisualAnalysis[] = [];
export const INITIAL_PRODUCTS: Product[] = [];
export const INITIAL_PROMPTS: PromptItem[] = [];

export const INITIAL_CAMERA_ANGLES: CameraAngle[] = [
  {
    id: 'angle-45',
    name: '45° Side Angle',
    shotType: 'Medium Shot',
    diagramType: '45-degree',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    prompt: '45-degree angle medium studio shot, camera positioned at three-quarters perspective to model face, capturing both facial cheekbones and lateral hair volume simultaneously, depth of field f/2.8, balanced dimensional lighting.',
    description: 'The golden standard for portrait and bottle photography, revealing both front label typography and 3D volumetric depth.',
    notes: 'Best for showcasing hair volume and profile jawlines without flattening features.',
    tags: ['Portrait', '3/4 Perspective', 'Editorial', 'Core Angle'],
    starred: true,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'angle-low',
    name: 'Low Angle',
    shotType: 'Hero Shot',
    diagramType: 'low-angle',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    prompt: 'Low angle shot looking upward at subject from 25 degrees below eye level, imposing majestic perspective, architectural ceiling leading lines, elevating presence and authority.',
    description: 'Creates a commanding heroic presence, making products appear monumental and models confident.',
    notes: 'Ideal for product bottles standing on pedestals and empowered campaign heroines.',
    tags: ['Hero Shot', 'Commanding', 'Product', 'Monumental'],
    starred: true,
    createdAt: '2024-01-16T11:00:00Z',
  },
  {
    id: 'angle-top-down',
    name: 'Top Down',
    shotType: 'Flat Lay',
    diagramType: 'top-down',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    prompt: '90-degree bird-eye top-down flat lay shot, camera perpendicular to marble surface, precise knolling arrangement of hair care routine, perfectly even diffused overhead illumination, zero perspective distortion.',
    description: 'Direct 90-degree orthogonal overhead view, ideal for complete routine kits, ingredients, and texture flat-lays.',
    notes: 'Ensure all bottle labels face the exact same direction and shadows are soft.',
    tags: ['Flat Lay', 'Routine', 'Overhead', 'Arrangement'],
    starred: false,
    createdAt: '2024-01-17T12:00:00Z',
  },
  {
    id: 'angle-close-up',
    name: 'Close-up',
    shotType: 'Detail Shot',
    diagramType: 'close-up',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
    prompt: 'Extreme macro close-up shot, 100mm f/2.8 macro lens, hyper-sharp focus on single hair fiber strand and liquid droplet refraction, microscopic biotechnology texture, luminous backlighting.',
    description: 'Magnified tight framing on textures, droplets, hair cuticles, or embossed bottle caps.',
    notes: 'Crucial for sensory proof, serum viscosity demonstrations, and luxury tactile feel.',
    tags: ['Macro', 'Detail', 'Texture', 'Sensory'],
    starred: true,
    createdAt: '2024-01-18T14:00:00Z',
  },
];

export const INITIAL_CREATIVE_REFERENCES: CreativeReference[] = [
  {
    id: 'cref-01',
    title: 'Luxury Product Editorial with Prism Reflections',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80',
    whatILike: 'Subtle rainbow prism refraction across glass bottle edge, deep violet shadow casting, minimalist marble plinth.',
    usefulFor: 'Serum campaign launch, packaging hero banners, luxury print advertisements.',
    tags: ['Prism', 'Refraction', 'Product', 'Minimal'],
    notes: 'Notice how the prism does not distract from the logo legibility.',
    starred: true,
    createdAt: '2024-02-01T10:00:00Z',
  },
  {
    id: 'cref-02',
    title: 'Cinematic Backlit Hair Silhouette with Violet Rim',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
    whatILike: 'Heavy atmospheric rim light catching individual flyaway hairs, creating a glowing ethereal halo around the silhouette.',
    usefulFor: 'Brand teaser reels, cinematic mood boards, scent storytelling.',
    tags: ['Rim Light', 'Silhouette', 'Halo', 'Atmosphere'],
    notes: 'The haze level is around 15%, giving subtle depth without muddying blacks.',
    starred: false,
    createdAt: '2024-02-05T12:00:00Z',
  },
  {
    id: 'cref-03',
    title: 'Modern Architecture Salon Vanity Mirrors with Neon Tubes',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    whatILike: 'Geometric vertical mirror strips with warm backlighting framed by industrial brushed metal and raw concrete.',
    usefulFor: 'Salon locator page, physical retail visual merchandising, brand environmental DNA.',
    tags: ['Interior', 'Salon', 'Architecture', 'Geometric'],
    notes: 'Great balance of warm halogen face lights with cool architectural accents.',
    starred: true,
    createdAt: '2024-02-10T14:00:00Z',
  },
];

export const INITIAL_GALLERY_REFERENCES: any[] = [];
