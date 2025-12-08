// components/SceneDirector.tsx
import React, { useState } from 'react';
import { StoryboardResponse, StoryboardScene } from '../types';
import { Icons } from '../constants';

interface SceneDirectorProps {
  data: StoryboardResponse | null;
}

const SceneCard: React.FC<{ scene: StoryboardScene }> = ({ scene }) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const copyDetailedPrompt = () => {
    // Kita hanya meng-copy prompt visual yang "Mahal" untuk Veo/Sora
    navigator.clipboard.writeText(scene.visual_prompt_detailed);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="group relative bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-orange-900/10">
      
      {/* 1. Header Information (Time & Shot) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity"/>
      
      <div className="p-5 flex flex-col md:flex-row gap-6">
        
        {/* LEFT: VISUAL CONTROL CENTER */}
        <div className="flex-1 space-y-4">
           <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                 <span className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-400 font-mono text-sm flex items-center justify-center border border-zinc-700">
                    #{scene.scene_id}
                 </span>
                 <span className="px-2 py-1 rounded-md bg-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-wider border border-zinc-700">
                    {scene.duration_sec}s
                 </span>
                 <span className="px-2 py-1 rounded-md bg-blue-900/20 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-900/30">
                    {scene.camera.shot_type}
                 </span>
              </div>
           </div>

           {/* The Visual Prompt Box (The most important part) */}
           <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 relative group/prompt">
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">AI VIDEO GENERATOR PROMPT</h4>
              <p className="text-zinc-300 text-sm leading-relaxed font-medium">
                 {scene.visual_prompt_detailed}
              </p>
              
              <button 
                onClick={copyDetailedPrompt}
                className={`absolute top-2 right-2 p-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                    copiedPrompt ? 'bg-green-500 text-white' : 'bg-zinc-800 text-zinc-400 opacity-0 group-hover/prompt:opacity-100 hover:text-white'
                }`}
              >
                {copiedPrompt ? <Icons.Check className="w-3 h-3"/> : <Icons.Copy className="w-3 h-3"/>}
                {copiedPrompt ? 'COPIED' : 'COPY'}
              </button>
           </div>

           {/* Technical Specs Grid */}
           <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-zinc-800/30 p-2 rounded border border-zinc-800/50">
                 <span className="text-zinc-500 block mb-1">Camera Move</span>
                 <span className="text-orange-400 font-medium">{scene.camera.movement}</span>
              </div>
              <div className="bg-zinc-800/30 p-2 rounded border border-zinc-800/50">
                 <span className="text-zinc-500 block mb-1">Lighting</span>
                 <span className="text-yellow-200/80 font-medium">{scene.background_lock.lighting}</span>
              </div>
           </div>
        </div>

        {/* RIGHT: NARRATIVE & CHARACTER */}
        <div className="md:w-1/3 flex flex-col justify-between border-l border-zinc-800 md:pl-6 space-y-4">
           
           {/* Narration */}
           <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 p-4 rounded-xl border border-zinc-800">
               <div className="flex items-center gap-2 mb-2">
                   <Icons.Script className="w-3 h-3 text-zinc-500"/>
                   <span className="text-[10px] font-bold text-zinc-500 uppercase">VOICE OVER (ID)</span>
               </div>
               <p className="text-zinc-200 text-sm italic leading-relaxed">
                  "{scene.narration_script}"
               </p>
           </div>

           {/* Character Lock Indicator */}
           {scene.character_lock && (
               <div className="flex items-center gap-3 p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
                   <div className="w-8 h-8 rounded-full bg-purple-900/30 border border-purple-500/30 flex items-center justify-center text-purple-400 text-xs font-bold">
                       {scene.character_lock.id.substring(0,2)}
                   </div>
                   <div className="flex-1 min-w-0">
                       <div className="text-[10px] text-zinc-500 uppercase font-bold">Character Lock</div>
                       <div className="text-xs text-zinc-300 truncate">{scene.character_lock.name}</div>
                   </div>
               </div>
           )}

           {/* Text Overlay */}
           {scene.text_overlay && (
                <div className="px-3 py-2 bg-pink-500/10 border border-pink-500/20 rounded text-center">
                    <span className="text-[10px] text-pink-500 font-bold uppercase block mb-0.5">ON SCREEN TEXT</span>
                    <span className="text-xs text-pink-200 font-bold">"{scene.text_overlay}"</span>
                </div>
           )}
        </div>
      </div>
    </div>
  );
};

const SceneDirector: React.FC<SceneDirectorProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4 min-h-[50vh]">
        <Icons.Film className="w-16 h-16 opacity-20" />
        <p>Storyboard data not found. Please generate first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
       <div className="flex items-end justify-between border-b border-zinc-800 pb-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-zinc-100 uppercase tracking-tight">Scene Director</h2>
            <p className="text-zinc-400 flex items-center gap-2">
                <span className="text-orange-500 font-bold">{data.scenes.length} Scenes</span> 
                • 
                <span className="text-zinc-500">Total Duration: {data.scenes.reduce((a, b) => a + b.duration_sec, 0)}s</span>
            </p>
          </div>
          <div className="bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800 text-xs text-zinc-400">
             Music: <span className="text-zinc-200 font-medium">{data.metadata.music_suggestion}</span>
          </div>
       </div>

       <div className="space-y-6">
         {data.scenes.map((scene) => (
           <SceneCard key={scene.scene_id} scene={scene} />
         ))}
       </div>
    </div>
  );
};

export default SceneDirector;