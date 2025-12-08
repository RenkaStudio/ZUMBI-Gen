import React, { useState } from 'react';
import { StoryboardResponse, StoryboardScene } from '../types';
import { Icons } from '../constants';

interface SceneDirectorProps {
  data: StoryboardResponse | null;
}

const SceneCard: React.FC<{ scene: StoryboardScene }> = ({ scene }) => {
  const [copied, setCopied] = useState(false);

  // Copy the exact JSON structure for Veo 3
  const handleCopy = () => {
    // We strictly copy the scene object excluding the narrative script if desired, 
    // or the whole object as requested "berupa json prompt detail"
    const veoJson = JSON.stringify({
      scene_id: scene.scene_id,
      duration_sec: scene.duration_sec,
      visual_style: scene.visual_style,
      background_lock: scene.background_lock,
      camera: scene.camera,
      character_lock: scene.character_lock,
      vfx: scene.vfx
    }, null, 2);

    navigator.clipboard.writeText(veoJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold text-sm">
            #{scene.scene_id}
          </span>
          <span className="px-2 py-1 rounded text-xs font-bold tracking-wider bg-orange-500/10 text-orange-500 border border-orange-500/20 uppercase">
            {scene.camera.framing}
          </span>
          <span className="text-xs text-zinc-500">{scene.duration_sec}s</span>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            copied ? 'bg-green-500/20 text-green-500' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {copied ? <Icons.Check className="w-3.5 h-3.5" /> : <Icons.Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copy JSON' : 'Copy JSON'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800">
        {/* Left Col: Visual Details */}
        <div className="p-5 space-y-5">
           {/* Character Lock */}
           <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Character Lock</h4>
                {scene.character_lock && (
                   <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                     {scene.character_lock.id}
                   </span>
                )}
              </div>
              <p className="text-sm text-zinc-200 leading-relaxed bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50">
                {scene.character_lock ? scene.character_lock.description : <span className="text-zinc-600 italic">No character lock (Landscape/Object focus)</span>}
              </p>
           </div>

           {/* VFX */}
           <div>
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">VFX</h4>
              <p className="text-sm text-purple-200/80 italic">"{scene.vfx}"</p>
           </div>
        </div>

        {/* Right Col: Background & Camera */}
        <div className="p-5 space-y-5">
          {/* Background Lock */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Background Lock</h4>
            <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                    <span className="text-zinc-500 w-16 shrink-0">Setting:</span>
                    <span className="text-zinc-300">{scene.background_lock.setting}</span>
                </div>
                <div className="flex gap-2">
                    <span className="text-zinc-500 w-16 shrink-0">Lighting:</span>
                    <span className="text-zinc-300">{scene.background_lock.lighting}</span>
                </div>
                <div className="flex gap-2">
                    <span className="text-zinc-500 w-16 shrink-0">Props:</span>
                    <span className="text-zinc-300">{scene.background_lock.props}</span>
                </div>
            </div>
          </div>
          
          {/* Camera */}
           <div>
             <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Camera</h4>
             <div className="flex gap-2 text-sm">
                <span className="text-zinc-500 w-16 shrink-0">Move:</span>
                <span className="text-zinc-300">{scene.camera.movement}</span>
             </div>
           </div>
        </div>
      </div>

      {/* Footer: Audio (Indonesian) */}
      <div className="bg-zinc-950/80 px-5 py-4 border-t border-zinc-800">
        <div className="flex gap-4">
          <div className="w-8 pt-1">
            <Icons.Microphone className="w-4 h-4 text-zinc-600" />
          </div>
          <div className="flex-1">
             <p className="text-sm text-zinc-100 font-medium leading-relaxed">"{scene.narration_script}"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SceneDirector: React.FC<SceneDirectorProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
        <Icons.Film className="w-16 h-16 opacity-20" />
        <p>Belum ada data storyboard. Silakan generate di Studio Kreatif.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
       <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-zinc-200">Scene Director</h2>
            <p className="text-zinc-400">Total {data.scenes.length} Scenes • Veo 3 Ready JSON</p>
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