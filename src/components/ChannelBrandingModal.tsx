import React, { useState } from 'react';
import { YouTubeBranding } from '../types';
import {
  X,
  Youtube,
  AtSign,
  Type,
  Bell,
  Check,
  Sparkles,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface ChannelBrandingModalProps {
  isOpen: boolean;
  onClose: () => void;
  branding: YouTubeBranding;
  onSave: (updated: YouTubeBranding) => void;
}

const PRESET_CHANNELS = [
  { name: 'TELUGU TECH PULSE', handle: '@telugu_tech_pulse', initials: 'TP' },
  { name: 'CODE WITH SHIVA', handle: '@codewithshiva', initials: 'CS' },
  { name: 'BYTE TELUGU AI', handle: '@bytetelugu', initials: 'BT' },
  { name: 'TELUGU DEVELOPER', handle: '@telugudev', initials: 'TD' },
  { name: 'TECH NUGGETS TELUGU', handle: '@technuggets_te', initials: 'TN' },
];

export const ChannelBrandingModal: React.FC<ChannelBrandingModalProps> = ({
  isOpen,
  onClose,
  branding,
  onSave,
}) => {
  const [formData, setFormData] = useState<YouTubeBranding>({ ...branding });
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof PRESET_CHANNELS[0]) => {
    setFormData((prev) => ({
      ...prev,
      channelName: preset.name,
      handle: preset.handle,
      initials: preset.initials,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center shadow-lg shadow-red-500/10">
              <Youtube className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>YouTube Channel Branding</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-semibold border border-red-500/30">
                  Custom Name
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Customize your channel name, handle, and end-screen Subscribe card for all video reels.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
          {/* Quick Presets */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2 flex items-center justify-between">
              <span>Quick Channel Presets</span>
              <span className="text-[10px] text-slate-500">Click to apply</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_CHANNELS.map((p) => (
                <button
                  type="button"
                  key={p.name}
                  onClick={() => handleApplyPreset(p)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    formData.channelName === p.name
                      ? 'bg-red-500/20 border-red-500/50 text-red-300'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Channel Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-red-400" />
              <span>YouTube Channel Name</span>
              <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.channelName}
              onChange={(e) => {
                const name = e.target.value.toUpperCase();
                // Auto generate initials
                const words = name.trim().split(/\s+/);
                const inits = words.map((w) => w[0] || '').join('').slice(0, 3);
                setFormData((prev) => ({
                  ...prev,
                  channelName: name,
                  initials: inits || prev.initials,
                }));
              }}
              placeholder="e.g. TELUGU TECH PULSE, CODE WITH SHIVA"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-red-500 transition-colors"
            />
            <p className="text-[11px] text-slate-500">
              Appears in the header watermark, bottom tag, and final YouTube Subscribe screen.
            </p>
          </div>

          {/* YouTube Handle & Initials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <AtSign className="w-3.5 h-3.5 text-cyan-400" />
                <span>YouTube Handle</span>
              </label>
              <input
                type="text"
                value={formData.handle}
                onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                placeholder="@yourchannel"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Logo Monogram (1-3 letters)</span>
              </label>
              <input
                type="text"
                maxLength={3}
                value={formData.initials}
                onChange={(e) => setFormData({ ...formData, initials: e.target.value.toUpperCase() })}
                placeholder="ST"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 uppercase transition-colors"
              />
            </div>
          </div>

          {/* Tagline & Telugu Call to Action */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-yellow-400" />
              <span>Telugu Subscribe Message (End Card)</span>
            </label>
            <input
              type="text"
              value={formData.ctaTelugu}
              onChange={(e) => setFormData({ ...formData, ctaTelugu: e.target.value })}
              placeholder="సబ్స్క్రైబ్ చేసుకోండి మావా!"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-yellow-500 font-['Ramabhadra'] transition-colors"
            />
          </div>

          {/* Live End Card Preview Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                LIVE END SCREEN PREVIEW
              </span>
              <span>Scene 8 (01:00 - 01:10)</span>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-red-500/30 flex flex-col items-center text-center shadow-lg shadow-red-950/20">
              {/* Circular Logo Monogram */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-red-600/30 mb-2 border-2 border-white/20">
                {formData.initials || 'ST'}
              </div>

              <div className="text-base font-extrabold text-white tracking-wide">
                {formData.channelName || 'YOUR CHANNEL NAME'}
              </div>

              <div className="text-xs text-slate-400 font-mono mt-0.5">
                {formData.handle || '@yourchannel'}
              </div>

              {/* Subscribe button mock */}
              <div className="mt-3.5 px-6 py-2 rounded-full bg-red-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-red-600/40">
                <Bell className="w-3.5 h-3.5 fill-current" />
                <span>SUBSCRIBE 🔔</span>
              </div>

              <div className="text-xs font-bold text-amber-300 font-['Ramabhadra'] mt-2.5">
                {formData.ctaTelugu || 'సబ్స్క్రైబ్ చేసుకోండి మావా!'}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-red-600/25 active:scale-95 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Apply Channel Branding</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
