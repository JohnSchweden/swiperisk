import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Modality } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { text, voiceName } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Missing text" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return res.status(500).json({ error: "No audio generated" });
    }

    return res.status(200).json({ audio: base64Audio });
  } catch (error) {
    console.error("TTS Error:", error);
    return res.status(500).json({ error: "TTS generation failed" });
  }
}
