import { useCallback, useEffect, useRef, useState } from "react";

interface UseCountdownOptions {
	startFrom: number;
	onComplete: () => void;
	isActive: boolean;
}

interface UseCountdownResult {
	count: number;
	reset: () => void;
}

export function useCountdown({
	startFrom,
	onComplete,
	isActive,
}: UseCountdownOptions): UseCountdownResult {
	const [count, setCount] = useState(startFrom);
	const wasCountingRef = useRef(false);

	useEffect(() => {
		if (!isActive) {
			setCount(startFrom);
			wasCountingRef.current = false;
			return;
		}

		// Expiry: we counted down from 1 to 0 — call onComplete
		if (count === 0 && wasCountingRef.current) {
			wasCountingRef.current = false;
			onComplete();
			return;
		}

		// Fresh activation: count was 0, startFrom > 0, we weren't counting — reset
		if (count === 0 && startFrom > 0) {
			setCount(startFrom);
			return;
		}

		if (count > 0) {
			wasCountingRef.current = true;
			const timer = setTimeout(() => setCount((c) => c - 1), 1000);
			return () => clearTimeout(timer);
		}

		// count === 0 and startFrom === 0: edge case
		onComplete();
	}, [isActive, count, startFrom, onComplete]);

	const reset = useCallback(() => {
		setCount(startFrom);
	}, [startFrom]);

	return { count, reset };
}
