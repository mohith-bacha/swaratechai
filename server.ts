import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// PCM 16-bit to WAV converter
function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Buffer {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmBuffer.length;
  const header = Buffer.alloc(44);

  // RIFF header
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);

  // fmt subchunk
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // 16 for PCM
  header.writeUInt16LE(1, 20); // 1 for PCM
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);

  // data subchunk
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

// Lazy Gemini client helper
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Endpoint: Generate Speech via Gemini TTS
app.post('/api/tts/generate', async (req, res) => {
  try {
    const {
      text,
      voiceName = 'Puck',
      style = 'Energetic, confident Telugu tech influencer for social media reel with dramatic cadence',
      model = 'gemini-3.8-flash-lite-tts',
    } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Text prompt is required.' });
    }

    const ai = getGeminiClient();

    // Ensure valid voice
    const allowedVoices = ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'];
    const selectedVoice = allowedVoices.includes(voiceName) ? voiceName : 'Puck';

    const chosenModel = model === 'gemini-3.8-flash-tts' ? 'gemini-3.8-flash-tts' : 'gemini-3.8-flash-lite-tts';

    const response = await ai.models.generateContent({
      model: chosenModel,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.trim(),
              speechMetadata: {
                style: style.trim(),
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: selectedVoice },
          },
        },
      },
    });

    const base64Pcm = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Pcm) {
      return res.status(500).json({
        error: 'No audio data returned from Gemini TTS model.',
        details: response.candidates?.[0]?.finishReason || 'Empty response',
      });
    }

    const rawPcm = Buffer.from(base64Pcm, 'base64');
    const wavBuffer = pcmToWav(rawPcm, 24000, 1, 16);
    const wavBase64 = wavBuffer.toString('base64');
    const durationSeconds = rawPcm.length / (24000 * 2); // 2 bytes per sample, 24000Hz mono

    return res.json({
      success: true,
      voice: selectedVoice,
      model: chosenModel,
      mimeType: 'audio/wav',
      audioBase64: wavBase64,
      audioUrl: `data:audio/wav;base64,${wavBase64}`,
      durationSeconds: Number(durationSeconds.toFixed(2)),
      fileSizeKb: Number((wavBuffer.length / 1024).toFixed(1)),
    });
  } catch (error: any) {
    console.error('Error generating speech:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate speech audio.',
    });
  }
});

// Endpoint: AI Script Analysis, Transliteration & Director Breakdown
app.post('/api/tts/analyze', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for analysis.' });
    }

    const ai = getGeminiClient();

    const prompt = `Analyze this Telugu video script for an AI tech reel/YouTube Short.
Original Telugu Script:
"""
${text}
"""

Break down the script sentence by sentence or segment by segment.
For each segment provide:
1. "telugu": The exact segment text in Telugu.
2. "transliteration": Clear English phonetics (e.g. "Developers jobs risk lo unnaya??", "Andukante Anthropic release chesina...").
3. "englishTranslation": Accurate English meaning.
4. "tag": The dramatic purpose of this line (e.g., "Hook", "Problem", "Tech Highlight", "Breakthrough", "Warning", "Call to Action").
5. "recommendedEmotion": Vocal direction for the voice actor (e.g. "Dramatic question, high energy", "Intriguing tone, slight pause", "Punchy tech excitement", "Urgent warning").
6. "suggestedSpeed": Float between 0.85 and 1.25.

Also provide overall script stats and viral reel tips for Telugu tech creators.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            hookRating: { type: Type.STRING, description: '1-10 rating of the hook' },
            estimatedTotalSeconds: { type: Type.NUMBER },
            overallMood: { type: Type.STRING },
            viralAdvice: { type: Type.STRING },
            segments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  telugu: { type: Type.STRING },
                  transliteration: { type: Type.STRING },
                  englishTranslation: { type: Type.STRING },
                  tag: { type: Type.STRING },
                  recommendedEmotion: { type: Type.STRING },
                  suggestedSpeed: { type: Type.NUMBER },
                },
                required: ['id', 'telugu', 'transliteration', 'englishTranslation', 'tag', 'recommendedEmotion'],
              },
            },
          },
          required: ['title', 'hookRating', 'estimatedTotalSeconds', 'overallMood', 'viralAdvice', 'segments'],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error analyzing script:', error);
    return res.status(500).json({
      error: error.message || 'Failed to analyze script with AI.',
    });
  }
});

// Endpoint: AI Script Variations (Punchy Reel Hook, Full Story, Casual Tech Bro)
app.post('/api/tts/variations', async (req, res) => {
  try {
    const { text, goal } = req.body;
    const ai = getGeminiClient();

    const prompt = `You are an expert Telugu tech content creator scriptwriter.
Original script:
"""
${text}
"""

Goal: Generate 3 refined Telugu script variations optimized for audio voiceover:
1. "viral_reel_30s": Fast, punchy 30-second Instagram Reel / YouTube Shorts script with high retention hooks.
2. "documentary_60s": A slightly more in-depth, dramatic tech news style for 60 seconds.
3. "telugu_tech_bro": Casual, friendly Telugu slang style (using words like మావా, బాస్, భయ్యా, అసలు నిజం ఏంటంటే).

Return JSON with keys: viral_reel_30s, documentary_60s, telugu_tech_bro, with their script text and rationale in Telugu/English.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            variations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  typeKey: { type: Type.STRING },
                  title: { type: Type.STRING },
                  durationEstimate: { type: Type.STRING },
                  scriptTelugu: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ['typeKey', 'title', 'durationEstimate', 'scriptTelugu', 'description'],
              },
            },
          },
          required: ['variations'],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating script variations:', error);
    return res.status(500).json({ error: error.message || 'Failed to create variations.' });
  }
});

// Dedicated download endpoint for desktop video files with explicit attachment headers
app.get('/api/video/download', (req, res) => {
  const videoPath = path.join(__dirname, 'public', 'video', 'telugu_claude_code_reel.mp4');
  if (!fs.existsSync(videoPath)) {
    return res.status(404).send('Video file not found.');
  }

  const stat = fs.statSync(videoPath);
  const rawName = (req.query.filename as string) || 'telugu-claude-code-reel.mp4';
  const safeFilename = rawName.endsWith('.mp4') ? rawName : `${rawName}.mp4`;

  res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
  res.setHeader('Content-Type', 'video/mp4');
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Accept-Ranges', 'bytes');

  const stream = fs.createReadStream(videoPath);
  stream.pipe(res);
});

// Serve public static assets (videos, audio, fonts) with range support
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Vite server in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
