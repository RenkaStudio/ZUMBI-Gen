import { GoogleGenAI } from "@google/genai";
import { StoryboardResponse, GenerateOptions } from "../types";

export const generateStoryboard = async (topic: string, options: GenerateOptions): Promise<StoryboardResponse> => {
  const apiKey = options.apiKey || process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key is missing. Please configure it in Settings.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const sceneCount = options.duration === 'short' ? 10 : 25;

  const SYSTEM_PROMPT = `
  ROLE: Expert Cinematic Director for Educational Shorts.
  TOPIC: "${topic}"
  OUTPUT: JSON Storyboard (${sceneCount} scenes).

  === CRITICAL LANGUAGE RULES ===
  1. **NARRATION SCRIPT**: MUST be in **INDONESIAN (Bahasa Indonesia)**. Casual, engaging, educational tone.
  2. **VISUAL PROMPTS (JSON Fields)**: All visual descriptions (background, camera, character, vfx) MUST be in **ENGLISH**. This is for Veo 3 generation.
  3. **METADATA**: Title (Clickbait/Viral) and Description in **INDONESIAN**.

  === STRUCTURE RULES ===
  - **Structure**: Hook -> Context -> The Science/Fact -> Detailed Visuals -> Climax/Impact -> Conclusion.
  - **Character Consistency**: If there is a main character, define them in Scene 1 and use the EXACT same ID and Description in \`character_lock\` for subsequent scenes.

  === JSON OUTPUT FORMAT (VEO 3 COMPLIANT) ===
  You must return a valid JSON object. Do not include markdown formatting.
  
  Format:
  {
    "metadata": { 
      "title": "Viral Clickbait Title in Indonesian", 
      "description": "Short summary in Indonesian", 
      "hashtags": ["#tag1", "#tag2"] 
    },
    "voice_over_guide": "Read it in a warm, friendly, slightly playful storytelling tone, with moderate and expressive pacing. (IN ENGLISH)",
    "scenes": [
      {
        "scene_id": 1,
        "duration_sec": "8",
        "visual_style": "${options.style}",
        "narration_script": "Teks narasi bahasa Indonesia...",
        "background_lock": {
          "setting": "Detailed environment description in ENGLISH...",
          "lighting": "Lighting mood in ENGLISH...",
          "props": "Specific items in the scene in ENGLISH..."
        },
        "camera": {
          "framing": "Shot type (e.g. Medium shot, Close up) in ENGLISH...",
          "movement": "Camera movement in ENGLISH..."
        },
        "character_lock": {
          "id": "UNIQUE_ID (e.g. CAT_1)",
          "description": "Detailed physical appearance in ENGLISH. If no character, set this object to null."
        },
        "vfx": "Visual effects description in ENGLISH..."
      }
    ]
  }
  `;

  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: [{ role: "user", parts: [{ text: "Generate Veo 3 Storyboard JSON." }] }],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        temperature: 0.75
      }
    });
    
    // Parser Logic
    const text = res.text?.replace(/```json|```/g, "").trim();
    if (!text) throw new Error("Empty response from AI");
    
    return JSON.parse(text);

  } catch (e: any) {
    console.error(e);
    if (e.message?.includes('API key')) {
        throw new Error("Invalid or missing API Key. Please check Settings.");
    }
    throw new Error("Gagal generate storyboard: " + e.message);
  }
};