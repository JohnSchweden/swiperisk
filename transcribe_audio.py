#!/usr/bin/env python3
"""Batch transcribe audio files using faster-whisper."""

import os
import glob
from faster_whisper import WhisperModel

# Use a smaller model for speed on CPU
MODEL_SIZE = "large-v3"  # or "base" for faster, "small"
DEVICE = "cpu"  # Use "cuda" if you have GPU

def transcribe_audio(audio_path: str, model) -> str:
    """Transcribe a single audio file and return the text."""
    segments, info = model.transcribe(audio_path, beam_size=5)
    text = " ".join([segment.text for segment in segments])
    return text.strip()

def main():
    # Initialize model
    print(f"Loading Whisper model: {MODEL_SIZE} on {DEVICE}...")
    model = WhisperModel(MODEL_SIZE, device=DEVICE, compute_type="int8")
    print("Model loaded!")

    # Get all audio files
    audio_dir = "/Users/yevgenschweden/swiperisk/public/audio/voices/roaster/feedback"
    audio_files = sorted(glob.glob(f"{audio_dir}/*.mp3"))
    
    print(f"Found {len(audio_files)} audio files to transcribe...")
    
    # Transcribe each file
    results = []
    for i, audio_path in enumerate(audio_files, 1):
        filename = os.path.basename(audio_path)
        print(f"[{i}/{len(audio_files)}] Transcribing: {filename}")
        
        try:
            text = transcribe_audio(audio_path, model)
            results.append({
                "filename": filename,
                "transcript": text
            })
            print(f"  → {text[:80]}...")
        except Exception as e:
            print(f"  → ERROR: {e}")
            results.append({
                "filename": filename,
                "transcript": f"ERROR: {e}"
            })
    
    # Write results to file
    output_path = f"{audio_dir}/transcripts/transcripts.txt"
    with open(output_path, "w") as f:
        f.write("# Audio Transcription Results\n\n")
        for r in results:
            f.write(f"## {r['filename']}\n")
            f.write(f"{r['transcript']}\n\n")
    
    print(f"\n✅ Transcriptions saved to: {output_path}")
    
    # Also print summary
    print("\n=== SUMMARY ===")
    for r in results:
        print(f"{r['filename']}: {r['transcript'][:60]}...")

if __name__ == "__main__":
    main()