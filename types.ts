// types.ts

export type AspectRatio = '9:16' | '16:9' | '1:1';

export interface VisualStyleConfig {
  id: string;
  label: string;
  prompt_keyword: string; 
  description: string;
}

// --- NEW STRICT JSON STRUCTURE INTERFACES ---

export interface ProjectSettings {
  project_name: string;
  aspect_ratio: string;
  resolution: string;
  global_aesthetic: string;
}

export interface CharacterDesign {
  identity_physique: string;
  costume_details: string;
  material_texture: string;
}

export interface CharacterPerformance {
  primary_action_verb: string;
  movement_quality: string;
  facial_expression_change: string;
  interaction_physics: string;
}

export interface EnvironmentAtmosphere {
  location_setting: string;
  lighting_mood: string;
  background_dynamics: string;
}

export interface VisualEffects {
  particles_atmosphere: string;
  simulation_fx: string;
}

export interface CameraWork {
  vertical_framing: string;
  camera_movement: string;
  lens_focus: string;
}

export interface AudioSoundDesign {
  ambience_env: string;
  action_foley: string;
  music_mood: string;
}

export interface StrictScene {
  scene_id: number;
  duration_sec: number;
  narration_script: string; // The segment of the script for this scene
  visual_style_override: string;
  character_design: CharacterDesign;
  character_performance: CharacterPerformance;
  environment_atmosphere: EnvironmentAtmosphere;
  visual_effects_vfx: VisualEffects;
  camera_work: CameraWork;
  audio_sound_design: AudioSoundDesign;
}

export interface MarketingMetadata {
  title: string;
  description: string;
  hashtags: string[];
}

export interface StoryboardResponse {
  project_settings: ProjectSettings;
  // script_content is now the primary source of truth before scenes are generated
  script_content: string; 
  marketing_metadata: MarketingMetadata;
  voice_over_guide: string;
  // Scenes are optional because they are generated in step 2
  scenes?: StrictScene[]; 
}

export interface GenerateOptions {
  style_id: string;
  duration: 'short' | 'long';
  apiKey?: string;
}

export enum AppView {
  STUDIO = 'STUDIO',
  METADATA = 'METADATA',
  SCRIPT = 'SCRIPT',
  SCENE_DIRECTOR = 'SCENE_DIRECTOR',
  SETTINGS = 'SETTINGS'
}