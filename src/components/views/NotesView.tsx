import React, { useState } from 'react';
import { FileText, Save, Check } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

export const NotesView: React.FC = () => {
  const { t, activeBrand, updateBrand } = useLibrary();
  const [notes, setNotes] = useState(activeBrand?.brandCore?.notes || '');
  const [saved, setSaved] = useState(false);

  if (!activeBrand) return null;

  const handleSave = () => {
    updateBrand(activeBrand.id, {
      brandCore: {
        ...activeBrand.brandCore,
        notes,
      },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            <span>Creative Notes & Campaign Scratchpad</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Internal notes, upcoming launch mood ideas, and specific rules for {activeBrand.name}.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(168,85,247,0.35)] transition-all"
        >
          {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saved ? t.saved : t.save}</span>
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-[#12111a] border border-white/5 space-y-4">
        <textarea
          rows={14}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write production guidelines, model casting specifications, lighting gear notes, or shoot dates..."
          className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-purple-500/60 font-sans leading-relaxed resize-none"
        />
        <div className="text-[11px] text-neutral-500 flex items-center justify-between">
          <span>Markdown notes auto-persisted locally</span>
          <span>{notes.length} characters</span>
        </div>
      </div>
    </div>
  );
};
