import { VoiceProfile, ScriptSegment, BgmPreset } from '../types';

export const USER_PROMPT_TELUGU = `డెవలపర్స్ జాబ్స్ రిస్క్లో ఉన్నాయా??

ఎందుకంటే ఆంథ్రోపిక్ రిలీజ్ చేసిన ఒక కొత్త టూల్ క్లాడ్ కోడ్ని చూస్తుంటే, అది నిజమే అనిపిస్తుంది…

ఇప్పటిదాకా మనం చూసిన ఏఐ టూల్స్ కేవలం కోడ్ రాసి ఇచ్చేవి. కానీ ఈ క్లాడ్ కోడ్ అలా కాదు.

ఇది క్లాడ్ 3.5 సోనెట్ మోడల్ని ఉపయోగిస్తుంది. అంటే ఇది మీ ఫైల్స్ స్ట్రక్చర్ని స్కాన్ చేసి, కేవలం కోడ్ జనరేట్ చేయడమే కాకుండా, రియల్ టైమ్లో మీ టెర్మినల్లో కమాండ్స్ని ఆటోమేటిక్గా ఎగ్జిక్యూట్ చేసి, వచ్చిన ఎర్రర్స్ని కూడా రిజాల్వ్ చేస్తుంది.

అంటే మీరు ఇచ్చే ఒక్క ప్రాంప్ట్తో, ఒక సీనియర్ డెవలపర్ రోజులు లేదా వారాల్లో చేసే పనిని ఇది కొన్ని నిమిషాల్లో చేయగలదు.

అసలు ఇది ఎలా సాధ్యం?

దీని వెనుక ఉన్నది ఏజెంటిక్ ఏఐ అనే ఒక పవర్ఫుల్ టెక్నాలజీ.

ఈ టెక్నాలజీ కేవలం ఆన్సర్స్ ఇవ్వడం మాత్రమే కాదు… సొంతంగా ప్లాన్ చేసుకుని, టాస్క్ని ఎగ్జిక్యూట్ చేసి, అవసరమైతే వచ్చిన సమస్యలను కూడా పరిష్కరించగలదు.

మరి క్లాడ్ కోడ్ లాంటి ఏఐ టూల్స్ పెరుగుతున్న కొద్దీ, కేవలం కోడింగ్ తెలిసిన వాళ్లకంటే, ఏఐ టూల్స్ని ఎఫెక్టివ్గా మేనేజ్ చేసి ఉపయోగించగల వాళ్లకు డిమాండ్ పెరిగే అవకాశం ఉంది.

కాబట్టి మీరు కూడా అప్డేట్ అవ్వకపోతే రిస్క్లో ఉన్నట్టే!

మీ ఒపీనియన్ ఏంటి? కామెంట్స్లో చెప్పండి.

ఇలాంటి ఇంట్రెస్టింగ్ టెక్ ఫ్యాక్ట్స్ కోసం మన ఛానల్ని సబ్స్క్రైబ్ చేసుకోండి మావా!`;

export const VOICE_PROFILES: VoiceProfile[] = [
  {
    id: 'Puck',
    name: 'Pavan (Puck)',
    nameTelugu: 'పవన్',
    gender: 'Male',
    description: 'High-energy, punchy Telugu YouTuber & Tech Reel voice. Vibrant and youthful.',
    bestFor: 'Reels, Shorts, Tech news with "Mawa" viral hooks',
    avatarColor: 'from-cyan-500 to-blue-600',
    sampleVibe: '🚀 Viral Tech Influencer',
  },
  {
    id: 'Charon',
    name: 'Chaitanya (Charon)',
    nameTelugu: 'చైతన్య',
    gender: 'Male',
    description: 'Deep, authoritative tech documentary and analytical narrator.',
    bestFor: 'Deep dive analysis, warning alerts, tech podcasts',
    avatarColor: 'from-amber-500 to-red-600',
    sampleVibe: '🎙️ Deep Tech Documentary',
  },
  {
    id: 'Kore',
    name: 'Keerthi (Kore)',
    nameTelugu: 'కీర్తి',
    gender: 'Female',
    description: 'Clear, engaging, articulate professional female tech host and news anchor.',
    bestFor: 'Tech product updates, explainers, keynotes',
    avatarColor: 'from-fuchsia-500 to-pink-600',
    sampleVibe: '✨ Crisp Tech Anchor',
  },
  {
    id: 'Fenrir',
    name: 'Farhan (Fenrir)',
    nameTelugu: 'ఫర్హాన్',
    gender: 'Male',
    description: 'Intense, cinematic voice with gripping presence and suspenseful timing.',
    bestFor: 'Dramatic tech revelations, AI breakthroughs',
    avatarColor: 'from-purple-500 to-indigo-700',
    sampleVibe: '🎬 Cinematic Tech Suspense',
  },
  {
    id: 'Zephyr',
    name: 'Zahid (Zephyr)',
    nameTelugu: 'జాహిద్',
    gender: 'Male',
    description: 'Warm, conversational, approachable mentor style voice.',
    bestFor: 'Tutorials, friendly career advice, coding tips',
    avatarColor: 'from-emerald-500 to-teal-600',
    sampleVibe: '☕ Casual Coding Mentor',
  },
];

export const INITIAL_SEGMENTS: ScriptSegment[] = [
  {
    id: 1,
    telugu: 'డెవలపర్స్ జాబ్స్ రిస్క్లో ఉన్నాయా??',
    transliteration: 'Developers jobs risk lo unnaya??',
    englishTranslation: "Are developers' jobs at risk??",
    tag: 'Hook',
    recommendedEmotion: 'High-tension provocative question, 0.5s pause after',
    suggestedSpeed: 1.1,
  },
  {
    id: 2,
    telugu: 'ఎందుకంటే ఆంథ్రోపిక్ రిలీజ్ చేసిన ఒక కొత్త టూల్ క్లాడ్ కోడ్ని చూస్తుంటే, అది నిజమే అనిపిస్తుంది…',
    transliteration: 'Endukante Anthropic release chesina oka kotha tool Claude Code ni chustunte, adi nijame anipistundi…',
    englishTranslation: "Because looking at Anthropic's new tool 'Claude Code', it feels like it might be true...",
    tag: 'Problem',
    recommendedEmotion: 'Intriguing, dramatic revelation',
    suggestedSpeed: 1.05,
  },
  {
    id: 3,
    telugu: 'ఇప్పటిదాకా మనం చూసిన ఏఐ టూల్స్ కేవలం కోడ్ రాసి ఇచ్చేవి. కానీ ఈ క్లాడ్ కోడ్ అలా కాదు.',
    transliteration: 'Ippatidaka manam choosina AI tools kevalam code raasi ichevi. Kaani ee Claude Code ala kaadu.',
    englishTranslation: 'Until now, the AI tools we saw only wrote code for us. But Claude Code is not like that.',
    tag: 'Tech Highlight',
    recommendedEmotion: 'Sharp contrast, deliberate emphasis on "ala kaadu"',
    suggestedSpeed: 1.05,
  },
  {
    id: 4,
    telugu: 'ఇది క్లాడ్ 3.5 సోనెట్ మోడల్ని ఉపయోగిస్తుంది. అంటే ఇది మీ ఫైల్స్ స్ట్రక్చర్ని స్కాన్ చేసి, కేవలం కోడ్ జనరేట్ చేయడమే కాకుండా, రియల్ టైమ్లో మీ టెర్మినల్లో కమాండ్స్ని ఆటోమేటిక్గా ఎగ్జిక్యూట్ చేసి, వచ్చిన ఎర్రర్స్ని కూడా రిజాల్వ్ చేస్తుంది.',
    transliteration: 'Idi Claude 3.5 Sonnet model ni upayogistundi. Ante idi mee files structure ni scan chesi, kevalam code generate cheyadame kakunda, real-time lo mee terminal lo commands ni automatically execute chesi, vachina errors ni kooda resolve chestundi.',
    englishTranslation: "It uses Claude 3.5 Sonnet. It scans your file structure, generates code, automatically executes commands in your terminal in real-time, and resolves any errors that crop up.",
    tag: 'Breakthrough',
    recommendedEmotion: 'Mind-blown tone, rapid tech explanation',
    suggestedSpeed: 1.15,
  },
  {
    id: 5,
    telugu: 'అంటే మీరు ఇచ్చే ఒక్క ప్రాంప్ట్తో, ఒక సీనియర్ డెవలపర్ రోజులు లేదా వారాల్లో చేసే పనిని ఇది కొన్ని నిమిషాల్లో చేయగలదు.',
    transliteration: 'Ante meeru iche okka prompt tho, oka senior developer rojulu leda vaarallo chese panini idi konni nimishallo cheyagaladu.',
    englishTranslation: 'With just a single prompt, work that takes a senior developer days or weeks can be finished in minutes.',
    tag: 'Tech Highlight',
    recommendedEmotion: 'Awestruck, emphatic delivery',
    suggestedSpeed: 1.1,
  },
  {
    id: 6,
    telugu: 'అసలు ఇది ఎలా సాధ్యం? దీని వెనుక ఉన్నది ఏజెంటిక్ ఏఐ అనే ఒక పవర్ఫుల్ టెక్నాలజీ.',
    transliteration: 'Asalu idi ela saadhyam? Deeni venuka unnadi Agentic AI ane oka powerful technology.',
    englishTranslation: 'How is this even possible? Behind this is a powerful technology called Agentic AI.',
    tag: 'Breakthrough',
    recommendedEmotion: 'Curious pause followed by authoritative reveal',
    suggestedSpeed: 1.05,
  },
  {
    id: 7,
    telugu: 'ఈ టెక్నాలజీ కేవలం ఆన్సర్స్ ఇవ్వడం మాత్రమే కాదు… సొంతంగా ప్లాన్ చేసుకుని, టాస్క్ని ఎగ్జిక్యూట్ చేసి, అవసరమైతే వచ్చిన సమస్యలను కూడా పరిష్కరించగలదు.',
    transliteration: 'Ee technology kevalam answers ivvadam maatrame kaadu… sonthanga plan cheskuni, task ni execute chesi, avasaramaithe vachina samasyalani kooda parishkarinchagaladu.',
    englishTranslation: 'This technology does not just give answers; it plans autonomously, executes tasks, and resolves issues on the fly.',
    tag: 'Tech Highlight',
    recommendedEmotion: 'Insightful, steady educational cadence',
    suggestedSpeed: 1.05,
  },
  {
    id: 8,
    telugu: 'మరి క్లాడ్ కోడ్ లాంటి ఏఐ టూల్స్ పెరుగుతున్న కొద్దీ, కేవలం కోడింగ్ తెలిసిన వాళ్లకంటే, ఏఐ టూల్స్ని ఎఫెక్టివ్గా మేనేజ్ చేసి ఉపయోగించగల వాళ్లకు డిమాండ్ పెరిగే అవకాశం ఉంది.',
    transliteration: 'Mari Claude Code laanti AI tools perugutunna koddee, kevalam coding telisina vaallakante, AI tools ni effectively manage chesi upayoginchagala vaallaku demand perige avakaasam undi.',
    englishTranslation: 'As tools like Claude Code grow, demand will surge for those who can effectively orchestrate AI tools rather than just write raw code.',
    tag: 'Warning',
    recommendedEmotion: 'Crucial career takeaway, clear guidance',
    suggestedSpeed: 1.08,
  },
  {
    id: 9,
    telugu: 'కాబట్టి మీరు కూడా అప్డేట్ అవ్వకపోతే రిస్క్లో ఉన్నట్టే! మీ ఒపీనియన్ ఏంటి? కామెంట్స్లో చెప్పండి.',
    transliteration: 'Kaabatti meeru kooda update avvakapothe risk lo unnatte! Mee opinion enti? Comments lo cheppandi.',
    englishTranslation: "So if you don't upskill, you are at risk! What's your opinion? Drop it in the comments.",
    tag: 'Warning',
    recommendedEmotion: 'Direct punchy warning, instant call to engage',
    suggestedSpeed: 1.12,
  },
  {
    id: 10,
    telugu: 'ఇలాంటి ఇంట్రెస్టింగ్ టెక్ ఫ్యాక్ట్స్ కోసం మన ఛానల్ని సబ్స్క్రైబ్ చేసుకోండి మావా!',
    transliteration: 'Ilaanti interesting tech facts kosam mana channel ni subscribe cheskondi mawa!',
    englishTranslation: 'For more interesting tech facts like this, subscribe to our channel mawa!',
    tag: 'Call to Action',
    recommendedEmotion: 'Signature warm viral sign-off with friendly "Mawa" cheer',
    suggestedSpeed: 1.15,
  },
];

export const BGM_PRESETS: BgmPreset[] = [
  {
    id: 'cyberpunk',
    title: 'Cyberpunk Pulse',
    subtitle: '128 BPM Synthwave tech drive for viral reels',
    icon: '⚡',
  },
  {
    id: 'lofi',
    title: 'Lo-Fi Chill Tech',
    subtitle: 'Warm analog chords for smooth listening',
    icon: '🎧',
  },
  {
    id: 'tension',
    title: 'Dramatic Tension',
    subtitle: 'Low cinematic rumble with suspenseful clock tick',
    icon: '⏱️',
  },
  {
    id: 'none',
    title: 'Acapella (No BGM)',
    subtitle: 'Pure studio vocal without background music',
    icon: '🔇',
  },
];

export const DIRECTOR_STYLES = [
  {
    id: 'viral_reel',
    title: 'Viral Reel & Shorts Hook',
    promptSnippet: 'Energetic, dramatic Telugu tech influencer speaking directly to audience on Instagram Reel with punchy pauses and viral urgency',
    badge: '🔥 Highest Retention',
    speed: 1.15,
  },
  {
    id: 'tech_doc',
    title: 'Tech News & Documentary',
    promptSnippet: 'Authoritative, clear, analytical Telugu tech presenter explaining cutting-edge AI breakthroughs with crisp journalistic rhythm',
    badge: '🎙️ Informative & Deep',
    speed: 1.0,
  },
  {
    id: 'casual_mawa',
    title: 'Telugu Tech Bro (మావా)',
    promptSnippet: 'Friendly, warm, conversational Telugu buddy using casual cadence, speaking like a senior engineer advising his close friend',
    badge: '☕ Friendly & Engaging',
    speed: 1.08,
  },
  {
    id: 'urgent_alert',
    title: 'Urgent Career Alert',
    promptSnippet: 'Serious, fast-paced, eye-opening urgency alerting software engineers about automation risks and the future of work',
    badge: '🚨 High Impact FOMO',
    speed: 1.2,
  },
];
