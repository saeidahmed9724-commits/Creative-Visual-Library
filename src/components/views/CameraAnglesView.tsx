import React, { useState } from 'react';
import {
  Camera,
  Plus,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  Edit,
  Trash2 } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { CameraAngle } from '../../types';

export const CameraAnglesView: React.FC = () => {
  const {
    t,
    cameraAngles,
    setIsAddAngleModalOpen,
    setEditingAngle,
    deleteCameraAngle,
    toggleStarCameraAngle,
  } = useLibrary();

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyPrompt = (angle: CameraAngle) => {
    navigator.clipboard.writeText(angle.prompt);
    setCopiedId(angle.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{t.cameraAngles}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950/70 text-purple-300 border border-purple-500/30">
              {cameraAngles.length} Angles
            </span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Pre-defined perspectives, schematics, and lens prompts for precise framing.
          </p>
        </div>

        <button
          onClick={() => setIsAddAngleModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(168,85,247,0.35)] transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addNewAngle}</span>
        </button>
      </div>

      {/* Grid of Camera Angles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {cameraAngles.map((angle) => (
          <div
            key={angle.id}
            className="rounded-2xl bg-[#12111a] border border-white/5 hover:border-purple-500/30 p-4 flex flex-col justify-between transition-all group hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
          >
            <div>
              {/* Visual schematic diagram box */}
              <div className="aspect-video rounded-xl bg-black/60 border border-white/5 flex items-center justify-center p-4 mb-3 relative overflow-hidden group-hover:border-purple-500/30 transition-colors">
                {angle.diagramType === '45-degree' && (
                  <svg className="w-12 h-12 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="4" y="4" width="16" height="16" rx="3" strokeDasharray="3 3" />
                    <circle cx="12" cy="12" r="4" />
                    <line x1="12" y1="2" x2="12" y2="4" strokeWidth="2" />
                    <line x1="20" y1="12" x2="22" y2="12" strokeWidth="2" />
                  </svg>
                )}
                {angle.diagramType === 'low-angle' && (
                  <svg className="w-12 h-12 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="7" r="3.5" />
                    <path d="M4 22l8-11 8 11" strokeWidth="2" />
                    <line x1="12" y1="17" x2="12" y2="22" strokeDasharray="2 2" />
                  </svg>
                )}
                {angle.diagramType === 'top-down' && (
                  <svg className="w-12 h-12 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="8" />
                    <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
                    <path d="M12 2v2M12 20v2M2 12h2M20 12h2" strokeWidth="2" />
                  </svg>
                )}
                {angle.diagramType === 'close-up' && (
                  <svg className="w-12 h-12 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="8" strokeDasharray="3 3" />
                    <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.2" />
                    <path d="M9 12h6M12 9v6" strokeWidth="2" />
                  </svg>
                )}
                {!angle.diagramType && (
                  <Camera className="w-10 h-10 text-purple-400" />
                )}

                <button
                  onClick={() => toggleStarCameraAngle(angle.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 hover:bg-black/80 text-white/80 hover:text-purple-300 transition-colors"
                >
                  {angle.starred ? (
                    <BookmarkCheck className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
                  ) : (
                    <Bookmark className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Title & Shot Type */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                    {angle.name}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/20 font-medium">
                    {angle.shotType}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 line-clamp-2">
                  {angle.description}
                </p>
              </div>

              {/* Prompt snippet */}
              <div className="mt-3 p-2.5 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-purple-200/80 line-clamp-3">
                {angle.prompt}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-white/5 mt-3 flex items-center justify-between">
              <button
                onClick={() => handleCopyPrompt(angle)}
                className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                {copiedId === angle.id ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedId === angle.id ? t.copied : t.copyPrompt}</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditingAngle(angle);
                    setIsAddAngleModalOpen(true);
                  }}
                  className="p-1 rounded text-neutral-400 hover:text-white"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteCameraAngle(angle.id)}
                  className="p-1 rounded text-neutral-400 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
