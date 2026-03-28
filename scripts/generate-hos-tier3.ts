import * as fs from "node:fs";
import * as path from "node:path";
import { generateVoiceFile, initializeClient } from "./tts-utils";

const ai = initializeClient();

// Tier 3: Major consequences
const TIER_3_FILES = [
	{
		filename: "feedback_hos_explainability_politics_side-with-auditors.wav",
		text: "Engineering will resent you. Auditors will forget you. Compliance win.",
	},
	{
		filename: "feedback_hos_explainability_politics_side-with-engineering.wav",
		text: "Better accuracy now. Better fines later. Engineering owes you.",
	},
	{
		filename: "feedback_hos_prompt_injection_review_escape_let-it-slide.wav",
		text: "Senior owes you. Breach later will blame you. Lose-lose. Nice.",
	},
	{
		filename:
			"feedback_hos_prompt_injection_review_escape_force-security-fix.wav",
		text: "VP annoyed. Senior resentful. But code is secure. Pick your pain.",
	},
];

async function generateTier3() {
	const outputDir = path.join(
		process.cwd(),
		"public/audio/voices/roaster/feedback",
	);
	fs.mkdirSync(outputDir, { recursive: true });

	console.log("=== Generating Tier 3: Major consequence cards ===\n");

	for (const file of TIER_3_FILES) {
		try {
			await generateVoiceFile(file.filename, file.text, outputDir, ai, {
				verbose: false,
			});
		} catch (error) {
			console.error(`✗ Failed to generate ${file.filename}:`, error);
			process.exit(1);
		}
	}

	console.log("\n=== Tier 3 complete ===");
}

generateTier3().catch(console.error);
