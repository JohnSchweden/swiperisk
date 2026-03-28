#!/usr/bin/env python3
"""Transcribe audio files using Groq Whisper API."""

import os
import glob
from groq import Groq
from pathlib import Path

# Load .env file for API key
env_path = Path("/Users/yevgenschweden/swiperisk/.env")
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line.startswith("GROQ_API_KEY="):
                os.environ["GROQ_API_KEY"] = line.split("=", 1)[1]
                break

# Get API key
api_key = os.environ.get("GROQ_API_KEY")
if not api_key:
    print("ERROR: GROQ_API_KEY not found")
    exit(1)

# Initialize Groq client
client = Groq(api_key=api_key)

# Get all audio files - recursively from voices folder
voices_dir = "/Users/yevgenschweden/swiperisk/public/audio/voices"
files = sorted(glob.glob(f"{voices_dir}/**/*.mp3", recursive=True))

print(f"Found {len(files)} audio files. Transcribing...")

results = []
for i, f in enumerate(files):
    name = os.path.basename(f)
    print(f"[{i+1}/{len(files)}] {name}")
    
    try:
        with open(f, "rb") as audio_file:
            # Send to Groq Whisper API
            response = client.audio.transcriptions.create(
                model="whisper-large-v3",
                file=audio_file,
                response_format="json",
                language="en"
            )
            text = response.text
            results.append((name, text))
            print(f"  → {text[:80]}...")
    except Exception as e:
        print(f"  → ERROR: {e}")
        results.append((name, f"ERROR: {e}"))

# Save to file
out = f"{voices_dir}/transcripts/all_transcripts.txt"
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, "w") as f:
    f.write("# TRANSCRIPTS\n\n")
    for name, text in results:
        f.write(f"## {name}\n{text}\n\n")

print(f"\n✅ Done! Saved to {out}")