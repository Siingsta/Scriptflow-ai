/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Video, 
  Play, 
  Pause,
  Square,
  Check, 
  Copy, 
  Download, 
  RefreshCw, 
  Sliders, 
  Lock, 
  Unlock, 
  FileText, 
  Zap, 
  Volume2, 
  Tv, 
  Flame, 
  ArrowRight, 
  Clock, 
  Compass, 
  Eye, 
  Moon, 
  Smartphone, 
  User, 
  LogOut, 
  LogIn, 
  X,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScriptResponse, ScriptScene } from './types';
import { 
  supabase, 
  isSupabaseConfigured, 
  getMockSession, 
  setMockSession 
} from './lib/supabase';

// High impact template suggestions
const SUGGESTED_TOPICS = [
  "3 Dark History Anomalies",
  "The Psychology of Extreme Wealth",
  "Why NASA Stopped Exploring The Deep Ocean",
  "How dopamine loops control your screen time",
  "The 5-second trick to cure morning fatigue"
];

// Reassuring loading statements to cycle through
const LOADING_STATEMENTS = [
  "Formulating viral hook hook logic...",
  "Stitching dynamic retention loops...",
  "Formatting typographic viewport text...",
  "Analyzing continuous sensory pacing...",
  "Injecting conversational psychological triggers..."
];

export default function App() {
  // Authentication states
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(!isSupabaseConfigured);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authIsSignUp, setAuthIsSignUp] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Script Builder states
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Mysterious');
  const [platform, setPlatform] = useState('YouTube Shorts');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0);
  const [script, setScript] = useState<ScriptResponse | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyVoiceoverSuccess, setCopyVoiceoverSuccess] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activePreviewSceneIdx, setActivePreviewSceneIdx] = useState(0);
  const [errorToast, setErrorToast] = useState('');
  const [voiceGender, setVoiceGender] = useState<'male' | 'female'>('male');
  const [googleVoice, setGoogleVoice] = useState<string>('Puck');
  const activeAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingSceneIdx, setCurrentSpeakingSceneIdx] = useState<number | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Handle Auth changes on mount
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({ email: session.user.email || 'user@supabase' });
          setIsDemoMode(false);
        } else {
          // Check mock storage if supabase fails or is unauthenticated
          const localUser = getMockSession();
          if (localUser) {
            setUser(localUser);
            setIsDemoMode(true);
          }
        }
      });

      // Subscribe to real time updates
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({ email: session.user.email || 'user@supabase' });
          setIsDemoMode(false);
        } else {
          setUser(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Fallback fully to sandbox mock authentication
      const localUser = getMockSession();
      if (localUser) {
        setUser(localUser);
      }
      setIsDemoMode(true);
    }
  }, []);

  // Cycle loaders
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setCurrentLoadingStep((prev) => (prev + 1) % LOADING_STATEMENTS.length);
      }, 2500);
    } else {
      setCurrentLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Auth Operations
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    if (!authEmail || !authPassword) {
      setAuthError('Please fill in all core fields.');
      setAuthLoading(false);
      return;
    }

    if (!isSupabaseConfigured) {
      // Execute local simulation state matching with standard local guidelines
      setTimeout(() => {
        const simulatedUser = { id: 'usr_' + Date.now(), email: authEmail };
        setMockSession(simulatedUser);
        setUser(simulatedUser);
        setIsDemoMode(true);
        setAuthLoading(false);
        setShowAuthModal(false);
        // Clean form states
        setAuthEmail('');
        setAuthPassword('');
      }, 800);
    } else if (supabase) {
      // Execute actual Supabase triggers
      try {
        if (authIsSignUp) {
          const { data, error } = await supabase.auth.signUp({
            email: authEmail,
            password: authPassword,
          });
          if (error) throw error;
          if (data.user) {
            setUser({ email: data.user.email || authEmail });
            setErrorToast('Sign-up successful! Welcome aboard.');
          }
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: authEmail,
            password: authPassword,
          });
          if (error) throw error;
          if (data.user) {
            setUser({ email: data.user.email || authEmail });
          }
        }
        setShowAuthModal(false);
        setAuthEmail('');
        setAuthPassword('');
      } catch (err: any) {
        setAuthError(err.message || 'Authentication operation failed.');
      } finally {
        setAuthLoading(false);
      }
    }
  };

  const handleSimulatedBypass = () => {
    const backupEmail = authEmail || 'guest.creator@yourniche.com';
    const simulatedUser = { id: 'usr_' + Date.now(), email: backupEmail };
    setMockSession(simulatedUser);
    setUser(simulatedUser);
    setIsDemoMode(true);
    setShowAuthModal(false);
    setAuthEmail('');
    setAuthPassword('');
    setAuthError('');
    setErrorToast('Bypassed with Sandbox Guest Mode successfully! Happy writing.');
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setMockSession(null);
    setUser(null);
    setScript(null);
  };

  // Generate Script Engine Integration trigger
  const handleGenerateScript = async () => {
    if (!topic.trim()) {
      setErrorToast('Please describe your target video topic first!');
      return;
    }

    // Force sign in constraint for premium retention generators - customizable
    if (!user) {
      setErrorToast('Please sign in first (using Sim or Real Auth) to access generation services.');
      setShowAuthModal(true);
      return;
    }

    setIsGenerating(true);
    setScript(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          tone: tone,
          platform: platform
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server returned an invalid error response.');
      }

      const parsedScript: ScriptResponse & { _simulation?: boolean, message?: string } = await response.json();
      
      setScript(parsedScript);
      setActivePreviewSceneIdx(0);

      if (parsedScript._simulation) {
        setErrorToast('Generating in Simulation/Demo mode since GEMINI_API_KEY is not configured yet.');
      }

    } catch (err: any) {
      console.error(err);
      setErrorToast(err.message || 'Script compilation failed. Check console.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Clipboard copies
  const handleCopyToClipboard = () => {
    if (!script) return;

    let textBuffer = `=== SCRIPTFLOW AI GENERATED VIRAL SCRIPT ===\n`;
    textBuffer += `TITLE: ${script.title}\n`;
    textBuffer += `TOPIC: ${script.topic}\n`;
    textBuffer += `TONE: ${script.tone}\n`;
    textBuffer += `PLATFORM: ${script.targetPlatform}\n`;
    textBuffer += `ESTIMATED TOTAL DURATION: ${script.totalDuration} seconds\n`;
    textBuffer += `VIRAL HOOK PSYCHOLOGY: ${script.viralHookReason}\n`;
    textBuffer += `SEAMLESS LOOP STRATEGY: ${script.loopStrategy}\n\n`;
    
    textBuffer += `--- SCENE BY SCENE SCRIPT BREAKDOWN ---\n`;
    script.scenes.forEach((scene) => {
      textBuffer += `\n[Scene ${scene.sceneNumber}] (${scene.duration})\n`;
      textBuffer += `▶ VISUAL (B-ROLL): ${scene.visualPrompt}\n`;
      textBuffer += `🎙️ VOICEOVER: "${scene.voiceover}"\n`;
      textBuffer += `💬 CAPTIONS: [${scene.screenText}]\n`;
      if (scene.pacingTip) {
        textBuffer += `⚡ DELIVERY PACING: ${scene.pacingTip}\n`;
      }
    });

    navigator.clipboard.writeText(textBuffer).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    });
  };

  const handleCopyVoiceoversOnly = () => {
    if (!script) return;
    const voiceovers = script.scenes.map(s => s.voiceover).join("\n\n");
    navigator.clipboard.writeText(voiceovers).then(() => {
      setCopyVoiceoverSuccess(true);
      setTimeout(() => setCopyVoiceoverSuccess(false), 2500);
    });
  };

  const handleCopyField = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  // Download raw txt file
  const handleDownloadScript = () => {
    if (!script) return;

    let textBuffer = `=== SCRIPTFLOW AI GENERATED VIRAL SCRIPT ===\n`;
    textBuffer += `TITLE: ${script.title}\n`;
    textBuffer += `TOPIC: ${script.topic}\n`;
    textBuffer += `TONE: ${script.tone}\n`;
    textBuffer += `PLATFORM: ${script.targetPlatform}\n`;
    textBuffer += `ESTIMATED TOTAL DURATION: ${script.totalDuration} seconds\n`;
    textBuffer += `VIRAL HOOK PSYCHOLOGY: ${script.viralHookReason}\n`;
    textBuffer += `SEAMLESS LOOP STRATEGY: ${script.loopStrategy}\n\n`;
    
    textBuffer += `--- SCENE BY SCENE SCRIPT BREAKDOWN ---\n`;
    script.scenes.forEach((scene) => {
      textBuffer += `\n[Scene ${scene.sceneNumber}] (${scene.duration})\n`;
      textBuffer += `▶ VISUAL (B-ROLL): ${scene.visualPrompt}\n`;
      textBuffer += `🎙️ VOICEOVER: "${scene.voiceover}"\n`;
      textBuffer += `💬 CAPTIONS: [${scene.screenText}]\n`;
      if (scene.pacingTip) {
        textBuffer += `⚡ DELIVERY PACING: ${scene.pacingTip}\n`;
      }
    });

    const element = document.createElement("a");
    const file = new Blob([textBuffer], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${script.title.toLowerCase().replace(/\s+/g, "_")}_viral_script.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // TTS Voice Synthesis Engine
  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        setVoices(window.speechSynthesis.getVoices());
      }
    };
    loadVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Helper to add 44-byte WAV header to 24000Hz 16-bit Mono PCM
  const addWavHeader = (pcmBytes: Uint8Array, sampleRate = 24000): Uint8Array => {
    const buffer = new ArrayBuffer(44 + pcmBytes.byteLength);
    const view = new DataView(buffer);

    const writeString = (v: DataView, offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        v.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
    /* file length */
    view.setUint32(4, 36 + pcmBytes.byteLength, true);
    /* RIFF type */
    writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw PCM = 1) */
    view.setUint16(20, 1, true);
    /* channel count */
    view.setUint16(22, 1, true); // Mono
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * 2, true); // 16-bit = 2 bytes
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, 2, true);
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    writeString(view, 36, 'data');
    /* chunk length */
    view.setUint32(40, pcmBytes.byteLength, true);

    // Copy PCM data
    const uint8View = new Uint8Array(buffer);
    uint8View.set(pcmBytes, 44);

    return uint8View;
  };

  const stopSpeaking = () => {
    // 1. Cancel active HTMLAudioElement if any
    if (activeAudioRef.current) {
      try {
        activeAudioRef.current.pause();
        activeAudioRef.current = null;
      } catch (err) {
        console.error("Audio pause error", err);
      }
    }

    // 2. Cancel fallback window Synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
    setCurrentSpeakingSceneIdx(null);
  };

  const speakText = async (text: string, sceneIndex: number | null = null, onEndCallback?: () => void) => {
    // 1. Fully clear any active playback
    stopSpeaking();

    setIsSpeaking(true);
    if (sceneIndex !== null) {
      setCurrentSpeakingSceneIdx(sceneIndex);
      setActivePreviewSceneIdx(sceneIndex);
    }

    try {
      // 2. Fetch synthesized audio from Gemini TTS Engine API
      const response = await fetch('/api/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: text, 
          voiceName: googleVoice 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.isDemo) {
          console.warn('API Key missing. Falling back to local browser TTS synthesis:', errorData.message);
          speakTextFallback(text, sceneIndex, onEndCallback);
          return;
        }
        throw new Error(errorData.message || errorData.error || 'Failed to synthesize speech');
      }

      const data = await response.json();
      if (!data.audioBase64) {
        throw new Error('No audio returned from Google AI speech synthesis API');
      }

      // 3. Convert base64 data to PCM Uint8Array
      const binaryString = window.atob(data.audioBase64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // 4. Wrap with an on-the-fly WAV header for universal HTML5 playback compatibility
      const wavBytes = addWavHeader(bytes, 24000);
      const blob = new Blob([wavBytes], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(blob);

      // 5. Build, cache and play the Audio object
      const audio = new Audio(audioUrl);
      activeAudioRef.current = audio;

      audio.onplay = () => {
        setIsSpeaking(true);
      };

      audio.onended = () => {
        setIsSpeaking(false);
        setCurrentSpeakingSceneIdx(null);
        activeAudioRef.current = null;
        if (onEndCallback) {
          onEndCallback();
        }
      };

      audio.onerror = (e) => {
        console.error("Premium Audio playback failed, running native browser synthesis fallback.", e);
        speakTextFallback(text, sceneIndex, onEndCallback);
      };

      await audio.play();

    } catch (err: any) {
      console.warn("Speech synthesis API failed. Falling back to local SpeechSynthesis:", err.message);
      speakTextFallback(text, sceneIndex, onEndCallback);
    }
  };

  // Browser speech synthesis fallback (offline/sandbox demo support)
  const speakTextFallback = (text: string, sceneIndex: number | null = null, onEndCallback?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setErrorToast('Speech synthesis not supported in this environment.');
      setIsSpeaking(false);
      setCurrentSpeakingSceneIdx(null);
      return;
    }

    const cleanText = text.replace(/\[.*?\]|\(.*?\)/g, ''); // strip out bracketed cues
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Filter available English voices
    const englishVoices = voices.filter(v => v.lang.startsWith('en'));
    
    // Choose suitable voice based on gender
    let selectedVoice = null;
    if (voiceGender === 'male') {
      selectedVoice = englishVoices.find(v => 
        v.name.toLowerCase().includes('male') || 
        v.name.toLowerCase().includes('david') || 
        v.name.toLowerCase().includes('daniel') || 
        v.name.toLowerCase().includes('george') || 
        v.name.toLowerCase().includes('james') || 
        v.name.toLowerCase().includes('rishi')
      );
    } else {
      selectedVoice = englishVoices.find(v => 
        v.name.toLowerCase().includes('female') || 
        v.name.toLowerCase().includes('zira') || 
        v.name.toLowerCase().includes('samantha') || 
        v.name.toLowerCase().includes('susan') || 
        v.name.toLowerCase().includes('hazel') || 
        v.name.toLowerCase().includes('google us english')
      );
    }

    if (!selectedVoice && englishVoices.length > 0) {
      selectedVoice = englishVoices[0];
    }
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Adapt pitch and rate to better approximate male and female tones
    if (voiceGender === 'female') {
      utterance.pitch = 1.15;
      utterance.rate = 1.05;
    } else {
      utterance.pitch = 0.85;
      utterance.rate = 0.98;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      if (sceneIndex !== null) {
        setCurrentSpeakingSceneIdx(sceneIndex);
        setActivePreviewSceneIdx(sceneIndex);
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeakingSceneIdx(null);
      if (onEndCallback) {
        onEndCallback();
      }
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentSpeakingSceneIdx(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const playFullScriptVoiceover = () => {
    if (!script) return;
    stopSpeaking();
    
    let currentIdx = 0;
    
    const playNext = () => {
      if (!script || currentIdx >= script.scenes.length) {
        setIsSpeaking(false);
        setCurrentSpeakingSceneIdx(null);
        return;
      }
      
      const currentScene = script.scenes[currentIdx];
      speakText(currentScene.voiceover, currentIdx, () => {
        currentIdx++;
        setTimeout(() => {
          playNext();
        }, 500);
      });
    };
    
    playNext();
  };

  // Tone choices definition
  const TONE_DEFS = [
    { name: 'Mysterious', icon: Moon, desc: 'Conspiratorial, whispering, slow buildup', color: 'border-purple-500/30 text-purple-400 bg-purple-950/20' },
    { name: 'Energetic', icon: Flame, desc: 'Ultra-fast, hype-inducing, peak volume', color: 'border-orange-500/30 text-orange-400 bg-orange-950/20' },
    { name: 'Dramatic', icon: Zap, desc: 'Explosive pauses, deep theatrical scales', color: 'border-rose-500/30 text-rose-400 bg-rose-950/20' },
    { name: 'Educational', icon: Compass, desc: 'Crisp clarity, authoritative, fact-focused', color: 'border-cyan-500/30 text-cyan-400 bg-cyan-950/20' },
  ];

  return (
    <div className="min-h-screen bg-[#05050a] text-zinc-100 flex flex-col font-sans selection:bg-indigo-600/40 antialiased overflow-x-hidden">
      
      {/* Alert / Toast Messages */}
      <AnimatePresence>
        {errorToast && (
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="bg-white/5 border border-white/10 text-cyan-100 shadow-[0_0_25px_rgba(6,182,212,0.15)] rounded-xl py-3.5 px-4 flex items-start gap-3 backdrop-blur-xl">
              <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-sm font-medium leading-relaxed">
                {errorToast}
              </div>
              <button 
                onClick={() => setErrorToast('')} 
                className="text-gray-405 hover:text-white p-0.5 transition-colors cursor-pointer"
                id="close-toast-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative background grid effects & Frosted glass orbs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Header View */}
      <header className="relative z-10 mx-6 mt-6 px-6 py-3.5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-black text-xs">SF</span>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                ScriptFlow <span className="text-indigo-400">AI</span>
              </span>
              <p className="text-[9px] text-zinc-500 font-mono tracking-wider">RETENTION ENGINEERING LAB</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Environment Status Capsule */}
            <div className="hidden md:flex items-center gap-2 bg-black/40 border border-white/10 rounded-full px-3 py-1 text-[11px] font-mono">
              <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-indigo-400' : 'bg-purple-400 animate-ping'}`} />
              <span className="text-zinc-400">
                {isSupabaseConfigured ? 'Supabase Secure' : 'Dev Sandbox Mode'}
              </span>
            </div>

            {user ? (
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
                <div className="flex flex-col text-right">
                  <span className="text-xs text-zinc-300 font-mono hidden sm:inline leading-none truncate max-w-[140px] mb-0.5">
                    {user.email}
                  </span>
                  <span className="text-[9px] text-indigo-400 font-mono leading-none font-bold uppercase tracking-widest">
                    {isDemoMode ? 'SIM MEMBER' : 'PRO MEMBER'}
                  </span>
                </div>
                <button
                  id="header-logout-btn"
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white hover:border border-transparent hover:border-white/10 transition-all cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="header-login-btn"
                onClick={() => {
                  setAuthIsSignUp(false);
                  setAuthError('');
                  setShowAuthModal(true);
                }}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold border border-white/10 transition-all cursor-pointer text-white shadow-md active:scale-95"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Section: Parameter Inputs Config (colspan-5) */}
        <section className="lg:col-span-5 flex flex-col gap-6" id="script-generator-config">
          
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 relative overflow-hidden">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Generator Setup</h2>
            </div>

            {/* Video Target Platform */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Target Visual Platform</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="platform-shorts-btn"
                  type="button"
                  onClick={() => setPlatform('YouTube Shorts')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    platform === 'YouTube Shorts'
                      ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 font-bold shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                      : 'bg-black/40 border-white/5 text-zinc-400 hover:border-white/10 hover:bg-white/5'
                  }`}
                >
                  <Tv className="w-3.5 h-3.5" />
                  YouTube Shorts
                </button>
                <button
                  id="platform-reels-btn"
                  type="button"
                  onClick={() => setPlatform('Instagram Reels')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    platform === 'Instagram Reels'
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-bold shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                      : 'bg-black/40 border-white/5 text-zinc-400 hover:border-white/10 hover:bg-white/5'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  Instagram Reels
                </button>
              </div>
            </div>

            {/* Topic Specification Text Box */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Video Topic or Niche</label>
                <span className="text-[9px] text-zinc-500 font-mono tracking-wide">RETENTION ANCHOR</span>
              </div>
              <textarea
                id="topic-input-box"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. 3 Deep Space anomalies, Secrets of dopamine loops, Wealth Psychology tricks..."
                className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/50 min-h-[100px] resize-none leading-relaxed transition-colors"
              />
              
              {/* Quick suggestions chips */}
              <div className="flex flex-wrap gap-1.5 mt-1">
                <span className="text-[10px] text-zinc-500 self-center mr-1">Inspirations:</span>
                {SUGGESTED_TOPICS.map((suggested, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTopic(suggested)}
                    className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded px-2.5 py-1 text-indigo-300 transition-all cursor-pointer truncate max-w-[200px]"
                  >
                    + {suggested}
                  </button>
                ))}
              </div>
            </div>

            {/* Micro tone card selector Grid */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Auditory Delivery Tone</label>
              <div className="grid grid-cols-2 gap-2">
                {TONE_DEFS.map((toneDef) => {
                  const IconComp = toneDef.icon;
                  const isSelected = tone === toneDef.name;
                  return (
                    <button
                      id={`tone-${toneDef.name.toLowerCase()}-btn`}
                      key={toneDef.name}
                      type="button"
                      onClick={() => setTone(toneDef.name)}
                      className={`text-left p-3.5 rounded-xl border flex flex-col gap-1 transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-indigo-500/10 border-indigo-505 border-indigo-500 text-indigo-400 ring-1 ring-indigo-500/20' 
                          : 'bg-black/40 border-white/5 hover:border-white/10 text-zinc-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-zinc-500'}`} />
                        <span className="text-xs font-bold font-mono tracking-wide">{toneDef.name}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 leading-snug font-sans">{toneDef.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Voiceover Artist Selection */}
            <div className="flex flex-col gap-2.5 bg-white/5 p-3.5 rounded-2xl border border-white/5">
              <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">Voiceover Artist Profiles</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="voice-male-btn"
                  type="button"
                  onClick={() => {
                    setVoiceGender('male');
                    setGoogleVoice('Puck');
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    voiceGender === 'male'
                      ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 font-bold shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                      : 'bg-black/40 border-white/5 text-zinc-400 hover:border-white/10 hover:bg-white/5'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  Male Artists
                </button>
                <button
                  id="voice-female-btn"
                  type="button"
                  onClick={() => {
                    setVoiceGender('female');
                    setGoogleVoice('Kore');
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    voiceGender === 'female'
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-bold shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                      : 'bg-black/40 border-white/5 text-zinc-400 hover:border-white/10 hover:bg-white/5'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-pink-400" />
                  Female Artists
                </button>
              </div>

              {/* Google AI Premium Voice Preset Selector */}
              <div className="flex flex-col gap-1.5 mt-1 pt-2 border-t border-white/5">
                <label className="text-[10px] font-medium text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Volume2 className="w-3 h-3 text-indigo-400 animate-pulse" />
                  Google AI Prebuilt Voice Artist
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {voiceGender === 'male' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setGoogleVoice('Puck')}
                        className={`py-1.5 px-1 rounded-lg border text-[10px] text-center font-mono transition-all cursor-pointer truncate ${
                          googleVoice === 'Puck'
                            ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 font-bold'
                            : 'bg-black/20 border-white/5 text-zinc-400 hover:border-white/10 hover:bg-white/5'
                        }`}
                        title="Puck - Energetic and Warm"
                      >
                        Puck (Hype)
                      </button>
                      <button
                        type="button"
                        onClick={() => setGoogleVoice('Charon')}
                        className={`py-1.5 px-1 rounded-lg border text-[10px] text-center font-mono transition-all cursor-pointer truncate ${
                          googleVoice === 'Charon'
                            ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 font-bold'
                            : 'bg-black/20 border-white/5 text-zinc-400 hover:border-white/10 hover:bg-white/5'
                        }`}
                        title="Charon - Deep and Commanding"
                      >
                        Charon (Deep)
                      </button>
                      <button
                        type="button"
                        onClick={() => setGoogleVoice('Fenrir')}
                        className={`py-1.5 px-1 rounded-lg border text-[10px] text-center font-mono transition-all cursor-pointer truncate ${
                          googleVoice === 'Fenrir'
                            ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 font-bold'
                            : 'bg-black/20 border-white/5 text-zinc-400 hover:border-white/10 hover:bg-white/5'
                        }`}
                        title="Fenrir - Mysterious Drama"
                      >
                        Fenrir (Drama)
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setGoogleVoice('Kore')}
                        className={`py-1.5 px-1 rounded-lg border text-[10px] text-center font-mono transition-all cursor-pointer truncate ${
                          googleVoice === 'Kore'
                            ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-bold'
                            : 'bg-black/20 border-white/5 text-zinc-400 hover:border-white/10 hover:bg-white/5'
                        }`}
                        title="Kore - Professional and Bright"
                      >
                        Kore (Bright)
                      </button>
                      <button
                        type="button"
                        onClick={() => setGoogleVoice('Zephyr')}
                        className={`py-1.5 px-1 rounded-lg border text-[10px] text-center font-mono transition-all cursor-pointer truncate ${
                          googleVoice === 'Zephyr'
                            ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-bold'
                            : 'bg-black/20 border-white/5 text-zinc-400 hover:border-white/10 hover:bg-white/5'
                        }`}
                        title="Zephyr - Soft and Serene"
                      >
                        Zephyr (Calm)
                      </button>
                      <div className="bg-white/[0.02] border border-white/[0.02] py-1.5 rounded-lg text-center font-mono text-[9px] text-zinc-500 flex items-center justify-center">
                        Secure API
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Prominent Action Generation Button */}
            <button
              id="generate-script-btn"
              type="button"
              onClick={handleGenerateScript}
              disabled={isGenerating}
              className={`w-full py-4 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-2xl text-sm font-bold shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer text-white`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>AI Retaining Engine Spinning...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-200 animate-pulse" />
                  <span>Generate Viral Script</span>
                </>
              )}
            </button>
          </div>

          {/* Psychological Rules Card */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col gap-3 font-mono text-xs shadow-xl">
            <span className="text-indigo-400 font-bold uppercase tracking-widest text-[10px]">Retention Design Rules</span>
            <ul className="space-y-2.5 text-zinc-400">
              <li className="flex gap-2 leading-relaxed">
                <span className="text-indigo-400 flex-shrink-0">✓</span>
                <span><strong>No Hello:</strong> Skip greeting; open with action prompt on Scene 1 instantly.</span>
              </li>
              <li className="flex gap-2 leading-relaxed">
                <span className="text-indigo-400 flex-shrink-0">✓</span>
                <span><strong>Infinite Loop:</strong> Pacing tip ends on terminal tag that reconnects.</span>
              </li>
              <li className="flex gap-2 leading-relaxed">
                <span className="text-indigo-400 flex-shrink-0">✓</span>
                <span><strong>Typo overlay:</strong> Overlays must match vocal peaks with high contrast.</span>
              </li>
            </ul>
          </div>

        </section>

        {/* Right Section: Interactive Output Display Display (colspan-7) */}
        <section className="lg:col-span-7 flex flex-col min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* 1. Loading State Screen */}
            {isGenerating && (
              <motion.div
                key="loader-screen"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[450px]"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-indigo-500/20 border-t-indigo-400 animate-spin" />
                  <Sparkles className="w-6 h-6 text-indigo-400 absolute inset-0 m-auto animate-pulse" />
                </div>

                <h3 className="text-lg font-bold text-zinc-200 font-sans text-center mb-2">Analyzing Topic Space</h3>
                
                {/* Dynamically cycled messaging */}
                <motion.p 
                  key={currentLoadingStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-xs text-indigo-400 font-mono tracking-wide text-center max-w-xs h-6 mb-8"
                >
                  {LOADING_STATEMENTS[currentLoadingStep]}
                </motion.p>

                <div className="w-full max-w-xs bg-black/40 border border-white/5 rounded-full h-1.5 p-0.5 overflow-hidden">
                  <motion.div 
                    initial={{ width: "3%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 12, ease: "easeInOut" }}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full"
                  />
                </div>
                <span className="text-[10px] text-zinc-500 mt-2.5 font-mono">Compiling Gemini-3.5-Flash Core Model</span>
              </motion.div>
            )}

            {/* 2. Base View Container: Script Output Frame */}
            {!isGenerating && script && (
              <motion.div
                key="script-active-screen"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-6"
              >
                
                {/* Script KPI Metrics Row */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
                  
                  {/* Title and platform details */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full px-2.5 py-0.5 font-mono font-semibold uppercase tracking-wide">
                          {script.targetPlatform}
                        </span>
                        <span className="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-full px-2.5 py-0.5 font-mono font-semibold uppercase tracking-wide">
                          {script.tone} Selection
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-white">
                          "{script.title}"
                        </h1>
                        <button
                          type="button"
                          onClick={() => handleCopyField(script.title, 'title')}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all inline-flex items-center justify-center cursor-pointer"
                          title="Copy Title"
                        >
                          {copiedId === 'title' ? (
                            <Check className="w-3.5 h-3.5 text-green-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-zinc-405 text-zinc-400" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
                        Topic: <span className="text-zinc-200 italic font-medium">{script.topic}</span>
                      </p>
                    </div>

                    {/* Quality Badges */}
                    <div className="flex flex-col items-end flex-shrink-0 text-right">
                      <div className="flex items-center gap-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-505 border-indigo-500/20 rounded-lg px-2.5 py-1 font-mono text-xs font-semibold">
                        <TrendingUp className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                        <span>{script.estimatedEngagementRate} Ret</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 mt-1.5 font-mono">Calculated Flow Rate</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-white/10 pt-4">
                    <div className="bg-black/40 rounded-xl p-3.5 border border-white/5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/5">
                        <Flame className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 uppercase font-bold block">Hook Rating</span>
                        <span className="text-sm font-bold text-zinc-200">{script.hookStrength} / 10 Strength</span>
                      </div>
                    </div>

                    <div className="bg-black/40 rounded-xl p-3.5 border border-white/5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/5">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 uppercase font-bold block">Pacing Duration</span>
                        <span className="text-sm font-bold text-zinc-200">~{script.totalDuration}s Frame</span>
                      </div>
                    </div>

                    <div className="bg-black/40 rounded-xl p-3.5 border border-white/5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-indigo-300">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 uppercase font-bold block">Status State</span>
                        <span className="text-sm font-heavy text-indigo-405 font-mono font-bold text-indigo-400">Success OK</span>
                      </div>
                    </div>
                  </div>

                  {/* Viral Driver Analysis Drawer */}
                  <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col gap-3 font-sans text-xs">
                    <div>
                      <span className="text-indigo-400 font-mono font-bold uppercase text-[9px] tracking-wider block mb-1">
                        VIRAL HOOK PSYCHOLOGY COGNITION
                      </span>
                      <p className="text-zinc-350 text-zinc-300 leading-relaxed font-sans">{script.viralHookReason}</p>
                    </div>
                    <div className="border-t border-white/5 pt-2.5">
                      <span className="text-purple-400 font-mono font-bold uppercase text-[9px] tracking-wider block mb-1">
                        SEAMLESS END-TO-BEGINNING LOOP STRATEGY
                      </span>
                      <p className="text-zinc-350 text-zinc-300 leading-relaxed font-sans italic">"{script.loopStrategy}"</p>
                    </div>
                  </div>

                  {/* Action Copy and Download toolbar */}
                  <div className="flex items-center gap-2 mt-1 border-t border-white/10 pt-4 flex-wrap md:flex-nowrap">
                    <button
                      id="copy-to-clipboard-btn"
                      onClick={handleCopyToClipboard}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-zinc-100 font-bold text-xs cursor-pointer transition-all bg-white/10 hover:bg-white/15 border border-white/10"
                    >
                      {copySuccess ? (
                        <>
                          <Check className="w-4 h-4 text-green-400" />
                          <span className="text-green-400">COPIED SUCCESSFULLY</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-indigo-400" />
                          <span>COPY FULL SCRIPT</span>
                        </>
                      )}
                    </button>
                    <button
                      id="copy-voiceovers-btn"
                      onClick={handleCopyVoiceoversOnly}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-zinc-100 font-bold text-xs cursor-pointer transition-all bg-indigo-500/10 hover:bg-indigo-500/15 border border-indigo-500/20"
                    >
                      {copyVoiceoverSuccess ? (
                        <>
                          <Check className="w-4 h-4 text-green-400" />
                          <span className="text-green-400">VOICEOVERS COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-purple-400" />
                          <span>COPY VOICEOVERS ONLY</span>
                        </>
                      )}
                    </button>
                    <button
                      id="download-script-btn"
                      onClick={handleDownloadScript}
                      className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-zinc-300 font-bold text-xs cursor-pointer transition-all bg-white/5 hover:bg-white/10 border border-white/5"
                    >
                      <Download className="w-4 h-4 text-zinc-400" />
                      <span>DOWNLOAD .TXT</span>
                    </button>
                  </div>
                </div>

                {/* The Core Scene Board */}
                <div className="flex flex-col gap-3" id="script-scene-board">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Viral Scene Timeline ({script.scenes.length} Blocks)</span>
                    <span className="text-[10px] text-cyan-400/80 font-mono">CHRONOLOGICAL ROADMAP</span>
                  </div>

                  <div className="space-y-4">
                    {script.scenes.map((scene, index) => {
                      const isActive = activePreviewSceneIdx === index;
                      return (
                        <div 
                          key={scene.sceneNumber} 
                          className={`bg-white/5 backdrop-blur-md border rounded-2xl overflow-hidden shadow-xl transition-all ${
                            isActive ? 'border-indigo-505 border-indigo-505 border-indigo-500 shadow-indigo-500/5 ring-1 ring-indigo-500/20' : 'border-white/10 hover:border-white/20'
                          }`}
                        >
                          {/* Scene Trigger / Header */}
                          <div 
                            onClick={() => setActivePreviewSceneIdx(index)}
                            className="bg-white/5 px-4 py-3 flex items-center justify-between cursor-pointer border-b border-white/10"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-md bg-black/40 border border-white/10 text-indigo-400 font-mono text-xs font-bold flex items-center justify-center">
                                {scene.sceneNumber}
                              </span>
                              <span className="text-xs font-bold font-mono text-zinc-300">
                                Scene Block: {scene.sceneNumber}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded">
                                {scene.duration}
                              </span>
                              <span className="text-xs text-indigo-400 font-mono flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {isActive ? 'Live' : 'Preview'}
                              </span>
                            </div>
                          </div>

                          {/* Scene content detail */}
                          <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                            
                            {/* Left part: Content & Voice details (cols-8) */}
                            <div className="md:col-span-8 flex flex-col gap-3">
                              
                              {/* Visual B-Roll Suggestion */}
                              <div className="flex flex-col gap-1 inline-block">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider font-semibold">
                                    ▶ VISUALS (PROMPTING / B-ROLL DESIGN)
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyField(scene.visualPrompt, `visual-${scene.sceneNumber}`)}
                                    className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all cursor-pointer inline-flex items-center justify-center"
                                    title="Copy Visuals"
                                  >
                                    {copiedId === `visual-${scene.sceneNumber}` ? (
                                      <Check className="w-3.5 h-3.5 text-green-400" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                                <p className="text-xs text-zinc-300 leading-relaxed bg-black/40 p-2.5 rounded-lg border border-white/5">
                                  {scene.visualPrompt}
                                </p>
                              </div>

                              {/* Spoken Narration Script */}
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] text-indigo-400 font-mono uppercase tracking-wider font-semibold">
                                    🎙️ VOICEOVER NARRATION (Zero-Fluff Script)
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (isSpeaking && currentSpeakingSceneIdx === index) {
                                          stopSpeaking();
                                        } else {
                                          speakText(scene.voiceover, index);
                                        }
                                      }}
                                      className="py-1 px-2 rounded-lg text-zinc-400 hover:text-indigo-300 hover:bg-white/5 transition-all cursor-pointer inline-flex items-center justify-center gap-1 font-mono text-[9px] font-bold tracking-wider uppercase border border-white/5"
                                      title={isSpeaking && currentSpeakingSceneIdx === index ? "Stop speaking this scene" : "Speak this scene"}
                                    >
                                      {isSpeaking && currentSpeakingSceneIdx === index ? (
                                        <>
                                          <Square className="w-2.5 h-2.5 text-red-400 fill-current" />
                                          <span className="text-red-400">Stop</span>
                                        </>
                                      ) : (
                                        <>
                                          <Play className="w-2.5 h-2.5 text-indigo-400 fill-current animate-pulse" />
                                          <span className="text-indigo-400">Listen</span>
                                        </>
                                      )}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyField(scene.voiceover, `voiceover-${scene.sceneNumber}`)}
                                      className="p-1 rounded text-zinc-500 hover:text-indigo-300 hover:bg-white/5 transition-all cursor-pointer inline-flex items-center justify-center"
                                      title="Copy Voiceover"
                                    >
                                      {copiedId === `voiceover-${scene.sceneNumber}` ? (
                                        <Check className="w-3.5 h-3.5 text-green-400" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                                <div className="text-sm text-white font-sans leading-relaxed tracking-normal bg-black/40 p-3 rounded-lg border border-white/5 font-medium">
                                  "{scene.voiceover}"
                                </div>
                              </div>
                            </div>

                            {/* Right part: Telemetry Typo captures (cols-4) */}
                            <div className="md:col-span-4 flex flex-col gap-3 justify-between border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-4">
                              
                              {/* Overlay typographic captions */}
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] text-purple-400 font-mono uppercase tracking-wider font-semibold">
                                    💬 SCREEN TEXT CAPTION
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyField(scene.screenText, `caption-${scene.sceneNumber}`)}
                                    className="p-1 rounded text-zinc-500 hover:text-purple-350 hover:text-purple-300 hover:bg-white/5 transition-all cursor-pointer inline-flex items-center justify-center"
                                    title="Copy Caption"
                                  >
                                    {copiedId === `caption-${scene.sceneNumber}` ? (
                                      <Check className="w-3.5 h-3.5 text-green-400" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                                <div className="text-center font-bold px-3 py-2 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-purple-300 text-xs tracking-wider border border-white/5 rounded-lg">
                                  "{scene.screenText}"
                                </div>
                              </div>

                              {/* Vocal Delivery tips */}
                              {scene.pacingTip && (
                                <div className="flex flex-col gap-1">
                                  <span className="text-[9px] text-indigo-400 font-mono uppercase tracking-wider font-semibold">
                                    ⚡ DELIVERY PACING TIP
                                  </span>
                                  <p className="text-[10px] text-zinc-400 leading-snug bg-black/45 border border-white/5 p-2 rounded">
                                    {scene.pacingTip}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* AI Voiceover Synthesis Lab and Audio Control Panel */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl" id="audio-synthesis-section">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-indigo-400 animate-pulse" />
                      <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400">🎙️ AI Voiceover Synthesis Lab</h3>
                    </div>
                    {/* Mode capsule */}
                    <span className="text-[9px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Active Artist: {voiceGender === 'male' ? 'Male Voice' : 'Female Voice'}
                    </span>
                  </div>

                  <div className="bg-black/35 rounded-2xl p-5 border border-white/5 flex flex-col gap-4">
                    {/* Control Bar and Waveform Interaction */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      
                      {/* Left: Buttons */}
                      <div className="md:col-span-5 flex flex-col gap-2.5">
                        <button
                          type="button"
                          onClick={playFullScriptVoiceover}
                          className="w-full py-2.5 px-4 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs cursor-pointer transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-600/10 active:scale-98"
                        >
                          <Play className="w-3.5 h-3.5 fill-current text-white/90" />
                          <span>SPEECHIFY COMPLETE SCRIPT</span>
                        </button>

                        <button
                          type="button"
                          onClick={stopSpeaking}
                          disabled={!isSpeaking}
                          className={`w-full py-2.5 px-4 rounded-xl font-bold border text-xs cursor-pointer transition-all flex items-center justify-center gap-2 active:scale-98 ${
                            isSpeaking 
                              ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/15'
                              : 'bg-zinc-800/10 border-white/5 text-zinc-500 cursor-not-allowed'
                          }`}
                        >
                          <Square className="w-3.5 h-3.5 fill-current" />
                          <span>STOP PLAYBACK</span>
                        </button>
                      </div>

                      {/* Right: Waveform and Interactive feedback */}
                      <div className="md:col-span-7 flex flex-col justify-center bg-black/40 border border-white/5 rounded-xl p-4 min-h-[96px] relative overflow-hidden">
                        
                        {/* Interactive Waveform Animation */}
                        {isSpeaking ? (
                          <div className="flex flex-col justify-between h-full w-full">
                            <div className="flex justify-between items-center mb-2.5">
                              <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                                Custom Voice synthesis active...
                              </span>
                              <span className="text-[10px] text-indigo-400 font-bold font-mono">
                                {currentSpeakingSceneIdx !== null ? `SCENE ${currentSpeakingSceneIdx + 1}` : 'NARRATING'}
                              </span>
                            </div>

                            {/* Animated Audio Waveform Bars */}
                            <div className="flex items-end justify-center gap-1 h-8 px-4 overflow-hidden">
                              {[1, 2, 3, 4, 5, 2, 4, 1, 3, 5, 6, 2, 3, 1, 4, 5, 2, 6, 3, 1, 4, 2, 5, 3, 1, 4, 2].map((val, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ height: 4 }}
                                  animate={{ height: isSpeaking ? [4, val * 5, 4] : 4 }}
                                  transition={{
                                    duration: 0.8 + (i % 3) * 0.15,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                  }}
                                  className="w-1 bg-gradient-to-t from-indigo-500 to-purple-400 rounded-full"
                                />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center py-2">
                            <Volume2 className="w-5 h-5 text-indigo-400/60 mb-1" />
                            <span className="text-xs text-zinc-350 font-sans font-medium">Vocal Reader Idle</span>
                            <p className="text-[10px] text-zinc-500 max-w-sm mt-0.5 font-mono">
                              Press "Speechify" above or individual "Listen" buttons below.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Gender and Speed information */}
                    <div className="flex flex-col gap-2 mt-1 bg-white/5 p-3.5 rounded-xl border border-white/5">
                      <span className="text-[9px] text-indigo-300 font-mono tracking-wide uppercase font-bold">
                        Vocal Artist Profile
                      </span>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
                        <div>
                          <span className="text-[9px] text-zinc-500 block uppercase">Voice Name</span>
                          <span className="text-[11px] text-zinc-200 font-semibold font-mono truncate block">
                            Google AI {googleVoice}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-500 block uppercase">Syllable Rate</span>
                          <span className="text-[11px] text-zinc-200 font-mono block">
                            {googleVoice === 'Puck' && '1.0x (Energetic)'}
                            {googleVoice === 'Charon' && '0.92x (Commanding)'}
                            {googleVoice === 'Fenrir' && '0.85x (Cinematic)'}
                            {googleVoice === 'Kore' && '1.05x (Polished)'}
                            {googleVoice === 'Zephyr' && '0.95x (Whispering)'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-500 block uppercase font-mono">Synthesizer Pitch</span>
                          <span className="text-[11px] text-zinc-200 font-mono block">
                            {googleVoice === 'Puck' && '100% (Hype Male)'}
                            {googleVoice === 'Charon' && '85% (Deep Baritone)'}
                            {googleVoice === 'Fenrir' && '75% (Dramatic Bass)'}
                            {googleVoice === 'Kore' && '120% (Bright Female)'}
                            {googleVoice === 'Zephyr' && '110% (Soft Alto)'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-500 block uppercase font-mono">Synthesis Engine</span>
                          <span className="text-[11px] text-zinc-200 font-mono block">
                            Gemini TTS (Hybrid)
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </motion.div>
            )}

            {/* 3. Empty State View */}
            {!isGenerating && !script && (
              <motion.div
                key="empty-dashboard-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center min-h-[450px] shadow-2xl relative overflow-hidden"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 border border-white/10 flex items-center justify-center text-indigo-400 mb-5 shadow-lg shadow-indigo-505/20">
                  <Video className="w-6 h-6 animate-pulse" />
                </div>
                
                <h3 className="text-lg font-bold tracking-tight text-white mb-2">
                  No Script Prepared Yet
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm leading-relaxed mb-6">
                  Fill out your custom video topic, select a delivery voice tone, and click "Generate Viral Script" to craft a short-form copy with high-retention cues.
                </p>

                {/* Retention Stats infographic bento */}
                <div className="w-full max-w-md grid grid-cols-2 gap-3">
                  <div className="bg-black/40 border border-white/5 p-3.5 rounded-xl text-left">
                    <span className="text-indigo-400 font-mono text-lg font-extrabold block">92%</span>
                    <span className="text-[10px] text-zinc-400 font-medium tracking-wide font-sans">Ideal Hook Retention</span>
                  </div>
                  <div className="bg-black/40 border border-white/5 p-3.5 rounded-xl text-left">
                    <span className="text-purple-400 font-mono text-lg font-extrabold block">3.0s</span>
                    <span className="text-[10px] text-zinc-400 font-medium tracking-wide font-sans">First Dropoff Window</span>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </section>

      </main>

      {/* Footer System Credits */}
      <footer className="mt-auto border-t border-white/5 bg-black/40 backdrop-blur-sm py-6 px-6 text-center text-xs text-zinc-500 font-mono">
        <p>© 2026 ScriptFlow AI Platform. Engineered for viral retention mechanics.</p>
        <div className="flex justify-center items-center gap-3 mt-1 text-[10px]">
          <span>Gemini-3.5-Flash Core Node</span>
          <span>•</span>
          <span>Supabase Auth Ready</span>
        </div>
      </footer>

      {/* Supabase Authentication Access Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              id="auth-modal-backdrop"
            />

            {/* Modal Frame */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 shadow-2xl z-20 flex flex-col gap-4 overflow-hidden"
              id="auth-modal-content"
            >
              {/* Glowing header accent */}
              <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-indigo-500 to-purple-500 shadow-md shadow-indigo-500/50" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 pointer-events-none">
                  <Lock className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-200">
                    {authIsSignUp ? 'Create Platform Account' : 'Security Auth Access'}
                  </span>
                </div>
                <button 
                  onClick={() => setShowAuthModal(false)}
                  className="p-1 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                  id="auth-modal-close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Informative notice about Simulated Mode */}
              <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                <div className="text-[11px] leading-relaxed text-zinc-300 font-mono">
                  {isSupabaseConfigured ? (
                    <span><strong>Active Connection Mode:</strong> Real Supabase Client is initialized. Enter standard details below to sign in or sign up securely.</span>
                  ) : (
                    <span><strong>Simulated Sandbox Mode:</strong> No VITE_SUPABASE_URL found in environment. Enter any email and password to instantly register mock session in browser!</span>
                  )}
                </div>
              </div>

              <form onSubmit={handleAuthSubmit} className="flex flex-col gap-3.5 mt-2">
                
                {/* Email slot */}
                <div className="flex flex-col gap-1.5 font-sans">
                  <label className="text-xs font-semibold text-zinc-300">Access Email Address</label>
                  <input
                    id="auth-email-input"
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="creator@yourniche.com"
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Password slot */}
                <div className="flex flex-col gap-1.5 font-sans">
                  <label className="text-xs font-semibold text-zinc-300">Secure Password</label>
                  <input
                    id="auth-password-input"
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {authError && (
                  <div className="flex flex-col gap-1.5 bg-red-950/25 border border-red-500/20 px-3 py-2.5 rounded-xl text-left">
                    <span className="text-xs text-red-400 font-sans leading-relaxed">
                      {authError}
                    </span>
                    <button
                      type="button"
                      onClick={handleSimulatedBypass}
                      className="text-left text-[11px] text-indigo-300 font-mono underline hover:text-indigo-200"
                    >
                      💡 Rate-limit issue? Skip setup and continue as Guest instead →
                    </button>
                  </div>
                )}

                {/* Primary Button */}
                <button
                  id="auth-submit-btn"
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 px-4 rounded-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 active:scale-98 text-white text-xs shadow-lg shadow-indigo-505/20 mt-1 cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  {authLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Loading Auth State...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{authIsSignUp ? 'REGISTER ACCOUNT' : 'SECURE ACCESS LOGIN'}</span>
                    </>
                  )}
                </button>

                {isSupabaseConfigured && (
                  <div className="flex items-center gap-2 my-1">
                    <div className="h-px bg-white/5 flex-1" />
                    <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase">Or Bypass Setup</span>
                    <div className="h-px bg-white/5 flex-1" />
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSimulatedBypass}
                  className="w-full py-2.5 px-4 rounded-xl font-bold border border-white/5 hover:border-white/10 hover:bg-white/5 active:scale-98 text-zinc-300 text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>CONTINUE AS GUEST (SIMULATED MODE)</span>
                </button>

                {/* Trigger selector */}
                <div className="text-center font-mono text-[10px] text-zinc-500 mt-2">
                  {authIsSignUp ? (
                    <span>Already a creator? <button type="button" onClick={() => { setAuthIsSignUp(false); setAuthError(''); }} className="text-indigo-400 hover:underline">Log in</button></span>
                  ) : (
                    <span>New viral script writer? <button type="button" onClick={() => { setAuthIsSignUp(true); setAuthError(''); }} className="text-indigo-400 hover:underline">Create account</button></span>
                  )}
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
