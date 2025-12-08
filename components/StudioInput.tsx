// components/StudioInput.tsx
import React, { useState } from 'react';
import { VISUAL_STYLES, Icons } from '../constants';
import { GenerateOptions } from '../types';

interface StudioInputProps {
  onGenerate: (topic: string, options: GenerateOptions) => Promise<void>;
  isGenerating: boolean;
}

const StudioInput: React.FC<StudioInputProps> = ({ onGenerate, isGenerating }) => {
  const [topic, setTopic] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(VISUAL_STYLES[0].id);
  const [duration, setDuration] = useState<'short' | 'long'>('short');

  const handleGenerate = () => {
    if (!topic.trim()) return;
    onGenerate(topic, {
      style_id: selectedStyle,
      duration,
    });
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-fade-in">
      {/* Header */}
      <div className="mb-8 text-center space-y-2">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">
          AI Creative Studio
        </h2>
        <p className="text-zinc-400 text-lg">Ubah ide kasar menjadi skenario video viral setara studio animasi.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: VISUAL CONFIG & TOPIC */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Input */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
             <label className="block text-sm font-bold text-zinc-300 mb-3 flex items-center gap-2">
                <Icons.Magic className="w-4 h-4 text-orange-500"/>
                TOPIC / STORY IDEA
             </label>
             <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Contoh: Seekor kepiting merah kecil yang tersesat saat migrasi masal di Christmas Island, tapi dia justru menemukan jalan rahasia..."
                className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-lg text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none transition-all"
             />
          </div>

          {/* Style Selector */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-zinc-300 ml-1">VISUAL STYLE</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {VISUAL_STYLES.map((style) => (
                    <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`text-left p-4 rounded-xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between h-full ${
                            selectedStyle === style.id
                            ? 'bg-gradient-to-br from-orange-900/40 to-zinc-900 border-orange-500 ring-1 ring-orange-500/50'
                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600'
                        }`}
                    >
                        <h3 className={`font-bold ${selectedStyle === style.id ? 'text-orange-400' : 'text-zinc-300'}`}>
                            {style.label}
                        </h3>
                        <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                            {style.description}
                        </p>
                    </button>
                ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DURATION & INFO */}
        <div className="lg:col-span-4 space-y-6">
            
            {/* Duration Selector */}
             <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                <label className="flex items-center gap-2 text-sm font-bold text-zinc-300">
                    <Icons.Settings className="w-4 h-4 text-orange-500"/>
                    DURATION & FORMAT
                </label>
                <div className="flex flex-col gap-2">
                    <button 
                        onClick={() => setDuration('short')}
                        className={`p-3 text-sm font-bold rounded-xl border text-left transition-all ${
                            duration === 'short' 
                            ? 'bg-orange-500/10 border-orange-500 text-orange-400' 
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span>Shorts / Reels</span>
                            <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">9:16</span>
                        </div>
                        <span className="text-xs font-normal opacity-70">~60 Seconds • Fast Paced</span>
                    </button>
                    
                    <button 
                        onClick={() => setDuration('long')}
                        className={`p-3 text-sm font-bold rounded-xl border text-left transition-all ${
                            duration === 'long' 
                            ? 'bg-orange-500/10 border-orange-500 text-orange-400' 
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span>Full Video</span>
                            <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">16:9</span>
                        </div>
                        <span className="text-xs font-normal opacity-70">~3 Minutes • Cinematic</span>
                    </button>
                </div>
             </div>

             {/* Auto Optimizations Info */}
             <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg shrink-0">
                        <Icons.Sparkles className="w-4 h-4 text-blue-400"/>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-zinc-300 uppercase mb-1">Auto-Director AI</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                            Tone, Narrative Style, and Pacing are automatically optimized based on your topic and chosen duration.
                        </p>
                    </div>
                </div>
             </div>
        </div>
      </div>

      {/* GENERATE BUTTON */}
      <div className="mt-10">
        <button
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            className={`w-full py-5 rounded-2xl font-black text-xl tracking-wide flex items-center justify-center transition-all transform active:scale-95 ${
                isGenerating || !topic.trim()
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700'
                : 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-2xl shadow-orange-900/50 hover:brightness-110'
            }`}
        >
            {isGenerating ? (
                <>
                   <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   DIRECTING THE SCENES...
                </>
            ) : (
                <>
                   <Icons.Play className="w-6 h-6 mr-3"/>
                   GENERATE STORYBOARD
                </>
            )}
        </button>
      </div>
    </div>
  );
};

export default StudioInput;
