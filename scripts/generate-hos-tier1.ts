import * as fs from "node:fs";
import * as path from "node:path";
import { generateVoiceFile, initializeClient } from "./tts-utils";

const ai = initializeClient();

// Tier 1: Game-ending catastrophes
const TIER_1_FILES = [
	{
		filename: "feedback_hos_managing_up_down_promise-the-impossible.wav",
		text: "Leadership loves you now. Your team hates you now. The crash comes later. Classic Theranos energy.",
	},
	{
		filename: "feedback_hos_managing_up_down_tell-leadership-no.wav",
		text: "Leadership is disappointed. Your team is relieved. You live to fight another day. You hope.",
	},
	{
		filename: "feedback_explainability_hos_2_refuse-and-fight.wav",
		text: "Taking on the federal government to protect your black box. David versus Goliath, if David was completely wrong.",
	},
	{
		filename: "feedback_explainability_hos_2_delay-and-comply.wav",
		text: "The regulators win. The timeline loses. But you avoid a consent decree. Small victories.",
	},
];

async function generateTier1() {
	const outputDir = path.join(
		process.cwd(),
		"public/audio/voices/roaster/feedback",
	);
	fs.mkdirSync(outputDir, { recursive: true });

	console.log("=== Generating Tier 1: Game-ending catastrophe cards ===\n");

	for (const file of TIER_1_FILES) {
		try {
			await generateVoiceFile(file.filename, file.text, outputDir, ai, {
				verbose: false,
			});
		} catch (error) {
			console.error(`✗ Failed to generate ${file.filename}:`, error);
			process.exit(1);
		}
	}

	console.log("\n=== Tier 1 complete ===");
}

generateTier1().catch(console.error);
