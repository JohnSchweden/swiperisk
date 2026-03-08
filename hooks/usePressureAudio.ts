import { useEffect, useRef } from "react";
import {
	createPressureAudioSession,
	type HeartbeatConfig,
} from "../services/pressureAudio";
import { triggerHaptic } from "../utils/haptic";

/** Phase 04: React lifecycle wrapper around pressure audio session */

export interface UsePressureAudioOptions {
	/** Whether pressure is high enough to trigger stress cues */
	hasHighPressure: boolean;
	/** Whether we're in a critical moment (haptic pulse) */
	isCritical: boolean;
	/** Current countdown value when countdown is active */
	countdownValue?: number;
	/** Total countdown length in seconds */
	countdownSec?: number;
	/** Whether countdown is ticking */
	isCountdownActive?: boolean;
}

export function usePressureAudio({
	hasHighPressure,
	isCritical,
	countdownValue,
	countdownSec,
	isCountdownActive,
}: UsePressureAudioOptions): void {
	const sessionRef = useRef<ReturnType<
		typeof createPressureAudioSession
	> | null>(null);
	const wasCriticalRef = useRef(false);

	if (typeof window !== "undefined" && !sessionRef.current) {
		try {
			sessionRef.current = createPressureAudioSession();
		} catch {
			sessionRef.current = null;
		}
	}

	useEffect(() => {
		const session = sessionRef.current;
		if (!session) return;

		if (!hasHighPressure) {
			session.stop();
			return;
		}

		const config: HeartbeatConfig =
			isCountdownActive && countdownValue != null && countdownSec != null
				? { countdownValue, countdownSec }
				: {};
		session.updateHeartbeat(config);
	}, [hasHighPressure, isCountdownActive, countdownValue, countdownSec]);

	// Fallback haptic; primary path is App.tsx onSwipe (vibrate blocked outside user gesture).
	useEffect(() => {
		if (isCritical && !wasCriticalRef.current) {
			triggerHaptic();
			wasCriticalRef.current = true;
		}
		if (!isCritical) {
			wasCriticalRef.current = false;
		}
	}, [isCritical]);

	useEffect(() => {
		return () => {
			sessionRef.current?.stop();
		};
	}, []);
}
