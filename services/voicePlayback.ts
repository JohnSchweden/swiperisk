import * as fs from 'fs';
import * as path from 'path';

let audioContext: any = null;
let currentSource: any = null;

const ERROR_MESSAGES = {
  roaster: "V.E.R.A. voice module malfunctioned",
  zenmaster: "The silence of the spreadsheets is deafening",
  lovebomber: "OMG the audio broke!! But we still love you!!",
};

export async function loadVoice(personality: string, trigger: string): Promise<void> {
  if (!audioContext) {
    audioContext = {};
  }

  const basePath = path.join(process.cwd(), 'public', 'audio', 'voices');
  const personalityDir = path.join(basePath, personality.toLowerCase());
  const filename = trigger.replace(/_/g, '-') + '.wav';
  const filePath = path.join(personalityDir, filename);

  try {
    const fileBuffer = fs.readFileSync(filePath);
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error(ERROR_MESSAGES[personality.toLowerCase()] || "Voice module error");
    }

    return;
  } catch (error) {
    console.error("[Voice Error]", error);
    throw new Error(ERROR_MESSAGES[personality.toLowerCase()] || "Voice module error");
  }
}

export async function playVoice(): Promise<void> {
  return;
}

export function stopVoice(): void {
  if (currentSource) {
    try {
      // Mock stop
    } catch (e) {
      console.error("Error stopping voice:", e);
    }
    currentSource = null;
  }
}

export function isPlaying(): boolean {
  return currentSource !== null;
}
