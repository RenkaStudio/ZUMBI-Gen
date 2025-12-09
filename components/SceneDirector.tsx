// components/SceneDirector.tsx
import React, { useState } from 'react';
import { StoryboardResponse } from '../types';
import { Icons } from '../constants';

interface SceneDirectorProps {
  data: StoryboardResponse | null;
}

const VideoPromptCard: React.FC<{ scene: any; sceneIndex: number; projectSettings: any }> = ({ scene, sceneIndex, projectSettings }) => {
    const [copied, setCopied] = useState(false);

    // Construct the VIDEO PROMPT JSON structure for this specific scene
    const videoPromptJson = {
       project_settings: {
          project_name: projectSettings.project_name,
          aspect_ratio: projectSettings.aspect_ratio,
          resolution: "4k",
          global_aesthetic: projectSettings.global_aesthetic
       },
       scenes: [
          {
            scene_id: scene.scene_id,
            duration_sec: scene.duration_sec,
            visual_style_override: scene.visual_style_override,
            character_design: scene.character_design,
            character_performance: scene.character_performance,
            environment_atmosphere: scene.environment_atmosphere,
            visual_effects_vfx: scene.visual_effects_vfx,
            camera_work: scene.camera_work,
            audio_sound_design: scene.audio_sound_design
          }
       ]
    };

    const jsonString = JSON.stringify(videoPromptJson, null, 2);

    const handleCopy = () => {
        navigator.clipboard.writeText(jsonString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-orange-500/30 transition-all shadow-md">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                    <span className="bg-orange-500 text-zinc-950 text-xs font-black px-2 py-1 rounded">SCENE {sceneIndex}</span>
                    <span className="text-zinc-500 text-xs font-mono">{scene.duration_sec}s</span>
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
                    {copied ? 'COPIED' : 'COPY JSON PROMPT'}
                </button>
            </div>

            <div className="space-y-4">
                {/* Visual Prompt Section (JSON) */}
                <div className="bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800/50">
                    <div className="px-3 py-2 bg-zinc-900/50 border-b border-zinc-800/50 flex justify-between items-center">
                         <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Video Generation JSON</p>
                         <span className="text-[10px] text-zinc-600">Ready for Generator</span>
                    </div>
                    <pre className="p-3 text-xs text-zinc-300 font-mono overflow-x-auto whitespace-pre-wrap break-all h-64 custom-scrollbar">
                        {jsonString}
                    </pre>
                </div>

                {/* Narration Reference (Context) */}
                <div className="pl-3 border-l-2 border-zinc-700">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Narration (Context)</p>
                    <p className="text-sm text-zinc-400 italic leading-relaxed">
                        "{scene.narration_script}"
                    </p>
                </div>
            </div>
        </div>
    );
}

const SceneDirector: React.FC<SceneDirectorProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4 min-h-[50vh]">
        <Icons.Film className="w-16 h-16 opacity-20" />
        <p>Storyboard data not found. Please generate Script first.</p>
      </div>
    );
  }

  // Check if scenes are generated yet
  if (!data.scenes || data.scenes.length === 0) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-6 min-h-[50vh] text-center max-w-lg mx-auto">
          <div className="relative">
             <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full"></div>
             <Icons.Script className="w-16 h-16 text-orange-500 relative z-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-zinc-200 mb-2">Visual Prompts Belum Tersedia</h3>
            <p className="text-sm">
                Silakan masuk ke menu <strong>Script & VO</strong>, edit naskah jika perlu, lalu klik tombol <strong>"Generate Visual Prompts"</strong> untuk membuat scene.
            </p>
          </div>
        </div>
      );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
       <div className="border-b border-zinc-800 pb-6">
          <h2 className="text-3xl font-black text-zinc-100 uppercase tracking-tight mb-2">Scene Director</h2>
          <p className="text-zinc-400 text-sm">
             Copy the <strong>JSON Prompts</strong> below. Each block is a complete prompt ready for automation.
          </p>
       </div>

       {/* Video Prompts List */}
       <div className="grid grid-cols-1 gap-6">
            {data.scenes.map((scene) => (
                <VideoPromptCard 
                    key={scene.scene_id} 
                    scene={scene} 
                    sceneIndex={scene.scene_id} 
                    projectSettings={data.project_settings}
                />
            ))}
       </div>

       {/* Footer Stats */}
       <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 text-center">
             <div className="text-xs text-zinc-500 uppercase font-bold">Total Scenes</div>
             <div className="text-2xl font-bold text-zinc-200">{data.scenes.length}</div>
          </div>
          <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 text-center">
             <div className="text-xs text-zinc-500 uppercase font-bold">Aspect Ratio</div>
             <div className="text-2xl font-bold text-zinc-200">{data.project_settings.aspect_ratio}</div>
          </div>
       </div>
    </div>
  );
};

export default SceneDirector;