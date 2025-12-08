// types.ts

export type AspectRatio = '9:16' | '16:9' | '1:1';

export interface VisualStyleConfig {
  id: string;
  label: string;
  prompt_keyword: string; // Keyword rahasia untuk AI Video Gen
  description: string;
}

export interface CharacterLock {
  id: string; // e.g., "PROFESSOR_CLAY"
  name: string;
  description: string; // Deskripsi fisik super detail untuk konsistensi
  image_ref?: string; // Placeholder untuk future feature
}

export interface BackgroundLock {
  setting: string; // Lokasi utama
  lighting: string; // Mood pencahayaan
  ambience: string; // Suasana (e.g., foggy, dusty, underwater)
}

export interface CameraConfig {
  shot_type: string; // Wide, Medium, Close-up, Macro
  movement: string; // Pan, Tilt, Dolly, Truck, Static
  focus: string; // Shallow depth of field, Rack focus, Deep focus
}

export interface StoryboardScene {
  scene_id: number;
  duration_sec: number;
  
  // NARRATIVE (INDONESIA)
  narration_script: string;
  text_overlay: string | null; // Teks yang muncul di layar (Penting untuk TikTok/Shorts)
  
  // VISUAL INSTRUCTION (ENGLISH - FOR VEO/SORA)
  visual_prompt_summary: string; // Prompt pendek untuk quick generation
  visual_prompt_detailed: string; // Prompt panjang & teknis untuk high-quality generation
  
  // TECHNICAL LOCKS
  character_lock: CharacterLock | null;
  background_lock: BackgroundLock;
  camera: CameraConfig;
  vfx: string;
}

export interface StoryboardMetadata {
  title: string;
  description: string;
  hashtags: string[];
  music_suggestion: string;
  tone_used: string; // Added to track auto-selected tone
}

export interface StoryboardResponse {
  metadata: StoryboardMetadata;
  voice_over_guide: string;
  scenes: StoryboardScene[];
}

export interface GenerateOptions {
  style_id: string;
  duration: 'short' | 'long';
  apiKey?: string;
}

export enum AppView {
  STUDIO = 'STUDIO',
  SCENE_DIRECTOR = 'SCENE_DIRECTOR',
  SCRIPT = 'SCRIPT',
  METADATA = 'METADATA',
  SETTINGS = 'SETTINGS'
}
