import React, { useState, useRef } from 'react';
import { AssetClip, ScriptSegment, SegmentClipMapping, AssetCategory } from '../types';
import {
  X,
  Upload,
  Video,
  Terminal,
  AlertTriangle,
  Brain,
  GitCompare,
  Zap,
  TrendingUp,
  Binary,
  Code,
  Bell,
  Check,
  Play,
  Pause,
  Plus,
  Trash2,
  Layers,
  Sparkles,
  Film,
  FileVideo,
} from 'lucide-react';

interface AssetLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  clips: AssetClip[];
  segments: ScriptSegment[];
  mappings: SegmentClipMapping;
  onUpdateMappings: (updated: SegmentClipMapping) => void;
  onAddCustomClip: (clip: AssetClip) => void;
  onDeleteCustomClip?: (clipId: string) => void;
  targetSegmentId?: number | null;
}

const CATEGORY_TABS: { id: string; label: string; icon: any }[] = [
  { id: 'all', label: 'All Clips', icon: Layers },
  { id: 'terminal', label: 'Terminal / CLI', icon: Terminal },
  { id: 'ai_brain', label: 'Agentic AI', icon: Brain },
  { id: 'code_ide', label: 'Code & Editor', icon: Code },
  { id: 'benchmark', label: 'Benchmarks & Charts', icon: Zap },
  { id: 'user_upload', label: 'Custom Uploads', icon: Upload },
];

export const AssetLibraryModal: React.FC<AssetLibraryModalProps> = ({
  isOpen,
  onClose,
  clips,
  segments,
  mappings,
  onUpdateMappings,
  onAddCustomClip,
  onDeleteCustomClip,
  targetSegmentId = null,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedClipId, setSelectedClipId] = useState<string>(clips[0]?.id || '');
  const [activeSegmentForMapping, setActiveSegmentForMapping] = useState<number>(
    targetSegmentId || segments[0]?.id || 1
  );
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const filteredClips = clips.filter((clip) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'user_upload') return clip.isCustomUpload;
    return clip.category === selectedCategory;
  });

  const selectedClip = clips.find((c) => c.id === selectedClipId) || clips[0];

  // Which segments use this clip?
  const segmentsUsingSelectedClip = segments.filter(
    (s) => mappings[s.id] === selectedClipId
  );

  const handleMapClipToSegment = (segId: number, clipId: string) => {
    onUpdateMappings({
      ...mappings,
      [segId]: clipId,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setUploadError('Please select a valid video file (.mp4, .webm, .mov).');
      return;
    }

    // Create object URL for client preview
    const videoUrl = URL.createObjectURL(file);
    const newClip: AssetClip = {
      id: `custom_${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, '').slice(0, 30),
      category: 'user_upload',
      description: `Uploaded clip (${(file.size / (1024 * 1024)).toFixed(1)} MB)`,
      badge: 'Custom B-Roll',
      iconName: 'Film',
      videoUrl: videoUrl,
      isCustomUpload: true,
      uploadedAt: Date.now(),
    };

    onAddCustomClip(newClip);
    setSelectedClipId(newClip.id);
    setSelectedCategory('user_upload');

    // Auto-map to current target segment
    if (activeSegmentForMapping) {
      handleMapClipToSegment(activeSegmentForMapping, newClip.id);
    }
  };

  const getClipIcon = (category: string) => {
    switch (category) {
      case 'terminal':
        return <Terminal className="w-4 h-4 text-cyan-400" />;
      case 'radar_alert':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'ai_brain':
        return <Brain className="w-4 h-4 text-purple-400" />;
      case 'code_ide':
        return <Code className="w-4 h-4 text-blue-400" />;
      case 'benchmark':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'subscribe_cta':
        return <Bell className="w-4 h-4 text-rose-400" />;
      case 'matrix_rain':
        return <Binary className="w-4 h-4 text-emerald-400" />;
      default:
        return <FileVideo className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-5xl h-[90vh] rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Video Asset Library & Timeline Mapper</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                  {clips.length} Clips Available
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Select or upload dynamic video scenes and map them to script dialogue beats.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Video Clip</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {uploadError && (
          <div className="px-6 py-2 bg-red-950/60 border-b border-red-500/30 text-red-300 text-xs">
            {uploadError}
          </div>
        )}

        {/* Categories Bar */}
        <div className="px-6 py-2.5 bg-slate-950/40 border-b border-slate-800 flex items-center gap-2 overflow-x-auto custom-scrollbar">
          {CATEGORY_TABS.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Body Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left: Clips Grid (7 cols) */}
          <div className="lg:col-span-7 p-5 overflow-y-auto border-r border-slate-800 space-y-3 custom-scrollbar">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
              <span>Select a clip to preview or map:</span>
              <span className="font-mono text-[11px]">{filteredClips.length} clips</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredClips.map((clip) => {
                const isSelected = selectedClip?.id === clip.id;
                const mappedSegmentsCount = segments.filter(
                  (s) => mappings[s.id] === clip.id
                ).length;

                return (
                  <div
                    key={clip.id}
                    onClick={() => setSelectedClipId(clip.id)}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-3 relative ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500/70 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-500/50'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                          {getClipIcon(clip.category)}
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800 font-mono font-medium">
                          {clip.badge}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-slate-200 mt-2.5 line-clamp-1">
                        {clip.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {clip.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                      {mappedSegmentsCount > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Active on {mappedSegmentsCount} {mappedSegmentsCount === 1 ? 'scene' : 'scenes'}</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 font-mono">Unassigned</span>
                      )}

                      {clip.isCustomUpload && onDeleteCustomClip && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCustomClip(clip.id);
                          }}
                          className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/20"
                          title="Delete custom clip"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Clip Details & Segment Mapping Timeline (5 cols) */}
          <div className="lg:col-span-5 p-5 overflow-y-auto space-y-5 bg-slate-950/40 custom-scrollbar flex flex-col justify-between">
            <div className="space-y-4">
              {/* Selected Clip Preview Card */}
              {selectedClip && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                      {getClipIcon(selectedClip.category)}
                      <span>Clip Preview & Details</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {selectedClip.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{selectedClip.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {selectedClip.description}
                    </p>
                  </div>

                  {/* If user uploaded, show video tag */}
                  {selectedClip.videoUrl && (
                    <div className="rounded-xl overflow-hidden border border-slate-800 bg-black aspect-video flex items-center justify-center">
                      <video
                        src={selectedClip.videoUrl}
                        controls
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}

                  {/* 1-Click Map Button for active selected segment */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleMapClipToSegment(activeSegmentForMapping, selectedClip.id)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Assign to Scene {activeSegmentForMapping}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Segment Mapping Timeline */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Script Scene Mapping ({segments.length} Beats)</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Click scene to map</span>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                  {segments.map((seg) => {
                    const assignedClipId = mappings[seg.id];
                    const assignedClip = clips.find((c) => c.id === assignedClipId);
                    const isTarget = activeSegmentForMapping === seg.id;

                    return (
                      <div
                        key={seg.id}
                        onClick={() => setActiveSegmentForMapping(seg.id)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          isTarget
                            ? 'bg-cyan-950/60 border-cyan-500/60 shadow-md'
                            : 'bg-slate-900/70 border-slate-800/80 hover:bg-slate-850'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5 font-bold">
                            <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 font-mono text-[10px] flex items-center justify-center shrink-0">
                              {seg.id}
                            </span>
                            <span className="text-slate-300 truncate font-['Ramabhadra']">
                              {seg.telugu.slice(0, 32)}...
                            </span>
                          </div>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0 font-sans">
                            {seg.tag}
                          </span>
                        </div>

                        {/* Assigned Clip Badge */}
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/50">
                          <span className="text-slate-400 text-[10px]">Active Clip:</span>
                          <div className="flex items-center gap-1 text-cyan-300 font-medium">
                            {assignedClip && getClipIcon(assignedClip.category)}
                            <span className="truncate max-w-[150px]">
                              {assignedClip ? assignedClip.title : 'None'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Done Button */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
              >
                Apply & Return to Studio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
