import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import StudioInput from './components/StudioInput';
import SceneDirector from './components/SceneDirector';
import ScriptView from './components/ScriptView';
import MetadataView from './components/MetadataView';
import SettingsView from './components/SettingsView';
import { generateScriptAndMetadata, generateScenesFromScript } from './services/geminiService';
import { AppView, StoryboardResponse, GenerateOptions } from './types';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.STUDIO);
  const [storyboardData, setStoryboardData] = useState<StoryboardResponse | null>(null);
  
  // State for generation status
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isGeneratingScenes, setIsGeneratingScenes] = useState(false);
  
  // Store generation options for Step 2
  const [lastOptions, setLastOptions] = useState<GenerateOptions | null>(null);

  const [error, setError] = useState<string | null>(null);

  // STEP 1: Generate Script & Metadata
  const handleGenerateScript = async (topic: string, options: GenerateOptions) => {
    setIsGeneratingScript(true);
    setError(null);
    setLastOptions(options); // Save options for step 2
    try {
      const storedKey = localStorage.getItem('zumbi_api_key');
      const response = await generateScriptAndMetadata(topic, { ...options, apiKey: storedKey || undefined });
      
      setStoryboardData(response);
      // Redirect to Metadata View (as per user request order: Metadata -> Script)
      setCurrentView(AppView.METADATA); 
    } catch (err: any) {
      setError(err.message || "Script generation failed");
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // STEP 2: Generate Visual Scenes (Called from ScriptView)
  const handleGenerateScenes = async () => {
    if (!storyboardData || !storyboardData.script_content || !lastOptions) {
        setError("Missing script or configuration.");
        return;
    }

    setIsGeneratingScenes(true);
    setError(null);
    try {
        const storedKey = localStorage.getItem('zumbi_api_key');
        
        // Call Step 2 API
        const scenes = await generateScenesFromScript(
            storyboardData.script_content,
            storyboardData.project_settings,
            { ...lastOptions, apiKey: storedKey || undefined }
        );

        // Update state with new scenes
        setStoryboardData(prev => prev ? { ...prev, scenes: scenes } : null);
        
        // Redirect to Scene Director
        setCurrentView(AppView.SCENE_DIRECTOR);

    } catch (err: any) {
        setError(err.message || "Scene generation failed");
    } finally {
        setIsGeneratingScenes(false);
    }
  };

  // Update script content when user edits textarea
  const handleUpdateScript = (newScript: string) => {
    setStoryboardData(prev => prev ? { ...prev, script_content: newScript } : null);
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.STUDIO:
        return <StudioInput onGenerate={handleGenerateScript} isGenerating={isGeneratingScript} />;
      case AppView.METADATA:
        return <MetadataView data={storyboardData} />;
      case AppView.SCRIPT:
        return (
            <ScriptView 
                data={storyboardData} 
                onUpdateScript={handleUpdateScript}
                onGenerateScenes={handleGenerateScenes}
                isGeneratingScenes={isGeneratingScenes}
            />
        );
      case AppView.SCENE_DIRECTOR:
        return <SceneDirector data={storyboardData} />;
      case AppView.SETTINGS:
        return <SettingsView />;
      default:
        return <StudioInput onGenerate={handleGenerateScript} isGenerating={isGeneratingScript} />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-orange-500/30 selection:text-orange-200">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="ml-64 p-8 min-h-screen relative">
        {/* Error Toast */}
        {error && (
            <div className="absolute top-4 right-4 bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg shadow-xl z-50 flex items-center gap-3 animate-bounce">
                <span className="text-xl">⚠️</span>
                <p className="text-sm font-medium">{error}</p>
                <button onClick={() => setError(null)} className="ml-2 text-red-400 hover:text-red-100">✕</button>
            </div>
        )}

        {renderContent()}
      </main>
    </div>
  );
}

export default App;