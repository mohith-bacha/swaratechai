import { ScriptSegment, VoiceName } from '../types';

export interface GenerateSpeechParams {
  text: string;
  voiceName: VoiceName;
  style?: string;
  model?: 'gemini-3.8-flash-lite-tts' | 'gemini-3.8-flash-tts';
}

export interface GenerateSpeechResponse {
  success: boolean;
  audioUrl: string;
  audioBase64: string;
  durationSeconds: number;
  fileSizeKb: number;
  voice: VoiceName;
  model: string;
}

export async function requestSpeechGeneration(params: GenerateSpeechParams): Promise<GenerateSpeechResponse> {
  const res = await fetch('/api/tts/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Voice generation failed (${res.status})`);
  }

  return await res.json();
}

export async function requestScriptAnalysis(text: string) {
  const res = await fetch('/api/tts/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to analyze script');
  }

  return await res.json();
}

export async function requestScriptVariations(text: string) {
  const res = await fetch('/api/tts/variations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate script variations');
  }

  return await res.json();
}

// Client-Side Web Speech API Fallback / Instant Preview
export function speakWithBrowserTts(text: string, rate = 1.0, pitch = 1.0): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      return reject(new Error('Browser speech synthesis is not supported'));
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;

    const voices = window.speechSynthesis.getVoices();
    // Prefer Telugu or Indian English voice
    const teluguVoice = voices.find(v => v.lang.startsWith('te') || v.lang.includes('TE'));
    const indianVoice = voices.find(v => v.lang.includes('IN') || v.name.toLowerCase().includes('india'));

    if (teluguVoice) {
      utterance.voice = teluguVoice;
    } else if (indianVoice) {
      utterance.voice = indianVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);

    window.speechSynthesis.speak(utterance);
  });
}

export function stopBrowserTts() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Helper: Format seconds to 00:00
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Helper: Format seconds to SRT format 00:00:00,000
function formatSrtTime(totalSec: number): string {
  const hrs = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = Math.floor(totalSec % 60);
  const millis = Math.floor((totalSec % 1) * 1000);
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(millis).padStart(3, '0')}`;
}

// Generate standard SRT subtitles
export function generateSrtContent(segments: ScriptSegment[], totalDurationSec: number): string {
  if (!segments.length) return '';

  const perSegment = totalDurationSec / segments.length;
  let srt = '';

  segments.forEach((seg, index) => {
    const start = index * perSegment;
    const end = (index + 1) * perSegment;
    srt += `${index + 1}\n`;
    srt += `${formatSrtTime(start)} --> ${formatSrtTime(end)}\n`;
    srt += `${seg.telugu}\n`;
    srt += `[${seg.transliteration}]\n\n`;
  });

  return srt;
}
