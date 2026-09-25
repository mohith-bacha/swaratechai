import { ScriptSegment, YouTubeBranding, SegmentClipMapping, AssetClip } from '../types';

export type CaptionStyle = 'viral_yellow' | 'cyberpunk_cyan' | 'clean_white';
export type AspectRatio = '9:16' | '16:9';

export interface VideoEditorSettings {
  aspectRatio: AspectRatio;
  captionStyle: CaptionStyle;
  showSoundwave: boolean;
  showTerminalAnimation: boolean;
  fontSize: number;
}

// ----------------------------------------------------
// SCENE RENDERERS FOR ASSET LIBRARY CLIPS
// ----------------------------------------------------

// 1. Radar Alert Clip
export function drawRadarAlertClip(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#1c0508');
  bg.addColorStop(0.5, '#0a0204');
  bg.addColorStop(1, '#020617');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Animated red pulse border
  const pulse = Math.abs(Math.sin(t * 5));
  ctx.strokeStyle = `rgba(239, 68, 68, ${0.3 + pulse * 0.4})`;
  ctx.lineWidth = 4;
  ctx.strokeRect(16, 16, w - 32, h - 32);

  // Card
  ctx.save();
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 24;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.beginPath();
  ctx.roundRect(w * 0.08, h * 0.18, w * 0.84, h * 0.46, 24);
  ctx.fill();
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();

  // Radar Scanner
  const cx = w / 2;
  const cy = h * 0.35;
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, w * 0.22, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, w * 0.12, 0, Math.PI * 2);
  ctx.stroke();

  // Radar sweep line
  const angle = t * 4;
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(angle) * (w * 0.22), cy + Math.sin(angle) * (w * 0.22));
  ctx.stroke();

  // Warning text
  ctx.font = 'bold 24px monospace, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('ARE DEVELOPER', w / 2, h * 0.52);
  ctx.fillStyle = '#ef4444';
  ctx.fillText('JOBS AT RISK?!', w / 2, h * 0.57);

  ctx.font = 'bold 12px monospace';
  ctx.fillStyle = '#fca5a5';
  ctx.fillText('● SYSTEM IMPACT: CRITICAL', w / 2, h * 0.61);
}

// 2. Claude Code Live Terminal Session Clip (Real-time auto typing & error solving)
export function drawClaudeTerminalClip(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number
) {
  // Dark terminal base
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, w, h);

  const termX = w * 0.06;
  const termY = h * 0.14;
  const termW = w - termX * 2;
  const termH = h * 0.52;

  ctx.save();
  ctx.shadowColor = 'rgba(56, 189, 248, 0.25)';
  ctx.shadowBlur = 24;
  ctx.fillStyle = '#0b1120';
  ctx.beginPath();
  ctx.roundRect(termX, termY, termW, termH, 18);
  ctx.fill();
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // Window title bar
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(termX, termY, termW, 38, [18, 18, 0, 0]);
  ctx.fill();

  // Window dots
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(termX + 18, termY + 19, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(termX + 34, termY + 19, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(termX + 50, termY + 19, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '500 11px monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'center';
  ctx.fillText('terminal — claude-code: 3.5-sonnet (autonomous)', termX + termW / 2, termY + 23);

  // Live dynamic CLI animation
  ctx.textAlign = 'left';
  const startX = termX + 18;
  let curY = termY + 64;

  const cycleTime = t % 12; // 12 second loop

  // Step 1: User command
  ctx.font = 'bold 12px monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('$ claude code "Fix auth API crash & test"', startX, curY);
  curY += 24;

  // Step 2: Scanning
  if (cycleTime >= 1.0) {
    ctx.font = '11px monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText('● Scanning files: src/auth.service.ts (142 files)...', startX, curY);
    curY += 22;
  }

  // Step 3: Run command
  if (cycleTime >= 2.2) {
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('$ npm test -- --coverage', startX, curY);
    curY += 24;
  }

  // Step 4: Red Error Alert Box
  if (cycleTime >= 3.2) {
    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(startX - 4, curY - 14, termW - 28, 54, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = '#f87171';
    ctx.fillText('✖ FAIL: src/auth.service.test.ts (2 exceptions)', startX, curY);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#fca5a5';
    ctx.fillText('  TypeError: Cannot read properties of undefined', startX, curY + 16);
    ctx.fillText('  at line 48: const user = await db.getUser()', startX, curY + 32);
    curY += 66;
  }

  // Step 5: Claude 3.5 Sonnet Auto-Patching
  if (cycleTime >= 5.5) {
    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('⚡ [Claude 3.5 Sonnet: Auto-Fixing Code...]', startX, curY);
    curY += 20;

    ctx.font = '10px monospace';
    ctx.fillStyle = '#34d399';
    ctx.fillText('+ Applying diff to src/auth.service.ts:48', startX, curY);
    curY += 22;
  }

  // Step 6: Green Success
  if (cycleTime >= 7.5) {
    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(startX - 4, curY - 14, termW - 28, 48, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = '#4ade80';
    ctx.fillText('✔ PASS: All 18 tests passed (0.42s)!', startX, curY);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#86efac';
    ctx.fillText('✔ Errors auto-resolved with zero human intervention!', startX, curY + 18);
  }
}

// 3. Contrast Split Clip (Traditional Chatbot vs Terminal Agent)
export function drawContrastSplitClip(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, w, h);

  // Top Card: Traditional AI
  const cardW = w * 0.88;
  const cardX = (w - cardW) / 2;

  ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
  ctx.beginPath();
  ctx.roundRect(cardX, h * 0.16, cardW, h * 0.21, 16);
  ctx.fill();
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.font = 'bold 14px monospace';
  ctx.fillStyle = '#f87171';
  ctx.textAlign = 'left';
  ctx.fillText('❌ TRADITIONAL AI (ChatGPT / Copilot)', cardX + 16, h * 0.21);
  ctx.font = '12px monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('• Only writes code inside chatbox', cardX + 16, h * 0.25);
  ctx.fillText('• Cannot run your terminal commands', cardX + 16, h * 0.285);
  ctx.fillText('• You must manually copy-paste & test', cardX + 16, h * 0.32);

  // VS Badge
  ctx.save();
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(w / 2, h * 0.405, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = 'bold 13px monospace';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('VS', w / 2, h * 0.41);
  ctx.restore();

  // Bottom Card: Claude Code Agentic
  ctx.save();
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 18;
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(cardX, h * 0.44, cardW, h * 0.23, 16);
  ctx.fill();
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  ctx.font = 'bold 14px monospace';
  ctx.fillStyle = '#34d399';
  ctx.textAlign = 'left';
  ctx.fillText('✔ CLAUDE CODE (AGENTIC AI)', cardX + 16, h * 0.49);
  ctx.font = '12px monospace';
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText('• Direct access to your OS Terminal', cardX + 16, h * 0.53);
  ctx.fillText('• Executes bash, git, npm commands', cardX + 16, h * 0.565);
  ctx.fillText('• Reads real terminal errors & auto-fixes!', cardX + 16, h * 0.60);
}

// 4. Speed Benchmark Clip (40 Hours vs 3.5 Minutes)
export function drawSpeedBenchmarkClip(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, w, h);

  const cardW = w * 0.88;
  const cardX = (w - cardW) / 2;

  ctx.save();
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 24;
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(cardX, h * 0.16, cardW, h * 0.50, 20);
  ctx.fill();
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  ctx.font = 'bold 13px monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'left';
  ctx.fillText('BENCHMARK: FULL REPOSITORY REFACTOR', cardX + 20, h * 0.21);

  // Senior dev bar
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 13px monospace';
  ctx.fillText('Senior Developer (Manual):', cardX + 20, h * 0.26);
  ctx.fillStyle = '#f87171';
  ctx.fillText('3 - 5 Days (40 Hours)', cardX + 20, h * 0.29);

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(cardX + 20, h * 0.31, cardW - 40, 16, 8);
  ctx.fill();
  ctx.fillStyle = '#f87171';
  ctx.beginPath();
  ctx.roundRect(cardX + 20, h * 0.31, (cardW - 40) * 0.25, 16, 8);
  ctx.fill();

  // Claude Code bar
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText('Claude Code (1 Prompt):', cardX + 20, h * 0.38);
  ctx.fillStyle = '#34d399';
  ctx.fillText('3.5 Minutes ⚡ (Instant Autonomy)', cardX + 20, h * 0.41);

  const prog = Math.min(1, ((t * 2) % 6) / 4);
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(cardX + 20, h * 0.43, cardW - 40, 18, 9);
  ctx.fill();
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.roundRect(cardX + 20, h * 0.43, (cardW - 40) * prog, 18, 9);
  ctx.fill();

  // Highlight Box
  ctx.save();
  ctx.fillStyle = '#064e3b';
  ctx.beginPath();
  ctx.roundRect(cardX + 20, h * 0.50, cardW - 40, h * 0.12, 12);
  ctx.fill();
  ctx.strokeStyle = '#10b981';
  ctx.stroke();

  ctx.font = 'bold 28px monospace';
  ctx.fillStyle = '#a7f3d0';
  ctx.textAlign = 'center';
  ctx.fillText('99% FASTER', w / 2, h * 0.56);
  ctx.font = 'bold 12px monospace';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('1 PROMPT = 1 FULL SPRINT', w / 2, h * 0.60);
  ctx.restore();
}

// 5. Agentic AI Neural Brain Core Clip
export function drawAgenticBrainClip(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, w, h);

  const cardW = w * 0.88;
  const cardX = (w - cardW) / 2;

  ctx.save();
  ctx.shadowColor = '#a855f7';
  ctx.shadowBlur = 24;
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(cardX, h * 0.16, cardW, h * 0.50, 20);
  ctx.fill();
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  const cx = w / 2;
  const cy = h * 0.41;
  const radius = w * 0.24;

  const rot = t * 1.5;
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Center core
  ctx.fillStyle = '#581c87';
  ctx.beginPath();
  ctx.arc(cx, cy, 45, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = 'bold 13px monospace';
  ctx.fillStyle = '#f3e8ff';
  ctx.textAlign = 'center';
  ctx.fillText('AGENTIC', cx, cy - 3);
  ctx.fillText('LOOP', cx, cy + 15);

  const steps = ['1. PLAN', '2. EXECUTE', '3. OBSERVE', '4. HEAL'];
  steps.forEach((title, idx) => {
    const angle = (idx * Math.PI) / 2 + rot;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;

    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(title, x, y + 3);
  });
}

// 6. Developer Career Roadmap Clip
export function drawCareerRoadmapClip(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, w, h);

  const cardW = w * 0.88;
  const cardX = (w - cardW) / 2;

  ctx.save();
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 20;
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(cardX, h * 0.16, cardW, h * 0.50, 20);
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // Risk block
  ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
  ctx.beginPath();
  ctx.roundRect(cardX + 16, h * 0.20, cardW - 32, h * 0.18, 12);
  ctx.fill();
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.font = 'bold 13px monospace';
  ctx.fillStyle = '#f87171';
  ctx.textAlign = 'left';
  ctx.fillText('🔴 HIGH AUTOMATION RISK:', cardX + 28, h * 0.24);
  ctx.font = '11px monospace';
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText('• Writing standard boilerplate code', cardX + 28, h * 0.28);
  ctx.fillText('• Repetitive manual testing & fixes', cardX + 28, h * 0.32);

  // Opportunity block
  ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
  ctx.beginPath();
  ctx.roundRect(cardX + 16, h * 0.41, cardW - 32, h * 0.21, 12);
  ctx.fill();
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.font = 'bold 13px monospace';
  ctx.fillStyle = '#34d399';
  ctx.fillText('🟢 10X SURGING DEMAND:', cardX + 28, h * 0.45);
  ctx.font = '11px monospace';
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText('• AI Agent & Tool Orchestrators', cardX + 28, h * 0.49);
  ctx.fillText('• Fullstack Systems Architects', cardX + 28, h * 0.53);
  ctx.fillText('• Prompt & Pipeline Evaluators', cardX + 28, h * 0.57);
}

// 7. YouTube Subscribe & Bell Card Clip (Dynamically displays user's YouTube Name!)
export function drawSubscribeCTAClip(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  branding: YouTubeBranding
) {
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, w, h);

  const cardW = w * 0.88;
  const cardX = (w - cardW) / 2;

  ctx.save();
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 30;
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(cardX, h * 0.16, cardW, h * 0.50, 20);
  ctx.fill();
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();

  // Channel Monogram Logo
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.arc(w / 2, h * 0.27, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = 'bold 28px monospace';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(branding.initials || 'ST', w / 2, h * 0.285);

  // Dynamic Custom YouTube Channel Name!
  ctx.font = 'bold 20px monospace';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(branding.channelName || 'TELUGU TECH PULSE', w / 2, h * 0.36);

  ctx.font = '12px monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(branding.handle || '@telugu_tech_pulse', w / 2, h * 0.395);

  // Animated Subscribe Button
  const scale = 1 + Math.sin(t * 8) * 0.04;
  ctx.save();
  ctx.translate(w / 2, h * 0.48);
  ctx.scale(scale, scale);

  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.roundRect(-110, -22, 220, 44, 22);
  ctx.fill();

  ctx.font = 'bold 15px monospace';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('SUBSCRIBE 🔔', 0, 6);
  ctx.restore();

  // Telugu CTA
  ctx.font = 'bold 18px "Ramabhadra", sans-serif';
  ctx.fillStyle = '#fde047';
  ctx.textAlign = 'center';
  ctx.fillText(branding.ctaTelugu || 'సబ్స్క్రైబ్ చేసుకోండి మావా!', w / 2, h * 0.58);
}

// 8. Matrix Rain Clip
export function drawMatrixRainClip(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = 'rgba(34, 197, 94, 0.7)';
  ctx.font = '14px monospace';

  const chars = '0123456789ABCDEF<>{}/*+=';
  const columns = Math.floor(w / 24);

  for (let i = 0; i < columns; i++) {
    const yOffset = ((t * 120 + i * 40) % h);
    for (let j = 0; j < 6; j++) {
      const char = chars[(i + j + Math.floor(t * 5)) % chars.length];
      const alpha = Math.max(0.1, 1 - j * 0.18);
      ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
      ctx.fillText(char, i * 24 + 10, yOffset - j * 20);
    }
  }
}

// ----------------------------------------------------
// MASTER SCENE DISPATCHER BASED ON ASSET MAPPING
// ----------------------------------------------------
export function drawSceneForClip(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  clipId: string,
  branding: YouTubeBranding,
  customClips?: AssetClip[]
) {
  // Check if custom uploaded clip with a video element
  if (clipId.startsWith('custom_') && customClips) {
    const custom = customClips.find((c) => c.id === clipId);
    if (custom?.videoUrl) {
      // Draw dark frame
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, w, h);

      // Card container
      ctx.save();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(w * 0.08, h * 0.18, w * 0.84, h * 0.46, 20);
      ctx.fill();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = 'bold 16px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'center';
      ctx.fillText('CUSTOM B-ROLL CLIP', w / 2, h * 0.38);
      ctx.font = '12px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(custom.title, w / 2, h * 0.43);
      ctx.restore();
      return;
    }
  }

  // Stock Presets Dispatch
  switch (clipId) {
    case 'clip_radar_alert':
      drawRadarAlertClip(ctx, w, h, t);
      break;
    case 'clip_terminal_claude':
    case 'clip_code_ide':
      drawClaudeTerminalClip(ctx, w, h, t);
      break;
    case 'clip_contrast_split':
      drawContrastSplitClip(ctx, w, h);
      break;
    case 'clip_speed_benchmark':
      drawSpeedBenchmarkClip(ctx, w, h, t);
      break;
    case 'clip_ai_brain':
      drawAgenticBrainClip(ctx, w, h, t);
      break;
    case 'clip_future_careers':
      drawCareerRoadmapClip(ctx, w, h);
      break;
    case 'clip_subscribe_cta':
      drawSubscribeCTAClip(ctx, w, h, t, branding);
      break;
    case 'clip_matrix_stream':
      drawMatrixRainClip(ctx, w, h, t);
      break;
    default:
      drawClaudeTerminalClip(ctx, w, h, t);
      break;
  }
}

// ----------------------------------------------------
// AUDIO WAVEFORM VISUALIZER
// ----------------------------------------------------
export function drawSoundwave(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  isPlaying: boolean,
  time: number
) {
  const waveY = h * 0.69;
  const numBars = 36;
  const barW = Math.max(3, w * 0.016);
  const gap = Math.max(2, w * 0.008);
  const totalW = numBars * (barW + gap) - gap;
  const startX = (w - totalW) / 2;

  for (let i = 0; i < numBars; i++) {
    const x = startX + i * (barW + gap);
    let barH = 6;
    if (isPlaying) {
      const freq = (i + 1) * 0.35;
      const noise = Math.sin(time * 12 + freq) * Math.cos(time * 7 + i * 0.4);
      barH = Math.max(6, Math.abs(noise) * (h * 0.05));
    }

    const grad = ctx.createLinearGradient(0, waveY - barH / 2, 0, waveY + barH / 2);
    grad.addColorStop(0, '#38bdf8');
    grad.addColorStop(1, '#06b6d4');
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.roundRect(x, waveY - barH / 2, barW, barH, 2);
    ctx.fill();
  }
}

// ----------------------------------------------------
// CLEAN KINETIC SUBTITLES (NO prompt text highlight box!)
// ----------------------------------------------------
export function drawCaptions(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  segment: ScriptSegment | null,
  style: CaptionStyle,
  fontSize = 24
) {
  if (!segment) return;

  const text = segment.telugu;
  const translit = segment.transliteration;
  const boxW = w * 0.88;
  const boxH = 100;
  const boxX = (w - boxW) / 2;
  const boxY = h * 0.73;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Floating dark glass pill
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 16;
  ctx.fillStyle = 'rgba(2, 6, 23, 0.88)';
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, 20);
  ctx.fill();

  ctx.strokeStyle = style === 'viral_yellow' ? '#f59e0b' : '#06b6d4';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Pure Telugu Script (clean typography, no prompt tag clutter!)
  ctx.font = `bold ${fontSize}px "Ramabhadra", sans-serif`;
  if (style === 'viral_yellow') {
    ctx.fillStyle = '#fde047';
    ctx.shadowColor = '#b45309';
    ctx.shadowBlur = 10;
  } else if (style === 'cyberpunk_cyan') {
    ctx.fillStyle = '#67e8f9';
    ctx.shadowColor = '#0891b2';
    ctx.shadowBlur = 12;
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 0;
  }

  wrapText(ctx, text, w / 2, boxY + 38, boxW - 32, fontSize * 1.3);

  // Romanized transliteration
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'italic 11px monospace';
  ctx.fillText(translit.slice(0, 52) + (translit.length > 52 ? '...' : ''), w / 2, boxY + 76);

  ctx.restore();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let curY = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, curY);
}

// ----------------------------------------------------
// DYNAMIC CREATOR BRANDING & WATERMARK
// ----------------------------------------------------
export function drawOverlays(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  branding: YouTubeBranding,
  time: number
) {
  ctx.save();

  // Top Header Banner with YouTube Channel Name
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.beginPath();
  ctx.roundRect(w * 0.06, 24, w * 0.88, 36, 18);
  ctx.fill();
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Red live indicator dot
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(w * 0.06 + 20, 42, 4.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(branding.channelName || 'TELUGU TECH PULSE', w * 0.06 + 32, 46);

  ctx.textAlign = 'right';
  ctx.font = '10px monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('CLAUDE CODE & AGENTIC AI', w * 0.94 - 14, 46);

  // Bottom Watermark with custom handle
  if (branding.showWatermark) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
    ctx.font = '500 12px monospace';
    ctx.fillText(`${branding.handle || '@telugu_tech_pulse'} • SwaraTech Studio`, w / 2, h - 34);
  }

  // Subscribe prompt at the end
  if (time > 60) {
    const subAlpha = Math.min(1, (time - 60) * 2);
    ctx.globalAlpha = subAlpha;
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.roundRect(w / 2 - 110, h - 90, 220, 36, 18);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px "Ramabhadra", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🔔 ${branding.ctaTelugu || 'సబ్స్క్రైబ్ చేసుకోండి మావా!'}`, w / 2, h - 67);
  }

  ctx.restore();
}
