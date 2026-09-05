import React, { useRef, useState } from 'react';
import { X, Download, Upload, RotateCcw, Settings, Check, AlertTriangle, Cloud, CloudOff, HardDrive, Loader2, Languages } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

export const BackupModal: React.FC = () => {
  const {
    t,
    lang,
    setLang,
    isBackupModalOpen,
    setIsBackupModalOpen,
    exportLibraryJSON,
    importLibraryJSON,
    resetToDemoData,
    lastSavedAt,
    cloudSyncState,
    pushLibraryToCloud,
    isSupabaseConfigured,
    brands,
    directions,
    analyses,
    products,
    prompts,
    cameraAngles,
    creativeReferences,
    galleryReferences,
  } = useLibrary();

  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pushing, setPushing] = useState(false);

  if (!isBackupModalOpen) return null;

  const total =
    brands.length +
    directions.length +
    analyses.length +
    products.length +
    prompts.length +
    cameraAngles.length +
    creativeReferences.length +
    galleryReferences.length;

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importLibraryJSON(String(reader.result || ''));
      setMessage({ ok, text: ok ? t.importSuccess : t.importFailed });
    };
    reader.readAsText(file);
  };

  const handlePush = async () => {
    setPushing(true);
    const ok = await pushLibraryToCloud();
    setMessage({ ok, text: ok ? t.syncSuccess : t.cloudSyncPending });
    setPushing(false);
  };

  const close = () => {
    setIsBackupModalOpen(false);
    setMessage(null);
  };

  const cloudLabel =
    cloudSyncState === 'synced'
      ? t.cloudSynced
      : cloudSyncState === 'syncing'
        ? t.savingToSupabase
        : t.cloudSyncPending;

  const stats: { label: string; n: number }[] = [
    { label: t.brands, n: brands.length },
    { label: t.visualDirections, n: directions.length },
    { label: t.analysesCount, n: analyses.length },
    { label: t.products, n: products.length },
    { label: t.promptLibrary, n: prompts.length },
    { label: t.cameraAngles, n: cameraAngles.length },
    { label: t.creativeReferences, n: creativeReferences.length },
    { label: t.references, n: galleryReferences.length },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0F0E14] border border-violet-500/30 shadow-2xl overflow-hidden flex flex-col my-8 max-h-[92vh]">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600/30 border border-violet-400/40 flex items-center justify-center text-violet-300">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{t.backupTitle}</h3>
              <p className="text-[11px] text-neutral-400">{t.localStorageNote}{lastSavedAt ? ` • ${t.lastSaved}: ${new Date(lastSavedAt).toLocaleTimeString()}` : ''}</p>
            </div>
          </div>
          <button onClick={close} className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 overflow-y-auto">
          <p className="text-xs text-neutral-400 leading-relaxed">{t.backupDesc}</p>

          {/* Status cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-[#141318] border border-white/5 flex items-start gap-3">
              <HardDrive className="w-5 h-5 text-emerald-400 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-white">{t.localStorageNote}</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  {total} {t.itemsCount}
                </p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#141318] border border-white/5 flex items-start gap-3">
              {cloudSyncState === 'synced' ? (
                <Cloud className="w-5 h-5 text-emerald-400 mt-0.5" />
              ) : cloudSyncState === 'syncing' ? (
                <Loader2 className="w-5 h-5 text-violet-400 mt-0.5 animate-spin" />
              ) : (
                <CloudOff className="w-5 h-5 text-amber-400 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white">Supabase</p>
                <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">{cloudLabel}</p>
                {isSupabaseConfigured && (
                  <button
                    onClick={handlePush}
                    disabled={pushing}
                    className="mt-2 text-[11px] font-semibold text-violet-300 hover:text-white disabled:opacity-50"
                  >
                    {pushing ? t.savingToSupabase : t.saveToSupabaseNow}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {stats.map((s) => (
              <div key={s.label} className="p-3 rounded-lg bg-black/30 border border-white/5">
                <p className="text-lg font-bold text-white leading-none">{s.n}</p>
                <p className="text-[10px] text-neutral-500 mt-1 truncate">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Language */}
          <div className="p-4 rounded-xl bg-[#141318] border border-white/5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-violet-300" />
              <p className="text-xs font-semibold text-white">{t.language}</p>
            </div>
            <div className="flex rounded-lg overflow-hidden border border-white/10">
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${lang === 'en' ? 'bg-violet-600 text-white' : 'bg-black/30 text-neutral-400 hover:text-white'}`}
              >
                English
              </button>
              <button
                onClick={() => setLang('ar')}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${lang === 'ar' ? 'bg-violet-600 text-white' : 'bg-black/30 text-neutral-400 hover:text-white'}`}
              >
                العربية
              </button>
            </div>
          </div>

          {/* Export */}
          <div className="p-4 rounded-xl bg-[#141318] border border-white/5 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <p className="text-xs font-semibold text-white">{t.exportBackup}</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">{t.exportDesc}</p>
            </div>
            <button
              onClick={exportLibraryJSON}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors"
            >
              <Download className="w-4 h-4" />
              {t.exportBackup}
            </button>
          </div>

          {/* Import */}
          <div className="p-4 rounded-xl bg-[#141318] border border-white/5 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <p className="text-xs font-semibold text-white">{t.importBackup}</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">{t.importDesc}</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = '';
              }}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-colors"
            >
              <Upload className="w-4 h-4" />
              {t.chooseFile}
            </button>
          </div>

          {/* Danger */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <p className="text-xs font-semibold text-rose-200 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                {t.dangerZone}
              </p>
              <p className="text-[11px] text-rose-200/60 mt-0.5">{t.resetDesc}</p>
            </div>
            <button
              onClick={() => {
                if (window.confirm(t.confirmReset)) {
                  resetToDemoData();
                  setMessage({ ok: true, text: t.saved });
                }
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-200 text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              {t.resetDemoData}
            </button>
          </div>

          {message && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg text-xs font-medium ${
                message.ok ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-amber-500/10 border border-amber-500/30 text-amber-200'
              }`}
            >
              {message.ok ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
