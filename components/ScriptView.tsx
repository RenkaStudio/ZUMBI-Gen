import React, { useState, useEffect } from 'react';
import { StoryboardResponse } from '../types';
import { Icons } from '../constants';

interface ScriptViewProps {
  data: StoryboardResponse | null;
  onUpdateScript: (newScript: string) => void;
  onGenerateScenes: () => void;
  isGeneratingScenes: boolean;
}

const ScriptView: React.FC<ScriptViewProps> = ({ data, onUpdateScript, onGenerateScenes, isGeneratingScenes }) => {
  const [localScript, setLocalScript] = useState('');

  useEffect(() => {
    if (data?.script_content) {
      setLocalScript(data.script_content);
    }
  }, [data]);

  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setLocalScript(val);
    onUpdateScript(val);
  };

  if (!data) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4 min-h-[50vh]">
        <Icons.Microphone className="w-16 h-16 opacity-20" />
        <p>Generate konsep awal di Studio Kreatif terlebih dahulu.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-zinc-200">Script & Voice Over</h2>
            <p className="text-zinc-400">Edit naskah sebelum membuat visual.</p>
          </div>
          
          <button
            onClick={onGenerateScenes}
            disabled={isGeneratingScenes || !localScript.trim()}
            className={`flex items-center px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
                isGeneratingScenes 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:brightness-110 active:scale-95'
            }`}
          >
            {isGeneratingScenes ? (
                <>
                   <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                   Generating Scenes...
                </>
            ) : (
                <>
                    <Icons.Film className="w-5 h-5 mr-2" />
                    GENERATE VISUAL PROMPTS
                </>
            )}
          </button>
      </div>

      {/* Voice Over Guide */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex gap-4 items-start">
        <div className="p-2 bg-zinc-800 rounded-lg shrink-0">
             <Icons.Microphone className="w-5 h-5 text-orange-500" />
        </div>
        <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">VO Style Guide</h3>
            <p className="text-sm text-zinc-300 italic">{data.voice_over_guide}</p>
        </div>
      </div>

      {/* Editable Script Area */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-3 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
            <h3 className="font-semibold text-zinc-200 text-sm">Naskah Narasi (Editable)</h3>
            <span className="text-xs text-zinc-500">
                {data.script_content.split(' ').length} Words
            </span>
        </div>
        <div className="p-0">
            <textarea
                value={localScript}
                onChange={handleScriptChange}
                className="w-full h-[500px] bg-zinc-950 p-8 text-lg text-zinc-200 leading-loose font-serif focus:outline-none resize-none focus:ring-2 focus:ring-orange-500/20"
                placeholder="Tulis naskah narasi di sini..."
            />
        </div>
        <div className="bg-orange-500/10 border-t border-orange-500/20 p-4 text-center">
             <p className="text-xs text-orange-300">
                ⚠️ Pastikan naskah sudah final. Saat tombol "Generate Visual Prompts" ditekan, AI akan memecah teks di atas menjadi scene visual.
             </p>
        </div>
      </div>
    </div>
  );
};

export default ScriptView;