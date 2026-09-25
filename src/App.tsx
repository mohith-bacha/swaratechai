import React, { useState, useRef, useEffect } from 'react';
import {
  VoiceName,
  ScriptSegment,
  BgmTheme,
  GeneratedAudioData,
} from './types';
import {
  USER_PROMPT_TELUGU,
  VOICE_PROFILES,
  INITIAL_SEGMENTS,
  DIRECTOR_STYLES,
} from './data/defaultScript';
import {
  requestSpeechGeneration,
  speakWithBrowserTts,
  stopBrowserTts,
  formatTime,
  generateSrtContent,
} from './services/speechService';
import { bgmSynth } from './services/bgmSynthesizer';
import { VoiceControls } from './components/VoiceControls';
import { Teleprompter } from './components/Teleprompter';
import { AudioWaveform } from './components/AudioWaveform';
import { ReelPreview } from './components/ReelPreview';
import { ScriptEnhancerModal } from './components/ScriptEnhancerModal';
import { VideoEditor } from './components/VideoEditor';
import { downloadMp4File } from './utils/downloadHelper';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  FileCode2,
  Volume2,
  VolumeX,
  Share2,
  Sparkles,
  Layers,
  Radio,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Smartphone,
  Headphones,
  Video,
} from 'lucide-react';

export default function App() {
  // Navigation mode
  const [activeMode, setActiveMode] = useState<'voice' | 'video'>('voice');

  // Script and Segment state
  const [fullScriptText, setFullScriptText] = useState(USER_PROMPT_TELUGU);
  const [segments, setSegments] = useState<ScriptSegment[]>(INITIAL_SEGMENTS);
  const [activeSegmentId, setActiveSegmentId] = useState<number | null>(null);

  // Voice Actor & Direction Config
  const [selectedVoice, setSelectedVoice] = useState<VoiceName>('Puck');
  const [selectedModel, setSelectedModel] = useState<'gemini-3.8-flash-lite-tts' | 'gemini-3.8-flash-tts'>(
    'gemini-3.8-flash-lite-tts'
  );
  const [selectedStyleId, setSelectedStyleId] = useState('viral_reel');
  const [customStylePrompt, setCustomStylePrompt] = useState('');
  const [playbackSpeed, setPlaybackSpeed] = useState(1.1); // Reels optimum

  // Background Music
  const [bgmTheme, setBgmTheme] = useState<BgmTheme>('none');
  const [bgmVolume, setBgmVolume] = useState(0.25);

  // Audio Playback & Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<GeneratedAudioData | null>({
    audioUrl: '/audio/telugu_claude_code_voiceover.wav',
    audioBase64: '',
    durationSeconds: 70.93,
    fileSizeKb: 3324.7,
    voice: 'Puck',
    model: 'gemini-3.8-flash-lite-tts',
    generatedAt: Date.now(),
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(70.93);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [showHowToUse, setShowHowToUse] = useState(false);

  // UI state
  const [isPolishModalOpen, setIsPolishModalOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'studio' | 'preview'>('studio');

  // Audio Element Ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Current Voice Profile
  const currentVoiceProfile = VOICE_PROFILES.find((v) => v.id === selectedVoice) || VOICE_PROFILES[0];

  // Show auto-dismissing toast
  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sync BGM volume with synthesizer
  useEffect(() => {
    bgmSynth.setVolume(bgmVolume);
  }, [bgmVolume]);

  // Audio element listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const time = audio.currentTime;
      setCurrentTime(time);

      // Determine active segment based on time ratio
      if (duration > 0 && segments.length > 0) {
        const segDuration = duration / segments.length;
        const index = Math.min(segments.length - 1, Math.floor(time / segDuration));
        setActiveSegmentId(segments[index]?.id || null);
      }
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setActiveSegmentId(null);
      bgmSynth.duck(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [duration, segments]);

  // Update playback rate on audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const playPromiseRef = useRef<Promise<void> | null>(null);

  const safePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      const promise = audio.play();
      playPromiseRef.current = promise;
      await promise;
      setIsPlaying(true);
      if (bgmTheme !== 'none') {
        bgmSynth.duck(true);
      }
    } catch (err: any) {
      // AbortError is normal when playback is quickly toggled or paused
      if (err.name !== 'AbortError' && !err.message?.includes('interrupted')) {
        console.warn('Audio play notice:', err);
      }
      setIsPlaying(false);
    } finally {
      playPromiseRef.current = null;
    }
  };

  const safePause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playPromiseRef.current) {
      playPromiseRef.current
        .then(() => {
          try {
            audio.pause();
          } catch (e) {}
          setIsPlaying(false);
          bgmSynth.duck(false);
        })
        .catch(() => {
          try {
            audio.pause();
          } catch (e) {}
          setIsPlaying(false);
          bgmSynth.duck(false);
        });
    } else {
      try {
        audio.pause();
      } catch (e) {}
      setIsPlaying(false);
      bgmSynth.duck(false);
    }
  };

  // Handle Play/Pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio && !generatedAudio) {
      // If no audio is generated yet, generate voiceover first!
      handleGenerateVoiceover();
      return;
    }

    if (!audio) return;

    if (isPlaying) {
      safePause();
    } else {
      safePlay();
    }
  };

  const switchMode = (mode: 'voice' | 'video') => {
    safePause();
    setActiveMode(mode);
  };

  // Keyboard Shortcuts: Space to play/pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowLeft') {
        handleSeek(Math.max(0, (currentTime - 5) / (duration || 1)));
      } else if (e.code === 'ArrowRight') {
        handleSeek(Math.min(1, (currentTime + 5) / (duration || 1)));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentTime, duration, generatedAudio]);

  // Seek bar
  const handleSeek = (ratio: number) => {
    if (audioRef.current && duration > 0) {
      const targetTime = ratio * duration;
      audioRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  // Generate Voiceover via Gemini TTS API
  const handleGenerateVoiceover = async () => {
    if (!fullScriptText.trim()) {
      showToast('Please enter a Telugu script to generate audio.', 'error');
      return;
    }

    try {
      setIsGenerating(true);
      showToast('Connecting to Gemini 3.8 Audio Engine...', 'info');

      // Compose director style
      const chosenPreset = DIRECTOR_STYLES.find((s) => s.id === selectedStyleId);
      const stylePrompt = customStylePrompt.trim()
        ? customStylePrompt
        : `${chosenPreset?.promptSnippet || ''}. Natural Telugu phonetics with dramatic pacing for tech reel.`;

      const response = await requestSpeechGeneration({
        text: fullScriptText,
        voiceName: selectedVoice,
        style: stylePrompt,
        model: selectedModel,
      });

      if (response.success && response.audioUrl) {
        setGeneratedAudio({
          audioUrl: response.audioUrl,
          audioBase64: response.audioBase64,
          durationSeconds: response.durationSeconds,
          fileSizeKb: response.fileSizeKb,
          voice: response.voice,
          model: response.model,
          generatedAt: Date.now(),
        });
        setDuration(response.durationSeconds);
        setCurrentTime(0);

        showToast(
          `Voiceover generated! Duration: ${response.durationSeconds}s (${response.fileSizeKb} KB)`,
          'success'
        );

        // Auto-play newly generated audio safely
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.playbackRate = playbackSpeed;
            safePlay();
          }
        }, 300);
      }
    } catch (err: any) {
      console.error('Generation failed:', err);
      showToast(err.message || 'Voice generation failed. You can use Instant Preview.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Audition a single segment
  const handlePlaySingleSegment = async (segment: ScriptSegment) => {
    setActiveSegmentId(segment.id);
    try {
      showToast(`Auditioning beat #${segment.id}: "${segment.telugu.slice(0, 30)}..."`, 'info');
      await speakWithBrowserTts(segment.telugu, segment.suggestedSpeed || playbackSpeed);
      showToast(`Audition finished.`, 'success');
    } catch (e: any) {
      showToast(e.message || 'Audition failed', 'error');
    }
  };

  // Instant browser TTS test
  const handleTestBrowserTts = async () => {
    try {
      showToast('Playing instant preview via Web Speech Engine...', 'info');
      await speakWithBrowserTts(fullScriptText, playbackSpeed);
      showToast('Instant speech preview finished.', 'success');
    } catch (e: any) {
      showToast(e.message || 'Browser speech is unavailable on this device.', 'error');
    }
  };

  // Handle BGM Toggle
  const handleToggleBgm = (theme: BgmTheme) => {
    setBgmTheme(theme);
    if (theme === 'none') {
      bgmSynth.stop();
    } else {
      bgmSynth.play(theme);
      if (isPlaying) {
        bgmSynth.duck(true);
      }
    }
  };

  // Download WAV Audio file
  const handleDownloadWav = () => {
    if (!generatedAudio?.audioUrl) {
      showToast('Please generate the voiceover first before downloading.', 'error');
      return;
    }
    const a = document.createElement('a');
    a.href = generatedAudio.audioUrl;
    a.download = `swaratech-telugu-voice-${selectedVoice.toLowerCase()}-${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Downloaded studio WAV audio file!', 'success');
  };

  // Download SRT Subtitle file
  const handleDownloadSrt = () => {
    const srtContent = generateSrtContent(segments, duration);
    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `telugu-tech-reel-captions-${Date.now()}.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Downloaded .SRT subtitles for Premiere / CapCut / DaVinci!', 'success');
  };

  const [isDownloadingMp4, setIsDownloadingMp4] = useState(false);

  // Download Desktop-Compatible MP4 Video
  const handleDownloadVideoMp4 = () => {
    setIsDownloadingMp4(true);
    showToast('Starting MP4 download for local desktop playback...', 'info');
    downloadMp4File(
      'telugu-claude-code-reel.mp4',
      () => {},
      () => {
        setIsDownloadingMp4(false);
        showToast('MP4 video saved! Ready for local desktop playback & social media.', 'success');
      },
      () => {
        setIsDownloadingMp4(false);
        showToast('Download started via server stream.', 'info');
      }
    );
  };

  // Reset script to user prompt
  const handleResetScript = () => {
    setFullScriptText(USER_PROMPT_TELUGU);
    setSegments(INITIAL_SEGMENTS);
    showToast('Reset script to initial Claude Code prompt.', 'info');
  };

  // Active segment
  const currentActiveSegment =
    segments.find((s) => s.id === activeSegmentId) ||
    segments[0] ||
    null;

  const progressRatio = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Studio Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <Radio className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                SwaraTech AI
              </h1>
              <span className="text-[11px] font-['Ramabhadra'] text-cyan-400 border border-cyan-500/30 px-1.5 py-0.2 rounded bg-cyan-950/40">
                స్వరటెక్ స్టూడియో
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Telugu AI Voiceover & Tech Reel Audio Producer
            </p>
          </div>
        </div>

        {/* Center Mode Switcher */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => switchMode('voice')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeMode === 'voice'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Voice Studio</span>
          </button>
          <button
            onClick={() => switchMode('video')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeMode === 'video'
                ? 'bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-cyan-200 border border-cyan-400 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-blue-400" />
            <span>Reel Video Editor</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-400 text-slate-950 font-extrabold">NEW</span>
          </button>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadVideoMp4}
            disabled={isDownloadingMp4}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20 hover:brightness-110 active:scale-95 disabled:opacity-75"
            title="Download 9:16 Vertical Short Video (.MP4) for desktop playback"
          >
            <Video className="w-3.5 h-3.5" />
            <span>{isDownloadingMp4 ? 'Downloading...' : 'Download Video (.MP4)'}</span>
          </button>

          <button
            onClick={handleDownloadWav}
            disabled={!generatedAudio}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              generatedAudio
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 hover:brightness-110 active:scale-95'
                : 'bg-slate-900/40 border-slate-800 text-slate-500 cursor-not-allowed'
            }`}
            title="Download Studio WAV Audio"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Audio (.WAV)</span>
          </button>

          <button
            onClick={handleDownloadSrt}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
            title="Download SRT Subtitle Captions"
          >
            <FileCode2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">SRT Captions</span>
          </button>
        </div>
      </header>

      {/* Prominent Instant Audio Player & Download Banner */}
      <section className="bg-gradient-to-r from-emerald-950/50 via-slate-900 to-cyan-950/50 border-b border-emerald-500/30 px-4 sm:px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 to-cyan-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all shrink-0"
              title="Play / Pause Audio"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current ml-0.5" />
              )}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Your Voiceover Audio is Ready!
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  70.9s • 3.4 MB WAV
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2 mt-0.5">
                <span>Pavan (Puck) Voice</span>
                <span className="text-slate-400 font-normal text-xs">• Viral Reel & Shorts Hook</span>
              </h2>
              <p className="text-[11px] text-slate-300 font-['Ramabhadra'] line-clamp-1 mt-0.5">
                "డెవలపర్స్ జాబ్స్ రిస్క్లో ఉన్నాయా?? ఎందుకంటే ఆంథ్రోపిక్ రిలీజ్ చేసిన..."
              </p>
            </div>
          </div>

          {/* Direct HTML5 Audio Player & Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            {generatedAudio?.audioUrl && (
              <audio
                ref={audioRef}
                controls
                src={generatedAudio.audioUrl}
                preload="auto"
                className="h-9 max-w-[260px] sm:max-w-[320px] rounded-lg opacity-90 accent-emerald-500"
                onPlay={() => {
                  setIsPlaying(true);
                  if (bgmTheme !== 'none') {
                    bgmSynth.duck(true);
                  }
                }}
                onPause={() => {
                  setIsPlaying(false);
                  bgmSynth.duck(false);
                }}
              />
            )}

            <button
              onClick={handleDownloadWav}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download .WAV</span>
            </button>

            <button
              onClick={handleDownloadVideoMp4}
              disabled={isDownloadingMp4}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/25 active:scale-95 transition-all disabled:opacity-75"
            >
              <Video className="w-4 h-4" />
              <span>{isDownloadingMp4 ? 'Downloading MP4...' : 'Download Video (.MP4)'}</span>
            </button>

            <button
              onClick={() => switchMode(activeMode === 'video' ? 'voice' : 'video')}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all ${
                activeMode === 'video'
                  ? 'bg-cyan-400 text-slate-950 ring-2 ring-cyan-300'
                  : 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white shadow-cyan-500/30'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{activeMode === 'video' ? 'Back to Voice Studio' : '🎬 Watch / Edit Video'}</span>
            </button>

            <button
              onClick={() => setShowHowToUse(!showHowToUse)}
              className="px-3 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-750 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>{showHowToUse ? 'Hide Guide' : 'How to Use'}</span>
            </button>
          </div>
        </div>

        {/* How to use expandable card */}
        {showHowToUse && (
          <div className="max-w-7xl mx-auto mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in duration-150">
            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center shrink-0">1</span>
              <div>
                <div className="font-bold text-slate-100 mb-0.5">Download the .WAV File</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Click <strong>Download .WAV</strong> above to save the 24kHz studio master voiceover to your phone or computer.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0">2</span>
              <div>
                <div className="font-bold text-slate-100 mb-0.5">Import into CapCut / Reels</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Open CapCut, Premiere Pro, or VN Video Editor. Import your screen recording and add this WAV file as the voiceover audio track.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0">3</span>
              <div>
                <div className="font-bold text-slate-100 mb-0.5">Auto-Captions with .SRT</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Click <strong>SRT Captions</strong> at the top right to download matching subtitle timestamps for auto-animated kinetic captions!
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden px-4 py-2 bg-slate-900/60 border-b border-slate-800 flex gap-2">
        <button
          onClick={() => setMobileTab('studio')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 ${
            mobileTab === 'studio'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400'
          }`}
        >
          <Headphones className="w-3.5 h-3.5" />
          <span>Voice Studio</span>
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 ${
            mobileTab === 'preview'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Reels Preview</span>
        </button>
      </div>

      {/* Main Studio Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeMode === 'video' ? (
          <VideoEditor
            audioUrl={generatedAudio?.audioUrl || '/audio/telugu_claude_code_voiceover.wav'}
            segments={segments}
            durationSec={duration}
            onClose={() => switchMode('voice')}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Voice Controls & Settings (5 cols) */}
            <div className={`lg:col-span-4 ${mobileTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
              <div className="sticky top-20">
                <VoiceControls
                  selectedVoice={selectedVoice}
                  onSelectVoice={(v) => {
                    setSelectedVoice(v);
                    showToast(`Switched voice actor to ${v}`, 'info');
                  }}
                  selectedModel={selectedModel}
                  onSelectModel={setSelectedModel}
                  selectedStyleId={selectedStyleId}
                  customStylePrompt={customStylePrompt}
                  onSelectStyle={setSelectedStyleId}
                  onChangeCustomStyle={setCustomStylePrompt}
                  playbackSpeed={playbackSpeed}
                  onChangeSpeed={setPlaybackSpeed}
                  bgmTheme={bgmTheme}
                  onChangeBgm={handleToggleBgm}
                  bgmVolume={bgmVolume}
                  onChangeBgmVolume={setBgmVolume}
                  isGenerating={isGenerating}
                  onGenerate={handleGenerateVoiceover}
                  onTestBrowserTts={handleTestBrowserTts}
                />
              </div>
            </div>

            {/* Center Column: Script Teleprompter & Beat Breakdown (5 cols) */}
            <div className={`lg:col-span-5 h-[680px] sm:h-[740px] flex flex-col ${mobileTab === 'preview' ? 'hidden lg:flex' : 'flex'}`}>
              <Teleprompter
                segments={segments}
                activeSegmentId={activeSegmentId}
                fullScriptText={fullScriptText}
                onChangeFullScript={setFullScriptText}
                onResetScript={handleResetScript}
                onPlaySingleSegment={handlePlaySingleSegment}
                onOpenPolishModal={() => setIsPolishModalOpen(true)}
                isAnalyzing={false}
              />
            </div>

            {/* Right Column: Reels Mobile Preview & Waveform Transport (3 cols) */}
            <div className={`lg:col-span-3 flex flex-col gap-4 ${mobileTab === 'studio' ? 'hidden lg:flex' : 'flex'}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>9:16 Reels Preview</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Syncs with audio</span>
              </div>

              <ReelPreview
                isPlaying={isPlaying}
                onTogglePlay={togglePlay}
                activeSegment={currentActiveSegment}
                voiceProfile={currentVoiceProfile}
                currentTimeSec={currentTime}
                totalDurationSec={duration}
              />
            </div>
          </div>
        )}
      </main>

      {/* Bottom Sticky Player Deck */}
      <footer className="sticky bottom-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-4 sm:px-8 py-3.5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Track Info */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                disabled={isGenerating}
                className="w-11 h-11 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
                title="Play / Pause (Spacebar)"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              <div>
                <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                  <span>Telugu Tech Voiceover</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                    {currentVoiceProfile.name}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(duration)}</span>
                  {bgmTheme !== 'none' && (
                    <span className="text-[10px] text-purple-400 font-sans">
                      • BGM: {bgmTheme}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Rewind */}
            <button
              onClick={() => handleSeek(0)}
              title="Restart from beginning"
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Central Waveform Scrubber */}
          <div className="flex-1 w-full max-w-2xl px-2">
            <AudioWaveform
              isPlaying={isPlaying}
              progress={progressRatio}
              onSeek={handleSeek}
            />
          </div>

          {/* Speed & Export Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            <span className="text-[11px] text-slate-400">Pace:</span>
            <span className="text-xs font-bold text-emerald-400 font-mono bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
              {playbackSpeed}x
            </span>

            <button
              onClick={handleDownloadWav}
              disabled={!generatedAudio}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all ${
                generatedAudio
                  ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-cyan-500/20 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Audio</span>
            </button>
          </div>
        </div>
      </footer>

      {/* AI Script Polish Modal */}
      <ScriptEnhancerModal
        isOpen={isPolishModalOpen}
        onClose={() => setIsPolishModalOpen(false)}
        currentScript={fullScriptText}
        onApplyScript={(newScript) => {
          setFullScriptText(newScript);
          showToast('Applied AI refined script to Teleprompter!', 'success');
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div
            className={`px-4 py-2.5 rounded-xl text-xs font-medium shadow-2xl flex items-center gap-2 border ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-700/80 shadow-emerald-950/50'
                : toastMessage.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-rose-700/80 shadow-rose-950/50'
                : 'bg-slate-900/95 text-cyan-200 border-cyan-700/60 shadow-cyan-950/50'
            }`}
          >
            {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
            {toastMessage.type === 'info' && <Sparkles className="w-4 h-4 text-cyan-400" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}
    </div>
  );
}
