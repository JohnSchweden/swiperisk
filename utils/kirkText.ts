/**
 * Phase 07: Kirk Easter Egg — Zalgo-lite text corruption utility.
 * Appends Unicode combining diacritics to characters to create a corrupted visual effect.
 */

/** Range of combining diacritical marks (U+0300–U+030D) */
const COMBINING_START = 0x0300;
const COMBINING_END = 0x030d;

function randomCombining(): string {
	const code =
		COMBINING_START +
		Math.floor(Math.random() * (COMBINING_END - COMBINING_START + 1));
	return String.fromCodePoint(code);
}

/**
 * Corrupts a string by appending 1-3 random Unicode combining diacritics
 * to each non-space character with the given probability.
 *
 * @param text - Input string to corrupt
 * @param intensity - Probability per character (0-1), default 0.3
 * @returns Corrupted string with Zalgo-lite diacritics
 */
export function corruptText(text: string, intensity = 0.3): string {
	return [...text]
		.map((char) => {
			if (char === " " || Math.random() > intensity) return char;
			const count = 1 + Math.floor(Math.random() * 3); // 1, 2, or 3 marks
			let corrupted = char;
			for (let i = 0; i < count; i++) {
				corrupted += randomCombining();
			}
			return corrupted;
		})
		.join("");
}
