import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  Trash2,
  UploadCloud,
  ImageIcon,
  Check,
  AlertCircle,
  Copy,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { uploadBrandImageToStorage, isSupabaseConfigured, SUPABASE_BRAND_IMAGES_BUCKET } from '../../lib/supabase';

export const BrandModal: React.FC = () => {
  const {
    t,
    isAddBrandModalOpen,
    setIsAddBrandModalOpen,
    editingBrand,
    setEditingBrand,
    addBrand,
    updateBrand,
    setActiveBrandId,
  } = useLibrary();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [founded, setFounded] = useState('');
  const [personality, setPersonality] = useState('');
  const [visualStyle, setVisualStyle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isRlsError, setIsRlsError] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [colors, setColors] = useState<string[]>(['#4B1E3F', '#7A4B6B', '#14121d']);
  const [newColor, setNewColor] = useState('#A855F7');

  useEffect(() => {
    if (editingBrand) {
      setName(editingBrand.name);
      setCategory(editingBrand.category);
      setFounded(editingBrand.founded);
      setPersonality(editingBrand.personality);
      setVisualStyle(editingBrand.visualStyle);
      setDescription(editingBrand.description);
      setColors(editingBrand.brandColors || []);
      setCoverImage(editingBrand.coverImage || '');
      setUploadError(null);
      setIsRlsError(false);
      setUploadSuccess(false);
    } else {
      setName('');
      setCategory('');
      setFounded('2024');
      setPersonality('');
      setVisualStyle('');
      setDescription('');
      setColors(['#4B1E3F', '#7A4B6B', '#E7D9C6', '#1E1E24']);
      setCoverImage('');
      setUploadError(null);
      setIsRlsError(false);
      setUploadSuccess(false);
    }
  }, [editingBrand, isAddBrandModalOpen]);

  if (!isAddBrandModalOpen) return null;

  const handleAddColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor]);
    }
  };

  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleFileSelect = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP, SVG).');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setIsRlsError(false);
    setUploadSuccess(false);

    // Immediate preview using object URL
    const localPreview = URL.createObjectURL(file);
    setCoverImage(localPreview);

    if (isSupabaseConfigured) {
      const res = await uploadBrandImageToStorage(file, file.name, editingBrand?.id);
      if (res.publicUrl) {
        setCoverImage(res.publicUrl);
        setUploadSuccess(true);
      } else {
        if (res.isRlsPolicyError) {
          setIsRlsError(true);
          setUploadError('Storage RLS policy required for bucket "brand-images".');
        } else {
          setUploadError(res.error || 'Failed to upload to Supabase Storage.');
        }
      }
    } else {
      // Fallback to data URL when Supabase isn't configured
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCoverImage(reader.result);
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
    if (!name.trim()) return;

    if (editingBrand) {
      updateBrand(editingBrand.id, {
        name,
        category,
        founded,
        personality,
        visualStyle,
        description,
        brandColors: colors,
        coverImage,
      });
    } else {
      const newB = addBrand({
        name,
        category: category || 'Luxury Care',
        founded: founded || '2024',
        personality: personality || 'Premium • Modern',
        visualStyle: visualStyle || 'Editorial • Cinematic',
        description,
        coverImage,
        brandColors: colors,
        brandCore: {
          personality,
          positioning: '',
          generalVisualIdentity: visualStyle,
          generalColors: colors.join(', '),
          typography: 'Poppins • Sans-serif',
          materials: 'Glass, Metal, Matte',
          generalPhotographyPrinciples: 'Diffused studio lighting, rich contrast',
          thingsToAvoid: 'Cluttered backgrounds, flat lighting',
          notes: '',
        },
      });
      setActiveBrandId(newB.id);
    }

    setIsAddBrandModalOpen(false);
    setEditingBrand(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#13111e] border border-purple-500/30 shadow-2xl overflow-hidden flex flex-col my-8">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <Building2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">
              {editingBrand ? t.edit : t.addNewBrand}
            </h3>
          </div>
          <button
            onClick={() => {
              setIsAddBrandModalOpen(false);
              setEditingBrand(null);
            }}
            className="p-1 rounded-lg text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="text-neutral-300 font-semibold block mb-1">
              {t.brandName} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mabelle Professional"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
            />
          </div>

          {/* Brand Cover / Logo Image (Supabase Storage: brand-images) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-neutral-300 font-semibold flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-violet-400" />
                <span>{t.brandImage || 'Brand Image / Cover'}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {SUPABASE_BRAND_IMAGES_BUCKET}
                </span>
              </label>

              {coverImage && (
                <button
                  type="button"
                  onClick={() => {
                    setCoverImage('');
                    setUploadSuccess(false);
                    setUploadError(null);
                  }}
                  className="text-neutral-400 hover:text-red-400 text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{t.removeImage || 'Remove'}</span>
                </button>
              )}
            </div>

            {/* If image is selected/uploaded, display preview */}
            {coverImage ? (
              <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40 group">
                <img
                  src={coverImage}
                  alt={name || 'Brand Cover'}
                  className="w-full h-36 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end justify-between p-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {uploadSuccess ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-medium font-mono">
                        <Check className="w-3 h-3" />
                        {t.uploadedToStorage || 'Uploaded to brand-images'}
                      </span>
                    ) : coverImage.includes('supabase.co/storage') ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-medium font-mono">
                        <Check className="w-3 h-3" />
                        Supabase Storage
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/80 text-[10px]">
                        Preview
                      </span>
                    )}
                  </div>

                  <label className="px-2.5 py-1 rounded-lg bg-black/70 hover:bg-violet-600 text-white text-[11px] font-medium border border-white/20 hover:border-violet-400/50 cursor-pointer transition-colors flex items-center gap-1">
                    <UploadCloud className="w-3 h-3" />
                    <span>{t.edit || 'Change'}</span>
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
                    ? 'border-violet-500 bg-violet-950/20'
                    : 'border-white/10 hover:border-violet-500/40 bg-black/30 hover:bg-black/50'
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  id="brand-image-file-input"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileSelect(f);
                  }}
                />

                {isUploading ? (
                  <div className="flex flex-col items-center gap-2 py-2">
                    <Loader2 className="w-7 h-7 text-violet-400 animate-spin" />
                    <span className="text-xs text-violet-300 font-medium">
                      {t.uploadingToStorage || 'Uploading to Supabase Storage (brand-images)...'}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 pointer-events-none">
                    <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-1">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-white">
                      {t.dragDropBrandImage || 'Drag & drop image or click to browse'}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      {t.supabaseStorageHelp || 'Directly uploaded to Supabase Storage (brand-images) and saved to image_url'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Error or RLS Alert */}
            {uploadError && !isRlsError && (
              <p className="text-[11px] text-red-400 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{uploadError}</span>
              </p>
            )}

            {/* RLS Policy Help Banner if permission denied */}
            {isRlsError && (
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs space-y-2">
                <div className="flex items-start gap-2 text-amber-300 font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span>مستودع brand-images يتطلب تفعيل سياسة RLS للرفع:</span>
                    <p className="text-[11px] text-amber-200/80 font-normal mt-0.5">
                      قم بلصق كود سياسة التخزين في Supabase SQL Editor للسماح برفع الصور عبر المفتاح العام.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={copyStorageSql}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'تم نسخ كود السياسة!' : 'نسخ كود SQL لسياسة Storage RLS'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-neutral-300 font-semibold block mb-1">
                {t.category}
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Hair Care, Skin Care"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
              />
            </div>

            <div>
              <label className="text-neutral-300 font-semibold block mb-1">
                {t.founded}
              </label>
              <input
                type="text"
                value={founded}
                onChange={(e) => setFounded(e.target.value)}
                placeholder="e.g. 2021"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
              />
            </div>
          </div>

          <div>
            <label className="text-neutral-300 font-semibold block mb-1">
              {t.personality}
            </label>
            <input
              type="text"
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="e.g. Elegant • Confident • Feminine"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
            />
          </div>

          <div>
            <label className="text-neutral-300 font-semibold block mb-1">
              {t.visualStyle}
            </label>
            <input
              type="text"
              value={visualStyle}
              onChange={(e) => setVisualStyle(e.target.value)}
              placeholder="e.g. Luxury • Editorial • Refined"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
            />
          </div>

          <div>
            <label className="text-neutral-300 font-semibold block mb-1">
              {t.description}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short brand overview statement..."
              className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500/60 resize-none"
            />
          </div>

          {/* Color swatches */}
          <div>
            <label className="text-neutral-300 font-semibold block mb-1">
              {t.brandColors}
            </label>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {colors.map((color, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/50 border border-white/10 text-neutral-300"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-mono text-[10px]">{color}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(i)}
                    className="text-neutral-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="w-8 h-8 rounded-lg bg-transparent cursor-pointer border border-white/10"
              />
              <input
                type="text"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="w-28 bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-white font-mono text-xs"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-purple-600 transition-colors"
              >
                Add Color
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsAddBrandModalOpen(false);
                setEditingBrand(null);
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
