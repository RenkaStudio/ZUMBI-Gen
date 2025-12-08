export interface CharacterLock {
  id: string;
  description: string;
}

export interface BackgroundLock {
  setting: string;
  lighting: string;
  props: string;
}

export interface CameraConfig {
  framing: string;
  movement: string;
}

export interface StoryboardScene {
  scene_id: number;
  duration_sec: string;
  visual_style: string;
  
  // Narrative Logic (Indonesia)
  narration_script: string;
  
  // Visual Logic (English - Veo 3 JSON Structure)
  character_lock: CharacterLock | null; // Nullable if landscape focus
  background_lock: BackgroundLock;
  camera: CameraConfig;
  vfx: string;
}

export interface StoryboardMetadata {
  title: string; // Viral/Clickbait
  description: string;
  hashtags: string[];
}

export interface StoryboardResponse {
  metadata: StoryboardMetadata;
  voice_over_guide: string; // Global VO guide in English
  scenes: StoryboardScene[];
}

export enum AppView {
  STUDIO = 'STUDIO',
  SCENE_DIRECTOR = 'SCENE_DIRECTOR',
  SCRIPT = 'SCRIPT',
  METADATA = 'METADATA',
  SETTINGS = 'SETTINGS'
}

export interface GenerateOptions {
  style: string;
  duration: 'short' | 'long';
  apiKey?: string;
}