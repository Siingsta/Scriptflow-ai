import React, { useState } from 'react';

export default function App() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Energetic');
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);

  const generateScript = async () => {
    if (!topic) return alert('Please enter a topic!');
    setLoading(true);
    setScript('');

    try {
      // Direct front-end Gemini API call targeting Google AI Studio endpoint
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const url = `https://googleapis.com{apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Write a high-retention viral YouTube Short/Reels script about: "${topic}". Tone should be ${tone}. Structure it clearly with Scene breakdowns, B-roll suggestions, and highly engaging Voiceover text.`
            }]
          }]
        })
      });

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      setScript(generatedText);
    } catch (error) {
      console.error(error);
      setScript('Error generating script. Please check your VITE_GEMINI_API_KEY value in Vercel settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-gray-800 rounded-xl p-8 shadow-2xl border border-gray-700">
        <h1 className="text-3xl font-extrabold mb-2 text-center text-indigo-400">ScriptFlow AI 🚀</h1>
        <p className="text-gray-400 text-sm text-center mb-8">Generate viral short-form scripts instantly using Gemini</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Video Topic / Niche</label>
              <input 
                type="text" 
                placeholder="e.g., 3 Dark Psychology Tricks, Space Secrets..." 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Video Tone</label>
              <select 
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="Energetic">Energetic 🔥</option>
                <option value="Dramatic">Dramatic 🎬</option>
                <option value="Mysterious">Mysterious 🕵️‍♂️</option>
                <option value="Educational">Educational 📚</option>
              </select>
            </div>

            <button 
              onClick={generateScript}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 font-bold py-3 px-4 rounded-lg transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'AI is thinking writing your viral script...' : 'Generate Viral Script ✨'}
            </button>
          </div>

          <div className="flex flex-col">
            <label className="block text-sm font-medium mb-2 text-gray-300">Your Generated Script</label>
            <div className="flex-1 min-h-[250px] bg-gray-950 border border-gray-700 rounded-lg p-4 font-mono text-sm text-gray-200 overflow-y-auto whitespace-pre-wrap">
              {script || 'Your viral short script will appear here layout by layout... Fill out the prompt and hit generate!'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
