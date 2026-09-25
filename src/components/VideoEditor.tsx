import React, { useRef, useEffect, useState } from 'react';
import { ScriptSegment, YouTubeBranding, SegmentClipMapping, AssetClip } from '../types';
import {
  CaptionStyle,
  AspectRatio,
  VideoEditorSettings,
  drawSceneForClip,
  drawSoundwave,
  drawCaptions,
  drawOverlays,
} from '../services/videoRenderer';
import {
  DEFAULT_YOUTUBE_BRANDING,
  BUILT_IN_ASSET_CLIPS,
  DEFAULT_SEGMENT_MAPPINGS,
} from '../data/assetClips';
import { ChannelBrandingModal } from './ChannelBrandingModal';
import { AssetLibraryModal } from './AssetLibraryModal';
import { downloadMp4File } from '../utils/downloadHelper';
import {
  Play,
  Pause,
  RotateCcw,
  Video,
  Download,
  Sliders,
  Layers,
  Sparkles,
  Smartphone,
  Tv,
  CheckCircle2,
  Settings2,
  Film,
  Youtube,
  Edit3,
  ExternalLink,
} from 'lucide-react';

interface VideoEditorProps {
  audioUrl: string;
  segments: ScriptSegment[];
  durationSec: number;
  onClose?: () => void;
}

export const VideoEditor: React.FC<VideoEditorProps> = ({
  audioUrl,
  segments,
  durationSec,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);

  const [editorTab, setEditorTab] = useState<'rendered_video' | 'live_studio'>('rendered_video');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // Asset Library & Custom Uploads state
  const [clips, setClips] = useState<AssetClip[]>(() => {
    return BUILT_IN_ASSET_CLIPS;
  });
  const [mappings, setMappings] = useState<SegmentClipMapping>(() => {
    return DEFAULT_SEGMENT_MAPPINGS;
  });

  // YouTube Channel Name & Branding
  const [branding, setBranding] = useState<YouTubeBranding>(() => {
    const saved = localStorage.getItem('swaratech_youtube_branding');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_YOUTUBE_BRANDING;
  });

  // Modals state
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState(false);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [targetSegmentForModal, setTargetSegmentForModal] = useState<number | null>(null);

  // Video Settings
  const [settings, setSettings] = useState<VideoEditorSettings>({
    aspectRatio: '9:16',
    captionStyle: 'viral_yellow',
    showSoundwave: true,
    showTerminalAnimation: true,
    fontSize: 22,
  });

  // Save branding to localStorage
  const handleSaveBranding = (updated: YouTubeBranding) => {
    setBranding(updated);
    localStorage.setItem('swaratech_youtube_branding', JSON.stringify(updated));
  };

  // Add custom uploaded clip
  const handleAddCustomClip = (newClip: AssetClip) => {
    setClips((prev) => [newClip, ...prev]);
  };

  const handleDeleteCustomClip = (clipId: string) => {
    setClips((prev) => prev.filter((c) => c.id !== clipId));
    // Reset any mapping that used this clip back to default
    const updated = { ...mappings };
    Object.keys(updated).forEach((key) => {
      const numKey = Number(key);
      if (updated[numKey] === clipId) {
        updated[numKey] = DEFAULT_SEGMENT_MAPPINGS[numKey] || 'clip_terminal_claude';
      }
    });
    setMappings(updated);
  };

  const [isDownloadingMp4, setIsDownloadingMp4] = useState(false);

  const handleDownloadMp4 = () => {
    setIsDownloadingMp4(true);
    const filename = `${branding.channelName.toLowerCase().replace(/\s+/g, '_')}_claude_reel.mp4`;
    downloadMp4File(
      filename,
      () => {},
      () => {
        setIsDownloadingMp4(false);
      },
      () => {
        setIsDownloadingMp4(false);
      }
    );
  };

  // Dimensions
  const canvasWidth = settings.aspectRatio === '9:16' ? 450 : 800;
  const canvasHeight = settings.aspectRatio === '9:16' ? 800 : 450;

  // Active segment detection
  const activeSegmentIndex = Math.min(
    segments.length - 1,
    Math.max(0, Math.floor((currentTime / (durationSec || 70.9)) * segments.length))
  );
  const activeSegment = segments[activeSegmentIndex] || segments[0] || null;

  // Animation Loop for rendering canvas
  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      const t = audioRef.current?.currentTime || currentTime;

      // 1. Get assigned clip for active segment
      const currentClipId = activeSegment
        ? mappings[activeSegment.id] || 'clip_terminal_claude'
        : 'clip_terminal_claude';

      // 2. Draw Scene for this clip
      drawSceneForClip(ctx, w, h, t, currentClipId, branding, clips);

      // 3. Draw Soundwave if enabled
      if (settings.showSoundwave) {
        drawSoundwave(ctx, w, h, isPlaying, t);
      }

      // 4. Draw Clean Kinetic Captions (NO prompt text highlight box!)
      drawCaptions(ctx, w, h, activeSegment, settings.captionStyle, settings.fontSize);

      // 5. Draw Overlays & Creator YouTube Branding
      drawOverlays(ctx, w, h, branding, t);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [settings, isPlaying, activeSegment, activeSegmentIndex, currentTime, mappings, branding, clips]);

  // Audio time update sync
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const playPromiseRef = useRef<Promise<void> | null>(null);

  const safePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      const promise = audio.play();
      playPromiseRef.current = promise;
      await promise;
      setIsPlaying(true);
    } catch (err: any) {
      if (err.name !== 'AbortError' && !err.message?.includes('interrupted')) {
        console.warn('Audio playback notice:', err);
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
        })
        .catch(() => {
          try {
            audio.pause();
          } catch (e) {}
          setIsPlaying(false);
        });
    } else {
      try {
        audio.pause();
      } catch (e) {}
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      safePause();
    } else {
      safePlay();
    }
  };

  const switchEditorTab = (tab: 'rendered_video' | 'live_studio') => {
    safePause();
    if (videoPlayerRef.current) {
      try {
        videoPlayerRef.current.pause();
      } catch (e) {}
    }
    setEditorTab(tab);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      safePause();
      if (videoPlayerRef.current) {
        try {
          videoPlayerRef.current.pause();
        } catch (e) {}
      }
    };
  }, []);

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Video Export using MediaRecorder API
  const handleExportVideo = async () => {
    const canvas = canvasRef.current;
    const audio = audioRef.current;
    if (!canvas || !audio) return;

    try {
      setIsExporting(true);
      setExportProgress(0);
      setDownloadUrl(null);

      audio.currentTime = 0;
      safePause();

      const canvasStream = canvas.captureStream(30);
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioCtx.createMediaElementSource(audio);
      const dest = audioCtx.createMediaStreamDestination();
      source.connect(dest);
      source.connect(audioCtx.destination);

      const combinedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...dest.stream.getAudioTracks(),
      ]);

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const recorder = new MediaRecorder(combinedStream, {
        mimeType,
        videoBitsPerSecond: 4_000_000,
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setIsExporting(false);
        setExportProgress(100);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${branding.channelName.toLowerCase().replace(/\s+/g, '_')}_claude_reel.webm`;
        a.click();
      };

      recorder.start(1000);
      safePlay();

      const totalSec = durationSec || 70.9;
      const interval = setInterval(() => {
        if (audio.ended || audio.currentTime >= totalSec) {
          clearInterval(interval);
          recorder.stop();
          safePause();
        } else {
          setExportProgress(Math.min(99, Math.round((audio.currentTime / totalSec) * 100)));
        }
      }, 300);
    } catch (err) {
      console.error('Export video failed:', err);
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Audio element sync */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        preload="auto"
      />

      {/* Top Banner with Action Buttons */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-cyan-950/60 border border-blue-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Video className="w-5 h-5 text-cyan-400" />
              <span>Telugu Reel & Short Video Studio</span>
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              Multi-Scene Dynamic Video
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic scene clippings synced with Telugu dialogue, custom YouTube channel branding, and native kinetic subtitles.
          </p>
        </div>

        {/* Action Buttons: Asset Library, YouTube Name, and Direct Download */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Asset Library Button */}
          <button
            onClick={() => {
              setTargetSegmentForModal(null);
              setIsAssetModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Film className="w-3.5 h-3.5 text-cyan-400" />
            <span>Asset Library ({clips.length})</span>
          </button>

          {/* YouTube Channel Name Button */}
          <button
            onClick={() => setIsBrandingModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Youtube className="w-3.5 h-3.5 fill-current text-red-400" />
            <span className="truncate max-w-[130px] font-bold">{branding.channelName}</span>
            <Edit3 className="w-3 h-3 text-red-400/80" />
          </button>

          {/* Download Rendered MP4 */}
          <button
            onClick={handleDownloadMp4}
            disabled={isDownloadingMp4}
            className="px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/25 active:scale-95 transition-all disabled:opacity-75"
            title="Download desktop-compatible MP4 file"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloadingMp4 ? 'Downloading...' : 'Download .MP4'}</span>
          </button>
        </div>
      </div>

      {/* Editor View Mode Tabs */}
      <div className="flex bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold max-w-md mx-auto sm:mx-0">
        <button
          onClick={() => switchEditorTab('rendered_video')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
            editorTab === 'rendered_video'
              ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/30 shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Watch Short Video (.MP4)</span>
        </button>
        <button
          onClick={() => switchEditorTab('live_studio')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
            editorTab === 'live_studio'
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Live Studio & Re-Renderer</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: RENDERED MULTI-SCENE VIDEO PLAYER & SCENE TIMELINE      */}
      {/* ============================================================== */}
      {editorTab === 'rendered_video' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
          {/* Video Player (9:16 Vertical Phone Frame) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[340px] sm:max-w-[360px] rounded-[36px] overflow-hidden border-4 border-slate-800 shadow-2xl bg-black shadow-cyan-950/40">
              <video
                ref={videoPlayerRef}
                src="/video/telugu_claude_code_reel.mp4"
                controls
                playsInline
                className="w-full h-auto object-cover aspect-[9/16]"
                poster="/video/telugu_claude_code_reel.mp4#t=1"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-mono">
              720 × 1280 (9:16 Vertical) • Multi-Scene Video • H.264 / AAC
            </p>
          </div>

          {/* Video Specs & Scene Mapping Breakdown */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* YouTube Branding & Video Header Card */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center font-black text-sm">
                  {branding.initials}
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Active YouTube Channel</div>
                  <div className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                    <span>{branding.channelName}</span>
                    <span className="text-xs text-slate-400 font-mono">({branding.handle})</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsBrandingModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Change Name</span>
              </button>
            </div>

            {/* Scene-by-Scene Video Clipping Mapping */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5" />
                    <span>Synchronized Video Clippings ({segments.length} Beats)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Different scenes play according to the audio dialogue (e.g. terminal execution during Claude Sonnet).
                  </p>
                </div>

                <button
                  onClick={() => setIsAssetModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Map Clips</span>
                </button>
              </div>

              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
                {segments.map((seg, idx) => {
                  const segStart = Math.floor((idx / segments.length) * (durationSec || 70.9));
                  const segEnd = Math.floor(((idx + 1) / segments.length) * (durationSec || 70.9));
                  const clipId = mappings[seg.id] || 'clip_terminal_claude';
                  const clip = clips.find((c) => c.id === clipId);

                  return (
                    <div
                      key={seg.id}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-750 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono text-[10px] shrink-0 border border-slate-800">
                          {segStart}s - {segEnd}s
                        </span>
                        <div className="truncate">
                          <div className="font-['Ramabhadra'] text-slate-200 truncate max-w-sm">
                            {seg.telugu}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono truncate">
                            {seg.transliteration}
                          </div>
                        </div>
                      </div>

                      {/* Video Clip Indicator & Switcher */}
                      <button
                        onClick={() => {
                          setTargetSegmentForModal(seg.id);
                          setIsAssetModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 border border-cyan-500/30 text-cyan-300 text-[11px] font-medium flex items-center gap-1.5 shrink-0 transition-colors"
                        title="Change clip for this dialogue"
                      >
                        <Film className="w-3 h-3 text-cyan-400" />
                        <span className="truncate max-w-[130px] font-mono">
                          {clip ? clip.title : 'Clip'}
                        </span>
                        <Edit3 className="w-2.5 h-2.5 text-slate-500 ml-1" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Download & Social Share Box */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div>
                <div className="font-bold text-slate-200">Ready to post on YouTube Shorts & Reels?</div>
                <div className="text-[11px] text-slate-400">
                  Clean native subtitles, no prompt text clutter, customized with {branding.channelName}.
                </div>
              </div>
              <button
                onClick={handleDownloadMp4}
                disabled={isDownloadingMp4}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shrink-0 disabled:opacity-75"
              >
                <Download className="w-4 h-4" />
                <span>{isDownloadingMp4 ? 'Downloading MP4...' : 'Download .MP4'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: LIVE CANVAS STUDIO & RE-RENDERER                        */}
      {/* ============================================================== */}
      {editorTab === 'live_studio' && (
        <div>
          {/* Export Progress Bar */}
          {isExporting && (
            <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/40 space-y-2 animate-in fade-in mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                  Recording Canvas & Synced Telugu Audio...
                </span>
                <span className="font-mono text-slate-300">{exportProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Please keep this tab open while the browser records your full video. The download will start automatically!
              </p>
            </div>
          )}

          {/* Download Ready Alert */}
          {downloadUrl && !isExporting && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between gap-3 text-xs text-emerald-200 mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Your custom video has been rendered and exported!</span>
              </div>
              <a
                href={downloadUrl}
                download={`${branding.channelName.toLowerCase().replace(/\s+/g, '_')}_reel.webm`}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 shrink-0"
              >
                Download Again
              </a>
            </div>
          )}

          {/* Main Studio Editor Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Interactive Canvas Video Preview (7 cols) */}
            <div className="lg:col-span-7 flex flex-col items-center gap-3">
              <div className="relative rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl bg-black flex items-center justify-center max-w-full">
                <canvas
                  ref={canvasRef}
                  width={canvasWidth}
                  height={canvasHeight}
                  className="max-h-[560px] w-auto object-contain cursor-pointer transition-all"
                  onClick={togglePlay}
                />

                {/* Play Overlay Button */}
                <button
                  onClick={togglePlay}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-slate-950/70 backdrop-blur-md border border-cyan-500/40 text-cyan-300 flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all opacity-80 hover:opacity-100"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  )}
                </button>
              </div>

              {/* Player Transport Bar */}
              <div className="w-full max-w-md flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <button
                  onClick={togglePlay}
                  className="p-2 rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                </button>

                <button
                  onClick={() => handleSeek(0)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                  title="Restart"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Progress Scrub */}
                <input
                  type="range"
                  min="0"
                  max={durationSec || 70.9}
                  step="0.1"
                  value={currentTime}
                  onChange={(e) => handleSeek(parseFloat(e.target.value))}
                  className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />

                <span className="font-mono text-slate-400 text-[11px] w-14 text-right">
                  {Math.floor(currentTime)}s / {Math.floor(durationSec || 70.9)}s
                </span>
              </div>
            </div>

            {/* Right: Video Styling & Scene Settings (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Asset Library & YouTube Customizer Quick Panel */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Dynamic Video Cliping & Branding</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setTargetSegmentForModal(null);
                      setIsAssetModalOpen(true);
                    }}
                    className="p-3 rounded-xl bg-slate-950 border border-cyan-500/40 hover:border-cyan-400 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Film className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                        {clips.length}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-100">Asset Library</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Upload or map video clips</div>
                  </button>

                  <button
                    onClick={() => setIsBrandingModalOpen(true)}
                    className="p-3 rounded-xl bg-slate-950 border border-red-500/40 hover:border-red-400 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Youtube className="w-4 h-4 text-red-400 fill-current group-hover:scale-110 transition-transform" />
                      <Edit3 className="w-3 h-3 text-slate-500" />
                    </div>
                    <div className="text-xs font-bold text-slate-100 truncate">{branding.channelName}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Edit channel name & handle</div>
                  </button>
                </div>
              </div>

              {/* Format / Aspect Ratio */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Video Format & Aspect Ratio</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSettings({ ...settings, aspectRatio: '9:16' })}
                    className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      settings.aspectRatio === '9:16'
                        ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 ring-1 ring-cyan-400/40'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>9:16 Vertical Reel</span>
                  </button>

                  <button
                    onClick={() => setSettings({ ...settings, aspectRatio: '16:9' })}
                    className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      settings.aspectRatio === '16:9'
                        ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 ring-1 ring-cyan-400/40'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Tv className="w-4 h-4" />
                    <span>16:9 Landscape</span>
                  </button>
                </div>
              </div>

              {/* Caption Style (No prompt box clutter!) */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Clean Telugu Caption Typography</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSettings({ ...settings, captionStyle: 'viral_yellow' })}
                    className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                      settings.captionStyle === 'viral_yellow'
                        ? 'border-amber-400 bg-amber-950/30 text-amber-300 ring-1 ring-amber-400/40'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400'
                    }`}
                  >
                    Viral Yellow
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, captionStyle: 'cyberpunk_cyan' })}
                    className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                      settings.captionStyle === 'cyberpunk_cyan'
                        ? 'border-cyan-400 bg-cyan-950/30 text-cyan-300 ring-1 ring-cyan-400/40'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400'
                    }`}
                  >
                    Cyber Cyan
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, captionStyle: 'clean_white' })}
                    className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                      settings.captionStyle === 'clean_white'
                        ? 'border-white bg-slate-800 text-white ring-1 ring-white/40'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400'
                    }`}
                  >
                    Clean White
                  </button>
                </div>
              </div>

              {/* Export Button */}
              <button
                onClick={handleExportVideo}
                disabled={isExporting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? `Exporting Video (${exportProgress}%)...` : 'Export Custom Video (.WEBM)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Asset Library Modal */}
      <AssetLibraryModal
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        clips={clips}
        segments={segments}
        mappings={mappings}
        onUpdateMappings={setMappings}
        onAddCustomClip={handleAddCustomClip}
        onDeleteCustomClip={handleDeleteCustomClip}
        targetSegmentId={targetSegmentForModal}
      />

      {/* YouTube Channel Branding Modal */}
      <ChannelBrandingModal
        isOpen={isBrandingModalOpen}
        onClose={() => setIsBrandingModalOpen(false)}
        branding={branding}
        onSave={handleSaveBranding}
      />
    </div>
  );
};
