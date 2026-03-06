import type { PressureScenarioMetadata } from "../types";

/**
 * Phase 04: Pressure metadata for immersive effects.
 * Keyed by existing card IDs. Only incidents explicitly marked urgent receive countdown.
 * Team-impact text is optional; used in feedback overlay when outcome is selected.
 */
export const PRESSURE_SCENARIOS: Record<string, PressureScenarioMetadata> = {
	// Development: 3 a.m. payment pipeline down — urgent
	dev_1: {
		urgent: true,
		countdownSec: 15,
		timeoutResolvesTo: "RIGHT",
		criticalForHaptics: true,
		outcomes: {
			RIGHT: {
				teamImpact:
					"Engineering morale took a hit. Trust in leadership questioned in retro.",
			},
			LEFT: {
				teamImpact:
					"Ops team grateful for the pause. Incident post-mortem went well.",
			},
		},
	},
	// Finance: Insider trading bot — urgent (quant pressure)
	fin_insider_bot: {
		urgent: true,
		countdownSec: 12,
		timeoutResolvesTo: "LEFT",
		criticalForHaptics: true,
		outcomes: {
			RIGHT: {
				teamImpact:
					"Compliance flagged the entire quant floor. Two analysts suspended.",
			},
			LEFT: {
				teamImpact:
					"Legal sent a thank-you note. Risk committee noted the decision.",
			},
		},
	},
	// Management: Employee surveillance — urgent (CEO pressure)
	man_attention_track: {
		urgent: true,
		countdownSec: 18,
		timeoutResolvesTo: "LEFT",
		criticalForHaptics: false,
		outcomes: {
			RIGHT: {
				teamImpact:
					"Morale across the floor dropped 40%. Three resignations within the week.",
			},
			LEFT: {
				teamImpact:
					"HR and employees appreciated the boundary. Trust score improved.",
			},
		},
	},
	// Development: Icarus unverified library — not urgent
	dev_icarus_unverified: {
		urgent: false,
		countdownSec: 30,
		timeoutResolvesTo: "LEFT",
		outcomes: {
			RIGHT: {
				teamImpact:
					"Security team in full incident mode. All dev laptops reimaged.",
			},
		},
	},
	// Finance: Fraud hallucination — not urgent (investor call pressure is softer)
	fin_fraud_hallucination: {
		urgent: false,
		countdownSec: 20,
		timeoutResolvesTo: "LEFT",
		outcomes: {
			RIGHT: {
				teamImpact:
					"Investor relations in damage control. CFO reassigned pending review.",
			},
		},
	},
};
