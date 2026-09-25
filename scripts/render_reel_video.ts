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

const fontsDir = path.resolve('public/fonts');
const outputPath = path.join(outDir, 'telugu_claude_code_reel.mp4');
const assPath = path.join(outDir, 'subtitles.ass');

console.log('Building ASS subtitle track...');

// Generate ASS subtitles with Hormozi-style viral Telugu captions
const assContent = `[Script Info]
Title: Telugu Claude Code Tech Reel
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
YCbCr Matrix: TV.601
PlayResX: 720
PlayResY: 1280

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: HookTag,JetBrains Mono,20,&H0047E0FD,&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,1,0,3,4,0,2,40,40,310,1
Style: TeluguSub,Noto Sans Telugu,34,&H00FFFFFF,&H0000FFFF,&H00000000,&HA0020617,-1,0,0,0,100,100,0,0,3,6,0,2,40,40,210,1
Style: TranslitSub,JetBrains Mono,18,&H00F9E867,&H000000FF,&H00000000,&H80000000,0,1,0,0,100,100,0,0,3,3,0,2,40,40,165,1
Style: TermLine,JetBrains Mono,17,&H00F8BD38,&H000000FF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,0,0,7,75,40,310,1
Style: TermSubLine,JetBrains Mono,15,&H0080DF34,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,7,75,40,340,1
Style: Header,JetBrains Mono,19,&H00FFFFFF,&H000000FF,&H00000000,&H90000000,-1,0,0,0,100,100,1,0,3,4,0,8,40,40,80,1
Style: Watermark,JetBrains Mono,16,&H00888888,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,2,40,40,40,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
; Always on Header
Dialogue: 0,0:00:00.00,0:01:11.00,Header,,0,0,0,,{\c&H0038bdf8&}● TELUGU TECH REELS{\c&Hffffff&}\NCLAUDE CODE & AGENTIC AI
Dialogue: 0,0:00:00.00,0:01:11.00,Watermark,,0,0,0,,@telugu_tech_pulse • SwaraTech AI Studio

; Scene 1: 0 - 6.5s
Dialogue: 1,0:00:00.00,0:00:06.50,TermLine,,0,0,0,,> claude-code: check industry risk status...
Dialogue: 1,0:00:00.00,0:00:06.50,TermSubLine,,0,0,0,,[AGENT ACTIVE] Analyzing software dev jobs 2026
Dialogue: 2,0:00:00.00,0:00:06.50,HookTag,,0,0,0,,🔥 VIRAL TECH HOOK
Dialogue: 2,0:00:00.00,0:00:06.50,TeluguSub,,0,0,0,,{\c&H00FFFF&}డెవలపర్స్ జాబ్స్ రిస్క్లో ఉన్నాయా??
Dialogue: 2,0:00:00.00,0:00:06.50,TranslitSub,,0,0,0,,Developers jobs risk lo unnaya??

; Scene 2: 6.5s - 14.5s
Dialogue: 1,0:00:06.50,0:00:14.50,TermLine,,0,0,0,,> anthropic release: claude code CLI tool
Dialogue: 1,0:00:06.50,0:00:14.50,TermSubLine,,0,0,0,,Scanning project file structures...
Dialogue: 2,0:00:06.50,0:00:14.50,HookTag,,0,0,0,,⚡ NEW ANTHROPIC TOOL
Dialogue: 2,0:00:06.50,0:00:14.50,TeluguSub,,0,0,0,,ఆంథ్రోపిక్ రిలీజ్ చేసిన కొత్త టూల్\\N{\\c&H00FFFF&}**క్లాడ్ కోడ్**ని చూస్తుంటే నిజమే అనిపిస్తుంది…
Dialogue: 2,0:00:06.50,0:00:14.50,TranslitSub,,0,0,0,,Anthropic kotha tool Claude Code chustunte nijame anipistundi...

; Scene 3: 14.5s - 22.0s
Dialogue: 1,0:00:14.50,0:00:22.00,TermLine,,0,0,0,,> traditional LLM vs agentic execution
Dialogue: 1,0:00:14.50,0:00:22.00,TermSubLine,,0,0,0,,Legacy: only write code | Claude: executes code!
Dialogue: 2,0:00:14.50,0:00:22.00,HookTag,,0,0,0,,💡 THE BIG CONTRAST
Dialogue: 2,0:00:14.50,0:00:22.00,TeluguSub,,0,0,0,,ఇప్పటిదాకా మనం చూసిన ఏఐ కేవలం కోడ్ రాసేవి\\N{\\c&H00FFFF&}కానీ ఈ క్లాడ్ కోడ్ అలా కాదు!
Dialogue: 2,0:00:14.50,0:00:22.00,TranslitSub,,0,0,0,,Ippatidaka AI tools kevalam code rasevi. Idi ala kaadu!

; Scene 4: 22.0s - 32.5s
Dialogue: 1,0:00:22.00,0:00:32.50,TermLine,,0,0,0,,> model: claude-3-5-sonnet agent active
Dialogue: 1,0:00:22.00,0:00:32.50,TermSubLine,,0,0,0,,Auto-executing bash commands & resolving syntax errors...
Dialogue: 2,0:00:22.00,0:00:32.50,HookTag,,0,0,0,,⚙️ CLAUDE 3.5 SONNET
Dialogue: 2,0:00:22.00,0:00:32.50,TeluguSub,,0,0,0,,టెర్మినల్లో కమాండ్స్ ఎగ్జిక్యూట్ చేసి\\Nవచ్చిన ఎర్రర్స్ని కూడా రిజాల్వ్ చేస్తుంది!
Dialogue: 2,0:00:22.00,0:00:32.50,TranslitSub,,0,0,0,,Terminal commands execute chesi, errors auto-resolve chestundi!

; Scene 5: 32.5s - 42.0s
Dialogue: 1,0:00:32.50,0:00:42.00,TermLine,,0,0,0,,> benchmark: 1 senior dev = 1 prompt
Dialogue: 1,0:00:32.50,0:00:42.00,TermSubLine,,0,0,0,,1 week engineering sprint -> done in 4 minutes!
Dialogue: 2,0:00:32.50,0:00:42.00,HookTag,,0,0,0,,🚀 10X ACCELERATION
Dialogue: 2,0:00:32.50,0:00:42.00,TeluguSub,,0,0,0,,మీరు ఇచ్చే ఒక్క ప్రాంప్ట్తో సీనియర్ డెవలపర్\\Nవారం పని కొన్ని నిమిషాల్లో చేస్తుంది!
Dialogue: 2,0:00:32.50,0:00:42.00,TranslitSub,,0,0,0,,Okka prompt tho senior developer rojulula pani nimishallo!

; Scene 6: 42.0s - 51.0s
Dialogue: 1,0:00:42.00,0:00:51.00,TermLine,,0,0,0,,> architecture: Agentic AI Autonomous Engine
Dialogue: 1,0:00:42.00,0:00:51.00,TermSubLine,,0,0,0,,Planning -> Self-Reflection -> Execution -> Healing
Dialogue: 2,0:00:42.00,0:00:51.00,HookTag,,0,0,0,,🧠 AGENTIC AI REVEAL
Dialogue: 2,0:00:42.00,0:00:51.00,TeluguSub,,0,0,0,,అసలు ఇది ఎలా సాధ్యం?\\Nదీని వెనుక ఉన్నది {\\c&H00FFFF&}ఏజెంటిక్ ఏఐ టెక్నాలజీ!
Dialogue: 2,0:00:42.00,0:00:51.00,TranslitSub,,0,0,0,,Asalu ela saadhyam? Deeni venuka unnadi Agentic AI!

; Scene 7: 51.0s - 60.5s
Dialogue: 1,0:00:51.00,0:00:60.50,TermLine,,0,0,0,,> career alert: shift from coding to AI orchestrator
Dialogue: 1,0:00:51.00,0:00:60.50,TermSubLine,,0,0,0,,High demand: AI Workflow Managers & Systems Architects
Dialogue: 2,0:00:51.00,0:00:60.50,HookTag,,0,0,0,,⚠️ CAREER ALERT
Dialogue: 2,0:00:51.00,0:00:60.50,TeluguSub,,0,0,0,,ఏఐ టూల్స్ని ఎఫెక్టివ్గా మేనేజ్ చేయగల వాళ్లకే\\Nఇకపై భారీ డిమాండ్ పెరగనుంది!
Dialogue: 2,0:00:51.00,0:00:60.50,TranslitSub,,0,0,0,,AI tools effectively manage chese vallake demand perugutundi!

; Scene 8: 60.5s - 71.0s
Dialogue: 1,0:00:60.50,0:01:11.00,TermLine,,0,0,0,,> call to action: community subscribe
Dialogue: 1,0:00:60.50,0:01:11.00,TermSubLine,,0,0,0,,Drop your comments & follow for tech updates!
Dialogue: 2,0:00:60.50,0:01:11.00,HookTag,,0,0,0,,🔔 SUBSCRIBE MAWA
Dialogue: 2,0:00:60.50,0:01:11.00,TeluguSub,,0,0,0,,{\\c&H00FFFF&}ఇలాంటి ఇంట్రెస్టింగ్ టెక్ ఫ్యాక్ట్స్ కోసం\\Nమన ఛానల్ని సబ్స్క్రైబ్ చేసుకోండి మావా!
Dialogue: 2,0:00:60.50,0:01:11.00,TranslitSub,,0,0,0,,Channel ni subscribe cheskondi mawa! Comment your opinion.
`;

fs.writeFileSync(assPath, assContent);
console.log('Saved ASS subtitles to:', assPath);

// Create ffmpeg command:
// 1. Dark animated gradient background (720x1280 9:16)
// 2. Audio waveform visualizer (showwaves)
// 3. Terminal box background
// 4. ASS subtitles rendering with fontsdir
const fAssPath = assPath.replace(/\\/g, '/').replace(/:/g, '\\:');
const fFontsDir = fontsDir.replace(/\\/g, '/').replace(/:/g, '\\:');

const filterComplex = [
  // 1. Solid dark slate-950 base
  `color=c=0x030712:s=720x1280:d=71[bg]`,
  // 2. Soundwave bars from audio
  `[0:a]showwaves=s=620x100:mode=line:colors=0x06b6d4:rate=30[waves]`,
  // 3. Overlay waveform at y=680
  `[bg][waves]overlay=x=(W-w)/2:y=680[v1]`,
  // 4. Terminal frame graphic box
  `[v1]drawbox=x=45:y=240:w=630:h=400:color=0x0f172a@0.95:t=fill,drawbox=x=45:y=240:w=630:h=400:color=0x1e293b:t=2,drawbox=x=45:y=240:w=630:h=42:color=0x1e293b@0.9:t=fill,ass='${fAssPath}':fontsdir='${fFontsDir}'[vout]`,
].join(';');

const cmd = [
  'ffmpeg',
  '-y',
  '-i', `"${audioPath}"`,
  '-filter_complex', `"${filterComplex}"`,
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

console.log('Rendering 70.9s vertical 9:16 MP4 Short video...');
const startTime = Date.now();
try {
  execSync(cmd, { stdio: 'inherit' });
  const stat = fs.statSync(outputPath);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`Video rendered successfully in ${elapsed}s!`);
  console.log(`Path: ${outputPath} (${(stat.size / (1024 * 1024)).toFixed(2)} MB)`);

  const meta = {
    videoPath: '/video/telugu_claude_code_reel.mp4',
    format: 'MP4 (H.264 / AAC)',
    resolution: '720x1280 (9:16 Vertical Reel)',
    durationSeconds: 70.93,
    fileSizeMb: Number((stat.size / (1024 * 1024)).toFixed(2)),
    voice: 'Pavan (Puck)',
    style: 'Viral Reel & Shorts Hook',
    hasTeluguSubtitles: true,
    hasTerminalAnimation: true,
    hasSoundwave: true,
    generatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(path.join(outDir, 'metadata.json'), JSON.stringify(meta, null, 2));
} catch (err) {
  console.error('Failed to render video:', err);
  process.exit(1);
}
