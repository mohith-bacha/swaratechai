import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('No GEMINI_API_KEY found');
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Buffer {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmBuffer.length;
  const header = Buffer.alloc(44);

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);

  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);

  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

const fullTeluguPrompt = `డెవలపర్స్ జాబ్స్ రిస్క్లో ఉన్నాయా??

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

async function main() {
  console.log('Generating voiceover with Pavan (Puck) and Viral Reel & Shorts Hook style...');
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: fullTeluguPrompt,
              speechMetadata: {
                style: 'Energetic, dramatic Telugu tech influencer speaking directly to audience on Instagram Reel with punchy pauses and viral urgency',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' },
          },
        },
      },
    });

    const base64Pcm = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Pcm) {
      throw new Error('No audio returned');
    }

    const rawPcm = Buffer.from(base64Pcm, 'base64');
    const wavBuffer = pcmToWav(rawPcm, 24000, 1, 16);
    const durationSeconds = rawPcm.length / (24000 * 2);

    const outDir = path.resolve('public/audio');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const outPath = path.join(outDir, 'telugu_claude_code_voiceover.wav');
    fs.writeFileSync(outPath, wavBuffer);

    const meta = {
      audioPath: '/audio/telugu_claude_code_voiceover.wav',
      voice: 'Puck',
      voiceName: 'Pavan (Puck)',
      style: 'Viral Reel & Shorts Hook',
      durationSeconds: Number(durationSeconds.toFixed(2)),
      fileSizeKb: Number((wavBuffer.length / 1024).toFixed(1)),
      generatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(path.join(outDir, 'metadata.json'), JSON.stringify(meta, null, 2));

    console.log(`Success! Saved ${wavBuffer.length} bytes to ${outPath}`);
    console.log(`Duration: ${durationSeconds.toFixed(2)}s`);
  } catch (err) {
    console.error('Error generating audio:', err);
    process.exit(1);
  }
}

main();
