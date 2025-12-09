// services/geminiService.ts

import { GoogleGenAI } from "@google/genai";
import { StoryboardResponse, GenerateOptions } from "../types";
import { VISUAL_STYLES } from "../constants";

export const generateStoryboard = async (topic: string, options: GenerateOptions): Promise<StoryboardResponse> => {
  const apiKey = options.apiKey || process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key is missing. Please configure it in Settings.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // 1. SELECT STYLE
  const selectedStyle = VISUAL_STYLES.find(s => s.id === options.style_id) || VISUAL_STYLES[0];
  
  // 2. FORMAT & PACING LOGIC
  const isShort = options.duration === 'short';
  const sceneCount = isShort ? 10 : 25;
  const aspectRatio = isShort ? "9:16 (Vertical)" : "16:9 (Landscape)";
  const pacingGuide = isShort 
    ? "FAST-PACED SPRINT. Every 3 seconds must have a new visual hook. Structure: HOOK (Sc 1-2) -> PROBLEM (Sc 3-4) -> SOLUTION/FACT (Sc 5-8) -> PUNCHLINE (Sc 9-10)."
    : "CINEMATIC JOURNEY. Allow shots to breathe. Use the 'Establish -> Isolate -> Detail' visual pattern. Build emotional connection before delivering facts.";

  const SYSTEM_PROMPT = `
  YOU ARE A WORLD-CLASS ANIMATION DIRECTOR (Pixar/Aardman Alumni).
  Your job is to create a VIRAL VIDEO STORYBOARD for: "${topic}"
  
  === CONFIGURATION ===
  - MODE: ${aspectRatio}
  - DURATION TYPE: ${isShort ? "Short Form (TikTok/Reels)" : "Long Form (YouTube)"}
  - VISUAL STYLE: ${selectedStyle.label}
  - KEYWORD PROMPT: "${selectedStyle.prompt_keyword}"
  - TOTAL SCENES: ${sceneCount}
  - PACING: ${pacingGuide}

  === STRICT RULES FOR HIGH QUALITY OUTPUT ===
  1. **AUTO-TONE ANALYSIS**: 
     - Analyze the topic and automatically determine the best narrative tone (e.g., Fun Educational, Dramatic Epic, Warm Bedtime, Suspenseful).
     - The script and visual choices MUST align with this tone.

  2. **CHARACTER CONSISTENCY (CRUCIAL)**: 
     - Create a definitive "Character Lock" in Scene 1. 
     - The 'id' must be simple (e.g., 'CRAB_01').
     - The 'description' must be EXTREMELY detailed (color, accessories, eye shape).
     - REPEAT this exact description in the JSON for every scene the character appears.

  3. **VISUAL PROMPTS (THE "SECRET SAUCE")**:
     - 'visual_prompt_detailed': This is for the Video AI generator. It MUST include the *Visual Style Keyword*, *Lighting*, *Camera Angle*, *Action*, and *Texture Details*.
     - Example: "Close-up macro shot of a cute red crab with big eyes, holding a tiny suitcase, standing on wet asphalt. Claymation style, fingerprints visible on the shell, tilt-shift effect, golden hour lighting."

  4. **NARRATIVE (INDONESIAN - PURE SPEECH)**:
     - Script must be colloquial, natural, and match the Determined Tone.
     - **CRITICAL**: DO NOT include sound effects or actions in brackets like [Suara Ombak] or (Ketawa). Keep it strictly spoken words only. SFX belongs in the visual prompt/JSON.

  5. **METADATA & GUIDES**:
     - Title: Must be HIGH-CTR, CLICKBAIT, and SEO OPTIMIZED (e.g., "TERUNGKAP! Rahasia Kelam di Balik...").
     - Voice Over Guide: Provide specific, actionable direction. Not just "Happy", but "Start with a whisper to build mystery, then shift to high-energy excitement at scene 3. Use a warm, storytelling timbre."

  === OUTPUT FORMAT (JSON ONLY) ===
  {
    "metadata": {
      "title": "SEO Optimized & Clickbait Title (Indonesian)",
      "description": "Engaging description (Indonesian)",
      "hashtags": ["#tag1", "#tag2"],
      "music_suggestion": "Mood and Genre of background music",
      "tone_used": "The tone you selected"
    },
    "voice_over_guide": "Comprehensive English instruction for the VO artist/AI (Tone, Pacing, Emphasis)",
    "scenes": [
      {
        "scene_id": 1,
        "duration_sec": 4,
        "narration_script": "Teks dubbing Indonesia only (No SFX text)",
        "text_overlay": "Teks Singkat di Layar (Max 5 words) or null",
        "visual_prompt_summary": "Short description for UI display",
        "visual_prompt_detailed": "FULL DETAILED PROMPT FOR AI VIDEO GENERATOR (Includes style keywords + action + camera)",
        "background_lock": {
          "setting": "Forest floor / Underwater / Space",
          "lighting": "Golden hour / Neon / Dark moody",
          "ambience": "Foggy / Raining / Dusty particles"
        },
        "camera": {
          "shot_type": "Close Up",
          "movement": "Dolly In",
          "focus": "Sharp focus on character"
        },
        "character_lock": {
          "id": "MAIN_CHAR_1",
          "name": "Boni the Crab",
          "description": "Red clay crab, large googly eyes, wearing a yellow construction hat..."
        },
        "vfx": "Explosion / Sparkles / Speed lines"
      }
    ]
  }
  `;

  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: "ACTION! Generate the storyboard JSON now." }] }],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        temperature: 0.8
      }
    });
    
    const text = res.text?.replace(/```json|```/g, "").trim();
    if (!text) throw new Error("AI returned empty response.");
    
    return JSON.parse(text);

  } catch (e: any) {
    console.error("Gemini Error:", e);
    if (e.message?.includes('API key')) {
        throw new Error("Invalid API Key. Check Settings.");
    }
    throw new Error("Generation Failed: " + e.message);
  }
};