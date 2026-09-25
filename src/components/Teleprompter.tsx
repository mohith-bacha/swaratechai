import React, { useState } from 'react';
import { ScriptSegment } from '../types';
import {
  FileText,
  ListOrdered,
  Play,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Volume2,
  Languages,
  Eye,
  EyeOff,
} from 'lucide-react';

interface TeleprompterProps {
  segments: ScriptSegment[];
  activeSegmentId: number | null;
  fullScriptText: string;
  onChangeFullScript: (text: string) => void;
  onResetScript: () => void;
  onPlaySingleSegment: (segment: ScriptSegment) => void;
  onOpenPolishModal: () => void;
  isAnalyzing: boolean;
}

export const Teleprompter: React.FC<TeleprompterProps> = ({
  segments,
  activeSegmentId,
  fullScriptText,
  onChangeFullScript,
  onResetScript,
  onPlaySingleSegment,
  onOpenPolishModal,
  isAnalyzing,
}) => {
  const [viewMode, setViewMode] = useState<'beats' | 'editor'>('beats');
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showEnglishTranslation, setShowEnglishTranslation] = useState(true);
  const [copiedTelugu, setCopiedTelugu] = useState(false);
  const [copiedTranslit, setCopiedTranslit] = useState(false);

  const wordCount = fullScriptText.trim().split(/\s+/).filter(Boolean).length;
  const estimatedReadTimeSec = Math.round(wordCount / 2.3); // ~140 wpm

  const handleCopyTelugu = () => {
    navigator.clipboard.writeText(fullScriptText);
    setCopiedTelugu(true);
    setTimeout(() => setCopiedTelugu(false), 2000);
  };

  const handleCopyTranslit = () => {
    const text = segments.map((s) => s.transliteration).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedTranslit(true);
    setTimeout(() => setCopiedTranslit(false), 2000);
  };

  const insertToken = (token: string) => {
    onChangeFullScript(fullScriptText + ' ' + token);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
      {/* Top Header & View Tabs */}
      <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('beats')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                viewMode === 'beats'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Beat Teleprompter ({segments.length})</span>
            </button>
            <button
              onClick={() => setViewMode('editor')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                viewMode === 'editor'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full Script Editor</span>
            </button>
          </div>

          <button
            onClick={onOpenPolishModal}
            className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>AI Reel Polish</span>
          </button>
        </div>

        {/* Stats & Toggles */}
        <div className="flex items-center gap-2 text-xs">
          <div className="hidden sm:flex items-center gap-3 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 font-mono">
            <span>{wordCount} words</span>
            <span className="text-slate-600">•</span>
            <span>~{estimatedReadTimeSec}s duration</span>
          </div>

          {viewMode === 'beats' && (
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
              <button
                onClick={() => setShowTransliteration(!showTransliteration)}
                className={`px-2 py-0.5 rounded flex items-center gap-1 transition-colors ${
                  showTransliteration ? 'text-cyan-300 bg-cyan-950/40' : 'text-slate-500'
                }`}
                title="Toggle Romanized Telugu phonetics"
              >
                <Languages className="w-3 h-3" />
                <span>Phonetics</span>
              </button>
              <button
                onClick={() => setShowEnglishTranslation(!showEnglishTranslation)}
                className={`px-2 py-0.5 rounded flex items-center gap-1 transition-colors ${
                  showEnglishTranslation ? 'text-cyan-300 bg-cyan-950/40' : 'text-slate-500'
                }`}
                title="Toggle English Translation"
              >
                {showEnglishTranslation ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                <span>English</span>
              </button>
            </div>
          )}

          {/* Copy actions */}
          <button
            onClick={handleCopyTelugu}
            title="Copy Telugu script"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {copiedTelugu ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
        {viewMode === 'beats' ? (
          <div className="space-y-3">
            {segments.map((seg, index) => {
              const isActive = activeSegmentId === seg.id;

              const getTagColor = (tag: string) => {
                switch (tag) {
                  case 'Hook':
                    return 'bg-red-500/15 text-red-300 border-red-500/30';
                  case 'Problem':
                    return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
                  case 'Breakthrough':
                    return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
                  case 'Tech Highlight':
                    return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
                  case 'Warning':
                    return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
                  case 'Call to Action':
                    return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
                  default:
                    return 'bg-slate-800 text-slate-300 border-slate-700';
                }
              };

              return (
                <div
                  key={seg.id}
                  className={`p-3.5 rounded-xl border transition-all relative ${
                    isActive
                      ? 'border-cyan-400 bg-cyan-950/30 shadow-lg shadow-cyan-950/40 ring-2 ring-cyan-400/40'
                      : 'border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-mono flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getTagColor(seg.tag)}`}>
                        {seg.tag}
                      </span>
                      <span className="text-[10px] text-slate-400 italic hidden sm:inline">
                        {seg.recommendedEmotion}
                      </span>
                    </div>

                    <button
                      onClick={() => onPlaySingleSegment(seg)}
                      title="Audition this single sentence"
                      className="px-2 py-1 rounded-md bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-300 text-slate-400 text-[11px] flex items-center gap-1 transition-colors shrink-0"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Audition</span>
                    </button>
                  </div>

                  {/* Telugu Script Line */}
                  <p className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed font-['Ramabhadra']">
                    {seg.telugu}
                  </p>

                  {/* Romanized Telugu Transliteration */}
                  {showTransliteration && seg.transliteration && (
                    <p className="mt-1.5 text-xs text-cyan-300/80 font-mono tracking-wide leading-normal">
                      {seg.transliteration}
                    </p>
                  )}

                  {/* English Translation */}
                  {showEnglishTranslation && seg.englishTranslation && (
                    <div className="mt-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-start gap-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">EN:</span>
                      <span className="italic">{seg.englishTranslation}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col h-full gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-slate-400 mr-1">Quick cues:</span>
              <button
                onClick={() => insertToken('...')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
              >
                + Pause (...)
              </button>
              <button
                onClick={() => insertToken('<breath>')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
              >
                + &lt;breath&gt;
              </button>
              <button
                onClick={() => insertToken('మావా!')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-['Ramabhadra']"
              >
                + మావా!
              </button>
              <button
                onClick={onResetScript}
                className="ml-auto px-2 py-1 rounded bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 border border-rose-800/40 text-xs flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Original</span>
              </button>
            </div>

            <textarea
              value={fullScriptText}
              onChange={(e) => onChangeFullScript(e.target.value)}
              rows={16}
              className="w-full flex-1 p-4 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 outline-none text-slate-100 text-base leading-relaxed font-['Ramabhadra'] resize-none shadow-inner"
              placeholder="Paste or write your Telugu tech script here..."
            />
          </div>
        )}
      </div>

      {/* Bottom Footer Tip */}
      <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Tip: Add pauses (...) or question marks (??) to enhance Telugu tech inflection</span>
        </span>
        <button
          onClick={handleCopyTranslit}
          className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
        >
          {copiedTranslit ? 'Copied Phonetics!' : 'Copy Romanized Phonetics'}
        </button>
      </div>
    </div>
  );
};
