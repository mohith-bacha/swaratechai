import React from 'react';
import { ScriptSegment, VoiceProfile } from '../types';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Music,
  Terminal,
  Play,
  Pause,
  Sparkles,
} from 'lucide-react';

interface ReelPreviewProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  activeSegment: ScriptSegment | null;
  voiceProfile: VoiceProfile;
  currentTimeSec: number;
  totalDurationSec: number;
}

export const ReelPreview: React.FC<ReelPreviewProps> = ({
  isPlaying,
  onTogglePlay,
  activeSegment,
  voiceProfile,
  currentTimeSec,
  totalDurationSec,
}) => {
  return (
    <div className="flex flex-col items-center">
      {/* 9:16 Mobile Phone Frame */}
      <div className="relative w-[280px] sm:w-[310px] h-[540px] sm:h-[580px] rounded-[38px] bg-slate-950 border-[6px] border-slate-800 shadow-2xl shadow-cyan-950/40 overflow-hidden flex flex-col justify-between select-none">
        {/* Phone Speaker & Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full flex items-center justify-center z-30">
          <div className="w-10 h-1 bg-slate-700 rounded-full" />
        </div>

        {/* Dynamic Tech Terminal Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 z-0 overflow-hidden">
          {/* Subtle grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

          {/* Claude Code Mock Terminal */}
          <div className="p-4 pt-10 font-mono text-[10px] text-cyan-400/70 leading-relaxed opacity-40">
            <div className="flex items-center gap-1.5 text-slate-500 mb-2 border-b border-slate-800 pb-1">
              <Terminal className="w-3 h-3 text-cyan-400" />
              <span>claude-code terminal session</span>
            </div>
            <p className="text-emerald-400">$ claude agent --scan-repo</p>
            <p className="text-slate-400">Scanning repository tree...</p>
            <p className="text-sky-300">✓ Found 142 files, 4 services</p>
            <p className="text-amber-300">⚡ Executing tests in real-time...</p>
            <p className="text-rose-400">✖ 2 errors caught in build</p>
            <p className="text-emerald-300 font-bold">✓ Agent auto-resolved errors in 1.4s</p>
            <p className="text-slate-500 mt-2">Agentic AI loop active...</p>
          </div>

          {/* Glowing central pulse */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl transition-opacity duration-500 ${
              isPlaying ? 'opacity-80 scale-110' : 'opacity-20 scale-90'
            }`}
          />
        </div>

        {/* Top Header in Reel */}
        <div className="relative z-10 pt-8 px-4 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700/80">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-semibold text-[10px] uppercase tracking-wider text-rose-200">
              Telugu Tech Reel
            </span>
          </div>
          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
            Claude Code
          </span>
        </div>

        {/* Center: Dynamic Animated Subtitles & Visualizer */}
        <div className="relative z-10 px-4 my-auto flex flex-col items-center text-center">
          {/* Play/Pause overlay tap */}
          <button
            onClick={onTogglePlay}
            className="w-12 h-12 rounded-full bg-slate-900/80 backdrop-blur-md border border-cyan-500/40 text-cyan-300 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all mb-4"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          {/* Telugu Dynamic Kinetic Caption Box */}
          <div className="w-full bg-slate-950/90 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-4 shadow-xl shadow-cyan-950/50">
            {activeSegment ? (
              <div className="space-y-2">
                <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {activeSegment.tag}
                </span>

                <h3 className="text-base sm:text-lg font-bold text-white font-['Ramabhadra'] leading-snug drop-shadow-md">
                  {activeSegment.telugu}
                </h3>

                <p className="text-[11px] text-cyan-300 font-mono italic">
                  "{activeSegment.transliteration}"
                </p>
              </div>
            ) : (
              <div className="py-2 space-y-1">
                <p className="text-sm font-semibold text-slate-200 font-['Ramabhadra']">
                  డెవలపర్స్ జాబ్స్ రిస్క్లో ఉన్నాయా??
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  Tap play to preview Telugu Voice
                </p>
              </div>
            )}
          </div>

          {/* Sound bars animation */}
          <div className="flex items-center justify-center gap-1 mt-4 h-6">
            {[40, 75, 100, 60, 90, 45, 80, 50, 95, 30].map((h, i) => (
              <div
                key={i}
                className={`w-1 rounded-full bg-cyan-400 transition-all duration-150 ${
                  isPlaying ? 'opacity-90' : 'opacity-25'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(4, (h * (0.4 + Math.random() * 0.6)) * 0.24)}px` : '4px',
                }}
              />
            ))}
          </div>
        </div>

        {/* Right Action Icons (Like, Comment, Share) */}
        <div className="absolute right-2 bottom-20 z-20 flex flex-col items-center gap-4 text-white">
          <div className="flex flex-col items-center">
            <button className="p-2 rounded-full bg-slate-900/70 backdrop-blur text-rose-400 hover:scale-110 transition-transform">
              <Heart className="w-5 h-5 fill-rose-500/40" />
            </button>
            <span className="text-[10px] font-semibold mt-1">42.8K</span>
          </div>

          <div className="flex flex-col items-center">
            <button className="p-2 rounded-full bg-slate-900/70 backdrop-blur text-slate-200 hover:scale-110 transition-transform">
              <MessageCircle className="w-5 h-5" />
            </button>
            <span className="text-[10px] font-semibold mt-1">1.2K</span>
          </div>

          <div className="flex flex-col items-center">
            <button className="p-2 rounded-full bg-slate-900/70 backdrop-blur text-slate-200 hover:scale-110 transition-transform">
              <Share2 className="w-5 h-5" />
            </button>
            <span className="text-[10px] font-semibold mt-1">Share</span>
          </div>

          <button className="p-2 rounded-full bg-slate-900/70 backdrop-blur text-slate-200 hover:scale-110 transition-transform">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Metadata & Sound Track Info */}
        <div className="relative z-10 p-4 pb-6 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
              {voiceProfile.name[0]}
            </div>
            <span className="text-xs font-bold text-white">@telugu_tech_pulse</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold">
              Follow
            </span>
          </div>

          <p className="text-[11px] text-slate-300 line-clamp-1 mb-2 font-['Ramabhadra']">
            క్లాడ్ కోడ్ & ఏజెంటిక్ ఏఐ రియాలిటీ చెక్! 🔥
          </p>

          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <Music className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="truncate">Voice: {voiceProfile.name} • SwaraTech AI Studio</span>
          </div>
        </div>
      </div>
    </div>
  );
};
