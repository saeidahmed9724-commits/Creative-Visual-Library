import React, { useState, useEffect } from 'react';
import { X, Camera } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

export const CameraAngleModal: React.FC = () => {
  const {
    t,
    isAddAngleModalOpen,
    setIsAddAngleModalOpen,
    editingAngle,
    setEditingAngle,
    addCameraAngle,
    updateCameraAngle,
  } = useLibrary();

  const [name, setName] = useState('');
  const [shotType, setShotType] = useState('Medium Shot');
  const [diagramType, setDiagramType] = useState<'45-degree' | 'low-angle' | 'top-down' | 'close-up'>('45-degree');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    if (editingAngle) {
      setName(editingAngle.name);
      setShotType(editingAngle.shotType);
      setDiagramType(editingAngle.diagramType || '45-degree');
      setDescription(editingAngle.description);
      setPrompt(editingAngle.prompt);
    } else {
      setName('');
      setShotType('Medium Shot');
      setDiagramType('45-degree');
      setDescription('');
      setPrompt('');
    }
  }, [editingAngle, isAddAngleModalOpen]);

  if (!isAddAngleModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !prompt.trim()) return;

    if (editingAngle) {
      updateCameraAngle(editingAngle.id, {
        name,
        shotType,
        diagramType,
        description,
        prompt,
      });
    } else {
      addCameraAngle({
        name,
        shotType,
        diagramType,
        description,
        prompt,
        starred: false,
      });
    }

    setIsAddAngleModalOpen(false);
    setEditingAngle(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-[#13111e] border border-purple-500/30 shadow-2xl overflow-hidden flex flex-col my-8">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <Camera className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">
              {editingAngle ? t.edit : t.addNewAngle}
            </h3>
          </div>
          <button
            onClick={() => {
              setIsAddAngleModalOpen(false);
              setEditingAngle(null);
            }}
            className="p-1 rounded-lg text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="text-neutral-300 font-semibold block mb-1">
              Angle Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 45° Side Angle"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-neutral-300 font-semibold block mb-1">
                Shot Type
              </label>
              <input
                type="text"
                value={shotType}
                onChange={(e) => setShotType(e.target.value)}
                placeholder="e.g. Medium Shot, Hero Shot"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
              />
            </div>

            <div>
              <label className="text-neutral-300 font-semibold block mb-1">
                Diagram Schematic
              </label>
              <select
                value={diagramType}
                onChange={(e) =>
                  setDiagramType(
                    e.target.value as '45-degree' | 'low-angle' | 'top-down' | 'close-up'
                  )
                }
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
              >
                <option value="45-degree">45° Side Angle</option>
                <option value="low-angle">Low Angle (Hero)</option>
                <option value="top-down">Top Down (Flat Lay)</option>
                <option value="close-up">Close-up (Detail)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-neutral-300 font-semibold block mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Visual description of the angle and purpose..."
              className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500/60 resize-none"
            />
          </div>

          <div>
            <label className="text-neutral-300 font-semibold block mb-1">
              Prompt Keyword Trigger *
            </label>
            <textarea
              rows={3}
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. 45-degree side portrait angle, dynamic diagonal perspective..."
              className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-purple-200 font-mono focus:outline-none focus:border-purple-500/60 resize-none"
            />
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsAddAngleModalOpen(false);
                setEditingAngle(null);
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
