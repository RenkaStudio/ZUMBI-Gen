import React, { useState } from 'react';
import { VISUAL_STYLES, DURATIONS, Icons } from '../constants';
import { GenerateOptions } from '../types';

interface StudioInputProps {
  onGenerate: (topic: string, options: GenerateOptions) => Promise<void>;
  isGenerating: boolean;
}

const StudioInput: React.FC<StudioInputProps> = ({ onGenerate, isGenerating }) => {
  const [topic, setTopic] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(VISUAL_STYLES[0].id);
  const [selectedDuration, setSelectedDuration] = useState<any>(DURATIONS[0].id);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    onGenerate(topic, {
      style: selectedStyle,
      duration: selectedDuration,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-zinc-200">Studio Kreatif</h2>
        <p className="text-zinc-400">Tulis ide kasarmu, biarkan AI merancang storyboard sinematik untuk Veo 3.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
        {/* Topic Input */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-zinc-300">Topik / Ide Cerita</label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Contoh: Kehidupan rahasia kepiting di dasar laut yang penuh warna..."
            className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
          />
        </div>

        {/* Visual Style Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-zinc-300">Gaya Visual</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {VISUAL_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`text-left p-4 rounded-xl border transition-all duration-200 relative overflow-hidden ${
                  selectedStyle === style.id
                    ? 'bg-orange-500/10 border-orange-500/50 ring-1 ring-orange-500/50'
                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="relative z-10">
                  <h3 className={`font-semibold ${selectedStyle === style.id ? 'text-orange-500' : 'text-zinc-200'}`}>
                    {style.label}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">{style.description}</p>
                </div>
                {selectedStyle === style.id && (
                  <div className="absolute -right-2 -bottom-2 text-orange-500/20">
                     <Icons.Sparkles className="w-16 h-16" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Duration Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-zinc-300">Durasi & Struktur</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DURATIONS.map((dur) => (
              <button
                key={dur.id}
                onClick={() => setSelectedDuration(dur.id as any)}
                className={`flex items-center p-4 rounded-xl border transition-all duration-200 ${
                  selectedDuration === dur.id
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-200'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                    selectedDuration === dur.id ? 'border-orange-500' : 'border-zinc-600'
                }`}>
                    {selectedDuration === dur.id && <div className="w-2 h-2 rounded-full bg-orange-500"></div>}
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">{dur.label}</div>
                  <div className="text-xs text-zinc-500">{dur.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center transition-all ${
              isGenerating || !topic.trim()
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 text-zinc-950 shadow-lg shadow-orange-500/20'
            }`}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-zinc-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Merancang Veo Prompts...
              </>
            ) : (
              <>
                <Icons.Sparkles className="w-5 h-5 mr-2" />
                Generate Storyboard
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudioInput;