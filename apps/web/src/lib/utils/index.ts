import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
dayjs.extend(relativeTime);
dayjs.extend(duration);

export function timeTo(date: Date | number) {
	return dayjs().to(date);
}

export function timeDiff(date: Date | number, duration: number) {
	const then = dayjs(date);
	const now = dayjs();

	const minutes = then.minute() - now.minute();
	console.log(minutes);

	return (duration - minutes) / duration;

	// return percentage;
}
