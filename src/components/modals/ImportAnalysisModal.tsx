import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  Check,
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { parseChatGPTAnalysis, ParsedAnalysisFields } from '../../utils/parser';

export const ImportAnalysisModal: React.FC = () => {
  const {
    t,
    isImportModalOpen,
    setIsImportModalOpen,
    brands,
    directions,
    activeBrandId,
    selectedDirectionId,
    addAnalysis,
    setSelectedDirectionId,
    setSelectedAnalysisId,
    setBrandSubTab,
  } = useLibrary();

  const [rawText, setRawText] = useState('');
  const [targetBrandId, setTargetBrandId] = useState(activeBrandId || brands[0]?.id || '');
  const [targetDirId, setTargetDirId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [referenceUrls, setReferenceUrls] = useState('');

  const [parsedFields, setParsedFields] = useState<ParsedAnalysisFields>({
    visualStyle: '',
    composition: '',
    camera: '',
    lensPerspective: '',
    lighting: '',
    colorPalette: '',
    environment: '',
    materials: '',
    subject: '',
    styling: '',
    mood: '',
    photography: '',
    usefulElements: '',
    avoid: '',
    notes: '',
  });

  const [step, setStep] = useState<'paste' | 'preview'>('paste');

  // Available directions for selected brand
  const brandDirections = directions.filter((d) => d.brandId === targetBrandId);

  useEffect(() => {
    if (selectedDirectionId) {
      setTargetDirId(selectedDirectionId);
    } else if (brandDirections.length > 0) {
      setTargetDirId(brandDirections[0].id);
    }
  }, [targetBrandId, selectedDirectionId, brandDirections.length]);

  if (!isImportModalOpen) return null;

  const handleParse = () => {
    const result = parseChatGPTAnalysis(rawText);
    setParsedFields(result);
    if (result.title) {
      setTitle(result.title);
    } else if (!title) {
      setTitle('Editorial Campaign Analysis ' + (brandDirections.length + 1));
    }
    setStep('preview');
  };

  const handleSave = () => {
    if (!targetDirId) return;

    const urls = referenceUrls
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    const newAnalysis = addAnalysis({
      brandId: targetBrandId,
      directionId: targetDirId,
      title: title.trim() || 'Imported Analysis',
      visualStyle: parsedFields.visualStyle,
      composition: parsedFields.composition,
      camera: parsedFields.camera,
      lensPerspective: parsedFields.lensPerspective,
      lighting: parsedFields.lighting,
      colorPalette: parsedFields.colorPalette,
      environment: parsedFields.environment,
      materials: parsedFields.materials,
      subject: parsedFields.subject,
      styling: parsedFields.styling,
      mood: parsedFields.mood,
      photography: parsedFields.photography,
      usefulElements: parsedFields.usefulElements,
      avoid: parsedFields.avoid,
      notes: parsedFields.notes,
      references: urls.length > 0 ? urls : [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      ],
      starred: false,
    });

    setSelectedDirectionId(targetDirId);
    setSelectedAnalysisId(newAnalysis.id);
    setBrandSubTab('visual-directions');
    setIsImportModalOpen(false);
    // Reset modal
    setRawText('');
    setStep('paste');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050505]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#111111] border border-[#1F1F1F] hover:border-violet-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col my-8">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#1F1F1F] flex items-center justify-between bg-[#0A0A0A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-[0_0_15px_rgba(124,58,237,0.2)]">
              <Sparkles className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {t.importModalTitle}
              </h3>
              <p className="text-[11px] text-[#A1A1AA]">
                {t.importModalSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsImportModalOpen(false)}
            className="p-1.5 rounded-lg text-[#52525B] hover:text-white hover:bg-[#1A1A1A] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[72vh] overflow-y-auto">
          {/* Target destination row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0A0A0A] p-3.5 rounded-xl border border-[#1F1F1F]">
            <div>
              <label className="text-xs font-semibold text-[#A1A1AA] block mb-1.5">
                {t.targetBrand}
              </label>
              <select
                value={targetBrandId}
                onChange={(e) => setTargetBrandId(e.target.value)}
                className="w-full bg-[#111111] border border-[#1F1F1F] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/60"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#A1A1AA] block mb-1.5">
                {t.targetDirection}
              </label>
              <select
                value={targetDirId}
                onChange={(e) => setTargetDirId(e.target.value)}
                className="w-full bg-[#111111] border border-[#1F1F1F] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/60"
              >
                {brandDirections.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.subtitle})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {step === 'paste' ? (
            /* STEP 1: Paste Text */
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#A1A1AA] block mb-1.5">
                  Paste ChatGPT / AI Output
                </label>
                <textarea
                  rows={12}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder={t.pastePlaceholder}
                  className="w-full p-4 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F] text-xs text-violet-300 placeholder-[#52525B] focus:outline-none focus:border-violet-500/60 font-mono resize-none leading-relaxed"
                />
              </div>

              {/* Sample Quick Fill Button */}
              <div className="flex items-center justify-between text-xs text-[#52525B]">
                <button
                  type="button"
                  onClick={() => {
                    setRawText(`VISUAL STYLE:
Haute couture editorial portrait with cinematic gloss and rich obsidian atmosphere

COMPOSITION:
Asymmetric portrait rule of thirds, 45 degree angle, negative space on right

LIGHTING:
Large diffused beauty dish key light with dramatic violet kicker rim light

COLOR PALETTE:
Deep plum, obsidian noir, champagne ivory, muted lilac

CAMERA:
Medium portrait shot, eye level

LENS / PERSPECTIVE:
85mm f/1.4 prime lens with shallow depth of field

ENVIRONMENT:
Luxury Parisian minimalist studio with subtle atmospheric haze

MATERIALS:
High gloss silk waves, brushed titanium accents, matte skin texture

SUBJECT:
High fashion female model with luscious dark wavy hair cascading over shoulder

STYLING:
Off-shoulder velvet plum blazer with minimalist gold architectural earring

MOOD:
Confident, mysterious, effortlessly opulent

USEFUL ELEMENTS:
Specular reflection highlight on silk hair strands, soft purple rim gradient

AVOID:
Flat flash, frizzy stray hair, over saturated neon tones, cluttered props`);
                  }}
                  className="text-violet-400 hover:text-violet-300 hover:underline transition-colors cursor-pointer"
                >
                  Insert Sample ChatGPT Analysis
                </button>
                <span>Rule-based parser • 100% Client-side</span>
              </div>
            </div>
          ) : (
            /* STEP 2: Review and Adjust Parsed Fields */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-purple-300">
                  {t.parsedPreview}
                </span>
                <button
                  onClick={() => setStep('paste')}
                  className="text-xs text-neutral-400 hover:text-white underline"
                >
                  ← Edit raw text
                </button>
              </div>

              {/* Title input */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  {t.analysisTitleLabel}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500/60 font-bold"
                  placeholder="e.g. 05 — Golden Hour Hair Movement"
                />
              </div>

              {/* Parsed Fields 2-col inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-neutral-400 block mb-1">{t.visualStyle}</label>
                  <textarea
                    rows={2}
                    value={parsedFields.visualStyle}
                    onChange={(e) =>
                      setParsedFields({ ...parsedFields, visualStyle: e.target.value })
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-purple-500/60"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">{t.composition}</label>
                  <textarea
                    rows={2}
                    value={parsedFields.composition}
                    onChange={(e) =>
                      setParsedFields({ ...parsedFields, composition: e.target.value })
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-purple-500/60"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">{t.camera}</label>
                  <input
                    type="text"
                    value={parsedFields.camera}
                    onChange={(e) =>
                      setParsedFields({ ...parsedFields, camera: e.target.value })
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500/60"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">{t.lensPerspective}</label>
                  <input
                    type="text"
                    value={parsedFields.lensPerspective}
                    onChange={(e) =>
                      setParsedFields({ ...parsedFields, lensPerspective: e.target.value })
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500/60"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">{t.lighting}</label>
                  <input
                    type="text"
                    value={parsedFields.lighting}
                    onChange={(e) =>
                      setParsedFields({ ...parsedFields, lighting: e.target.value })
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500/60"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">{t.colorPalette}</label>
                  <input
                    type="text"
                    value={parsedFields.colorPalette}
                    onChange={(e) =>
                      setParsedFields({ ...parsedFields, colorPalette: e.target.value })
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500/60"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">{t.subject}</label>
                  <input
                    type="text"
                    value={parsedFields.subject}
                    onChange={(e) =>
                      setParsedFields({ ...parsedFields, subject: e.target.value })
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500/60"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">{t.mood}</label>
                  <input
                    type="text"
                    value={parsedFields.mood}
                    onChange={(e) =>
                      setParsedFields({ ...parsedFields, mood: e.target.value })
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500/60"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">{t.usefulElements}</label>
                  <textarea
                    rows={2}
                    value={parsedFields.usefulElements}
                    onChange={(e) =>
                      setParsedFields({ ...parsedFields, usefulElements: e.target.value })
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-purple-500/60"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">{t.avoid}</label>
                  <textarea
                    rows={2}
                    value={parsedFields.avoid}
                    onChange={(e) =>
                      setParsedFields({ ...parsedFields, avoid: e.target.value })
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-purple-500/60"
                  />
                </div>
              </div>

              {/* Reference image URLs */}
              <div className="pt-2">
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  {t.uploadImages}
                </label>
                <input
                  type="text"
                  value={referenceUrls}
                  onChange={(e) => setReferenceUrls(e.target.value)}
                  placeholder="https://images.unsplash.com/..., https://..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500/60"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#1F1F1F] flex items-center justify-between bg-[#0A0A0A]">
          <button
            onClick={() => setIsImportModalOpen(false)}
            className="px-4 py-2 rounded-full text-xs text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
          >
            {t.cancel}
          </button>

          {step === 'paste' ? (
            <button
              onClick={handleParse}
              disabled={!rawText.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-bold shadow-[0_0_20px_rgba(124,58,237,0.35)] transition-all cursor-pointer"
            >
              <span>Parse & Map Fields</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(124,58,237,0.35)] transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{t.saveAnalysis}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
