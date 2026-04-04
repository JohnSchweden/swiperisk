import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

/**
 * Head of Something Critical Card Audio Tests
 *
 * These tests verify that all critical HoS card feedback audio files exist.
 * Critical cards are high-impact (game-enders, sacrifice moments) with
 * dedicated Roaster voice lines for each choice.
 * Files are in Opus format (.opus) with MP3 fallback (.mp3).
 *
 * @smoke @area:audio
 */

const VOICES_DIR = path.join(process.cwd(), "public/audio/voices");

// Critical Head of Something cards with dedicated feedback audio
const CRITICAL_HOS_CARDS = [
	{
		id: "hos_managing_up_down",
		leftSlug: "tell-leadership-no",
		rightSlug: "promise-the-impossible",
	},
	{
		id: "explainability_hos_2",
		leftSlug: "delay-and-comply",
		rightSlug: "refuse-and-fight",
	},
	{
		id: "hos_copyright_team_blame",
		leftSlug: "protect-the-team",
		rightSlug: "cooperate-with-investigation",
	},
	{
		id: "hos_team_burnout_deadline",
		leftSlug: "push-back-on-deadline",
		rightSlug: "push-team-harder",
	},
	{
		id: "hos_model_drift_team_blame",
		leftSlug: "defend-and-take-heat",
		rightSlug: "blame-data-scientist",
	},
	{
		id: "hos_explainability_politics",
		leftSlug: "side-with-engineering",
		rightSlug: "side-with-auditors",
	},
	{
		id: "hos_prompt_injection_review_escape",
		leftSlug: "force-security-fix",
		rightSlug: "let-it-slide",
	},
	{
		id: "hos_prompt_injection_blame",
		leftSlug: "take-the-blame",
		rightSlug: "name-the-engineer",
	},
	{
		id: "hos_model_drift_budget_conflict",
		leftSlug: "fight-for-budget",
		rightSlug: "ship-without-retraining",
	},
	{
		id: "hos_delegation_gone_wrong",
		leftSlug: "defend-delegation",
		rightSlug: "admit-oversight-failure",
	},
	{
		id: "hos_promotion_politics",
		leftSlug: "promote-best-performer",
		rightSlug: "promote-politically-connected",
	},
	{
		id: "hos_prompt_injection_copilot_team",
		leftSlug: "pull-for-patching",
		rightSlug: "continue-development",
	},
	{
		id: "hos_model_drift_retrain_delay",
		leftSlug: "start-immediately",
		rightSlug: "delay-until-next-quarter",
	},
	{
		id: "explainability_hos_1",
		leftSlug: "side-with-auditors",
		rightSlug: "side-with-engineering",
	},
	{
		id: "shadow_ai_hos_1",
		leftSlug: "shield-the-team",
		rightSlug: "give-names-to-compliance",
	},
	{
		id: "synthetic_data_hos_1",
		leftSlug: "take-the-blame",
		rightSlug: "name-the-data-scientist",
	},
	{
		id: "synthetic_data_hos_2",
		leftSlug: "provide-full-documentation",
		rightSlug: "claim-poor-record-keeping",
	},
];

test.describe("Head of Something Critical Card Audio @smoke @area:audio", () => {
	test.describe("Critical HoS cards have feedback audio for both choices", () => {
		for (const card of CRITICAL_HOS_CARDS) {
			test(`${card.id} has feedback audio for LEFT and RIGHT choices`, () => {
				const leftPath = path.join(
					VOICES_DIR,
					"roaster",
					"feedback",
					`feedback_${card.id}_${card.leftSlug}.opus`,
				);
				const rightPath = path.join(
					VOICES_DIR,
					"roaster",
					"feedback",
					`feedback_${card.id}_${card.rightSlug}.opus`,
				);

				expect(
					fs.existsSync(leftPath),
					`Missing LEFT feedback audio: roaster/feedback_${card.id}_${card.leftSlug}.opus`,
				).toBe(true);
				expect(
					fs.existsSync(rightPath),
					`Missing RIGHT feedback audio: roaster/feedback_${card.id}_${card.rightSlug}.opus`,
				).toBe(true);
			});
		}
	});

	test("All 36 critical HoS audio files exist (18 cards x 2 choices)", () => {
		let missingCount = 0;
		const missingFiles: string[] = [];

		for (const card of CRITICAL_HOS_CARDS) {
			for (const slug of [card.leftSlug, card.rightSlug]) {
				const filePath = path.join(
					VOICES_DIR,
					"roaster",
					"feedback",
					`feedback_${card.id}_${slug}.opus`,
				);
				if (!fs.existsSync(filePath)) {
					missingCount++;
					missingFiles.push(
						`roaster/feedback/feedback_${card.id}_${slug}.opus`,
					);
				}
			}
		}

		expect(
			missingCount,
			`Missing ${missingCount} files: ${missingFiles.join(", ")}`,
		).toBe(0);
	});

	test.describe("Critical HoS audio files are Opus format", () => {
		for (const card of CRITICAL_HOS_CARDS) {
			for (const slug of [card.leftSlug, card.rightSlug]) {
				test(`feedback/feedback_${card.id}_${slug}.opus is valid Opus`, () => {
					const filePath = path.join(
						VOICES_DIR,
						"roaster",
						"feedback",
						`feedback_${card.id}_${slug}.opus`,
					);

					expect(
						fs.existsSync(filePath),
						`File does not exist: ${filePath}`,
					).toBe(true);

					// Read first 4 bytes - should be "OggS" for Opus-in-OGG container
					const buffer = fs.readFileSync(filePath);
					const header = buffer.slice(0, 4).toString("ascii");
					expect(header).toBe("OggS");
				});
			}
		}
	});

	test.describe("Only Roaster has critical HoS feedback files", () => {
		const otherPersonalities = ["zenmaster", "lovebomber"] as const;

		for (const personality of otherPersonalities) {
			test(`${personality} does NOT have critical HoS feedback files`, () => {
				for (const card of CRITICAL_HOS_CARDS) {
					for (const slug of [card.leftSlug, card.rightSlug]) {
						const filePath = path.join(
							VOICES_DIR,
							personality,
							"feedback",
							`feedback_${card.id}_${slug}.opus`,
						);
						expect(
							fs.existsSync(filePath),
							`${personality} should NOT have feedback/feedback_${card.id}_${slug}.opus (per design)`,
						).toBe(false);
					}
				}
			});
		}
	});
});
