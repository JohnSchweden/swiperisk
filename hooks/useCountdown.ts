import { useCallback, useEffect, useState } from "react";

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

	useEffect(() => {
		if (!isActive) {
			setCount(startFrom);
			return;
		}

		// Fresh activation: count was 0 (or stale), startFrom > 0 — reset and defer tick
		if (count === 0 && startFrom > 0) {
			setCount(startFrom);
			return;
		}

		if (count > 0) {
			const timer = setTimeout(() => setCount((c) => c - 1), 1000);
			return () => clearTimeout(timer);
		}

		// count === 0 and startFrom === 0: legitimate expiry
		onComplete();
	}, [isActive, count, startFrom, onComplete]);

	const reset = useCallback(() => {
		setCount(startFrom);
	}, [startFrom]);

	return { count, reset };
}
