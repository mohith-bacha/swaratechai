import React, { useState } from 'react';
import { ScriptVariation } from '../types';
import { requestScriptVariations } from '../services/speechService';
import { Sparkles, X, Check, Loader2, PlayCircle, ArrowRight } from 'lucide-react';

interface ScriptEnhancerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScript: string;
  onApplyScript: (newScript: string) => void;
}

export const ScriptEnhancerModal: React.FC<ScriptEnhancerModalProps> = ({
  isOpen,
  onClose,
  currentScript,
  onApplyScript,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [variations, setVariations] = useState<ScriptVariation[]>([]);
  const [selectedVariation, setSelectedVariation] = useState<ScriptVariation | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateVariations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await requestScriptVariations(currentScript);
      if (res?.data?.variations) {
        setVariations(res.data.variations);
        setSelectedVariation(res.data.variations[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate script variations.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (selectedVariation) {
      onApplyScript(selectedVariation.scriptTelugu);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                AI Script Director & Reel Variations
              </h3>
              <p className="text-xs text-slate-400">
                Rewrite and optimize your Telugu voiceover for virality and retention
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {variations.length === 0 && !isLoading && (
            <div className="text-center py-8 px-4 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
              <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-slate-200 mb-1">
                Generate Optimized Reel & Short Variations
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-5 leading-relaxed">
                Gemini AI will re-pace this script into 3 production cuts: 30s High-Retention Hook, 60s Tech Deep Dive, and Casual Telugu Tech Bro style.
              </p>
              <button
                onClick={handleGenerateVariations}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center gap-2 mx-auto shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Script Variations</span>
              </button>
            </div>
          )}

          {isLoading && (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
              <p className="text-xs text-slate-300 font-medium">
                Crafting optimized Telugu script variations with Gemini AI...
              </p>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-300">
              {error}
            </div>
          )}

          {variations.length > 0 && !isLoading && (
            <div className="space-y-4">
              {/* Variation Tabs */}
              <div className="grid grid-cols-3 gap-2">
                {variations.map((v) => {
                  const isSelected = selectedVariation?.typeKey === v.typeKey;
                  return (
                    <button
                      key={v.typeKey}
                      onClick={() => setSelectedVariation(v)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        isSelected
                          ? 'border-amber-400 bg-amber-950/30 text-amber-200 ring-1 ring-amber-400/50'
                          : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold truncate">{v.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {v.durationEstimate}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Variation Content */}
              {selectedVariation && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{selectedVariation.title}</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Est. {selectedVariation.durationEstimate}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed italic">
                    {selectedVariation.description}
                  </p>

                  <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 max-h-48 overflow-y-auto">
                    <p className="text-sm text-slate-100 font-['Ramabhadra'] leading-relaxed whitespace-pre-line">
                      {selectedVariation.scriptTelugu}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          {variations.length > 0 && (
            <button
              onClick={handleApply}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Apply to Studio</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
