import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import StudioInput from './components/StudioInput';
import SceneDirector from './components/SceneDirector';
import ScriptView from './components/ScriptView';
import MetadataView from './components/MetadataView';
import SettingsView from './components/SettingsView';
import { generateStoryboard } from './services/geminiService';
import { AppView, StoryboardResponse, GenerateOptions } from './types';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.STUDIO);
  const [storyboardData, setStoryboardData] = useState<StoryboardResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (topic: string, options: GenerateOptions) => {
    setIsGenerating(true);
    setError(null);
    try {
      // Pass stored key if available
      const storedKey = localStorage.getItem('zumbi_api_key');
      const response = await generateStoryboard(topic, { ...options, apiKey: storedKey || undefined });
      setStoryboardData(response);
      setCurrentView(AppView.SCENE_DIRECTOR);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.STUDIO:
        return <StudioInput onGenerate={handleGenerate} isGenerating={isGenerating} />;
      case AppView.SCENE_DIRECTOR:
        return <SceneDirector data={storyboardData} />;
      case AppView.SCRIPT:
        return <ScriptView data={storyboardData} />;
      case AppView.METADATA:
        return <MetadataView data={storyboardData} />;
      case AppView.SETTINGS:
        return <SettingsView />;
      default:
        return <StudioInput onGenerate={handleGenerate} isGenerating={isGenerating} />;
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