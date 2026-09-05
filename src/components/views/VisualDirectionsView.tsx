import React, { useState } from 'react';
import {
  Plus,
  Sparkles,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Edit,
  Trash2,
  Copy,
  Check,
  Image as ImageIcon,
  Maximize2 } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { VisualAnalysis } from '../../types';

export const VisualDirectionsView: React.FC = () => {
  const {
    t,
    activeBrand,
    directions,
    analyses,
    selectedDirectionId,
    setSelectedDirectionId,
    selectedAnalysisId,
    setSelectedAnalysisId,
    setIsAddDirectionModalOpen,
    setIsAddAnalysisModalOpen,
    setIsImportModalOpen,
    setEditingDirection,
    setEditingAnalysis,
    deleteDirection,
    deleteAnalysis,
    toggleStarDirection,
    toggleStarAnalysis,
  } = useLibrary();

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Filter directions for current brand
  const brandDirections = directions.filter(
    (d) => !activeBrand || d.brandId === activeBrand.id
  );

  // Active Direction
  const currentDirection = directions.find((d) => d.id === selectedDirectionId) || null;

  // Analyses for current direction
  const directionAnalyses = analyses.filter(
    (a) => currentDirection && a.directionId === currentDirection.id
  );

  // Active Analysis
  const currentAnalysis = analyses.find((a) => a.id === selectedAnalysisId) || directionAnalyses[0] || null;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const copyFullAnalysisPrompt = (ana: VisualAnalysis) => {
    const promptText = `VISUAL ANALYSIS & PROMPT SPECIFICATION
Subject: ${ana.subject}
Visual Style: ${ana.visualStyle}
Composition: ${ana.composition}
Camera Angle: ${ana.camera}
Lens & Perspective: ${ana.lensPerspective}
Lighting: ${ana.lighting}
Color Palette: ${ana.colorPalette}
Environment: ${ana.environment}
Materials: ${ana.materials}
Styling: ${ana.styling}
Mood: ${ana.mood}
Photography: ${ana.photography}
Useful Elements: ${ana.usefulElements}
Things to Avoid: ${ana.avoid}`;

    copyToClipboard(promptText, 'fullAnalysis');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {currentDirection && (
            <button
              onClick={() => {
                setSelectedDirectionId(null);
                setSelectedAnalysisId(null);
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 transition-colors"
              title="Back to all directions"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>
                {currentDirection ? currentDirection.name : t.visualDirections}
              </span>
              {currentDirection && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950/70 text-purple-300 border border-purple-500/30">
                  {currentDirection.subtitle}
                </span>
              )}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              {currentDirection
                ? `${directionAnalyses.length} ${t.analysesCount} for this aesthetic direction.`
                : `Organize multiple visual styles for ${activeBrand?.name || 'this brand'}.`}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#111111] hover:bg-violet-600/20 text-[#A1A1AA] hover:text-white border border-[#1F1F1F] hover:border-violet-500/40 text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>{t.importAnalysis}</span>
          </button>

          {currentDirection ? (
            <button
              onClick={() => setIsAddAnalysisModalOpen(true)}
              className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-[0_0_20px_rgba(124,58,237,0.3)] flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{t.addAnalysis}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAddDirectionModalOpen(true)}
              className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-[0_0_20px_rgba(124,58,237,0.3)] flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{t.addVisualDirection}</span>
            </button>
          )}
        </div>
      </div>

      {/* Case 1: Direction is selected -> Show analyses split-pane */}
      {currentDirection ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Analyses list for this direction (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-[#A1A1AA] px-1">
              <span>{t.analysesCount} ({directionAnalyses.length})</span>
              <button
                onClick={() => setIsAddAnalysisModalOpen(true)}
                className="text-violet-400 hover:underline transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
            </div>

            {directionAnalyses.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#111111] border border-[#1F1F1F] text-center space-y-3">
                <p className="text-xs text-[#A1A1AA]">
                  {t.noAnalyses}
                </p>
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-full bg-violet-600 text-white text-xs font-bold shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                >
                  {t.importAnalysis}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {directionAnalyses.map((ana) => {
                  const isSelected = currentAnalysis?.id === ana.id;
                  return (
                    <div
                      key={ana.id}
                      onClick={() => setSelectedAnalysisId(ana.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                        isSelected
                          ? 'bg-violet-600/10 border-l-2 rtl:border-l-0 rtl:border-r-2 border-violet-500 shadow-[0_0_15px_rgba(124,58,237,0.2)]'
                          : 'bg-[#111111] border-[#1F1F1F] hover:border-violet-500/30 hover:bg-[#161616]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors">
                          {ana.title}
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStarAnalysis(ana.id);
                          }}
                          className="text-[#52525B] hover:text-violet-400 p-0.5"
                        >
                          {ana.starred ? (
                            <BookmarkCheck className="w-3.5 h-3.5 text-violet-400 fill-violet-400" />
                          ) : (
                            <Bookmark className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <p className="text-[11px] text-[#A1A1AA] line-clamp-2 mt-1">
                        {ana.visualStyle}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-[#52525B] mt-2">
                        <span className="truncate max-w-[150px]">{ana.camera}</span>
                        {ana.references?.length > 0 && (
                          <span className="text-violet-400 flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" />
                            {ana.references.length}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Detailed 14-field Analysis View (8 cols) */}
          <div className="lg:col-span-8">
            {currentAnalysis ? (
              <div className="p-6 rounded-2xl bg-[#111111] border border-[#1F1F1F] space-y-6">
                {/* Header with Title and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1F1F1F]">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {currentAnalysis.title}
                    </h3>
                    <span className="text-xs text-violet-400">
                      Visual Direction: {currentDirection.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyFullAnalysisPrompt(currentAnalysis)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white border border-violet-500/40 text-xs font-semibold transition-all cursor-pointer shadow-sm"
                      title="Copy full analysis into AI prompt format"
                    >
                      {copiedField === 'fullAnalysis' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {copiedField === 'fullAnalysis' ? t.copied : 'Copy for AI'}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingAnalysis(currentAnalysis);
                        setIsAddAnalysisModalOpen(true);
                      }}
                      className="p-1.5 rounded-full bg-[#1A1A1A] hover:bg-white/10 text-[#A1A1AA] border border-[#2D2D2D] hover:text-white transition-colors cursor-pointer"
                      title={t.edit}
                    >
                      <Edit className="w-3.5 h-3.5 text-violet-400" />
                    </button>

                    <button
                      onClick={() => deleteAnalysis(currentAnalysis.id)}
                      className="p-1.5 rounded-full bg-[#1A1A1A] hover:bg-red-500/20 text-[#A1A1AA] border border-[#2D2D2D] hover:text-red-400 transition-colors cursor-pointer"
                      title={t.delete}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* References Image Gallery */}
                {currentAnalysis.references && currentAnalysis.references.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#52525B] uppercase tracking-widest">
                      {t.references} ({currentAnalysis.references.length})
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {currentAnalysis.references.map((url, i) => (
                        <div
                          key={i}
                          onClick={() => setLightboxImage(url)}
                          className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-[#0A0A0A] border border-[#1F1F1F] hover:border-violet-500/50 cursor-pointer transition-all"
                        >
                          <img
                            src={url}
                            alt={`Reference ${i + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-[#050505]/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                            <Maximize2 className="w-4 h-4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detailed Analysis 14 Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Visual Style */}
                  <div className="p-3.5 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F] space-y-1">
                    <span className="font-semibold text-violet-400 block">
                      {t.visualStyle}
                    </span>
                    <p className="text-[#E0E0E0] leading-relaxed">
                      {currentAnalysis.visualStyle || '—'}
                    </p>
                  </div>

                  {/* Composition */}
                  <div className="p-3.5 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F] space-y-1">
                    <span className="font-semibold text-violet-300 block">
                      {t.composition}
                    </span>
                    <p className="text-[#E0E0E0] leading-relaxed">
                      {currentAnalysis.composition || '—'}
                    </p>
                  </div>

                  {/* Camera Angle */}
                  <div className="p-3.5 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F] space-y-1">
                    <span className="font-semibold text-violet-400 block">
                      {t.camera}
                    </span>
                    <p className="text-[#E0E0E0] leading-relaxed">
                      {currentAnalysis.camera || '—'}
                    </p>
                  </div>

                  {/* Lens / Perspective */}
                  <div className="p-3.5 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F] space-y-1">
                    <span className="font-semibold text-cyan-400 block">
                      {t.lensPerspective}
                    </span>
                    <p className="text-[#E0E0E0] leading-relaxed">
                      {currentAnalysis.lensPerspective || '—'}
                    </p>
                  </div>

                  {/* Lighting */}
                  <div className="p-3.5 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F] space-y-1">
                    <span className="font-semibold text-amber-400 block">
                      {t.lighting}
                    </span>
                    <p className="text-[#E0E0E0] leading-relaxed">
                      {currentAnalysis.lighting || '—'}
                    </p>
                  </div>

                  {/* Color Palette */}
                  <div className="p-3.5 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F] space-y-1">
                    <span className="font-semibold text-pink-400 block">
                      {t.colorPalette}
                    </span>
                    <p className="text-[#E0E0E0] leading-relaxed">
                      {currentAnalysis.colorPalette || '—'}
                    </p>
                  </div>

                  {/* Environment */}
                  <div className="p-3.5 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F] space-y-1">
                    <span className="font-semibold text-violet-300 block">
                      {t.environment}
                    </span>
                    <p className="text-[#E0E0E0] leading-relaxed">
                      {currentAnalysis.environment || '—'}
                    </p>
                  </div>

                  {/* Materials */}
                  <div className="p-3.5 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F] space-y-1">
                    <span className="font-semibold text-teal-400 block">
                      {t.materials}
                    </span>
                    <p className="text-[#E0E0E0] leading-relaxed">
                      {currentAnalysis.materials || '—'}
                    </p>
                  </div>

                  {/* Subject */}
                  <div className="p-3.5 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F] space-y-1">
                    <span className="font-semibold text-rose-400 block">
                      {t.subject}
                    </span>
                    <p className="text-[#E0E0E0] leading-relaxed">
                      {currentAnalysis.subject || '—'}
                    </p>
                  </div>

                  {/* Styling */}
                  <div className="p-3.5 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F] space-y-1">
                    <span className="font-semibold text-yellow-400 block">
                      {t.styling}
                    </span>
                    <p className="text-[#E0E0E0] leading-relaxed">
                      {currentAnalysis.styling || '—'}
                    </p>
                  </div>

                  {/* Mood */}
                  <div className="p-3.5 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F] space-y-1">
                    <span className="font-semibold text-emerald-400 block">
                      {t.mood}
                    </span>
                    <p className="text-[#E0E0E0] leading-relaxed">
                      {currentAnalysis.mood || '—'}
                    </p>
                  </div>

                  {/* Photography */}
                  <div className="p-3.5 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F] space-y-1">
                    <span className="font-semibold text-blue-400 block">
                      {t.photography}
                    </span>
                    <p className="text-[#E0E0E0] leading-relaxed">
                      {currentAnalysis.photography || '—'}
                    </p>
                  </div>

                  {/* Useful Elements */}
                  <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                    <span className="font-semibold text-emerald-400 block">
                      {t.usefulElements}
                    </span>
                    <p className="text-[#E0E0E0] leading-relaxed">
                      {currentAnalysis.usefulElements || '—'}
                    </p>
                  </div>

                  {/* Things to Avoid */}
                  <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/30 space-y-1">
                    <span className="font-semibold text-red-400 block">
                      {t.avoid}
                    </span>
                    <p className="text-[#E0E0E0] leading-relaxed">
                      {currentAnalysis.avoid || '—'}
                    </p>
                  </div>
                </div>

                {/* Notes */}
                {currentAnalysis.notes && (
                  <div className="p-3.5 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F] text-xs space-y-1">
                    <span className="font-bold text-[#52525B] block uppercase tracking-wider text-[10px]">
                      {t.notes}
                    </span>
                    <p className="text-[#A1A1AA] leading-relaxed">
                      {currentAnalysis.notes}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 rounded-2xl bg-[#111111] border border-[#1F1F1F] text-center text-[#52525B] text-xs">
                Select an analysis to view details
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Case 2: Grid of all Visual Directions */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {brandDirections.map((dir, idx) => (
            <div
              key={dir.id}
              onClick={() => setSelectedDirectionId(dir.id)}
              className="group rounded-2xl bg-[#111111] border border-[#1F1F1F] hover:border-violet-500/50 p-3 transition-all cursor-pointer hover:shadow-[0_0_24px_rgba(124,58,237,0.25)] flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#0A0A0A] mb-3">
                  <img
                    src={dir.image || undefined}
                    alt={dir.name}
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent z-10" />

                  <div className="absolute top-2.5 left-2.5 z-20">
                    <span className="text-[9px] font-mono font-bold tracking-wider text-violet-400 bg-[#050505]/70 px-1.5 py-0.5 rounded border border-violet-500/30 uppercase">
                      0{idx + 1}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStarDirection(dir.id);
                    }}
                    className="absolute top-2.5 right-2.5 z-20 p-1.5 rounded-lg bg-[#050505]/70 hover:bg-[#050505] text-[#A1A1AA] hover:text-violet-300 transition-colors border border-white/5"
                  >
                    {dir.starred ? (
                      <BookmarkCheck className="w-4 h-4 text-violet-400 fill-violet-400" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="space-y-1 px-1">
                  <h3 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                    {dir.name}
                  </h3>
                  <p className="text-xs text-[#A1A1AA]">
                    {dir.subtitle}
                  </p>
                </div>
              </div>

              <div className="pt-3 px-1 border-t border-[#1F1F1F] mt-3 flex items-center justify-between text-xs">
                <span className="text-violet-400 font-medium">
                  {dir.analysesCount || 0} {t.analysesCount}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingDirection(dir);
                      setIsAddDirectionModalOpen(true);
                    }}
                    className="p-1 rounded-full hover:bg-white/10 text-[#52525B] hover:text-white transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDirection(dir.id);
                    }}
                    className="p-1 rounded-full hover:bg-red-500/20 text-[#52525B] hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Direction card */}
          <div
            onClick={() => setIsAddDirectionModalOpen(true)}
            className="rounded-2xl border-2 border-dashed border-[#1F1F1F] hover:border-violet-500/40 hover:bg-violet-600/10 p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[260px] group"
          >
            <div className="w-12 h-12 rounded-full bg-violet-600/20 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform mb-3 border border-violet-500/30">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">
              {t.addVisualDirection}
            </span>
            <span className="text-xs text-[#52525B] mt-1">
              Add a new aesthetic stream for this brand
            </span>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden border border-purple-500/30">
            <img
              src={lightboxImage}
              alt="Reference"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/90"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
