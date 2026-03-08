import type React from "react";
import type { IncidentPressureState } from "../../hooks/useIncidentPressure";
import { usePressureAudio } from "../../hooks/usePressureAudio";

interface PressureCueControllerProps extends IncidentPressureState {
	/** Current countdown value (from useCountdown). */
	countdownValue: number;
	/** Whether countdown is active and ticking. */
	isCountdownActive: boolean;
}

/**
 * Phase 04: Live pressure cue orchestration for gameplay audio and haptics.
 * Drives heartbeat/alert audio and mobile vibration from pressure state.
 */
export const PressureCueController: React.FC<PressureCueControllerProps> = ({
	isUrgent,
	isCritical,
	countdownValue,
	countdownSec,
	isCountdownActive,
}) => {
	usePressureAudio({
		hasHighPressure: isUrgent || isCritical,
		isCritical,
		countdownValue,
		countdownSec,
		isCountdownActive,
	});

	return null;
};
