import dayjs, { Dayjs } from "dayjs";
import { when } from "whendys";

export class PomoTimer {
	config: { duration: { break: number; work: number } };
	interval: NodeJS.Timer | undefined = undefined;
	initAt: dayjs.Dayjs;
	swapAt: dayjs.Dayjs;
	mode: "work" | "break";
	remaining: string;
	paused = false;
	pausedAt: Dayjs | undefined = undefined;

	constructor(init: Partial<PomoTimer>) {
		this.config = init.config || { duration: { break: 5, work: 25 } };
		this.initAt = dayjs();
		this.mode = init.mode || "work";
		this.swapAt = this.initAt.add(this.config.duration[this.mode], "minutes");
		this.remaining = when(this.initAt.toDate());
	}

	get percentage() {
		//@ts-ignore
		return (this.swapAt - this.initAt) / this.swapAt;
	}

	pause() {
		clearInterval(this.interval);
		this.paused = true;
		this.pausedAt = dayjs();
	}

	unpause() {
		if (this.paused && this.pausedAt) {
			const now = dayjs().valueOf();
			const start = this.pausedAt.valueOf();

			const secondsDiff = Math.floor((now - start) / 1000);
			this.swapAt = this.swapAt.add(secondsDiff, "seconds");
			console.log(secondsDiff);

			this.paused = false;
			this.initAt = dayjs();
			this.remaining = dayjs(this.swapAt.valueOf() - dayjs().valueOf()).format(
				"mm:ss",
			);
			this.start();
		}
	}

	switch() {
		const newMode = this.mode === "work" ? "break" : "work";
		this.mode = newMode;
		this.initAt = dayjs();
		this.swapAt = this.initAt.add(this.config.duration[newMode], "minutes");
		clearInterval(this.interval);
		this.remaining = dayjs(this.swapAt.valueOf() - dayjs().valueOf()).format(
			"mm:ss",
		);
		this.start();
	}

	start() {
		this.interval = setInterval(() => {
			this.remaining = dayjs(this.swapAt.valueOf() - dayjs().valueOf()).format(
				"mm:ss",
			);
			if (dayjs() === this.swapAt) {
				console.log("swapping mode");
				const newMode = this.mode === "work" ? "break" : "work";
				this.mode = newMode;
				this.initAt = dayjs();
				this.swapAt = dayjs().add(this.config.duration[this.mode], "minutes");
				return;
			}
		}, 1000);
	}
}
