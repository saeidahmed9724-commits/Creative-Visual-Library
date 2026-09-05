import React, { useState } from 'react';
import { UploadCloud, AlertTriangle, Copy, Check, Loader2, Link2 } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { uploadGenericImageToStorage, isSupabaseConfigured } from '../lib/supabase';

interface ImageUploadFieldProps {
  /** Current image value (URL or data: URL) */
  value: string;
  /** Called with the new value whenever the URL changes or an upload finishes */
  onChange: (value: string) => void;
  /** Storage sub-folder for this entity type, e.g. 'directions', 'products' */
  folder: string;
  /** Optional id hint used to namespace the uploaded file path */
  idHint?: string;
  /** Label shown above the field */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Aspect ratio class for the preview box, defaults to aspect-video */
  previewAspectClassName?: string;
}

/**
 * A single reusable field for anywhere in the app that previously only accepted
 * an image URL. Lets the user either paste a URL or drag & drop / browse an image
 * file from their device. Uploaded files go to Supabase Storage when configured,
 * otherwise they're kept as a local data URL so everything still works offline.
 */
export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  folder,
  idHint,
  label,
  required,
  previewAspectClassName = 'aspect-video',
}) => {
  const { lang } = useLibrary();
  const isRTL = lang === 'ar';

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isRlsError, setIsRlsError] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const inputId = `image-upload-${folder}-${idHint || 'new'}-${label || ''}`.replace(/\s+/g, '-');

  const handleFileSelect = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError(
        isRTL
          ? 'يرجى اختيار ملف صورة صالح (PNG, JPG, WEBP).'
          : 'Please select a valid image file (PNG, JPG, WEBP).'
      );
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setIsRlsError(false);

    // Immediate local preview so the user sees something right away
    const localPreview = URL.createObjectURL(file);
    onChange(localPreview);

    if (isSupabaseConfigured) {
      const res = await uploadGenericImageToStorage(file, folder, idHint);
      if (res.publicUrl) {
        onChange(res.publicUrl);
      } else if (res.isRlsPolicyError) {
        setIsRlsError(true);
        setUploadError(
          isRTL
            ? 'مطلوب تفعيل سياسة الرفع (Storage RLS Policy) في Supabase — تم استخدام الصورة محليًا مؤقتًا.'
            : 'Storage RLS policy required in Supabase — using the image locally for now.'
        );
        // Fall back to a data URL so the image still persists in local storage
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') onChange(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setUploadError(
          res.error || (isRTL ? 'فشل الرفع إلى Supabase Storage، تم استخدام الصورة محليًا.' : 'Upload to Supabase failed, using the image locally.')
        );
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') onChange(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      // No Supabase configured — persist as a data URL so it survives reloads
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') onChange(reader.result);
      };
      reader.readAsDataURL(file);
    }

    setIsUploading(false);
  };

  const copyStorageSql = async () => {
    const sql = `CREATE POLICY "Allow public upload brand-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'brand-images');
CREATE POLICY "Allow public select brand-images" ON storage.objects FOR SELECT USING (bucket_id = 'brand-images');
CREATE POLICY "Allow public update brand-images" ON storage.objects FOR UPDATE USING (bucket_id = 'brand-images');`;
    try {
      await navigator.clipboard.writeText(sql);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-neutral-300 font-semibold block mb-1 text-xs">
          {label} {required && '*'}
        </label>
      )}

      {/* URL text input */}
      <div className="relative">
        <Link2 className="w-3.5 h-3.5 text-neutral-500 absolute top-1/2 -translate-y-1/2 start-3 pointer-events-none rtl:right-3 rtl:left-auto" />
        <input
          type="url"
          value={value.startsWith('data:') || value.startsWith('blob:') ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isRTL ? 'الصق رابط صورة، أو ارفع صورة من جهازك بالأسفل' : 'Paste an image URL, or upload from your device below'}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 ps-8 text-xs text-white focus:outline-none focus:border-purple-500/60"
        />
      </div>

      {/* Drag & drop / browse upload area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          const f = e.dataTransfer.files?.[0];
          if (f) handleFileSelect(f);
        }}
        className={`border-2 border-dashed rounded-xl p-3.5 flex items-center justify-center text-center transition-all cursor-pointer relative ${
          dragActive
            ? 'border-purple-500 bg-purple-950/30'
            : 'border-white/10 hover:border-purple-500/50 bg-black/30 hover:bg-black/50'
        }`}
      >
        <input
          id={inputId}
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFileSelect(f);
            e.target.value = '';
          }}
        />

        {isUploading ? (
          <div className="flex items-center gap-2 py-1 text-purple-300">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-[11px] font-medium">
              {isSupabaseConfigured
                ? (isRTL ? 'جارٍ رفع الصورة...' : 'Uploading image...')
                : (isRTL ? 'جارٍ تجهيز الصورة...' : 'Processing image...')}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 pointer-events-none">
            <UploadCloud className="w-4 h-4 text-violet-400" />
            <span className="text-[11px] font-semibold text-white">
              {isRTL ? 'اسحب صورة هنا أو اضغط للرفع من جهازك' : 'Drag & drop an image, or click to upload from your device'}
            </span>
          </div>
        )}
      </div>

      {uploadError && (
        <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-300 text-[11px] flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <div className="space-y-1.5 flex-1">
            <p>{uploadError}</p>
            {isRlsError && (
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-amber-500/20">
                <span className="text-[10px] text-amber-200/80">
                  {isRTL ? 'انسخ كود سياسة RLS في Supabase SQL Editor' : 'Copy the RLS policy for Supabase SQL Editor:'}
                </span>
                <button
                  type="button"
                  onClick={copyStorageSql}
                  className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[10px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-300">{isRTL ? 'تم النسخ!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>{isRTL ? 'نسخ الكود' : 'Copy SQL'}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {value && (
        <div className={`${previewAspectClassName} rounded-xl overflow-hidden bg-black/40 border border-white/10`}>
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
};

interface MultiImageUploadInputProps {
  /** Comma/newline separated list of URLs */
  value: string;
  onChange: (value: string) => void;
  folder: string;
  idHint?: string;
  placeholder?: string;
  label?: string;
}

/**
 * For fields that store multiple reference image URLs as a comma-separated string.
 * Keeps the existing free-text URL box, and adds a small button that lets the
 * user pick one or more images from their device — each gets uploaded (or turned
 * into a data URL) and appended to the list.
 */
export const MultiImageUploadInput: React.FC<MultiImageUploadInputProps> = ({
  value,
  onChange,
  folder,
  idHint,
  placeholder,
  label,
}) => {
  const { lang } = useLibrary();
  const isRTL = lang === 'ar';
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const appendUrl = (url: string) => {
    const existing = value
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter((u) => u.length > 0);
    onChange([...existing, url].join(', '));
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadError(null);

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;

      if (isSupabaseConfigured) {
        const res = await uploadGenericImageToStorage(file, folder, idHint);
        if (res.publicUrl) {
          appendUrl(res.publicUrl);
          continue;
        }
        setUploadError(
          res.error || (isRTL ? 'فشل رفع إحدى الصور، تم استخدامها محليًا.' : 'One of the uploads failed, using it locally.')
        );
      }

      // Fallback: encode as a data URL so it still gets saved
      await new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') appendUrl(reader.result);
          resolve();
        };
        reader.onerror = () => resolve();
        reader.readAsDataURL(file);
      });
    }

    setIsUploading(false);
  };

  return (
    <div>
      {label && <label className="text-neutral-400 block mb-1">{label}</label>}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500/60"
        />
        <label
          className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[11px] font-medium cursor-pointer transition-colors ${
            isUploading
              ? 'border-purple-500/30 text-purple-300 bg-purple-950/30'
              : 'border-white/10 text-neutral-300 hover:text-white hover:border-purple-500/50 bg-black/40'
          }`}
        >
          {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
          <span>{isRTL ? 'رفع صور' : 'Upload'}</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = '';
            }}
          />
        </label>
      </div>
      {uploadError && (
        <p className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 shrink-0" />
          <span>{uploadError}</span>
        </p>
      )}
    </div>
  );
};
