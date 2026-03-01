import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";
import { PersonalityType } from "../types";
import { PERSONALITIES } from "../constants";

const ROAST_MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash"] as const;

const TONE_INSTRUCTIONS: Record<PersonalityType, string> = {
  [PersonalityType.ROASTER]: "Be sarcastic, witty, and cynical. Biting British humor.",
  [PersonalityType.ZEN_MASTER]: "Be calm, meditative, and passive-aggressive. Zen koans and flowing-water metaphors. Softly devastating.",
  [PersonalityType.LOVEBOMBER]: "Be high-energy, hype, and Silicon Valley influencer style. Exclamation points. 'Slay,' 'literally,' 'vibes.'",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { workflow, personality } = req.body;

  if (!workflow || !personality) {
    return res.status(400).json({ error: "Missing workflow or personality" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  const personalityName = PERSONALITIES[personality].name;
  const tone = TONE_INSTRUCTIONS[personality];

  const prompt = `
You are ${personalityName} from the satirical tech company HyperScale Inc.
A user has described their current AI workflow: "${workflow}".

**Step 1:** Analyze the workflow. Is it using public tools (high privacy risk) or enterprise/in-house tools (low privacy risk)?
**Step 2:** Respond based on that analysis, in your character's voice.
*   If **Public**: Call out leaking IP and data breach risk.
*   If **Private/In-house**: Call out blindly trusting AI code, "secure" garbage, or believing a firewall fixes bad engineering.

${tone} Keep it under 50 words.
`;

  const ai = new GoogleGenAI({ apiKey });

  for (const model of ROAST_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });
      const text = response.text || "Even for you, this is remarkably insecure.";
      return res.status(200).json({ text });
    } catch (error) {
      console.warn(`Roast Error (${model}):`, error);
    }
  }

  return res.status(500).json({ error: "The auditors found your workflow so bad they broke my AI." });
}
