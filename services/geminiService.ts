// services/geminiService.ts

import { GoogleGenAI, Type, Schema } from "@google/genai";
import { StoryboardResponse, GenerateOptions, StrictScene } from "../types";
import { VISUAL_STYLES } from "../constants";

const getAIClient = (apiKey: string | undefined) => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please configure it in Settings.");
  }
  return new GoogleGenAI({ apiKey });
};

// --- SCHEMAS FOR STRUCTURED OUTPUT ---

const SCRIPT_METADATA_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    project_settings: {
      type: Type.OBJECT,
      properties: {
        project_name: { type: Type.STRING },
        aspect_ratio: { type: Type.STRING },
        resolution: { type: Type.STRING },
        global_aesthetic: { type: Type.STRING },
      },
      required: ["project_name", "aspect_ratio", "resolution", "global_aesthetic"],
    },
    voice_over_guide: { type: Type.STRING },
    script_content: { type: Type.STRING },
    marketing_metadata: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        hashtags: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: ["title", "description", "hashtags"],
    },
  },
  required: ["project_settings", "voice_over_guide", "script_content", "marketing_metadata"],
};

const SCENE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    scenes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          scene_id: { type: Type.INTEGER },
          duration_sec: { type: Type.INTEGER },
          narration_script: { type: Type.STRING },
          visual_style_override: { type: Type.STRING },
          character_design: {
            type: Type.OBJECT,
            properties: {
              identity_physique: { type: Type.STRING },
              costume_details: { type: Type.STRING },
              material_texture: { type: Type.STRING },
            },
            required: ["identity_physique", "costume_details", "material_texture"],
          },
          character_performance: {
            type: Type.OBJECT,
            properties: {
              primary_action_verb: { type: Type.STRING },
              movement_quality: { type: Type.STRING },
              facial_expression_change: { type: Type.STRING },
              interaction_physics: { type: Type.STRING },
            },
            required: ["primary_action_verb", "movement_quality", "facial_expression_change", "interaction_physics"],
          },
          environment_atmosphere: {
            type: Type.OBJECT,
            properties: {
              location_setting: { type: Type.STRING },
              lighting_mood: { type: Type.STRING },
              background_dynamics: { type: Type.STRING },
            },
            required: ["location_setting", "lighting_mood", "background_dynamics"],
          },
          visual_effects_vfx: {
            type: Type.OBJECT,
            properties: {
              particles_atmosphere: { type: Type.STRING },
              simulation_fx: { type: Type.STRING },
            },
            required: ["particles_atmosphere", "simulation_fx"],
          },
          camera_work: {
            type: Type.OBJECT,
            properties: {
              vertical_framing: { type: Type.STRING },
              camera_movement: { type: Type.STRING },
              lens_focus: { type: Type.STRING },
            },
            required: ["vertical_framing", "camera_movement", "lens_focus"],
          },
          audio_sound_design: {
            type: Type.OBJECT,
            properties: {
              ambience_env: { type: Type.STRING },
              action_foley: { type: Type.STRING },
              music_mood: { type: Type.STRING },
            },
            required: ["ambience_env", "action_foley", "music_mood"],
          },
        },
        required: [
          "scene_id", "duration_sec", "narration_script", "visual_style_override",
          "character_design", "character_performance", "environment_atmosphere",
          "visual_effects_vfx", "camera_work", "audio_sound_design"
        ],
      },
    },
  },
  required: ["scenes"],
};

// STEP 1: Generate Script & Metadata ONLY
export const generateScriptAndMetadata = async (topic: string, options: GenerateOptions): Promise<StoryboardResponse> => {
  const ai = getAIClient(options.apiKey || process.env.API_KEY);
  
  const isShort = options.duration === 'short';
  const selectedStyle = VISUAL_STYLES.find(s => s.id === options.style_id) || VISUAL_STYLES[0];
  const aspectRatio = isShort ? "9:16" : "16:9";

  const REQUIRED_VO_GUIDE = "Read aloud in a friendly and engaging tone, like a knowledgeable friend sharing an interesting story. The pace should be moderate, clear, and inviting.";

  const SYSTEM_PROMPT = `
  YOU ARE A PROFESSIONAL SCRIPTWRITER FOR HIGH-QUALITY DOCUMENTARY SHORTS.
  
  Your task is to write a narration script about: "${topic}".
  The script must be in "Bahasa Indonesia" with a "Gaul Sopan" tone (Casual, Educated, Respectful).
  
  CRITICAL REQUIREMENTS:
  1. **Voice Over Guide**: You MUST use exactly this string: "${REQUIRED_VO_GUIDE}".
  2. **Length**: 
     - IF SHORT: Strict limit of 130-150 words (approx 60 seconds). Concise and punchy.
     - IF LONG: Limit of 300-400 words (approx 2-3 minutes). Detailed but well-paced.
  3. **Format**: Pure spoken narration in clear paragraphs. NO visual instructions in the text.
  
  === REFERENCE STYLE (FOLLOW THIS STRUCTURE EXACTLY) ===
  
  Example 1 (Short/Medium):
  "Kalian tahu enggak, ada bunga berwarna pink cerah yang bisa ngalahin bakteri jahat cuma dalam hitungan detik? Namanya Kecombrang. Dan ternyata, dia punya kekuatan antiseptik alami yang bikin banyak orang enggak nyangka.

  Kecombrang ini sering dipakai di masakan Nusantara. Tapi, dibalik rasanya yang unik, bunganya ternyata kaya flavonoid dan tanin, dua senyawa alami yang bisa menghambat bakteri. Penelitian bahkan nunjukin kalau ekstrak kecombrang bisa melawan bakteri penyebab bau badan dan jerawat. Jadi, bukan cuma wangi, tapi beneran ampuh.

  Yang lebih unik lagi, di beberapa daerah, kecombrang dipakai sebagai sabun tradisional. Beneran, direbus terus airnya dipakai mandi.

  Intinya, kecombrang itu bukan sekedar bumbu. Dia punya potensi besar sebagai antiseptik alami tanpa bahan kimia keras.

  Gimana menurut kalian? Manfaatnya banyak banget kan? Kalau kalian suka cerita seperti ini, jangan lupa follow dan share ya, biar makin banyak orang yang tahu."

  === INSTRUCTIONS FOR OUTPUT ===
  1. **Structure**: 
     - **Paragraph 1 (Hook)**: Start with a strong hook or question.
     - **Paragraph 2 (Context)**: Explain the 'what' and 'why' clearly.
     - **Paragraph 3 (Deep Dive)**: Add specific details, scientific facts, or a twist.
     - **Paragraph 4 (Conclusion/CTA)**: Summarize and ask for engagement.
  2. **Strict JSON**: You must output valid JSON matching the provided schema. The 'script_content' must be a single string containing the full narration.
  `;

  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: `Generate script for a ${isShort ? "SHORT (60s)" : "LONG (3m)"} video.` }] }],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: SCRIPT_METADATA_SCHEMA, // Use schema to prevent JSON syntax errors
        temperature: 0.80 
      }
    });
    
    // With responseSchema, the text is guaranteed to be valid JSON structure (though we still parse it)
    const text = res.text?.trim();
    if (!text) throw new Error("AI returned empty response.");
    
    return JSON.parse(text);

  } catch (e: any) {
    console.error("Gemini Error (Step 1):", e);
    throw new Error("Script Generation Failed: " + e.message);
  }
};

// STEP 2: Generate Visual Scenes from Existing Script
export const generateScenesFromScript = async (
  currentScript: string, 
  projectSettings: any, 
  options: GenerateOptions
): Promise<StrictScene[]> => {
  const ai = getAIClient(options.apiKey || process.env.API_KEY);

  const selectedStyle = VISUAL_STYLES.find(s => s.id === options.style_id) || VISUAL_STYLES[0];
  const isShort = options.duration === 'short';
  const targetSceneCount = isShort ? 10 : 25;

  const SYSTEM_PROMPT = `
  YOU ARE A WORLD-CLASS CINEMATOGRAPHER AND 3D ARTIST SPECIALIZING IN "${selectedStyle.label}".
  
  Task: Break down the provided NARRATION SCRIPT into EXACTLY ${targetSceneCount} visual scenes.
  
  === AESTHETIC DIRECTION (CRITICAL) ===
  You must enforce the following visual traits in every single scene description:
  "${selectedStyle.prompt_keyword}"
  
  **TEXTURE & DETAIL RULES:**
  1. If style is 'High-end Clay': Mention "visible fingerprints", "slight imperfections", "soft clay shader", "miniature scale".
  2. If style is 'Felt & Wool': Mention "fuzzy stray fibers", "soft fabric lighting", "knitted patterns", "tactile wool texture".
  3. If style is '3D Pixar': Mention "subsurface scattering", "soft fur", "warm bounce lighting".
  
  **CINEMATOGRAPHY RULES:**
  1. Do NOT use boring flat angles. Use "Low angle macro", "Top-down diorama view", "Rack focus reveal".
  2. The visual should NOT just be the literal character talking. Create visual metaphors or interesting actions that support the narration.
  3. Example: If script says "It fights bacteria", show "Cute tiny clay bacteria running away from a glowing flower shield", not just a flower sitting there.
  
  === INPUT CONTEXT ===
  - **Script:** "${currentScript}"
  
  Output MUST adhere to the JSON schema provided.
  `;

  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: "Generate the Visual Scenes JSON array now." }] }],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: SCENE_SCHEMA, // Use schema here too for robustness
        temperature: 0.85
      }
    });

    const text = res.text?.trim();
    if (!text) throw new Error("AI returned empty response.");
    
    const parsed = JSON.parse(text);
    if (!parsed.scenes || !Array.isArray(parsed.scenes)) {
        throw new Error("Invalid scene format returned.");
    }
    
    return parsed.scenes;

  } catch (e: any) {
    console.error("Gemini Error (Step 2):", e);
    throw new Error("Scene Generation Failed: " + e.message);
  }
};