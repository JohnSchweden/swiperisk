/**
 * Copies a seed WebP to every path in INCIDENT_IMAGES / OUTCOME_IMAGES that is missing on disk.
 * Keeps `tests/data/image-assets.test.ts` green until real assets are generated per slug.
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { INCIDENT_IMAGES, OUTCOME_IMAGES } from "../data/imageMap.ts";

const ROOT = path.join(import.meta.dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const SEED = path.join(
	PUBLIC,
	"images/incidents/samsung-chatgpt-code-leak.webp",
);

if (!existsSync(SEED)) {
	console.error("sync-image-placeholders: seed missing:", SEED);
	process.exit(1);
}

const paths = new Set([
	...Object.values(INCIDENT_IMAGES),
	...Object.values(OUTCOME_IMAGES),
]);

let created = 0;
for (const webPath of paths) {
	const rel = webPath.startsWith("/") ? webPath.slice(1) : webPath;
	const dest = path.join(PUBLIC, rel);
	if (existsSync(dest)) continue;
	mkdirSync(path.dirname(dest), { recursive: true });
	copyFileSync(SEED, dest);
	created++;
}

console.log(
	`sync-image-placeholders: wrote ${created} file(s); ${paths.size} unique path(s) total`,
);
