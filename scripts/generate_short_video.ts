import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/video');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const audioPath = path.resolve('public/audio/telugu_claude_code_voiceover.wav');
if (!fs.existsSync(audioPath)) {
  console.error('Audio file not found at:', audioPath);
  process.exit(1);
}

const fontTelugu = path.resolve('public/fonts/NotoSansTelugu-Bold.ttf');
const fontMono = path.resolve('public/fonts/JetBrainsMono-Bold.ttf');
const outputPath = path.join(outDir, 'telugu_claude_code_reel.mp4');

// Escape font paths for ffmpeg filter syntax
const fTelugu = fontTelugu.replace(/\\/g, '/').replace(/:/g, '\\:');
const fMono = fontMono.replace(/\\/g, '/').replace(/:/g, '\\:');

console.log('Rendering vertical 9:16 Short Video with ffmpeg...');
console.log('Audio Source:', audioPath);
console.log('Output Destination:', outputPath);

// We define timed subtitle segments (start, end, telugu, transliteration, tag)
const scenes = [
  {
    start: 0,
    end: 6.5,
    tag: '🔥 HOOK ALERT',
    telugu: 'డెవలపర్స్ జాబ్స్ రిస్క్లో ఉన్నాయా??',
    translit: 'Developers jobs risk lo unnaya??',
    code: '$ claude code --check-industry-impact',
  },
  {
    start: 6.5,
    end: 14.5,
    tag: '⚡ NEW AI TOOL',
    telugu: 'ఆంథ్రోపిక్ రిలీజ్ చేసిన కొత్త టూల్: క్లాడ్ కోడ్!',
    translit: 'Anthropic release chesina kotha tool: Claude Code!',
    code: '$ claude agent --scan-repository-tree',
  },
  {
    start: 14.5,
    end: 22.0,
    tag: '💡 BIG DIFFERENCE',
    telugu: 'కేవలం కోడ్ రాయడం కాదు... టెర్మినల్లో రన్ చేస్తుంది!',
    translit: 'Kevalam code rayadam kaadu... Terminal lo run chestundi!',
    code: '✓ Found 142 files in repo (0.3s)',
  },
  {
    start: 22.0,
    end: 32.5,
    tag: '🚀 BREAKTHROUGH',
    telugu: 'క్లాడ్ 3.5 సోనెట్: ఎర్రర్స్ని ఆటోమేటిక్గా రిజాల్వ్ చేస్తుంది',
    translit: 'Claude 3.5 Sonnet: Errors ni auto-resolve chestundi',
    code: '⚡ Executing bash commands in real-time...',
  },
  {
    start: 32.5,
    end: 42.0,
    tag: '⏱️ 10X SPEED',
    telugu: 'సీనియర్ డెవలపర్ వారం రోజుల పని కొన్ని నిమిషాల్లో!',
    translit: 'Senior developer days work done in minutes!',
    code: '✔ Auto-fixed 2 syntax exceptions (1.4s)',
  },
  {
    start: 42.0,
    end: 51.0,
    tag: '🧠 AGENTIC AI',
    telugu: 'అసలు ఇది ఎలా సాధ్యం? దీని వెనుక ఉంది ఏజెంటిక్ ఏఐ!',
    translit: 'Asalu ela saadhyam? Deeni venuka Agentic AI!',
    code: '● Agentic loop: Plan -> Execute -> Self-Heal',
  },
  {
    start: 51.0,
    end: 60.5,
    tag: '⚠️ CAREER WARNING',
    telugu: 'ఏఐ టూల్స్ని మేనేజ్ చేయగల వాళ్లకే ఇకపై భారీ డిమాండ్!',
    translit: 'AI tools manage chese vallake demand perugutundi!',
    code: '➜ Warning: Upskill in AI orchestration',
  },
  {
    start: 60.5,
    end: 71.0,
    tag: '🔔 SUBSCRIBE MAWA',
    telugu: 'ఇలాంటి ఇంట్రెస్టింగ్ టెక్ ఫ్యాక్ట్స్ కోసం సబ్స్క్రైబ్ చేసుకోండి మావా!',
    translit: 'Subscribe to our channel mawa! Drop your thoughts below.',
    code: '$ echo "Channel subscribe cheskondi mawa!"',
  },
];

// Build complex filter for ffmpeg
// 1. Generate 720x1280 9:16 background
// 2. Generate animated showwaves audio waveform
// 3. Draw Terminal Box
// 4. Draw Header banner
// 5. Draw Timed drawtext for each scene (Telugu text + Transliteration + Code log + Tag)
let drawTextFilters: string[] = [];

// Header Banner
drawTextFilters.push(
  `drawtext=fontfile='${fMono}':text='TELUGU TECH REEL':fontcolor=0x38bdf8:fontsize=22:x=(w-text_w)/2:y=90:box=1:boxcolor=0x0f172a@0.85:boxborderw=12`
);
drawTextFilters.push(
  `drawtext=fontfile='${fMono}':text='CLAUDE CODE & AGENTIC AI':fontcolor=0xffffff:fontsize=28:x=(w-text_w)/2:y=135`
);

// Terminal Window Frame Mockup
drawTextFilters.push(
  `drawbox=x=45:y=210:w=630:h=420:color=0x0f172a@0.95:t=fill`
);
drawTextFilters.push(
  `drawbox=x=45:y=210:w=630:h=420:color=0x1e293b:t=2`
);
drawTextFilters.push(
  `drawbox=x=45:y=210:w=630:h=46:color=0x1e293b@0.9:t=fill`
);
drawTextFilters.push(
  `drawtext=fontfile='${fMono}':text='● ● ●  claude-code — agentic-cli: 3.5-sonnet':fontcolor=0x94a3b8:fontsize=16:x=65:y=226`
);

// Scene by scene terminal code + subtitles
scenes.forEach((s) => {
  const enableCondition = `between(t,${s.start},${s.end})`;

  // Terminal active command log
  drawTextFilters.push(
    `drawtext=fontfile='${fMono}':text='${s.code}':fontcolor=0x38bdf8:fontsize=20:x=70:y=285:enable='${enableCondition}'`
  );

  // Subtitle Container Card
  drawTextFilters.push(
    `drawbox=x=40:y=820:w=640:h=230:color=0x020617@0.92:t=fill:enable='${enableCondition}'`
  );
  drawTextFilters.push(
    `drawbox=x=40:y=820:w=640:h=230:color=0x06b6d4:t=3:enable='${enableCondition}'`
  );

  // Tag Badge
  drawTextFilters.push(
    `drawtext=fontfile='${fMono}':text='${s.tag}':fontcolor=0xfde047:fontsize=18:x=(w-text_w)/2:y=845:enable='${enableCondition}'`
  );

  // Native Telugu Script
  drawTextFilters.push(
    `drawtext=fontfile='${fTelugu}':text='${s.telugu}':fontcolor=0xffffff:fontsize=30:x=(w-text_w)/2:y=900:enable='${enableCondition}'`
  );

  // Romanized Transliteration
  drawTextFilters.push(
    `drawtext=fontfile='${fMono}':text='${s.translit}':fontcolor=0x67e8f9:fontsize=17:x=(w-text_w)/2:y=975:enable='${enableCondition}'`
  );
});

// Footer Watermark
drawTextFilters.push(
  `drawtext=fontfile='${fMono}':text='@telugu_tech_pulse • SwaraTech AI':fontcolor=0x64748b:fontsize=18:x=(w-text_w)/2:y=1220`
);

const filterChain = [
  // Base 720x1280 dark gradient background
  `color=c=0x040814:s=720x1280:d=71[bg]`,
  // Soundwave visualization from audio
  `[0:a]showwaves=s=600x120:mode=line:colors=0x06b6d4:rate=30[waves]`,
  // Overlay waveform onto background at y=670
  `[bg][waves]overlay=x=(W-w)/2:y=670[v1]`,
  // Apply all drawtext and drawbox overlays
  `[v1]${drawTextFilters.join(',')}[vout]`,
].join(';');

const cmd = [
  'ffmpeg',
  '-y',
  '-i', `"${audioPath}"`,
  '-filter_complex', `"${filterChain}"`,
  '-map', '"[vout]"',
  '-map', '0:a',
  '-c:v', 'libx264',
  '-preset', 'ultrafast',
  '-crf', '22',
  '-pix_fmt', 'yuv420p',
  '-c:a', 'aac',
  '-b:a', '192k',
  '-shortest',
  `"${outputPath}"`,
].join(' ');

console.log('Executing ffmpeg command...');
try {
  execSync(cmd, { stdio: 'inherit' });
  const stat = fs.statSync(outputPath);
  console.log(`Video created successfully: ${outputPath} (${(stat.size / (1024 * 1024)).toFixed(2)} MB)`);
} catch (err) {
  console.error('ffmpeg execution error:', err);
  process.exit(1);
}
