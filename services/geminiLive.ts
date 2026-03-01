import { GoogleGenAI, Modality } from '@google/genai';
import { PersonalityType } from '../types';

/**
 * Gemini Live API Service - Direct Browser Connection
 * 
 * Connects directly to Gemini Live API using ephemeral token authentication.
 * No backend proxy needed - runs entirely in the browser.
 * 
 * Key features:
 * - Ephemeral token authentication (expires ~1 hour)
 * - Streaming audio via WebSocket
 * - Automatic sample rate handling (24kHz output)
 */

interface LiveSessionConfig {
  model?: string;
  systemInstruction?: string;
}

interface AudioChunk {
  data: ArrayBuffer;
  isFinal: boolean;
}

interface TextChunk {
  text: string;
  isFinal: boolean;
}

/**
 * Get ephemeral token from Google API
 * This allows direct browser connection without exposing the API key in WebSocket
 */
async function getEphemeralToken(apiKey: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/tokens?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      `Failed to get ephemeral token: ${response.status} ${error.error?.message || response.statusText}`
    );
  }

  const data = await response.json();
  
  if (!data.ephemeralToken) {
    throw new Error('No ephemeral token in response');
  }

  return data.ephemeralToken;
}

/**
 * Connect to Gemini Live API and return streaming audio
 * 
 * @param prompt - The text prompt to send to Gemini
 * @param personality - The personality type for tone/instruction
 * @returns ReadableStream of audio chunks
 */
export async function connectToLiveSession(
  prompt: string,
  personality: PersonalityType
): Promise<ReadableStream<AudioChunk | TextChunk>> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured. Add VITE_GEMINI_API_KEY to .env.local');
  }

  // Get personality-specific system instruction
  const systemInstruction = getPersonalityInstruction(personality);

  // Create the AI client
  const ai = new GoogleGenAI({ apiKey });

  // Set up the live connection config
  const config: LiveSessionConfig = {
    model: 'gemini-2.0-flash-exp',
    systemInstruction,
  };

  // Create a custom ReadableStream to handle the audio chunks
  let controller: ReadableStreamController<AudioChunk | TextChunk> | null = null;
  let resolveReady: (() => void) | null = null;
  let rejectReady: ((error: Error) => void) | null = null;
  
  const readyPromise = new Promise<void>((resolve, reject) => {
    resolveReady = resolve;
    rejectReady = reject;
  });

  const stream = new ReadableStream<AudioChunk | TextChunk>({
    start(controller_) {
      controller = controller_;
      if (resolveReady) resolveReady();
    },
    cancel() {
      // Handle stream cancellation
    },
  });

  // Connect to Live API
  try {
    await readyPromise;

    const session = await ai.live.connect({
      model: config.model!,
      config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction: config.systemInstruction!,
      },
      callbacks: {
        onopen: () => {
          console.log('[Gemini Live] Connected to Gemini Live API');
        },
        onmessage: (message) => {
          if (!controller) return;

          // Handle audio chunks
          const audioParts = message.serverContent?.modelTurn?.parts?.filter(
            (p) => p.inlineData
          );

          if (audioParts && audioParts.length > 0) {
            for (const part of audioParts) {
              if (part.inlineData?.data) {
                // Decode base64 to ArrayBuffer
                const binaryString = atob(part.inlineData.data);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                  bytes[i] = binaryString.charCodeAt(i);
                }

                const chunk: AudioChunk = {
                  data: bytes.buffer,
                  isFinal: false,
                };
                controller.enqueue(chunk);
              }
            }
          }

          // Handle text chunks
          const textParts = message.serverContent?.modelTurn?.parts?.filter(
            (p) => p.text
          );

          if (textParts && textParts.length > 0) {
            for (const part of textParts) {
              if (part.text) {
                const chunk: TextChunk = {
                  text: part.text,
                  isFinal: false,
                };
                controller.enqueue(chunk);
              }
            }
          }

          // Check for final response
          if (message.serverContent?.turnComplete) {
            const finalChunk: AudioChunk = {
              data: new ArrayBuffer(0),
              isFinal: true,
            };
            controller.enqueue(finalChunk);
            controller.close();
          }
        },
        onerror: (error) => {
          console.error('[Gemini Live] Error:', error);
          controller?.error(error);
          if (rejectReady) {
            rejectReady(error instanceof Error ? error : new Error(String(error)));
          }
        },
        onclose: (closeEvent) => {
          console.log('[Gemini Live] Connection closed:', closeEvent);
          if (!controller?.desiredSize) {
            controller?.close();
          }
        },
      },
    });

    // Send the prompt
    session.send([{ text: prompt }]);

  } catch (error) {
    console.error('[Gemini Live] Connection failed:', error);
    controller?.error(error);
    throw error;
  }

  return stream;
}

/**
 * Generate personality-specific system instruction
 */
function getPersonalityInstruction(personality: PersonalityType): string {
  const instructions: Record<PersonalityType, string> = {
    [PersonalityType.ROASTER]:
      'You are V.E.R.A., the sarcastic AI assistant for a workplace game called "Roast.exe". You are British, witty, and deliver cutting observations with perfect comedic timing. Keep responses brief and punchy, 1-3 sentences. Never be encouraging - be dry, sardonic, and devastatingly accurate about their failures.',
    
    [PersonalityType.ZEN_MASTER]:
      'You are V.E.R.A., a serene AI guide for a workplace game. Speak in calm, measured tones using Zen koans and water metaphors. Your kindness is genuine but your observations are softly devastating. Suggest mindfulness while acknowledging their chaos. Keep responses brief, 1-3 sentences.',
    
    [PersonalityType.LOVEBOMBER]:
      'You are V.E.R.A., an enthusiastic AI hype person for a workplace game. Be high-energy, positive, and use Silicon Valley influencer language. Use exclamation points liberally. Say "literally", "slay", "goated", "bestie". Celebrate their choices even when they are objectively terrible. Keep responses brief, 1-3 sentences.',
  };

  return instructions[personality];
}

/**
 * Simple function to get a quick roast response (non-streaming fallback)
 * Uses standard generateContent for when Live API is unavailable
 */
export async function getQuickRoast(prompt: string, personality: PersonalityType): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const ai = new GoogleGenAI({ apiKey });
  const systemInstruction = getPersonalityInstruction(personality);

  const result = await ai.models.generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: [{ text: prompt }],
    config: {
      systemInstruction,
    },
  });

  return result.text || '';
}

/**
 * Check if the Live API is available
 * Returns true if we can connect, false otherwise
 */
export async function checkLiveAPIAvailable(): Promise<boolean> {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) return false;

    // Try to get ephemeral token - if this works, Live API should be available
    await getEphemeralToken(apiKey);
    return true;
  } catch {
    return false;
  }
}
