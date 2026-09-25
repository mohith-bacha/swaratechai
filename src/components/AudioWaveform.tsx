import React, { useEffect, useRef } from 'react';

interface AudioWaveformProps {
  isPlaying: boolean;
  progress: number; // 0 to 1
  onSeek: (ratio: number) => void;
  accentColor?: string;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isPlaying,
  progress,
  onSeek,
  accentColor = '#06b6d4', // cyan-500
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Generate deterministic bar heights for consistent visual waveform
  const barCount = 72;
  const barsRef = useRef<number[]>([]);

  if (barsRef.current.length === 0) {
    const bars: number[] = [];
    for (let i = 0; i < barCount; i++) {
      // Natural speech-like envelope: rises, peaks, pauses, high energy middle
      const x = i / barCount;
      const envelope = Math.sin(x * Math.PI);
      const randomNoise = 0.3 + 0.7 * Math.abs(Math.sin(i * 12.3) * Math.cos(i * 4.7));
      bars.push(Math.max(0.12, envelope * randomNoise));
    }
    barsRef.current = bars;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const barWidth = (width / barCount) * 0.65;
      const barGap = (width / barCount) * 0.35;

      const activeBarIndex = Math.floor(progress * barCount);

      barsRef.current.forEach((baseHeight, i) => {
        let currentHeight = baseHeight;

        if (isPlaying) {
          // Add subtle dynamic bounce while playing
          const wave = Math.sin(phase + i * 0.3) * 0.18;
          currentHeight = Math.max(0.08, Math.min(1.0, baseHeight + wave));
        }

        const h = currentHeight * (height * 0.85);
        const x = i * (barWidth + barGap);
        const y = (height - h) / 2;

        const isPast = i <= activeBarIndex;

        // Gradient styling
        const grad = ctx.createLinearGradient(0, y, 0, y + h);
        if (isPast) {
          grad.addColorStop(0, '#38bdf8'); // sky-400
          grad.addColorStop(1, '#06b6d4'); // cyan-500
        } else {
          grad.addColorStop(0, '#334155'); // slate-700
          grad.addColorStop(1, '#1e293b'); // slate-800
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        // Rounded bar
        ctx.roundRect(x, y, barWidth, h, 3);
        ctx.fill();

        // Glow for current active playhead bar
        if (i === activeBarIndex && isPlaying) {
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 10;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.roundRect(x - 1, y - 2, barWidth + 2, h + 4, 3);
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      });

      if (isPlaying) {
        phase += 0.12;
      }
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, progress, accentColor]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio);
  };

  return (
    <div className="relative w-full h-24 bg-slate-900/90 rounded-xl border border-slate-800/80 p-3 shadow-inner flex flex-col justify-between overflow-hidden group">
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 pointer-events-none" />

      {/* Scrubber Canvas */}
      <canvas
        ref={canvasRef}
        width={640}
        height={96}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-pointer relative z-10"
        title="Click to jump / scrub audio"
      />

      {/* Progress percentage indicator */}
      <div className="absolute top-1.5 right-3 text-[10px] font-mono text-slate-400 pointer-events-none">
        {Math.round(progress * 100)}%
      </div>
    </div>
  );
};
