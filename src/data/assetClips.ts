import { AssetClip, YouTubeBranding, SegmentClipMapping } from '../types';

export const DEFAULT_YOUTUBE_BRANDING: YouTubeBranding = {
  channelName: 'TELUGU TECH PULSE',
  handle: '@telugu_tech_pulse',
  initials: 'ST',
  tagline: 'AI Tutorials & Tech News in Telugu',
  ctaTelugu: 'సబ్స్క్రైబ్ చేసుకోండి మావా!',
  showWatermark: true,
};

export const BUILT_IN_ASSET_CLIPS: AssetClip[] = [
  {
    id: 'clip_terminal_claude',
    title: 'Claude Code Terminal Session',
    category: 'terminal',
    description: 'Realistic live CLI session showing Claude 3.5 Sonnet executing bash commands, fixing syntax errors, and passing tests.',
    badge: 'Real-time CLI',
    iconName: 'Terminal',
  },
  {
    id: 'clip_radar_alert',
    title: 'Cyber Radar & Risk Scanner',
    category: 'radar_alert',
    description: 'High-tech radar sweep grid with glowing red alert indicators for developer automation warnings.',
    badge: 'Viral Hook',
    iconName: 'AlertTriangle',
  },
  {
    id: 'clip_ai_brain',
    title: 'Agentic AI Neural Network Core',
    category: 'ai_brain',
    description: '3D glowing neural graph with rotating synaptic nodes (Plan -> Execute -> Observe -> Self-Heal).',
    badge: 'Neural Core',
    iconName: 'Brain',
  },
  {
    id: 'clip_contrast_split',
    title: 'Chatbot vs Terminal Agent',
    category: 'code_ide',
    description: 'Side-by-side contrast cards comparing legacy copy-paste LLMs against direct OS terminal automation.',
    badge: 'Tech Comparison',
    iconName: 'GitCompare',
  },
  {
    id: 'clip_speed_benchmark',
    title: '10X Acceleration Benchmark',
    category: 'benchmark',
    description: 'Animated visual speed comparison chart showing 1-week manual dev sprint compressed into 3.5 minutes.',
    badge: 'Benchmark',
    iconName: 'Zap',
  },
  {
    id: 'clip_future_careers',
    title: 'Developer Career Roadmap',
    category: 'benchmark',
    description: 'High-risk repetitive tasks vs high-demand AI orchestrators & systems architects breakdown.',
    badge: 'Career Insights',
    iconName: 'TrendingUp',
  },
  {
    id: 'clip_matrix_stream',
    title: 'Matrix Digital Data Stream',
    category: 'matrix_rain',
    description: 'Cascading green cyberpunk hex glyph stream for high-energy tech transitions.',
    badge: 'Cyberpunk',
    iconName: 'Binary',
  },
  {
    id: 'clip_code_ide',
    title: 'VS Code Live TypeScript Typing',
    category: 'code_ide',
    description: 'Crisp dark mode code editor with fast syntax highlighted code generation and test execution.',
    badge: 'Code Typing',
    iconName: 'Code',
  },
  {
    id: 'clip_subscribe_cta',
    title: 'YouTube Subscribe & Bell Card',
    category: 'subscribe_cta',
    description: 'Pulsing 3D YouTube Subscribe button, bell ringing, channel monogram, and your custom channel name.',
    badge: 'End Screen CTA',
    iconName: 'Bell',
  },
];

export const DEFAULT_SEGMENT_MAPPINGS: SegmentClipMapping = {
  1: 'clip_radar_alert',
  2: 'clip_terminal_claude',
  3: 'clip_contrast_split',
  4: 'clip_terminal_claude',
  5: 'clip_speed_benchmark',
  6: 'clip_ai_brain',
  7: 'clip_future_careers',
  8: 'clip_subscribe_cta',
};
