/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Parse json requests
app.use(express.json());

// Lazy-initialization helper for Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY is not configured. Please add your key in the AI Studio Secrets panel.');
  }
  
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return geminiClient;
}

// Highly detailed viral template system fallback if API keys are not supplied.
// This allows immediate validation and click-testing in any sandbox state.
const FALLBACK_VIRAL_TEMPLATES: Record<string, any> = {
  default: {
    title: "The Silent Algorithm Trick",
    topic: "Default Selection",
    tone: "Mysterious",
    hookStrength: 9,
    totalDuration: 42,
    estimatedEngagementRate: "93%",
    targetPlatform: "YouTube Shorts",
    loopStrategy: "End with 'And that's why...' so it links seamlessly back to the first word 'Most people don't know...'",
    viralHookReason: "Utilizes cognitive dissonance and FOMO (Fear Of Missing Out). The viewer feels like they are part of a closed elite circle.",
    scenes: [
      {
        sceneNumber: 1,
        duration: "0-5s",
        visualPrompt: "Extreme close-up of a finger pressing 'Delete' on a glowing keycap. Fast zoom out to show a face reflecting dual monitor light.",
        voiceover: "Most people think the YouTube algorithm is random. But the top 1% use a silent loophole that forces views.",
        screenText: "THE ALGORITHM SEARCH LIES",
        pacingTip: "Speak in a calm, confident, slightly quiet voice over a heavy ambient synth swell."
      },
      {
        sceneNumber: 2,
        duration: "5-15s",
        visualPrompt: "Quick split-screen showing a view counter raising by 50,000 views per second on a mobile dashboard.",
        voiceover: "It’s called 'Negative Retention Hijacking'. By leaving out ONE critical word in your first five seconds, you force viewers to read the comments.",
        screenText: "THE COGNITIVE LOOP",
        pacingTip: "Speed up delivery slightly to build tension."
      },
      {
        sceneNumber: 3,
        duration: "15-30s",
        visualPrompt: "Macroscopic shot of an hourglass draining fast. Arrows pointing to a comment pinned at the top with 2.5k likes.",
        voiceover: "This action tricks the system into thinking your video has maximum viewer interaction, immediately boosting it to the explorer page.",
        screenText: "EXPLOSIVE GROWTH",
        pacingTip: "Exunciate every single syllable loudly and clearly."
      },
      {
        sceneNumber: 4,
        duration: "30-42s",
        visualPrompt: "Abstract screen animation of waves circling back into a loop. Neon arrows highlighting the replay count.",
        voiceover: "Top channels repeat this cycle twice a week to keep their traffic boiling. Check out the pinned comment for step-by-step instructions. And that's why...",
        screenText: "HOW TO DUPLICATE",
        pacingTip: "Deliver the final looped phrase with an ascending inflection."
      }
    ]
  }
};

// Generates simulated rich custom scripts matching user parameters for clean sandbox tests
function generateSimulatedScript(topic: string, tone: string, platform: string): typeof FALLBACK_VIRAL_TEMPLATES.default {
  const formattedTopic = topic ? topic.trim() : "Viral Secrets";
  return {
    title: `The Ultimate ${formattedTopic} Loophole`,
    topic: formattedTopic,
    tone: tone,
    hookStrength: 9,
    totalDuration: 35,
    estimatedEngagementRate: "91%",
    targetPlatform: platform || "YouTube Shorts",
    loopStrategy: `Seamlessly tie the last line "which means..." back into the visual opener "This single trick..."`,
    viralHookReason: `Leverages instant gratification psychology and custom curiosity gaps based on "${formattedTopic}".`,
    scenes: [
      {
        sceneNumber: 1,
        duration: "0-5s",
        visualPrompt: `High-contrast B-roll of hands typing fast. Neon red text overlays bouncing on beat. Transition with a sharp analog glitch effect.`,
        voiceover: `This is why everything you know about ${formattedTopic} is completely wrong. And the industry is hiding the truth.`,
        screenText: `DO NOT LOOK AWAY`,
        pacingTip: "High-energy hook pitch. Leave a micro-second pause right before the reveal."
      },
      {
        sceneNumber: 2,
        duration: "5-15s",
        visualPrompt: "Animation of statistical graphs skyrocketing upward. Fast camera pan right to follow a glowing line.",
        voiceover: `Everyone tells you to work harder, but they ignore the real catalyst. If you apply this simple variable, results double overnight.`,
        screenText: "88% IMPROVEMENT",
        pacingTip: "Intense, rapid delivery matching a fast visual pace."
      },
      {
        sceneNumber: 3,
        duration: "15-25s",
        visualPrompt: "Macro close-up split-screen showing a lock opening. Bright soft transitions with colorful flares.",
        voiceover: "First, you isolate the friction point. Second, you inject a recursive feedback loop. This keeps retention locked at maximum.",
        screenText: "RETENTION LOCK",
        pacingTip: "Measured, rhythmic structure. Sound authoritative."
      },
      {
        sceneNumber: 4,
        duration: "25-35s",
        visualPrompt: "A sleek visual loop showing a futuristic circle emblem rotating. Arrows spin back into the center.",
        voiceover: `Once you connect these dots, success becomes entirely mechanical. Test this exact script formula loop, which means...`,
        screenText: "TEST IT TODAY",
        pacingTip: "Blend the final phrase seamlessly with the initial word 'This'"
      }
    ]
  };
}

// Creative and structural System Prompt for Viral retention architecture
const VIRAL_SYSTEM_PROMPT = `You are a legendary short-form video optimization engineer and viral copywriter for YouTube Shorts, Instagram Reels, and TikTok.
Your specialty is retention engineering—retaining 90%+ attention spans through the initial 3-second psychological hook, rhythmic visual pacing, visual B-roll cues, dynamic captions, and an organic loop that stitches the end back to the beginning.

When asked to generate active scripts, follow these strict laws of short-form virality:
1. THE HOOK (0-5s): Must instantly identify a high-value question, counter-intuitive fact, or deep secret. Avoid introductory fluff like 'Hey guys' or 'Welcome to my channel'. Jump straight into the action.
2. CONTINUOUS LOOP STRATEGY: The very last line must end mid-sentence or run smoothly directly back into the first word of the hook to make viewers replay the short without noticing.
3. RETENTION DENSITY: Break the script into dense 3 to 10-second micro-scenes. Provide precise b-roll / acting prompts that change visuals every 2-3 seconds.
4. AUDITORY CADENCE: Use energetic, crisp words. Highlight where the voiceover should raise their pitch, pause, or whisper.
5. SCREEN TEXT / TYPOGRAPHY overlays: Provide custom high-impact phrases (1 to 4 words max) to overlay dynamically over each scene.

You MUST follow the specified JSON schema exactly. Return ONLY clean JSON matching the schema of response. Do not surround the JSON with markdown text wrappers other than what is returned by the client.`;

// API route first
app.post('/api/generate', async (req, res) => {
  const { topic, tone, platform } = req.body;
  
  if (!topic) {
    return res.status(400).json({ error: 'Topic is a required field.' });
  }

  const selectedTone = tone || 'Energetic';
  const selectedPlatform = platform || 'YouTube Shorts';

  try {
    const ai = getGeminiClient();
    
    const userPrompt = `Generate a viral, retention-engineered, short-form ${selectedPlatform} script about the following topic: "${topic}".
Selected video tone: "${selectedTone}".
Make sure to break it down into sequential scenes. Design a perfect looping connection for the voiceovers. Define the exact hook reasoning. Ensure the total duration is between 20 to 50 seconds.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: VIRAL_SYSTEM_PROMPT,
        temperature: 0.9,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Highly engaging, clickable title for the short-form video idea." },
            topic: { type: Type.STRING },
            tone: { type: Type.STRING },
            hookStrength: { type: Type.INTEGER, description: "Metric rating from 1 to 10 of how strong the hook is." },
            totalDuration: { type: Type.INTEGER, description: "Total duration in seconds." },
            estimatedEngagementRate: { type: Type.STRING, description: "Estimated retention score, e.g. '92%'" },
            targetPlatform: { type: Type.STRING },
            loopStrategy: { type: Type.STRING, description: "Pacing advice for connecting the end perfectly back to the beginning." },
            viralHookReason: { type: Type.STRING, description: "Why this psychological hook works so well." },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sceneNumber: { type: Type.INTEGER },
                  duration: { type: Type.STRING, description: "e.g. '0-3s', '3-8s'" },
                  visualPrompt: { type: Type.STRING, description: "Action, graphic, zoom, or camera prompt for B-roll or acting cuts." },
                  voiceover: { type: Type.STRING, description: "The spoken narration text. Keep it snappy, raw, and high energy." },
                  screenText: { type: Type.STRING, description: "Short on-screen text overlays (1-4 words) for text captions." },
                  pacingTip: { type: Type.STRING, description: "Vocal speed, inflection, or pausing tips." }
                },
                required: ["sceneNumber", "duration", "visualPrompt", "voiceover", "screenText"]
              }
            }
          },
          required: [
            "title", "topic", "tone", "hookStrength", "totalDuration", "estimatedEngagementRate",
            "targetPlatform", "loopStrategy", "viralHookReason", "scenes"
          ]
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json(parsedData);

  } catch (error: any) {
    console.error('Gemini Generation Error:', error.message);
    
    // Check if the error is due to a missing AI Key
    const isKeyError = error.message.includes('GEMINI_API_KEY') || error.message.includes('API key');
    
    // In order to provide a pristine preview user experience even before they configure their custom keys,
    // we return a beautiful simulated script payload marked with a status letting them know.
    if (isKeyError) {
      console.warn('Falling back to custom simulated generation due to missing server API keys.');
      const demoScript = generateSimulatedScript(topic, selectedTone, selectedPlatform);
      return res.json({
        ...demoScript,
        _simulation: true,
        message: 'This script is generated in Demo Mode because a GEMINI_API_KEY is not configured yet. Add your key in AI Studio Secrets to unlock real AI generation!'
      });
    }

    return res.status(500).json({ 
      error: 'Generation failed: ' + error.message,
      suggestion: 'Ensure your GEMINI_API_KEY is valid and configured.'
    });
  }
});

// Real Google AI Voice Synthesis endpoint using premium gemini-3.1-flash-tts-preview
app.post('/api/synthesize', async (req, res) => {
  const { text, voiceName } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required for TTS synthesis.' });
  }

  const selectedVoice = voiceName || 'Kore';

  try {
    const ai = getGeminiClient();
    
    // Strip out SSML or bracketed cues (e.g. [whispers], (pause)) for smoother clean reading
    const cleanText = text.replace(/\[.*?\]|\(.*?\)/g, '').trim();

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text: cleanText }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: selectedVoice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error('No audio data returned from the Gemini TTS model.');
    }

    return res.json({ audioBase64: base64Audio });
  } catch (error: any) {
    console.error('Speech synthesis error:', error.message);
    
    const isKeyError = error.message.includes('GEMINI_API_KEY') || error.message.includes('API key');
    if (isKeyError) {
      return res.status(400).json({ 
        error: 'Demo Mode Fallback',
        isDemo: true,
        message: 'Google AI voice synthesis is in demo fallback. Add your GEMINI_API_KEY in Secrets to try premium synthetic voices!'
      });
    }
    
    return res.status(500).json({ 
      error: error.message || 'Speech Synthesis Failed'
    });
  }
});

// Configure Vite or production folder serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ScriptFlow AI Backend Server running at http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

setupServer().catch((err) => {
  console.error("Failed to start ScriptFlow AI Server:", err);
});
