import React from 'react';
import { Star, Sparkles, Compass, Camera, Lightbulb, FileText } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

export const StarredView: React.FC = () => {
  const {
    t,
    directions,
    analyses,
    prompts,
    cameraAngles,
    creativeReferences,
    setSelectedDirectionId,
    setBrandSubTab,
    setActiveNav,
    setEditingPrompt,
  } = useLibrary();

  const starredDirections = directions.filter((d) => d.starred);
  const starredAnalyses = analyses.filter((a) => a.starred);
  const starredPrompts = prompts.filter((p) => p.starred);
  const starredAngles = cameraAngles.filter((a) => a.starred);
  const starredCreativeRefs = creativeReferences.filter((r) => r.starred);

  const totalStarred =
    starredDirections.length +
    starredAnalyses.length +
    starredPrompts.length +
    starredAngles.length +
    starredCreativeRefs.length;

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          <span>{t.starred}</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950/70 text-purple-300 border border-purple-500/30">
            {totalStarred} Bookmarked Items
          </span>
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Your bookmarked directions, analyses, prompts, and camera angles for fast access.
        </p>
      </div>

      {totalStarred === 0 ? (
        <div className="p-12 rounded-2xl bg-[#12111a] border border-white/5 text-center text-neutral-400 text-xs">
          No starred items yet. Click the bookmark icon on any card to save it here.
        </div>
      ) : (
        <div className="space-y-8">
          {/* Starred Directions */}
          {starredDirections.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-neutral-300 flex items-center gap-2">
                <Compass className="w-4 h-4 text-purple-400" />
                <span>{t.visualDirections} ({starredDirections.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {starredDirections.map((dir) => (
                  <div
                    key={dir.id}
                    onClick={() => {
                      setSelectedDirectionId(dir.id);
                      setBrandSubTab('visual-directions');
                      setActiveNav('dashboard');
                    }}
                    className="p-2.5 rounded-xl bg-[#12111a] border border-white/5 hover:border-purple-500/30 cursor-pointer group"
                  >
                    <div className="aspect-[4/3] rounded-lg overflow-hidden mb-2">
                      <img
                        src={dir.image}
                        alt={dir.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-xs font-bold text-white block truncate">
                      {dir.name}
                    </span>
                    <span className="text-[10px] text-neutral-400 block truncate">
                      {dir.subtitle}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Starred Prompts */}
          {starredPrompts.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-neutral-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>{t.promptLibrary} ({starredPrompts.length})</span>
              </h3>
              <div className="space-y-2">
                {starredPrompts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setEditingPrompt(p);
                      setActiveNav('promptLibrary');
                    }}
                    className="p-3 rounded-xl bg-[#12111a] border border-white/5 hover:border-purple-500/30 flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-medium text-white group-hover:text-purple-300">
                        {p.name}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/20">
                      {p.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Starred Camera Angles */}
          {starredAngles.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-neutral-300 flex items-center gap-2">
                <Camera className="w-4 h-4 text-purple-400" />
                <span>{t.cameraAngles} ({starredAngles.length})</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {starredAngles.map((angle) => (
                  <div
                    key={angle.id}
                    onClick={() => setActiveNav('cameraAngles')}
                    className="p-3 rounded-xl bg-[#12111a] border border-white/5 hover:border-purple-500/30 cursor-pointer"
                  >
                    <span className="text-xs font-bold text-white block truncate">
                      {angle.name}
                    </span>
                    <span className="text-[10px] text-neutral-400 block truncate">
                      {angle.shotType}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
