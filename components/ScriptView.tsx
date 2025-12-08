import React, { useState } from 'react';
import { StoryboardResponse } from '../types';
import { Icons } from '../constants';

interface ScriptViewProps {
  data: StoryboardResponse | null;
}

const ScriptView: React.FC<ScriptViewProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  if (!data) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
        <Icons.Microphone className="w-16 h-16 opacity-20" />
        <p>Generate storyboard terlebih dahulu untuk melihat naskah.</p>
      </div>
    );
  }

  // Join scripts with double newlines for clear paragraphs
  const fullScript = data.scenes.map(s => s.narration_script).join('\n\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(fullScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-zinc-200">Script & Voice Over</h2>
        <p className="text-zinc-400">Naskah narasi final untuk dubbing / TTS.</p>
      </div>

      {/* Voice Over Guide (English) */}
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
             <div className="p-2 bg-orange-500/20 rounded-lg">
                <Icons.Microphone className="w-5 h-5 text-orange-500" />
             </div>
             <div>
                 <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-1">Voice Over Style Guide</h3>
                 <p className="text-lg text-orange-100 font-medium italic">
                    "{data.voice_over_guide}"
                 </p>
             </div>
        </div>
      </div>

      {/* Full Script */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
            <h3 className="font-semibold text-zinc-200">Naskah Narasi (Bahasa Indonesia)</h3>
             <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    copied ? 'text-green-500 bg-green-500/10' : 'text-zinc-400 hover:text-zinc-200 bg-zinc-800'
                }`}
             >
                {copied ? 'Tersalin!' : 'Copy Text'}
             </button>
        </div>
        <div className="p-10 bg-zinc-950">
            <div className="prose prose-invert prose-lg max-w-none text-zinc-300 leading-loose font-serif whitespace-pre-line">
                {fullScript}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptView;