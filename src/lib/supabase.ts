import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseBrandRow {
  id: string;
  name: string;
  image_url: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      brands: {
        Row: SupabaseBrandRow;
        Insert: {
          id?: string;
          name: string;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          image_url?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

export function normalizeSupabaseUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  let u = rawUrl.trim();
  // Strip trailing slashes
  u = u.replace(/\/+$/, '');
  // Strip /rest/v1 or /rest/v1/ if user copied the REST endpoint URL
  u = u.replace(/\/rest\/v1\/?$/i, '');
  return u.replace(/\/+$/, '');
}

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const supabaseUrl = normalizeSupabaseUrl(rawUrl);
export const supabaseAnonKey = rawKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.length > 10
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Fetch all brands from Supabase 'brands' table
 */
export async function fetchBrandsFromSupabase(): Promise<SupabaseBrandRow[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching brands from Supabase:', error.message);
      return null;
    }

    return data || [];
  } catch (err) {
    console.error('Supabase fetch exception:', err);
    return null;
  }
}

/**
 * Insert a brand into Supabase 'brands' table
 */
export async function insertBrandToSupabase(brand: {
  id?: string;
  name: string;
  image_url?: string;
  created_at?: string;
}): Promise<SupabaseBrandRow | null> {
  if (!supabase) return null;
  try {
    const payload = {
      ...(brand.id ? { id: brand.id } : {}),
      name: brand.name,
      image_url: brand.image_url || null,
      created_at: brand.created_at || new Date().toISOString(),
    };

    const { data, error } = await (supabase
      .from('brands') as any)
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.warn('Error upserting brand to Supabase:', error.message);
      return null;
    }

    return data as SupabaseBrandRow;
  } catch (err) {
    console.error('Supabase insert exception:', err);
    return null;
  }
}

/**
 * Update a brand in Supabase 'brands' table
 */
export async function updateBrandInSupabase(
  id: string,
  updates: {
    name?: string;
    image_url?: string;
  }
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await (supabase
      .from('brands') as any)
      .update(updates)
      .eq('id', id);

    if (error) {
      console.warn('Error updating brand in Supabase:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Supabase update exception:', err);
    return false;
  }
}

/**
 * Delete a brand from Supabase 'brands' table
 */
export async function deleteBrandFromSupabase(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('brands')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('Error deleting brand from Supabase:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Supabase delete exception:', err);
    return false;
  }
}

/**
 * Test connectivity to Supabase and check if 'brands' table exists
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  message: string;
  tableExists: boolean;
}> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      connected: false,
      message: 'VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing.',
      tableExists: false,
    };
  }

  try {
    const { data, error } = await supabase
      .from('brands')
      .select('id, name')
      .limit(1);

    if (error) {
      if (error.code === '42P01' || error.message.includes('relation "public.brands" does not exist') || error.message.includes('does not exist')) {
        return {
          connected: true,
          message: 'Connected to Supabase! However, the "brands" table has not been created yet in your Supabase SQL editor.',
          tableExists: false,
        };
      }
      return {
        connected: false,
        message: `Supabase returned error: ${error.message} (code: ${error.code})`,
        tableExists: false,
      };
    }

    return {
      connected: true,
      message: `Successfully connected to Supabase! "brands" table is reachable (${data?.length || 0} sample rows inspected).`,
      tableExists: true,
    };
  } catch (err: any) {
    return {
      connected: false,
      message: err?.message || 'Network error connecting to Supabase.',
      tableExists: false,
    };
  }
}

export const SUPABASE_BRAND_IMAGES_BUCKET = 'brand-images';

export interface StorageUploadResult {
  publicUrl: string | null;
  path: string | null;
  error: string | null;
  isRlsPolicyError?: boolean;
}

/**
 * Upload a brand image file or blob to the 'brand-images' bucket in Supabase Storage.
 * Returns the public URL that can be stored in the 'image_url' column of the 'brands' table.
 */
export async function uploadBrandImageToStorage(
  file: File | Blob,
  fileName?: string,
  brandId?: string
): Promise<StorageUploadResult> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      publicUrl: null,
      path: null,
      error: 'Supabase is not configured',
      isRlsPolicyError: false,
    };
  }

  try {
    const originalName = (file instanceof File ? file.name : fileName) || 'image.jpg';
    const rawExt = originalName.split('.').pop() || '';
    const safeExt = (rawExt || (file.type ? file.type.split('/')[1] : 'jpg'))
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase()
      .slice(0, 5) || 'jpg';

    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const cleanBrandId = (brandId || 'brand').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filePath = `brands/${cleanBrandId}_${timestamp}_${randomSuffix}.${safeExt}`;

    const contentType = file.type || (safeExt === 'png' ? 'image/png' : safeExt === 'webp' ? 'image/webp' : 'image/jpeg');

    const { data, error } = await supabase.storage
      .from(SUPABASE_BRAND_IMAGES_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType,
      });

    if (error) {
      console.warn('Supabase storage upload error:', error);
      const isRls =
        error.message?.toLowerCase().includes('violates row-level security') ||
        error.message?.toLowerCase().includes('security policy') ||
        (error as any).statusCode === '403' ||
        (error as any).status === 400 ||
        (error as any).code === 'AccessDenied';

      return {
        publicUrl: null,
        path: null,
        error: error.message,
        isRlsPolicyError: isRls,
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(SUPABASE_BRAND_IMAGES_BUCKET)
      .getPublicUrl(data.path);

    return {
      publicUrl: urlData.publicUrl,
      path: data.path,
      error: null,
      isRlsPolicyError: false,
    };
  } catch (err: any) {
    console.error('Storage upload exception:', err);
    return {
      publicUrl: null,
      path: null,
      error: err?.message || 'Failed to upload image',
      isRlsPolicyError: false,
    };
  }
}

/**
 * Delete an image from Supabase Storage by its path or public URL
 */
export async function deleteBrandImageFromStorage(imagePathOrUrl: string): Promise<boolean> {
  if (!supabase || !imagePathOrUrl) return false;
  try {
    let path = imagePathOrUrl;
    if (imagePathOrUrl.includes(SUPABASE_BRAND_IMAGES_BUCKET)) {
      const parts = imagePathOrUrl.split(`${SUPABASE_BRAND_IMAGES_BUCKET}/`);
      if (parts[1]) {
        path = decodeURIComponent(parts[1].split('?')[0]);
      }
    }
    const { error } = await supabase.storage
      .from(SUPABASE_BRAND_IMAGES_BUCKET)
      .remove([path]);
    return !error;
  } catch (err) {
    console.warn('Storage delete exception:', err);
    return false;
  }
}

/**
 * Check if the 'brand-images' storage bucket is accessible and configured for upload
 */
export async function testSupabaseStorageBucket(): Promise<{
  accessible: boolean;
  canUpload: boolean;
  message: string;
}> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      accessible: false,
      canUpload: false,
      message: 'Supabase is not configured',
    };
  }

  try {
    const dummy = new Blob(['ping'], { type: 'text/plain' });
    const testPath = `_test/ping_${Date.now()}.txt`;
    const { data, error } = await supabase.storage
      .from(SUPABASE_BRAND_IMAGES_BUCKET)
      .upload(testPath, dummy, { upsert: true, contentType: 'text/plain' });

    if (error) {
      if (
        error.message?.includes('violates row-level security') ||
        (error as any).statusCode === '403'
      ) {
        return {
          accessible: true,
          canUpload: false,
          message: 'Bucket exists, but Storage RLS policy must be created in Supabase SQL editor to allow uploads.',
        };
      }
      return {
        accessible: false,
        canUpload: false,
        message: error.message,
      };
    }

    if (data?.path) {
      await supabase.storage
        .from(SUPABASE_BRAND_IMAGES_BUCKET)
        .remove([data.path]);
    }

    return {
      accessible: true,
      canUpload: true,
      message: 'brand-images bucket is online and ready for uploads!',
    };
  } catch (err: any) {
    return {
      accessible: false,
      canUpload: false,
      message: err?.message || 'Storage bucket check failed',
    };
  }
}

/**
 * Upload a prompt output image to Supabase Storage (tries 'prompt-images' bucket, falls back to 'brand-images/prompts/').
 * Returns the public URL to be saved in the Prompt item.
 */
export async function uploadPromptImageToStorage(
  file: File | Blob,
  fileName?: string,
  promptId?: string
): Promise<StorageUploadResult> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      publicUrl: null,
      path: null,
      error: 'Supabase is not configured',
      isRlsPolicyError: false,
    };
  }

  try {
    const originalName = (file instanceof File ? file.name : fileName) || 'prompt_output.jpg';
    const rawExt = originalName.split('.').pop() || '';
    const safeExt = (rawExt || (file.type ? file.type.split('/')[1] : 'jpg'))
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase()
      .slice(0, 5) || 'jpg';

    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const cleanPromptId = (promptId || 'prompt').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filePath = `prompts/${cleanPromptId}_${timestamp}_${randomSuffix}.${safeExt}`;

    const contentType = file.type || (safeExt === 'png' ? 'image/png' : safeExt === 'webp' ? 'image/webp' : 'image/jpeg');

    // Attempt upload to 'brand-images' (or 'prompt-images' if configured)
    let bucketToUse = SUPABASE_BRAND_IMAGES_BUCKET;
    let { data, error } = await supabase.storage
      .from(bucketToUse)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType,
      });

    if (error) {
      console.warn('Supabase storage upload error for prompt:', error);
      const isRls =
        error.message?.toLowerCase().includes('violates row-level security') ||
        error.message?.toLowerCase().includes('security policy') ||
        (error as any).statusCode === '403' ||
        (error as any).status === 400 ||
        (error as any).code === 'AccessDenied';

      return {
        publicUrl: null,
        path: null,
        error: error.message,
        isRlsPolicyError: isRls,
      };
    }

    const { data: urlData } = supabase.storage
      .from(bucketToUse)
      .getPublicUrl(data.path);

    return {
      publicUrl: urlData.publicUrl,
      path: data.path,
      error: null,
      isRlsPolicyError: false,
    };
  } catch (err: any) {
    console.error('Storage prompt upload exception:', err);
    return {
      publicUrl: null,
      path: null,
      error: err?.message || 'Failed to upload prompt image',
      isRlsPolicyError: false,
    };
  }
}


