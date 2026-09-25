import { createCanvas, GlobalFonts, CanvasRenderingContext2D } from '@napi-rs/canvas';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// Register fonts
GlobalFonts.registerFromPath(path.resolve('public/fonts/NotoSansTelugu-Bold.ttf'), 'Noto Sans Telugu');
GlobalFonts.registerFromPath(path.resolve('public/fonts/JetBrainsMono-Bold.ttf'), 'JetBrains Mono');

const WIDTH = 720;
const HEIGHT = 1280;
const FPS = 25;
const DURATION = 70.93;
const TOTAL_FRAMES = Math.ceil(DURATION * FPS);

const audioPath = path.resolve('public/audio/telugu_claude_code_voiceover.wav');
const outputPath = path.resolve('public/video/telugu_claude_code_reel.mp4');

if (!fs.existsSync(audioPath)) {
  console.error('Audio file not found:', audioPath);
  process.exit(1);
}

console.log(`Starting dynamic multi-scene render: ${TOTAL_FRAMES} frames @ ${FPS} fps...`);

// Helper: Wrap text
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
// SCENE 1: (0.0s - 6.5s) Developer Jobs in Risk Alert!
// ----------------------------------------------------
function drawScene1(ctx: CanvasRenderingContext2D, t: number) {
  // Dark red cyber gradient
  const bg = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  bg.addColorStop(0, '#1c0508');
  bg.addColorStop(0.5, '#0a0204');
  bg.addColorStop(1, '#020617');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Animated red pulse border
  const pulse = Math.abs(Math.sin(t * 5));
  ctx.strokeStyle = `rgba(239, 68, 68, ${0.3 + pulse * 0.5})`;
  ctx.lineWidth = 6;
  ctx.strokeRect(16, 16, WIDTH - 32, HEIGHT - 32);

  // Warning Header
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(WIDTH / 2 - 120, 140, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = 'bold 22px "JetBrains Mono"';
  ctx.fillStyle = '#f87171';
  ctx.textAlign = 'center';
  ctx.fillText('⚠️ TECH ALERT: 2026', WIDTH / 2, 148);

  // Big Question Card
  ctx.save();
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 30;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.beginPath();
  ctx.roundRect(40, 260, WIDTH - 80, 420, 28);
  ctx.fill();
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();

  // Radar Scanner Circle
  const cx = WIDTH / 2;
  const cy = 410;
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 90, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, 50, 0, Math.PI * 2);
  ctx.stroke();

  // Radar sweep line
  const angle = t * 4;
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(angle) * 90, cy + Math.sin(angle) * 90);
  ctx.stroke();

  // Warning Label
  ctx.font = 'bold 32px "JetBrains Mono"';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('ARE DEVELOPER', WIDTH / 2, 570);
  ctx.fillStyle = '#ef4444';
  ctx.fillText('JOBS AT RISK?!', WIDTH / 2, 615);

  // Status Badge
  ctx.font = 'bold 15px "JetBrains Mono"';
  ctx.fillStyle = '#fca5a5';
  ctx.fillText('● SYSTEM IMPACT: CRITICAL', WIDTH / 2, 655);
}

// ----------------------------------------------------
// SCENE 2: (6.5s - 14.5s) Anthropic Claude Code Reveal
// ----------------------------------------------------
function drawScene2(ctx: CanvasRenderingContext2D, t: number) {
  // Warm Anthropic terracotta / slate theme
  const bg = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  bg.addColorStop(0, '#1c130d');
  bg.addColorStop(0.5, '#0c0a09');
  bg.addColorStop(1, '#020617');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Header Badge
  ctx.font = 'bold 20px "JetBrains Mono"';
  ctx.fillStyle = '#f59e0b';
  ctx.textAlign = 'center';
  ctx.fillText('✦ ANTHROPIC OFFICIAL RELEASE', WIDTH / 2, 140);

  // Claude Code 3D Window Card
  ctx.save();
  ctx.shadowColor = '#d97706';
  ctx.shadowBlur = 35;
  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  ctx.roundRect(40, 220, WIDTH - 80, 480, 24);
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();

  // Window top bar
  ctx.fillStyle = '#292524';
  ctx.beginPath();
  ctx.roundRect(40, 220, WIDTH - 80, 46, [24, 24, 0, 0]);
  ctx.fill();

  // Dots
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(65, 243, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(85, 243, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(105, 243, 6, 0, Math.PI * 2);
  ctx.fill();

  // Giant Claude Code Title
  ctx.font = 'bold 38px "JetBrains Mono"';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('CLAUDE CODE', WIDTH / 2, 330);

  ctx.font = 'bold 18px "JetBrains Mono"';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('AGENTIC CODING TOOL v1.0', WIDTH / 2, 370);

  // Simulated animated repo tree scan
  const scanY = 420;
  ctx.font = '15px "JetBrains Mono"';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#64748b';
  ctx.fillText('$ claude code --init workspace', 70, scanY);

  const files = [
    '✔ Scanned repository architecture',
    '✔ Indexed 142 source files',
    '✔ Reading AST & dependency tree...',
    '⚡ Autonomous Agent Ready',
  ];

  const visible = Math.min(files.length, Math.floor((t - 6.5) * 1.5) + 1);
  for (let i = 0; i < visible; i++) {
    ctx.fillStyle = i === 3 ? '#34d399' : '#e2e8f0';
    ctx.fillText(files[i], 70, scanY + 36 + i * 32);
  }

  // Live pulsing cursor
  if (Math.floor(t * 3) % 2 === 0) {
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(70, scanY + 36 + visible * 32, 10, 16);
  }
}

// ----------------------------------------------------
// SCENE 3: (14.5s - 22.0s) Contrast: Chatbot vs Terminal Agent
// ----------------------------------------------------
function drawScene3(ctx: CanvasRenderingContext2D, t: number) {
  // Deep slate background
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Header
  ctx.font = 'bold 22px "JetBrains Mono"';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'center';
  ctx.fillText('THE BIG EVOLUTION IN AI', WIDTH / 2, 130);

  // Top Card: Traditional AI (Red/Gray)
  ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
  ctx.beginPath();
  ctx.roundRect(40, 190, WIDTH - 80, 210, 20);
  ctx.fill();
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.font = 'bold 18px "JetBrains Mono"';
  ctx.fillStyle = '#f87171';
  ctx.textAlign = 'left';
  ctx.fillText('❌ TRADITIONAL AI (ChatGPT / Copilot)', 65, 235);
  ctx.font = '15px "JetBrains Mono"';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('• Only writes code inside chatbox', 65, 275);
  ctx.fillText('• Cannot run your terminal commands', 65, 310);
  ctx.fillText('• You must manually copy-paste & test', 65, 345);

  // VS Badge in middle
  ctx.save();
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 20;
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(WIDTH / 2, 425, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = 'bold 18px "JetBrains Mono"';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('VS', WIDTH / 2, 431);
  ctx.restore();

  // Bottom Card: Claude Code Agentic (Green/Cyan)
  ctx.save();
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 25;
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(40, 480, WIDTH - 80, 240, 20);
  ctx.fill();
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();

  ctx.font = 'bold 19px "JetBrains Mono"';
  ctx.fillStyle = '#34d399';
  ctx.textAlign = 'left';
  ctx.fillText('✔ CLAUDE CODE (AGENTIC AI)', 65, 530);
  ctx.font = '15px "JetBrains Mono"';
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText('• Direct access to your OS Terminal', 65, 575);
  ctx.fillText('• Executes bash, git, npm commands', 65, 615);
  ctx.fillText('• Reads real terminal errors & auto-fixes!', 65, 655);
}

// ----------------------------------------------------
// SCENE 4: (22.0s - 32.5s) Live Terminal Auto-Fixing (User Key Highlight!)
// ----------------------------------------------------
function drawScene4(ctx: CanvasRenderingContext2D, t: number) {
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Header Title
  ctx.font = 'bold 20px "JetBrains Mono"';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'center';
  ctx.fillText('⚡ CLAUDE 3.5 SONNET IN TERMINAL', WIDTH / 2, 130);

  // Main Terminal Window
  const termX = 35;
  const termY = 175;
  const termW = WIDTH - 70;
  const termH = 550;

  ctx.save();
  ctx.shadowColor = 'rgba(56, 189, 248, 0.25)';
  ctx.shadowBlur = 30;
  ctx.fillStyle = '#0b1120';
  ctx.beginPath();
  ctx.roundRect(termX, termY, termW, termH, 20);
  ctx.fill();
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // Terminal Window Bar
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(termX, termY, termW, 42, [20, 20, 0, 0]);
  ctx.fill();

  // Dots
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(termX + 22, termY + 21, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(termX + 40, termY + 21, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(termX + 58, termY + 21, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '500 12px "JetBrains Mono"';
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'center';
  ctx.fillText('terminal — claude-code run (autonomous)', termX + termW / 2, termY + 26);

  // Live Terminal Content Animation
  ctx.textAlign = 'left';
  const startX = termX + 24;
  let curY = termY + 74;

  const dt = t - 22.0;

  // Step 1: User command
  ctx.font = 'bold 14px "JetBrains Mono"';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('$ claude code "Fix auth API crash & test"', startX, curY);
  curY += 28;

  // Step 2: Scanning
  if (dt >= 1.0) {
    ctx.font = '13px "JetBrains Mono"';
    ctx.fillStyle = '#64748b';
    ctx.fillText('● Scanning files: src/auth.service.ts (142 files)...', startX, curY);
    curY += 26;
  }

  // Step 3: Command execution
  if (dt >= 2.2) {
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('$ npm test -- --coverage', startX, curY);
    curY += 30;
  }

  // Step 4: Red Error Alert Box
  if (dt >= 3.5) {
    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(startX - 6, curY - 18, termW - 36, 68, 8);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 13px "JetBrains Mono"';
    ctx.fillStyle = '#f87171';
    ctx.fillText('✖ FAIL: src/auth.service.test.ts (2 exceptions)', startX, curY);
    ctx.font = '12px "JetBrains Mono"';
    ctx.fillStyle = '#fca5a5';
    ctx.fillText('  TypeError: Cannot read properties of undefined', startX, curY + 22);
    ctx.fillText('  at line 48: const user = await db.getUser()', startX, curY + 42);
    curY += 84;
  }

  // Step 5: Claude 3.5 Sonnet Auto-Patching
  if (dt >= 6.0) {
    ctx.font = 'bold 13px "JetBrains Mono"';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('⚡ [Claude 3.5 Sonnet: Auto-Fixing Code...]', startX, curY);
    curY += 24;

    ctx.font = '12px "JetBrains Mono"';
    ctx.fillStyle = '#34d399';
    ctx.fillText('+ Applying diff to src/auth.service.ts:48', startX, curY);
    curY += 28;
  }

  // Step 6: Green Success
  if (dt >= 8.5) {
    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(startX - 6, curY - 18, termW - 36, 62, 8);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 14px "JetBrains Mono"';
    ctx.fillStyle = '#4ade80';
    ctx.fillText('✔ PASS: All 18 tests passed (0.42s)!', startX, curY);
    ctx.font = '12px "JetBrains Mono"';
    ctx.fillStyle = '#86efac';
    ctx.fillText('✔ Errors resolved automatically without human intervention!', startX, curY + 24);
  }
}

// ----------------------------------------------------
// SCENE 5: (32.5s - 42.0s) 1 Senior Dev Days of Work in Minutes
// ----------------------------------------------------
function drawScene5(ctx: CanvasRenderingContext2D, t: number) {
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.font = 'bold 20px "JetBrains Mono"';
  ctx.fillStyle = '#f59e0b';
  ctx.textAlign = 'center';
  ctx.fillText('🚀 10X ACCELERATION BENCHMARK', WIDTH / 2, 130);

  // Speedometer / Gauge Card
  ctx.save();
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 30;
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(40, 190, WIDTH - 80, 520, 24);
  ctx.fill();
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  ctx.font = 'bold 15px "JetBrains Mono"';
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'left';
  ctx.fillText('BENCHMARK: FULL REPOSITORY REFACTOR', 70, 240);

  // Traditional Dev Bar
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 16px "JetBrains Mono"';
  ctx.fillText('Senior Developer (Manual):', 70, 290);
  ctx.fillStyle = '#f87171';
  ctx.fillText('3 - 5 Days (40 Hours)', 70, 318);

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(70, 335, WIDTH - 140, 20, 10);
  ctx.fill();
  ctx.fillStyle = '#f87171';
  ctx.beginPath();
  ctx.roundRect(70, 335, (WIDTH - 140) * 0.25, 20, 10);
  ctx.fill();

  // Claude Code Bar
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText('Claude Code (1 Prompt):', 70, 400);
  ctx.fillStyle = '#34d399';
  ctx.fillText('3.5 Minutes ⚡ (Instant Autonomy)', 70, 428);

  const fillProgress = Math.min(1, (t - 32.5) / 4);
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(70, 445, WIDTH - 140, 24, 12);
  ctx.fill();
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.roundRect(70, 445, (WIDTH - 140) * fillProgress, 24, 12);
  ctx.fill();

  // Big Highlight Badge
  ctx.save();
  ctx.shadowColor = '#34d399';
  ctx.shadowBlur = 20;
  ctx.fillStyle = '#064e3b';
  ctx.beginPath();
  ctx.roundRect(70, 520, WIDTH - 140, 140, 16);
  ctx.fill();
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = 'bold 36px "JetBrains Mono"';
  ctx.fillStyle = '#a7f3d0';
  ctx.textAlign = 'center';
  ctx.fillText('99% FASTER', WIDTH / 2, 580);
  ctx.font = 'bold 15px "JetBrains Mono"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('1 PROMPT = 1 FULL SPRINT', WIDTH / 2, 625);
  ctx.restore();
}

// ----------------------------------------------------
// SCENE 6: (42.0s - 51.0s) What is Agentic AI?
// ----------------------------------------------------
function drawScene6(ctx: CanvasRenderingContext2D, t: number) {
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.font = 'bold 20px "JetBrains Mono"';
  ctx.fillStyle = '#a855f7';
  ctx.textAlign = 'center';
  ctx.fillText('🧠 THE SECRET: AGENTIC AI', WIDTH / 2, 130);

  // Center Glowing Loop Box
  ctx.save();
  ctx.shadowColor = '#a855f7';
  ctx.shadowBlur = 35;
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(40, 190, WIDTH - 80, 520, 24);
  ctx.fill();
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();

  // Circular Agentic Loop Nodes
  const cx = WIDTH / 2;
  const cy = 410;
  const radius = 135;

  const steps = [
    { title: '1. PLAN', desc: 'Breakdown Goal', angle: 0 },
    { title: '2. EXECUTE', desc: 'Run Terminal CLI', angle: Math.PI / 2 },
    { title: '3. OBSERVE', desc: 'Check Errors/Logs', angle: Math.PI },
    { title: '4. SELF-HEAL', desc: 'Patch & Retry', angle: (3 * Math.PI) / 2 },
  ];

  // Rotating energy ring
  const rot = t * 1.5;
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Center AI Brain Badge
  ctx.fillStyle = '#581c87';
  ctx.beginPath();
  ctx.arc(cx, cy, 55, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = 'bold 15px "JetBrains Mono"';
  ctx.fillStyle = '#f3e8ff';
  ctx.textAlign = 'center';
  ctx.fillText('AGENTIC', cx, cy - 4);
  ctx.fillText('LOOP', cx, cy + 18);

  // Draw 4 Nodes
  steps.forEach((s) => {
    const x = cx + Math.cos(s.angle + rot) * radius;
    const y = cy + Math.sin(s.angle + rot) * radius;

    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(x, y, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = 'bold 11px "JetBrains Mono"';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(s.title, x, y + 4);
  });

  // Footer explanation
  ctx.font = '14px "JetBrains Mono"';
  ctx.fillStyle = '#e2e8f0';
  ctx.textAlign = 'center';
  ctx.fillText('Autonomous Reasoning + Terminal Execution', WIDTH / 2, 650);
}

// ----------------------------------------------------
// SCENE 7: (51.0s - 61.0s) Career Warning & Future Developers
// ----------------------------------------------------
function drawScene7(ctx: CanvasRenderingContext2D, t: number) {
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.font = 'bold 20px "JetBrains Mono"';
  ctx.fillStyle = '#fbbf24';
  ctx.textAlign = 'center';
  ctx.fillText('⚠️ FUTURE OF DEVELOPERS', WIDTH / 2, 130);

  // Card
  ctx.save();
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 25;
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(40, 190, WIDTH - 80, 520, 24);
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // Top Risk Banner
  ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
  ctx.beginPath();
  ctx.roundRect(65, 230, WIDTH - 130, 150, 16);
  ctx.fill();
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.font = 'bold 16px "JetBrains Mono"';
  ctx.fillStyle = '#f87171';
  ctx.textAlign = 'left';
  ctx.fillText('🔴 HIGH AUTOMATION RISK:', 85, 270);
  ctx.font = '14px "JetBrains Mono"';
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText('• Coders who only write basic syntax', 85, 305);
  ctx.fillText('• Manual boilerplate repetitive tasks', 85, 340);

  // Bottom Opportunity Banner
  ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
  ctx.beginPath();
  ctx.roundRect(65, 410, WIDTH - 130, 230, 16);
  ctx.fill();
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.font = 'bold 16px "JetBrains Mono"';
  ctx.fillStyle = '#34d399';
  ctx.fillText('🟢 10X SURGING DEMAND:', 85, 450);
  ctx.font = '14px "JetBrains Mono"';
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText('• AI Tool & Agent Orchestrators', 85, 490);
  ctx.fillText('• System Architects & Evaluators', 85, 525);
  ctx.fillText('• Developers who manage AI loops', 85, 560);

  ctx.font = 'bold 15px "JetBrains Mono"';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('👉 UPGRADE YOUR SKILLS TODAY!', 85, 605);
}

// ----------------------------------------------------
// SCENE 8: (61.0s - 71.0s) Subscribe Mawa & Community
// ----------------------------------------------------
function drawScene8(ctx: CanvasRenderingContext2D, t: number) {
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.font = 'bold 20px "JetBrains Mono"';
  ctx.fillStyle = '#ef4444';
  ctx.textAlign = 'center';
  ctx.fillText('🔔 SUBSCRIBE & JOIN COMMUNITY', WIDTH / 2, 130);

  // Giant Card
  ctx.save();
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 35;
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(40, 190, WIDTH - 80, 520, 24);
  ctx.fill();
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();

  // Channel Logo / Badge
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(WIDTH / 2, 280, 45, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = 'bold 36px "JetBrains Mono"';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('ST', WIDTH / 2, 292);

  ctx.font = 'bold 24px "JetBrains Mono"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('TELUGU TECH PULSE', WIDTH / 2, 365);
  ctx.font = '14px "JetBrains Mono"';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('AI Tutorials & Tech News in Telugu', WIDTH / 2, 395);

  // Animated Red Subscribe Button
  const scale = 1 + Math.sin(t * 8) * 0.04;
  ctx.save();
  ctx.translate(WIDTH / 2, 470);
  ctx.scale(scale, scale);

  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.roundRect(-140, -28, 280, 56, 28);
  ctx.fill();
  ctx.font = 'bold 20px "JetBrains Mono"';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('SUBSCRIBE 🔔', 0, 8);
  ctx.restore();

  // Bell ring animation
  ctx.font = 'bold 22px "Noto Sans Telugu"';
  ctx.fillStyle = '#fde047';
  ctx.textAlign = 'center';
  ctx.fillText('సబ్స్క్రైబ్ చేసుకోండి మావా!', WIDTH / 2, 570);

  ctx.font = '15px "JetBrains Mono"';
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText('Drop your opinions in comments! 💬', WIDTH / 2, 630);
}

// ----------------------------------------------------
// CLEAN KINETIC SUBTITLES (NO prompt text box!)
// ----------------------------------------------------
const subtitleTimeline = [
  { start: 0.0, end: 6.5, telugu: 'డెవలపర్స్ జాబ్స్ రిస్క్లో ఉన్నాయా??' },
  { start: 6.5, end: 14.5, telugu: 'ఆంథ్రోపిక్ రిలీజ్ చేసిన కొత్త టూల్: క్లాడ్ కోడ్!' },
  { start: 14.5, end: 22.0, telugu: 'ఇప్పటిదాకా చూసిన ఏఐ వేరు... ఈ క్లాడ్ కోడ్ వేరు!' },
  { start: 22.0, end: 27.5, telugu: 'క్లాడ్ 3.5 సోనెట్: టెర్మినల్ కమాండ్స్ ఆటోమేటిక్గా రన్ చేస్తుంది' },
  { start: 27.5, end: 32.5, telugu: 'రియల్ టైమ్లో ఎర్రర్స్ని కూడా సొంతంగా రిజాల్వ్ చేస్తుంది!' },
  { start: 32.5, end: 42.0, telugu: 'ఒక్క ప్రాంప్ట్తో సీనియర్ డెవలపర్ వారం పని కొన్ని నిమిషాల్లో!' },
  { start: 42.0, end: 51.0, telugu: 'అసలు ఇది ఎలా సాధ్యం? దీని వెనుకే ఉంది ఏజెంటిక్ ఏఐ!' },
  { start: 51.0, end: 60.5, telugu: 'ఏఐ టూల్స్ని ఎఫెక్టివ్గా మేనేజ్ చేయగల వాళ్లకే భారీ డిమాండ్!' },
  { start: 60.5, end: 71.0, telugu: 'ఇలాంటి ఇంట్రెస్టింగ్ టెక్ ఫ్యాక్ట్స్ కోసం సబ్స్క్రైబ్ చేసుకోండి మావా!' },
];

function drawSubtitles(ctx: CanvasRenderingContext2D, t: number) {
  const current = subtitleTimeline.find((s) => t >= s.start && t < s.end);
  if (!current) return;

  // Clean, modern floating pill at bottom
  const boxY = 820;
  const boxH = 120;
  const boxW = WIDTH - 80;
  const boxX = 40;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = 15;
  ctx.fillStyle = 'rgba(2, 6, 23, 0.88)';
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, 24);
  ctx.fill();

  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // Glowing Telugu Text (NO English prompt box!)
  ctx.font = 'bold 30px "Noto Sans Telugu"';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  wrapText(ctx, current.telugu, WIDTH / 2, boxY + boxH / 2, boxW - 40, 42);
}

// ----------------------------------------------------
// MAIN RENDER PIPELINE STREAMING INTO FFMPEG
// ----------------------------------------------------
async function main() {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Spawn ffmpeg to read JPEG stream from stdin and mix with audio
  const ff = spawn('ffmpeg', [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'mjpeg',
    '-r', String(FPS),
    '-i', '-',
    '-i', audioPath,
    '-c:v', 'libx264',
    '-profile:v', 'high',
    '-level', '4.0',
    '-preset', 'ultrafast',
    '-crf', '22',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-ar', '44100',
    '-ac', '2',
    '-movflags', '+faststart',
    '-shortest',
    outputPath,
  ]);

  ff.stderr.on('data', (d) => {
    // Optional debug log
  });

  console.log('Rendering frames...');
  const startTime = Date.now();

  for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
    const t = frame / FPS;

    // Pick scene based on dialogue time
    if (t < 6.5) {
      drawScene1(ctx, t);
    } else if (t < 14.5) {
      drawScene2(ctx, t);
    } else if (t < 22.0) {
      drawScene3(ctx, t);
    } else if (t < 32.5) {
      drawScene4(ctx, t);
    } else if (t < 42.0) {
      drawScene5(ctx, t);
    } else if (t < 51.0) {
      drawScene6(ctx, t);
    } else if (t < 60.5) {
      drawScene7(ctx, t);
    } else {
      drawScene8(ctx, t);
    }

    // Clean subtitles
    drawSubtitles(ctx, t);

    // Encode to JPEG buffer and write to ffmpeg stdin
    const buf = canvas.toBuffer('image/jpeg', 80);

    const canWrite = ff.stdin.write(buf);
    if (!canWrite) {
      await new Promise((r) => ff.stdin.once('drain', r));
    }

    if (frame % 200 === 0 || frame === TOTAL_FRAMES - 1) {
      const pct = ((frame / TOTAL_FRAMES) * 100).toFixed(0);
      console.log(`Render progress: ${pct}% (${frame}/${TOTAL_FRAMES} frames, t=${t.toFixed(1)}s)`);
    }
  }

  ff.stdin.end();

  await new Promise<void>((resolve, reject) => {
    ff.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });

  const stat = fs.statSync(outputPath);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nDONE! Rendered ${TOTAL_FRAMES} frames in ${elapsed}s!`);
  console.log(`Output: ${outputPath} (${(stat.size / (1024 * 1024)).toFixed(2)} MB)`);
}

main().catch((err) => {
  console.error('Fatal render error:', err);
  process.exit(1);
});
