import * as fs from "node:fs";
import http from "node:http";
import https from "node:https";
import * as path from "node:path";
import templates from "../data/templates/meme-templates.json";

const CACHE_DIR = path.join(process.cwd(), "data/templates/cache");

// Types
export interface MemeTemplate {
	id: string;
	name: string;
	url: string;
	primary?: boolean;
}

export type DeathType =
	| "BANKRUPT"
	| "REPLACED_BY_SCRIPT"
	| "CONGRESS"
	| "FLED_COUNTRY"
	| "PRISON"
	| "AUDIT_FAILURE"
	| "KIRK";
export type Archetype =
	| "PRAGMATIST"
	| "SHADOW_ARCHITECT"
	| "DISRUPTOR"
	| "CONSERVATIVE"
	| "BALANCED"
	| "CHAOS_AGENT"
	| "KIRK";

// =============================================================================
// DOWNLOAD FUNCTIONS
// =============================================================================

/**
 * Download image from URL and return buffer
 */
function downloadImage(url: string): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		const protocol = url.startsWith("https") ? https : http;

		protocol
			.get(url, (res) => {
				// Handle redirect
				if (res.statusCode === 301 || res.statusCode === 302) {
					const redirectUrl = res.headers.location;
					if (redirectUrl) {
						downloadImage(redirectUrl).then(resolve).catch(reject);
						return;
					}
					reject(new Error(`Redirect with no location: ${res.statusCode}`));
					return;
				}

				if (res.statusCode !== 200) {
					reject(new Error(`Failed to fetch: ${res.statusCode}`));
					return;
				}

				const chunks: Buffer[] = [];
				res.on("data", (chunk) => chunks.push(chunk));
				res.on("end", () => resolve(Buffer.concat(chunks)));
				res.on("error", reject);
			})
			.on("error", reject);
	});
}

/**
 * Download and cache a meme - returns local file path
 */
export async function downloadMeme(
	templateId: string,
	url: string,
): Promise<string> {
	// Ensure cache dir exists
	fs.mkdirSync(CACHE_DIR, { recursive: true });

	const ext = url.split(".").pop()?.split("?")[0] || "jpg";
	const cachePath = path.join(CACHE_DIR, `${templateId}.${ext}`);

	// Return cached if exists
	if (fs.existsSync(cachePath)) {
		return cachePath;
	}

	// Download and cache
	const buffer = await downloadImage(url);
	fs.writeFileSync(cachePath, buffer);

	return cachePath;
}

// =============================================================================
// LOOKUP FUNCTIONS
// =============================================================================

/**
 * Get death meme template
 */
export function getDeathTemplate(
	deathType: DeathType,
): MemeTemplate | undefined {
	const deaths = templates.deaths as Record<
		string,
		{ static: MemeTemplate; gif: MemeTemplate }
	>;
	const options = deaths[deathType];
	if (!options) return undefined;

	const primary = options.static.primary
		? options.static
		: options.gif.primary
			? options.gif
			: undefined;
	return primary || options.static;
}

/**
 * Get archetype meme template
 */
export function getArchetypeTemplate(
	archetype: Archetype,
): MemeTemplate | undefined {
	const archetypes = templates.archetypes as Record<
		string,
		{ static: MemeTemplate; gif: MemeTemplate }
	>;
	const options = archetypes[archetype];
	if (!options) return undefined;

	const primary = options.static.primary
		? options.static
		: options.gif.primary
			? options.gif
			: undefined;
	return primary || options.static;
}

/**
 * Download death meme and return local path
 */
export async function getDeathMemePath(
	deathType: DeathType,
): Promise<string | null> {
	const template = getDeathTemplate(deathType);
	if (!template) return null;

	return downloadMeme(template.id, template.url);
}

/**
 * Download archetype meme and return local path
 */
export async function getArchetypeMemePath(
	archetype: Archetype,
): Promise<string | null> {
	const template = getArchetypeTemplate(archetype);
	if (!template) return null;

	return downloadMeme(template.id, template.url);
}

/**
 * Download GIF for escalation
 */
export async function getEscalationGifPath(): Promise<string | null> {
	// escalation gifs not in current meme-templates.json format
	// returning null for now - could be extended with future gifs data
	return null;
}
