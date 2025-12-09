// components/SceneDirector.tsx
import React, { useState } from 'react';
import { StoryboardResponse, StoryboardScene } from '../types';
import { Icons } from '../constants';

interface SceneDirectorProps {
  data: StoryboardResponse | null;
}

const SceneJsonBlock: React.FC<{ scene: StoryboardScene }> = ({ scene }) => {
  const [copied, setCopied] = useState(false);

  // Construct a cleaner JSON specifically for Generation Tools
  const displayJson = {
    scene_number: scene.scene_id,
    duration: `${scene.duration_sec}s`,
    visual_prompt: scene.visual_prompt_detailed,
    negative_prompt: "blurry, distorted, low quality, watermark, text",
    camera_movement: scene.camera.movement,
    sfx_notes: scene.vfx,
    narration: scene.narration_script
  };

  const jsonString = JSON.stringify(displayJson, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden mb-6 shadow-lg">
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded bg-orange-500/10 text-orange-500 flex items-center justify-center font-mono text-xs border border-orange-500/20">
            {scene.scene_id}
          </span>
          <span className="text-sm font-bold text-zinc-300">JSON Prompt Object</span>
        </div>
        <button
          onClick={handleCopy}
          className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all ${
            copied 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
          }`}
        >
          {copied ? <Icons.Check className="w-3 h-3" /> : <Icons.Copy className="w-3 h-3" />}
          {copied ? 'COPIED' : 'COPY JSON'}
        </button>
      </div>
      <div className="p-4 overflow-x-auto relative group">
        <pre className="text-xs md:text-sm font-mono text-zinc-300 leading-relaxed whitespace-pre-wrap break-all">
          <span className="text-purple-400">{`{`}</span>
          {jsonString.slice(1, -1)}
          <span className="text-purple-400">{`}`}</span>
        </pre>
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
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
       <div className="border-b border-zinc-800 pb-6">
          <h2 className="text-3xl font-black text-zinc-100 uppercase tracking-tight mb-2">Scene JSON Prompts</h2>
          <p className="text-zinc-400 text-sm">
             Copy the JSON objects below directly into your AI Video Generator or Automation Workflow (Make/n8n).
          </p>
       </div>

       <div>
         {data.scenes.map((scene) => (
           <SceneJsonBlock key={scene.scene_id} scene={scene} />
         ))}
       </div>
    </div>
  );
};

export default SceneDirector;