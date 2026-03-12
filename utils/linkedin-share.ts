import { ROLE_LABELS } from "../data/roles";
import type { Archetype, RoleType } from "../types";

/**
 * Formats share text for LinkedIn post.
 * Returns: "I just faced the Kobayashi Maru as a [ROLE_TITLE]. My Resilience Score: [XX]% ([ARCHETYPE])."
 */
export function formatShareText(
	role: RoleType,
	archetypeName: string,
	resilience: number,
): string {
	const roleTitle = ROLE_LABELS[role];
	const clampedResilience = Math.max(0, Math.min(100, Math.round(resilience)));
	return `I just faced the Kobayashi Maru as a ${roleTitle}. My Resilience Score: ${clampedResilience}% (${archetypeName}).`;
}

/**
 * Encodes the current URL for LinkedIn's native share endpoint.
 * LinkedIn handles the share text via og:description meta tags, not URL params.
 * Optionally includes a summary parameter for pre-filled share text.
 */
export function encodeLinkedInShareUrl(
	currentUrl: string,
	summary?: string,
): string {
	const encodedUrl = encodeURIComponent(currentUrl);
	const encodedSummary = summary ? encodeURIComponent(summary) : "";
	if (encodedSummary) {
		return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedSummary}`;
	}
	return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
}

/**
 * Combines formatShareText and encodeLinkedInShareUrl for convenience.
 * Returns the complete LinkedIn share URL with encoded parameters.
 */
export function getShareUrl(
	role: RoleType,
	archetype: Pick<Archetype, "name">,
	resilience: number,
	currentUrl?: string,
): string {
	const url =
		currentUrl ?? (typeof window !== "undefined" ? window.location.href : "");
	const shareText = formatShareText(role, archetype.name, resilience);
	return encodeLinkedInShareUrl(url, shareText);
}
