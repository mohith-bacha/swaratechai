import React from 'react';
import { VoiceName, BgmTheme } from '../types';
import { VOICE_PROFILES, BGM_PRESETS, DIRECTOR_STYLES } from '../data/defaultScript';
import {
  Mic,
  Sliders,
  Music,
  Radio,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface VoiceControlsProps {
  selectedVoice: VoiceName;
  onSelectVoice: (voice: VoiceName) => void;
  selectedModel: 'gemini-3.8-flash-lite-tts' | 'gemini-3.8-flash-tts';
  onSelectModel: (model: 'gemini-3.8-flash-lite-tts' | 'gemini-3.8-flash-tts') => void;
  selectedStyleId: string;
  customStylePrompt: string;
  onSelectStyle: (styleId: string) => void;
  onChangeCustomStyle: (prompt: string) => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  bgmTheme: BgmTheme;
  onChangeBgm: (theme: BgmTheme) => void;
  bgmVolume: number;
  onChangeBgmVolume: (vol: number) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  onTestBrowserTts: () => void;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  selectedVoice,
  onSelectVoice,
  selectedModel,
  onSelectModel,
  selectedStyleId,
  customStylePrompt,
  onSelectStyle,
  onChangeCustomStyle,
  playbackSpeed,
  onChangeSpeed,
  bgmTheme,
  onChangeBgm,
  bgmVolume,
  onChangeBgmVolume,
  isGenerating,
  onGenerate,
  onTestBrowserTts,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Primary Action Hero */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-blue-950/40 border border-cyan-500/30 shadow-xl shadow-cyan-950/20 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wider uppercase text-cyan-300">
              Gemini 3.8 Audio Engine
            </span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
            24kHz PCM Studio
          </span>
        </div>

        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          Produce viral Telugu tech voiceover with native cadence, dramatic pauses, and sound direction.
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
              isGenerating
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/25 hover:shadow-cyan-500/40 active:scale-[0.98]'
            }`}
          >
            {isGenerating ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-slate-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Synthesizing Telugu Voice...</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-slate-950 fill-current" />
                <span>Generate Telugu AI Voice</span>
              </>
            )}
          </button>

          <button
            onClick={onTestBrowserTts}
            title="Instant offline voice test using browser speech engine"
            className="px-3.5 py-2.5 rounded-xl border border-slate-700/80 bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Instant Preview</span>
          </button>
        </div>
      </div>

      {/* Voice Cast Selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-cyan-400" />
            <span>Select Voice Actor (స్వర నటుడు)</span>
          </label>
          <span className="text-[11px] text-slate-400">5 Personas Available</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {VOICE_PROFILES.map((profile) => {
            const isSelected = selectedVoice === profile.id;
            return (
              <button
                key={profile.id}
                onClick={() => onSelectVoice(profile.id)}
                className={`text-left p-3 rounded-xl border transition-all relative overflow-hidden ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/30 shadow-md shadow-cyan-950/30 ring-1 ring-cyan-400/50'
                    : 'border-slate-800/80 bg-slate-900/60 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${profile.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow-inner shrink-0`}
                  >
                    {profile.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <div className="font-semibold text-xs text-slate-100 flex items-center gap-1.5 truncate">
                        <span>{profile.name}</span>
                        <span className="text-[11px] font-normal text-cyan-400 font-['Ramabhadra']">
                          ({profile.nameTelugu})
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {profile.gender}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                      {profile.sampleVibe}
                    </p>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {profile.bestFor}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Director Tone & Style Presets */}
      <div>
        <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Director Style & Cadence (శైలి)</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {DIRECTOR_STYLES.map((style) => {
            const isSelected = selectedStyleId === style.id;
            return (
              <button
                key={style.id}
                onClick={() => onSelectStyle(style.id)}
                className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                  isSelected
                    ? 'border-amber-400/80 bg-amber-950/20 text-slate-100 ring-1 ring-amber-400/40'
                    : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800/50 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-xs mb-1">
                  <span>{style.title}</span>
                  <span className="text-[10px] text-amber-300/90 font-normal">
                    {style.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {style.promptSnippet}
                </p>
              </button>
            );
          })}
        </div>

        {/* Custom style directive */}
        <div className="mt-2.5">
          <input
            type="text"
            value={customStylePrompt}
            onChange={(e) => onChangeCustomStyle(e.target.value)}
            placeholder="Or type custom direction: e.g. Fast, dramatic pauses on 'అసలు ఇది ఎలా సాధ్యం?'..."
            className="w-full text-xs px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:border-cyan-500 focus:outline-none text-slate-200 placeholder-slate-500"
          />
        </div>
      </div>

      {/* Model & Speed Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Gemini Model */}
        <div>
          <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Radio className="w-3.5 h-3.5 text-blue-400" />
            <span>AI Voice Model</span>
          </label>
          <div className="flex gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onSelectModel('gemini-3.8-flash-lite-tts')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                selectedModel === 'gemini-3.8-flash-lite-tts'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Flash-Lite TTS
              <span className="block text-[9px] text-slate-500">Ultra Fast</span>
            </button>
            <button
              onClick={() => onSelectModel('gemini-3.8-flash-tts')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                selectedModel === 'gemini-3.8-flash-tts'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Flash TTS
              <span className="block text-[9px] text-slate-500">Voice Design</span>
            </button>
          </div>
        </div>

        {/* Speed Modifier */}
        <div>
          <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span>Voice Pace / Speed</span>
          </label>
          <div className="flex gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {[0.85, 1.0, 1.1, 1.25].map((speed) => (
              <button
                key={speed}
                onClick={() => onChangeSpeed(speed)}
                className={`flex-1 py-1.5 px-1 rounded-lg text-xs font-semibold transition-all ${
                  playbackSpeed === speed
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {speed}x
                {speed === 1.1 && <span className="block text-[8px] text-emerald-400">Reels</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Background Music (BGM) Soundboard */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-purple-400" />
            <span>Tech Background Music (BGM)</span>
          </label>
          <span className="text-[10px] text-slate-400 font-mono">Web Audio Synths</span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          {BGM_PRESETS.map((preset) => {
            const isSelected = bgmTheme === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onChangeBgm(preset.id)}
                className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'border-purple-500/80 bg-purple-950/30 text-slate-100 ring-1 ring-purple-400/40'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:bg-slate-800/40 hover:text-slate-300'
                }`}
              >
                <span className="text-base">{preset.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold truncate">{preset.title}</div>
                  <div className="text-[9px] text-slate-400 truncate">{preset.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* BGM Volume Slider */}
        {bgmTheme !== 'none' && (
          <div className="flex items-center gap-3 pt-2 border-t border-slate-800/60">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              {bgmVolume > 0 ? (
                <Volume2 className="w-3 h-3 text-purple-400" />
              ) : (
                <VolumeX className="w-3 h-3 text-slate-500" />
              )}
              BGM Volume:
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={bgmVolume}
              onChange={(e) => onChangeBgmVolume(parseFloat(e.target.value))}
              className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <span className="text-[11px] font-mono text-purple-300 w-8 text-right">
              {Math.round(bgmVolume * 100)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
