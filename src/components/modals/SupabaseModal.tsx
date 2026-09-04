import React, { useState } from 'react';
import {
  Database,
  X,
  Copy,
  Check,
  RefreshCw,
  Server,
  Key,
  Globe,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ImageIcon,
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { testSupabaseStorageBucket, SUPABASE_BRAND_IMAGES_BUCKET } from '../../lib/supabase';

export const SupabaseModal: React.FC = () => {
  const {
    lang,
    isSupabaseModalOpen,
    setIsSupabaseModalOpen,
    isSupabaseConfigured,
    isSupabaseSyncing,
    supabaseStatus,
    syncWithSupabase,
    pushBrandsToSupabase,
    checkSupabaseHealth,
    brands,
  } = useLibrary();

  const [copied, setCopied] = useState(false);
  const [copiedStorageSql, setCopiedStorageSql] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [pushResult, setPushResult] = useState<string | null>(null);
  const [testingHealth, setTestingHealth] = useState(false);
  const [testingStorage, setTestingStorage] = useState(false);
  const [storageStatus, setStorageStatus] = useState<{
    tested: boolean;
    canUpload: boolean;
    message: string;
  } | null>(null);

  if (!isSupabaseModalOpen) return null;

  const storageSqlCode = `-- Storage Bucket Policies for '${SUPABASE_BRAND_IMAGES_BUCKET}'
-- Run this in Supabase Dashboard -> SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('${SUPABASE_BRAND_IMAGES_BUCKET}', '${SUPABASE_BRAND_IMAGES_BUCKET}', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow public read access to brand-images
DROP POLICY IF EXISTS "Allow public read brand-images" ON storage.objects;
CREATE POLICY "Allow public read brand-images" ON storage.objects
  FOR SELECT USING (bucket_id = '${SUPABASE_BRAND_IMAGES_BUCKET}');

-- Allow public upload / insert into brand-images
DROP POLICY IF EXISTS "Allow public upload brand-images" ON storage.objects;
CREATE POLICY "Allow public upload brand-images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = '${SUPABASE_BRAND_IMAGES_BUCKET}');

-- Allow public update in brand-images
DROP POLICY IF EXISTS "Allow public update brand-images" ON storage.objects;
CREATE POLICY "Allow public update brand-images" ON storage.objects
  FOR UPDATE USING (bucket_id = '${SUPABASE_BRAND_IMAGES_BUCKET}');

-- Allow public delete in brand-images
DROP POLICY IF EXISTS "Allow public delete brand-images" ON storage.objects;
CREATE POLICY "Allow public delete brand-images" ON storage.objects
  FOR DELETE USING (bucket_id = '${SUPABASE_BRAND_IMAGES_BUCKET}');`;

  const sqlCode = `-- 1. Create the 'brands' table with the required columns
CREATE TABLE IF NOT EXISTS public.brands (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies allowing full read & write for anon clients
DROP POLICY IF EXISTS "Allow public read access" ON public.brands;
CREATE POLICY "Allow public read access" ON public.brands
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert access" ON public.brands;
CREATE POLICY "Allow public insert access" ON public.brands
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update access" ON public.brands;
CREATE POLICY "Allow public update access" ON public.brands
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete access" ON public.brands;
CREATE POLICY "Allow public delete access" ON public.brands
  FOR DELETE USING (true);

${storageSqlCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sqlCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyStorageSql = async () => {
    try {
      await navigator.clipboard.writeText(storageSqlCode);
      setCopiedStorageSql(true);
      setTimeout(() => setCopiedStorageSql(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTestStorage = async () => {
    setTestingStorage(true);
    try {
      const res = await testSupabaseStorageBucket();
      setStorageStatus({
        tested: true,
        canUpload: res.canUpload,
        message: res.message,
      });
    } catch (e: any) {
      setStorageStatus({
        tested: true,
        canUpload: false,
        message: e?.message || 'Storage check error',
      });
    } finally {
      setTestingStorage(false);
    }
  };

  const handleTestHealth = async () => {
    setTestingHealth(true);
    await checkSupabaseHealth();
    setTestingHealth(false);
  };

  const handlePushBrands = async () => {
    setIsPushing(true);
    setPushResult(null);
    try {
      const res = await pushBrandsToSupabase();
      setPushResult(
        lang === 'ar'
          ? `تم رفع ${res.success} براند بنجاح (${res.failed} فشل)`
          : `Pushed ${res.success} brands successfully (${res.failed} failed)`
      );
    } catch (e: any) {
      setPushResult(e?.message || 'Push failed');
    } finally {
      setIsPushing(false);
    }
  };

  const isRTL = lang === 'ar';

  return (
    <div className="fixed inset-0 z-50 bg-[#050505]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#111111] border border-[#1F1F1F] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col my-8">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#1F1F1F] flex items-center justify-between bg-[#0A0A0A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Database className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>{isRTL ? 'إعداد وربط قاعدة بيانات Supabase' : 'Supabase Database Integration'}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  brands table
                </span>
              </h3>
              <p className="text-[11px] text-[#A1A1AA]">
                {isRTL
                  ? 'مزامنة براندات المكتبة مع جدول brands (id, name, image_url, created_at)'
                  : 'Sync your visual library brands with PostgreSQL table brands (id, name, image_url, created_at)'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSupabaseModalOpen(false)}
            className="p-1.5 rounded-lg text-[#52525B] hover:text-white hover:bg-[#1A1A1A] cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[72vh] overflow-y-auto">
          {/* Status Card */}
          <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {isSupabaseConfigured ? (
                  supabaseStatus?.tableExists ? (
                    <span className="relative flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                    </span>
                  ) : (
                    <span className="relative flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
                    </span>
                  )
                ) : (
                  <span className="inline-flex rounded-full h-3.5 w-3.5 bg-[#52525B]"></span>
                )}
              </div>
              <div>
                <div className="text-xs font-semibold text-white flex items-center gap-2">
                  <span>{isRTL ? 'حالة الاتصال' : 'Connection Status'}:</span>
                  {isSupabaseConfigured ? (
                    supabaseStatus?.tableExists ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isRTL ? 'متصل وجدول brands جاهز' : 'Connected & Table Ready'}
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1 font-mono">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {isRTL ? 'المتغيرات موجودة ولكن الجدول لم يتم إنشاؤه بعد' : 'Variables Set — Table Not Created Yet'}
                      </span>
                    )
                  ) : (
                    <span className="text-[#A1A1AA] font-mono">
                      {isRTL ? 'في انتظار إدخال المتغيرات (VITE_SUPABASE_URL & ANON_KEY)' : 'Awaiting VITE_SUPABASE_URL & ANON_KEY'}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#A1A1AA] mt-1">
                  {supabaseStatus?.message ||
                    (isSupabaseConfigured
                      ? isRTL
                        ? 'تم التعرف على إعدادات Supabase في بيئة التشغيل.'
                        : 'Supabase client initialized via environment variables.'
                      : isRTL
                      ? 'قم بإضافة المتغيرات في لوحة Settings الخاصة بالمشروع لتفعيل المزامنة المباشرة.'
                      : 'Configure the environment variables in the platform Settings to enable real-time cloud sync.')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={handleTestHealth}
                disabled={testingHealth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#161616] hover:bg-[#202020] border border-[#2D2D2D] text-xs text-[#A1A1AA] hover:text-white transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${testingHealth ? 'animate-spin' : ''}`} />
                <span>{isRTL ? 'فحص الاتصال' : 'Test Health'}</span>
              </button>

              {isSupabaseConfigured && (
                <button
                  onClick={() => syncWithSupabase()}
                  disabled={isSupabaseSyncing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs text-emerald-400 font-semibold transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isSupabaseSyncing ? 'animate-spin' : ''}`} />
                  <span>{isRTL ? 'مزامنة فورية' : 'Sync Now'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Environment Variables Guide */}
          <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F] space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Key className="w-3.5 h-3.5 text-violet-400" />
              <span>{isRTL ? 'متغيرات البيئة المطلوبة' : 'Required Environment Variables'}</span>
            </div>
            <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
              {isRTL
                ? 'عند إنشاء مشروعك على Supabase، انسخ الـ Project URL والـ Anon Key ثم ضعهم في إعدادات البيئة (Settings -> Secrets / Environment Variables):'
                : 'After creating your Supabase project, copy your Project URL and Anon Key into the environment configuration:'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-[#111111] border border-[#1F1F1F] flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <Globe className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                  <span className="text-white text-[11px]">VITE_SUPABASE_URL</span>
                </div>
                <span className="text-[10px] text-[#52525B]">https://*.supabase.co</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#111111] border border-[#1F1F1F] flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <Server className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-white text-[11px]">VITE_SUPABASE_ANON_KEY</span>
                </div>
                <span className="text-[10px] text-[#52525B]">eyJh...</span>
              </div>
            </div>
          </div>

          {/* Table Schema Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isRTL ? 'كود SQL لإنشاء جدول brands وسياسات التخزين' : 'SQL Script: "brands" Table + Storage Policies'}</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 text-xs font-semibold transition-all cursor-pointer shadow-[0_0_10px_rgba(124,58,237,0.2)]"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{isRTL ? 'تم النسخ!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isRTL ? 'نسخ كود SQL الكامل' : 'Copy All SQL'}</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <pre className="p-3.5 rounded-xl bg-[#080808] border border-[#1F1F1F] text-[11px] font-mono text-violet-200 overflow-x-auto max-h-44 leading-relaxed">
                {sqlCode}
              </pre>
            </div>
            <p className="text-[10px] text-[#52525B] flex items-center gap-1.5 pt-0.5">
              <HelpCircle className="w-3 h-3 text-[#71717A]" />
              {isRTL
                ? 'قم بلصق هذا الكود في Supabase Dashboard -> SQL Editor -> New Query ثم اضغط Run.'
                : 'Paste this query in your Supabase Dashboard -> SQL Editor -> New query, then click Run.'}
            </p>
          </div>

          {/* Dedicated Storage Bucket Card */}
          <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white flex items-center gap-2">
                    <span>{isRTL ? 'مستودع الصور (Storage Bucket):' : 'Storage Bucket:'}</span>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {SUPABASE_BRAND_IMAGES_BUCKET}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A1A1AA]">
                    {isRTL
                      ? 'يتم رفع صور البراندات عليه مباشرة وتخزين الرابط في عمود image_url'
                      : 'Brand images are uploaded directly here and public URLs stored in the image_url column.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleTestStorage}
                  disabled={testingStorage}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#161616] hover:bg-[#202020] border border-[#2D2D2D] text-xs text-[#A1A1AA] hover:text-white transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${testingStorage ? 'animate-spin' : ''}`} />
                  <span>{isRTL ? 'فحص المستودع' : 'Test Bucket'}</span>
                </button>

                <button
                  onClick={handleCopyStorageSql}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  {copiedStorageSql ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">{isRTL ? 'تم النسخ!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>{isRTL ? 'نسخ SQL السياسات فقط' : 'Copy Storage SQL'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {storageStatus && (
              <div
                className={`p-2.5 rounded-lg border text-xs font-mono flex items-center gap-2 ${
                  storageStatus.canUpload
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                    : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
                }`}
              >
                {storageStatus.canUpload ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <span>{storageStatus.message}</span>
              </div>
            )}
          </div>

          {/* Push Existing Brands (If Configured) */}
          {isSupabaseConfigured && (
            <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-white flex items-center gap-2">
                  <UploadCloud className="w-3.5 h-3.5 text-violet-400" />
                  <span>{isRTL ? 'رفع براندات المكتبة الحالية إلى Supabase' : 'Seed Supabase with Current Brands'}</span>
                </div>
                <p className="text-[11px] text-[#A1A1AA] mt-0.5">
                  {isRTL
                    ? `لديك حاليًا ${brands.length} براند في المكتبة. يمكنك رفعها دفعة واحدة إلى جدول brands.`
                    : `You currently have ${brands.length} brands in your visual library. Seed them to the Supabase table.`}
                </p>
                {pushResult && (
                  <p className="text-[11px] text-emerald-400 font-mono mt-1">{pushResult}</p>
                )}
              </div>

              <button
                onClick={handlePushBrands}
                disabled={isPushing}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50 shrink-0 shadow-[0_0_15px_rgba(124,58,237,0.35)]"
              >
                <UploadCloud className={`w-3.5 h-3.5 ${isPushing ? 'animate-bounce' : ''}`} />
                <span>{isPushing ? (isRTL ? 'جارٍ الرفع...' : 'Pushing...') : (isRTL ? 'رفع البراندات الآن' : 'Push Brands')}</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#1F1F1F] flex items-center justify-between bg-[#0A0A0A]">
          <div className="text-[11px] text-[#52525B]">
            {isRTL ? 'الملف supabase_schema.sql متوفر في جذر المشروع' : 'supabase_schema.sql is available in project root'}
          </div>

          <button
            onClick={() => setIsSupabaseModalOpen(false)}
            className="px-5 py-2 rounded-full bg-[#1A1A1A] hover:bg-[#252525] text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            {isRTL ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
