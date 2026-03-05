import { useEffect, useState } from "react";

function getCurrentTime(): string {
	return new Date().toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function useClock(updateInterval = 10000): string {
	const [time, setTime] = useState(getCurrentTime);

	useEffect(() => {
		const timer = setInterval(() => {
			setTime(getCurrentTime());
		}, updateInterval);

		return () => clearInterval(timer);
	}, [updateInterval]);

	return time;
}
