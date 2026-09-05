import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  ImageIcon,
  UploadCloud,
  Check,
  Trash2,
  RefreshCw,
  AlertTriangle,
  Copy,
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import {
  uploadPromptImageToStorage,
  isSupabaseConfigured } from '../../lib/supabase';

export const PromptModal: React.FC = () => {
  const {
    t,
    lang,
    isAddPromptModalOpen,
    setIsAddPromptModalOpen,
    editingPrompt,
    setEditingPrompt,
    addPrompt,
    updatePrompt,
    activeBrandId,
  } = useLibrary();

  const isRTL = lang === 'ar';

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Editorial');
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('');
  const [usage, setUsage] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isRlsError, setIsRlsError] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    if (editingPrompt) {
      setName(editingPrompt.name);
      setCategory(editingPrompt.category);
      setPrompt(editingPrompt.prompt);
      setStyle(editingPrompt.style || '');
      setUsage(editingPrompt.usage || '');
      setTagsStr(editingPrompt.tags?.join(', ') || '');
      setImageUrl(editingPrompt.imageUrl || '');
      setUploadError(null);
      setIsRlsError(false);
      setUploadSuccess(false);
    } else {
      setName('');
      setCategory('Editorial');
      setPrompt('');
      setStyle('');
      setUsage('');
      setTagsStr('');
      setImageUrl('');
      setUploadError(null);
      setIsRlsError(false);
      setUploadSuccess(false);
    }
  }, [editingPrompt, isAddPromptModalOpen]);

  if (!isAddPromptModalOpen) return null;

  const handleFileSelect = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError(isRTL ? 'يرجى اختيار ملف صورة صالح (PNG, JPG, WEBP).' : 'Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setIsRlsError(false);
    setUploadSuccess(false);

    // Immediate preview
    const localPreview = URL.createObjectURL(file);
    setImageUrl(localPreview);

    if (isSupabaseConfigured) {
      const res = await uploadPromptImageToStorage(file, file.name, editingPrompt?.id);
      if (res.publicUrl) {
        setImageUrl(res.publicUrl);
        setUploadSuccess(true);
      } else {
        if (res.isRlsPolicyError) {
          setIsRlsError(true);
          setUploadError(
            isRTL
              ? 'مطلوب تفعيل سياسة الرفع (Storage RLS Policy) في Supabase.'
              : 'Storage RLS policy required in Supabase SQL Editor.'
          );
        } else {
          setUploadError(res.error || (isRTL ? 'فشل الرفع إلى Supabase Storage.' : 'Failed to upload to Supabase Storage.'));
        }
      }
    } else {
      // Fallback to data URL when Supabase isn't configured
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !prompt.trim()) return;

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    const cleanImageUrl = imageUrl.trim() || undefined;

    if (editingPrompt) {
      updatePrompt(editingPrompt.id, {
        name,
        category,
        prompt,
        style,
        usage,
        tags,
        imageUrl: cleanImageUrl,
      });
    } else {
      addPrompt({
        brandId: activeBrandId,
        name,
        category,
        prompt,
        style,
        usage,
        tags,
        imageUrl: cleanImageUrl,
        description: usage || style || '',
        starred: false,
      });
    }

    setIsAddPromptModalOpen(false);
    setEditingPrompt(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#13111e] border border-purple-500/30 shadow-2xl overflow-hidden flex flex-col my-8">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {editingPrompt ? t.edit : t.addNewPrompt}
              </h3>
              <p className="text-[11px] text-neutral-400">
                {isRTL
                  ? 'أضف برومبت مصحوب بصورة توضح النتيجة الفنية الناتجة'
                  : 'Add master prompt with visual result image preview'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsAddPromptModalOpen(false);
              setEditingPrompt(null);
            }}
            className="p-1 rounded-lg text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="text-neutral-300 font-semibold block mb-1">
              {isRTL ? 'عنوان البرومبت *' : 'Prompt Title *'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isRTL ? 'مثال: لقطة تحريرية فاخرة — حملة الشعر' : 'e.g. Luxury Editorial — Hair Campaign'}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
            />
          </div>

          {/* Prompt Output / Result Image (Supabase Storage) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-neutral-300 font-semibold flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                <span>{t.promptResultImage || (isRTL ? 'صورة نتيجة البرومبت' : 'Prompt Output / Result Image')}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Supabase Storage
                </span>
              </label>

              {imageUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl('');
                    setUploadSuccess(false);
                    setUploadError(null);
                  }}
                  className="text-neutral-400 hover:text-red-400 text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{t.removeImage || (isRTL ? 'حذف' : 'Remove')}</span>
                </button>
              )}
            </div>

            {/* Preview if image exists */}
            {imageUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-purple-500/30 bg-black/40 group">
                <img
                  src={imageUrl}
                  alt={name || 'Prompt Result'}
                  className="w-full h-44 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end justify-between p-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {uploadSuccess ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-medium font-mono">
                        <Check className="w-3 h-3" />
                        {t.uploadedPromptImage || (isRTL ? 'تم الرفع إلى Supabase' : 'Uploaded to Supabase Storage')}
                      </span>
                    ) : imageUrl.includes('supabase.co/storage') ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-medium font-mono">
                        <Check className="w-3 h-3" />
                        Supabase Storage
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-200 text-[10px]">
                        {isRTL ? 'معاينة النتيجة' : 'Result Preview'}
                      </span>
                    )}
                  </div>

                  <label className="px-2.5 py-1 rounded-lg bg-black/70 hover:bg-purple-600 text-white text-[11px] font-medium border border-white/20 hover:border-purple-400/50 cursor-pointer transition-colors flex items-center gap-1">
                    <UploadCloud className="w-3 h-3" />
                    <span>{t.edit || (isRTL ? 'تغيير' : 'Change')}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFileSelect(f);
                      }}
                    />
                  </label>
                </div>
              </div>
            ) : (
              /* Drag & drop upload area */
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
                className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative ${
                  dragActive
                    ? 'border-purple-500 bg-purple-950/30'
                    : 'border-white/10 hover:border-purple-500/50 bg-black/30 hover:bg-black/50'
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileSelect(f);
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />

                {isUploading ? (
                  <div className="flex flex-col items-center gap-2 py-2 text-purple-300">
                    <RefreshCw className="w-6 h-6 animate-spin text-purple-400" />
                    <span className="text-xs font-medium">
                      {t.uploadingPromptImage || (isRTL ? 'جارٍ رفع الصورة إلى Supabase...' : 'Uploading to Supabase Storage...')}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">
                        {t.dragDropPromptImage || (isRTL ? 'اسحب صورة نتيجة البرومبت هنا أو اضغط للاختيار' : 'Drag & drop prompt result image or click to browse')}
                      </p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        {t.promptImageHelp || (isRTL ? 'صورة توضح النتيجة التي ينتجها هذا البرومبت (PNG, JPG, WEBP)' : 'Image showing the output generated by this prompt (PNG, JPG, WEBP)')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Upload Error / Storage Policy alert */}
            {uploadError && (
              <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-300 text-[11px] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <div className="space-y-1.5 flex-1">
                  <p>{uploadError}</p>
                  {isRlsError && (
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-amber-500/20">
                      <span className="text-[10px] text-amber-200/80">
                        {isRTL
                          ? 'انسخ كود سياسة RLS لتصريح الرفع في Supabase SQL Editor'
                          : 'Copy RLS policy for Supabase SQL Editor:'}
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
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-neutral-300 font-semibold block mb-1">
                {isRTL ? 'الفئة' : 'Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
              >
                <option value="Editorial">Editorial</option>
                <option value="Product">Product</option>
                <option value="Motion">Motion</option>
                <option value="Portrait">Portrait</option>
                <option value="Minimal">Minimal</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="text-neutral-300 font-semibold block mb-1">
                {isRTL ? 'الستايل / الأسلوب' : 'Style / Medium'}
              </label>
              <input
                type="text"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                placeholder={isRTL ? 'مثال: 35mm Analog, 8k Studio' : 'e.g. 35mm Analog, 8k Studio'}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
              />
            </div>
          </div>

          <div>
            <label className="text-neutral-300 font-semibold block mb-1">
              {isRTL ? 'نص البرومبت *' : 'Prompt String *'}
            </label>
            <textarea
              rows={4}
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={isRTL ? 'اكتب نص البرومبت الدقيق والمفصل لتوليد الصورة...' : 'Detailed prompt text for AI generation...'}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-purple-200 font-mono focus:outline-none focus:border-purple-500/60 resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-neutral-300 font-semibold block mb-1">
                {isRTL ? 'الاستخدام الموصى به' : 'Recommended Usage'}
              </label>
              <input
                type="text"
                value={usage}
                onChange={(e) => setUsage(e.target.value)}
                placeholder={isRTL ? 'مثال: إعلانات الطرق، انستجرام' : 'e.g. Hero billboard, Instagram feed'}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
              />
            </div>

            <div>
              <label className="text-neutral-300 font-semibold block mb-1">
                {isRTL ? 'الوسوم (مفصولة بفواصل)' : 'Tags (comma separated)'}
              </label>
              <input
                type="text"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                placeholder="editorial, hair, studio"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsAddPromptModalOpen(false);
                setEditingPrompt(null);
              }}
              className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-md"
            >
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

