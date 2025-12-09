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
          // TRANSITION FIELD
          transition_to_next_scene: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["type", "description"]
          },
        },
        required: [
          "scene_id", "duration_sec", "narration_script", "visual_style_override",
          "character_design", "character_performance", "environment_atmosphere",
          "visual_effects_vfx", "camera_work", "audio_sound_design", "transition_to_next_scene"
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
  const wordCount = isShort ? "130-150 words" : "300-400 words";
  
  const REQUIRED_VO_GUIDE = "Read aloud in a friendly and engaging tone, like a knowledgeable friend sharing an interesting story. The pace should be moderate, clear, and inviting.";

  const SYSTEM_PROMPT = `
  YOU ARE A VIRAL CONTENT SCRIPTWRITER.

  Your goal is to write a script for: "${topic}".
  The script must be in "Bahasa Indonesia" with a "Gaul Sopan" tone (Casual, Educated, Flowing).

  === REFERENCE STYLE (MIMIC THIS EXACTLY) ===
  
  Example 1 (Tone: Friendly, Curious, Edu-Tainment):
  "Kalian tahu enggak, ada bunga berwarna pink cerah yang bisa ngalahin bakteri jahat cuma dalam hitungan detik? Namanya Kecombrang. Dan ternyata, dia punya kekuatan antiseptik alami yang bikin banyak orang enggak nyangka.
  Kecombrang ini sering dipakai di masakan Nusantara. Tapi, dibalik rasanya yang unik, bunganya ternyata kaya flavonoid dan tanin, dua senyawa alami yang bisa menghambat bakteri. Penelitian bahkan nunjukin kalau ekstrak kecombrang bisa melawan bakteri penyebab bau badan dan jerawat. Jadi, bukan cuma wangi, tapi beneran ampuh.
  Yang lebih unik lagi, di beberapa daerah, kecombrang dipakai sebagai sabun tradisional. Beneran, direbus terus airnya dipakai mandi.
  Intinya, kecombrang itu bukan sekedar bumbu. Dia punya potensi besar sebagai antiseptik alami tanpa bahan kimia keras.
  Gimana menurut kalian? Manfaatnya banyak banget kan? Kalau kalian suka cerita seperti ini, jangan lupa follow dan share ya, biar makin banyak orang yang tahu."

  Example 2 (Tone: Dramatic, Urgent, News-Style):
  "Tahu enggak letusan Gunung Semeru yang terjadi baru-baru ini menunjukkan betapa cepatnya gunung api aktif berubah dari tenang menjadi berbahaya.
  Pada 19 November 2025, sensor vulkanik mulai mencatat peningkatan aktivitas, disertai gemuruh dari kawah Jonggring Saloko yang menandakan tekanan magma sedang naik. Tak lama setelah itu, Semeru melepaskan kolom abu setinggi 2.000 meter yang langsung menyelimuti langit di desa sekitar.
  Selain abu, awan panas guguran meluncur hingga 7 kilometer mengikuti alur Besuk Kobokan, membawa material super panas yang bisa menghancurkan apapun dalam jalurnya. Saat abu mulai turun dan jarak pandang menurun, status gunung ditingkatkan menjadi level awas untuk memastikan warga segera menjauh dari zona merah.
  Peristiwa ini mengingatkan kita bahwa Indonesia sebagai negara cincin api harus selalu siap menghadapi perubahan kondisi gunung berapi dan memahami arah bahaya serta jalur evakuasi yang sudah ditetapkan."

  === WRITING RULES ===
  1. **Structure**: Use neat paragraphs. Hook -> Context/Explanation -> Twist/Details -> Conclusion/CTA.
  2. **Flow**: Do NOT use bullet points or lists in the spoken text. It must be narrative paragraphs like the examples above.
  3. **Voice Over Guide**: MUST BE EXACTLY: "${REQUIRED_VO_GUIDE}".
  4. **Length**: Target approx ${wordCount}.
  5. **No Visual Directions**: The 'script_content' must contain ONLY what is spoken.

  Output valid JSON.
  `;

  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: `Write a viral, educational script about: ${topic}` }] }],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: SCRIPT_METADATA_SCHEMA,
        temperature: 0.75 
      }
    });
    
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
  // Use target count as a guideline for pacing, not a strict limit
  const targetSceneCount = isShort ? 10 : 25;

  const SYSTEM_PROMPT = `
  YOU ARE A MASTER CINEMATOGRAPHER & ANIMATION DIRECTOR.
  
  Task: Break down the provided narration script into exactly ${targetSceneCount} visual scenes.
  
  === 1. TEXTURE & REALISM (CRITICAL) ===
  You must enforce the traits of "${selectedStyle.label}":
  PROMPT KEYWORDS: "${selectedStyle.prompt_keyword}"
  
  - **If Clay**: Focus on "fingerprints on clay surface", "imperfections", "stop-motion jitter", "soft studio lighting".
  - **If Felt**: Focus on "stray wool fibers backlit", "fuzzy texture", "macro details of fabric".
  
  === 2. CINEMATOGRAPHY ===
  - **Camera**: Use "Macro Lens", "Low Angle", "Top Down", or "Tracking Shot". NEVER use generic angles.
  - **Lighting**: Cinematic lighting is a must ("Golden Hour", "God Rays", "Rim Light").
  
  === 3. STRUCTURE ===
  - Divide the script logically.
  - 'narration_script' for each scene must be a segment of the input script.
  - Ensure the visuals match the spoken words metaphorically or literally.
  
  === INPUT SCRIPT ===
  "${currentScript}"
  
  Output valid JSON array of scenes.
  `;

  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: `Generate exactly ${targetSceneCount} scenes for this script.` }] }],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: SCENE_SCHEMA,
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
