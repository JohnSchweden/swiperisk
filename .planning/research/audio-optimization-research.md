# Audio Optimization Research for Web & Mobile

## Current State
- 59 WAV files, ~19MB total
- Files range from 220KB-510KB each
- Format: WAV PCM 16-bit (uncompressed)

## File Type Analysis

### By Content Category:
1. **archetype/** - Archetype reveal voice lines (7 archetypes × 3 personalities = 21 files)
2. **death/** - Death ending voice lines (7 deaths × 3 personalities = 21 files)  
3. **feedback/** - Card-specific feedback (16 Roaster files)
4. **core/** - Onboarding, victory, failure (9 files across personalities)

## Recommended Folder Structure

```
public/audio/voices/
├── {personality}/
│   ├── archetype/           # Archetype reveal audio (debrief page 3)
│   ├── death/               # Death ending audio (debrief page 1)
│   ├── feedback/            # Card-specific feedback
│   └── core/                # Onboarding, victory, failure
```

Example:
```
roaster/
├── archetype/
│   ├── pragmatist.wav
│   ├── shadow_architect.wav
│   └── ...
├── death/
│   ├── bankrupt.wav
│   ├── fled_country.wav
│   └── ...
├── feedback/
│   ├── hos_managing_up_down_left.wav
│   └── ...
└── core/
    ├── onboarding.wav
    ├── victory.wav
    └── failure.wav
```

## Audio Format Recommendations

### Option 1: Keep WAV (Current)
- **Pros**: No re-encoding, simplest implementation, best quality
- **Cons**: Large file sizes (~19MB), slow downloads on mobile
- **Best for**: If storage/bandwidth not a concern

### Option 2: MP3 (128-192kbps)
- **Compression**: ~5-10x smaller than WAV
- **Result**: ~2-4MB total (down from 19MB)
- **Pros**: Universal browser support, good quality at 192kbps
- **Cons**: Slight quality loss, older format
- **Best for**: Maximum compatibility

### Option 3: Ogg Vorbis (Q4-Q5)
- **Compression**: ~8-12x smaller than WAV
- **Result**: ~1.5-3MB total
- **Pros**: Better quality than MP3 at same bitrate, open format
- **Cons**: Safari/Apple limited support (requires fallback)
- **Best for**: Android + desktop Chrome/Firefox

### Option 4: Opus (Recommended for Voice)
- **Compression**: ~10-15x smaller than WAV for voice
- **Result**: ~1-2MB total
- **Pros**: Best quality at low bitrates (48-96kbps), excellent for speech
- **Cons**: Safari <15 has limited support (requires MP3 fallback)
- **Best for**: Voice content where quality matters

### Option 5: WebM Audio
- **Compression**: Similar to Opus (uses Opus codec)
- **Result**: ~1-2MB total
- **Pros**: Good browser support, modern format
- **Cons**: Safari requires fallback
- **Best for**: Web-first applications

## Recommended Approach: Dual Format

**Primary**: Opus (.opus) at 96kbps for modern browsers
**Fallback**: MP3 at 192kbps for Safari/iOS

```typescript
// In voicePlayback.ts
const filePath = supportsOpus() 
  ? `${personalityDir}/${trigger}.opus`
  : `${personalityDir}/${trigger}.mp3`;
```

## Tools for Conversion

### 1. FFmpeg (Recommended)
```bash
# Convert WAV to Opus
ffmpeg -i input.wav -c:a libopus -b:a 96k output.opus

# Convert WAV to MP3
ffmpeg -i input.wav -c:a libmp3lame -b:a 192k output.mp3

# Batch convert all files
for f in *.wav; do
  ffmpeg -i "$f" -c:a libopus -b:a 96k "${f%.wav}.opus"
  ffmpeg -i "$f" -c:a libmp3lame -b:a 192k "${f%.wav}.mp3"
done
```

### 2. Online Tools
- https://cloudconvert.com (API available)
- https://convertio.co

### 3. Node.js Solutions
- `ffmpeg-static` + `fluent-ffmpeg` for automated pipeline

## Implementation Plan

### Phase 1: Restructure (No Format Change)
1. Create new subfolders: `archetype/`, `death/`, `feedback/`, `core/`
2. Move existing files to appropriate folders
3. Update voicePlayback.ts path logic
4. Update voice file generation scripts

### Phase 2: Add Compression (Optional)
1. Generate Opus versions (96kbps)
2. Generate MP3 fallback (192kbps)  
3. Update voicePlayback.ts for format detection
4. A/B test quality vs file size

## Browser Support

| Format | Chrome | Firefox | Safari | Edge | Mobile |
|--------|--------|---------|--------|------|--------|
| WAV    | ✓      | ✓       | ✓      | ✓    | ✓      |
| MP3    | ✓      | ✓       | ✓      | ✓    | ✓      |
| Ogg    | ✓      | ✓       | ✗      | ✓    | Partial|
| Opus   | ✓      | ✓       | 15+    | ✓    | Partial|

## Decision Matrix

| Priority | Recommendation |
|----------|----------------|
| Max compatibility | Keep WAV, just restructure |
| Balance | Restructure + MP3 (192kbps) |
| Min file size | Restructure + Opus + MP3 fallback |

## Next Steps
1. Decide on file structure (Phase 4 plan)
2. Implement folder reorganization
3. Optional: Add compressed formats in Phase 5
