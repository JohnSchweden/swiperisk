/**
 * Shared audio utilities for format detection
 */

/**
 * Check if browser supports Opus codec
 * Tests multiple container formats for cross-browser compatibility
 */
export function supportsOpus(): boolean {
	if (typeof window === "undefined") return false;

	const audio = new Audio();
	// Check Ogg Opus (most common - Chrome, Firefox, Edge)
	const oggSupport = audio.canPlayType('audio/ogg; codecs="opus"');
	// Check WebM Opus (alternative)
	const webmSupport = audio.canPlayType('audio/webm; codecs="opus"');
	// Safari uses CAF container for Opus
	const cafSupport = audio.canPlayType("audio/x-caf");

	return (
		oggSupport === "probably" ||
		webmSupport === "probably" ||
		cafSupport === "probably" ||
		oggSupport === "maybe" ||
		webmSupport === "maybe"
	);
}

/**
 * Get the appropriate audio extension based on browser support
 * @returns ".opus" or ".mp3"
 */
export function getAudioExtension(): ".opus" | ".mp3" {
	return supportsOpus() ? ".opus" : ".mp3";
}

/**
 * Convert a base audio path to the appropriate format
 * Replaces any existing extension with the browser-supported one
 * @param basePath - Path without extension or with any audio extension
 * @returns Path with correct extension for current browser
 */
export function getAudioPath(basePath: string): string {
	// Remove any existing audio extension
	const pathWithoutExt = basePath.replace(
		/\.(mp3|opus|ogg|wav|m4a|flac)$/i,
		"",
	);
	return `${pathWithoutExt}${getAudioExtension()}`;
}
