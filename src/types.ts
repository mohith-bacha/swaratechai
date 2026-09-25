export type VoiceName = 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';

export interface VoiceProfile {
  id: VoiceName;
  name: string;
  nameTelugu: string;
  gender: 'Male' | 'Female';
  description: string;
  bestFor: string;
  avatarColor: string;
  sampleVibe: string;
}

export interface ScriptSegment {
  id: number;
  telugu: string;
  transliteration: string;
  englishTranslation: string;
  tag: 'Hook' | 'Problem' | 'Tech Highlight' | 'Breakthrough' | 'Warning' | 'Call to Action' | 'General';
  recommendedEmotion: string;
  suggestedSpeed: number;
  startTimeSec?: number;
  durationSec?: number;
  audioUrl?: string;
  isGenerating?: boolean;
}

export interface GeneratedAudioData {
  audioUrl: string;
  audioBase64: string;
  durationSeconds: number;
  fileSizeKb: number;
  voice: VoiceName;
  model: string;
  generatedAt: number;
}

export type BgmTheme = 'cyberpunk' | 'lofi' | 'tension' | 'none';

export interface BgmPreset {
  id: BgmTheme;
  title: string;
  subtitle: string;
  icon: string;
}

export interface ScriptVariation {
  typeKey: string;
  title: string;
  durationEstimate: string;
  scriptTelugu: string;
  description: string;
}

export type AssetCategory =
  | 'terminal'
  | 'ai_brain'
  | 'code_ide'
  | 'radar_alert'
  | 'matrix_rain'
  | 'benchmark'
  | 'subscribe_cta'
  | 'user_upload';

export interface AssetClip {
  id: string;
  title: string;
  category: AssetCategory;
  description: string;
  badge: string;
  iconName: string;
  videoUrl?: string; // For user uploaded clips or remote video sources
  thumbnailUrl?: string;
  isCustomUpload?: boolean;
  uploadedAt?: number;
}

export interface YouTubeBranding {
  channelName: string;
  handle: string;
  initials: string;
  tagline: string;
  ctaTelugu: string;
  showWatermark: boolean;
}

export type SegmentClipMapping = Record<number, string>;
