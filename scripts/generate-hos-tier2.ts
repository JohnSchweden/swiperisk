import * as fs from "node:fs";
import * as path from "node:path";
import { generateVoiceFile, initializeClient } from "./tts-utils";

const ai = initializeClient();

// Tier 2: Massive sacrifice moments
const TIER_2_FILES = [
	{
		filename:
			"feedback_hos_copyright_team_blame_cooperate-with-investigation.wav",
		text: "Legal is happy. Your team is polishing resumes. Management approved.",
	},
	{
		filename: "feedback_hos_copyright_team_blame_protect-the-team.wav",
		text: "Taking a thirty-five million dollar bullet for your team. Noble. Expensive. Probably career-limiting.",
	},
	{
		filename: "feedback_hos_team_burnout_deadline_push-team-harder.wav",
		text: "Crunch time! Watch those resignations roll in. Fresh talent is cheap anyway.",
	},
	{
		filename: "feedback_hos_team_burnout_deadline_push-back-on-deadline.wav",
		text: "Product will hate you. Your team will stay. Sometimes that's the win.",
	},
	{
		filename: "feedback_shadow_ai_hos_2_force-compliance.wav",
		text: "Your best engineer just resigned. Compliance preserved. Output cratered.",
	},
	{
		filename: "feedback_shadow_ai_hos_2_allow-claude-use.wav",
		text: "Great, now everyone wants their favorite AI tool. Governance is optional now.",
	},
	{
		filename: "feedback_hos_model_drift_team_blame_blame-data-scientist.wav",
		text: "They warned you. You ignored it. Now you blame them. Classic management.",
	},
	{
		filename: "feedback_hos_model_drift_team_blame_defend-and-take-heat.wav",
		text: "Career-limiting. Noble. Your team will follow you anywhere. The VP less so.",
	},
];

async function generateTier2() {
	const outputDir = path.join(
		process.cwd(),
		"public/audio/voices/roaster/feedback",
	);
	fs.mkdirSync(outputDir, { recursive: true });

	console.log("=== Generating Tier 2: Sacrifice moment cards ===\n");

	for (const file of TIER_2_FILES) {
		try {
			await generateVoiceFile(file.filename, file.text, outputDir, ai, {
				verbose: false,
			});
		} catch (error) {
			console.error(`✗ Failed to generate ${file.filename}:`, error);
			process.exit(1);
		}
	}

	console.log("\n=== Tier 2 complete ===");
}

generateTier2().catch(console.error);
