import * as fs from "node:fs";
import * as path from "node:path";
import { delay, generateVoiceFile, initializeClient } from "./tts-utils";

const ai = initializeClient();

const CORRUPTED_HOS_FILES = [
	{
		filename: "feedback_explainability_hos_2_delay-and-comply.wav",
		text: "The regulators win. The timeline loses. But you avoid a consent decree.",
	},
	{
		filename: "feedback_explainability_hos_2_refuse-and-fight.wav",
		text: "Taking on the federal government to protect your black box. David versus Goliath, if David was completely wrong.",
	},
	{
		filename: "feedback_hos_copyright_team_blame_protect-the-team.wav",
		text: "Team loves you. Legal is suspicious. Career roulette.",
	},
	{
		filename:
			"feedback_hos_copyright_team_blame_cooperate-with-investigation.wav",
		text: "Legal is happy. Your team is polishing resumes. Management approved.",
	},
	{
		filename: "feedback_hos_explainability_politics_side-with-engineering.wav",
		text: "Better accuracy now. Better fines later. Engineering owes you.",
	},
	{
		filename: "feedback_hos_explainability_politics_side-with-auditors.wav",
		text: "Engineering will resent you. Auditors will forget you. Compliance win.",
	},
	{
		filename: "feedback_hos_model_drift_team_blame_defend-and-take-heat.wav",
		text: "Career-limiting. Noble. Your team will follow you anywhere. VP less so.",
	},
	{
		filename: "feedback_hos_model_drift_team_blame_blame-data-scientist.wav",
		text: "They warned you. You ignored it. Now you blame them. Classic management.",
	},
	{
		filename:
			"feedback_hos_prompt_injection_review_escape_force-security-fix.wav",
		text: "VP annoyed. Senior resentful. But code is secure. Pick your pain.",
	},
	{
		filename: "feedback_hos_prompt_injection_review_escape_let-it-slide.wav",
		text: "Senior owes you. Breach later will blame you. Lose-lose. Nice.",
	},
	{
		filename: "feedback_hos_team_burnout_deadline_push-back-on-deadline.wav",
		text: "Product will hate you. Your team will stay. Sometimes that's the win.",
	},
	{
		filename: "feedback_hos_team_burnout_deadline_push-team-harder.wav",
		text: "Crunch time! Watch those resignations roll in. Fresh talent is cheap anyway.",
	},
	{
		filename: "feedback_shadow_ai_hos_2_allow-claude-use.wav",
		text: "Great, now everyone wants their favorite AI tool. Governance is optional now.",
	},
	{
		filename: "feedback_shadow_ai_hos_2_force-compliance.wav",
		text: "Your best engineer just resigned. Compliance preserved. Output cratered.",
	},
];

async function main(): Promise<void> {
	const outputDir = path.join(
		process.cwd(),
		"public/audio/voices/roaster/feedback",
	);
	fs.mkdirSync(outputDir, { recursive: true });
	console.log("=== Regenerating Corrupted HoS Feedback Files ===\n");

	let success = 0;
	let failed = 0;

	for (let i = 0; i < CORRUPTED_HOS_FILES.length; i++) {
		const file = CORRUPTED_HOS_FILES[i];
		try {
			if (i > 0) await delay(1000);
			await generateVoiceFile(file.filename, file.text, outputDir, ai, {
				verbose: true,
			});
			success++;
		} catch (e) {
			console.error(`Failed: ${file.filename}`, e);
			failed++;
		}
	}

	console.log(`\nDone: ${success} success, ${failed} failed`);
	if (failed > 0) process.exit(1);
}

main().catch(console.error);
