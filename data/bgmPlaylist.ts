import { getAudioPath, supportsOpus } from "../services/audioUtils";

export type BgmTrack = {
	title: string;
	url: string;
};

/** Base filenames under `public/audio/music/` without extensions (order = play order). */
export const BGM_SOURCE_STEMS = [
	"Chromed Rainfall Cover",
	"Quiet Apogee - AI Music",
] as const;

/** First two words of the stem (e.g. "Chromed Rainfall", "Quiet Apogee"). */
export function bgmDisplayTitleFromStem(stem: string): string {
	const parts = stem.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return stem;
	if (parts.length <= 2) return parts.join(" ");
	return `${parts[0]} ${parts[1]}`;
}

/** @deprecated Use bgmDisplayTitleFromStem instead */
export function bgmDisplayTitleFromFilename(filename: string): string {
	const stem = filename.replace(/\.(mp3|m4a|ogg|wav|flac)$/i, "");
	return bgmDisplayTitleFromStem(stem);
}

/**
 * Get the BGM URL for a specific stem with format detection
 * Uses Opus for supported browsers (92%), MP3 for others (8%)
 */
export function getBgmUrl(stem: string): string {
	const ext = supportsOpus() ? ".opus" : ".mp3";
	return `/audio/music/${encodeURIComponent(stem)}${ext}`;
}

/** Ordered playlist: first file, then second, then loops. URLs encode spaces for the browser. */
export const BGM_TRACKS: readonly BgmTrack[] = BGM_SOURCE_STEMS.map((stem) => ({
	title: bgmDisplayTitleFromStem(stem),
	url: getBgmUrl(stem),
}));

/** @deprecated Use BGM_SOURCE_STEMS instead */
export const BGM_SOURCE_FILENAMES = [
	"Chromed Rainfall Cover.mp3",
	"Quiet Apogee - AI Music.mp3",
] as const;
