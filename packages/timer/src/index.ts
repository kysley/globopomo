import dayjs, { Dayjs } from "dayjs";
import { when } from "whendys";

export class PomoTimer {
	config: { duration: { break: number; work: number } };
	interval: NodeJS.Timer | undefined = undefined;
	initAt: dayjs.Dayjs | undefined;
	swapAt: dayjs.Dayjs | undefined;
	mode: "work" | "break";
	remaining: string;
	paused = false;
	pausedAt: Dayjs | undefined = undefined;

	constructor(init: Partial<PomoTimer>) {
		this.config = init.config || { duration: { break: 1, work: 2 } };
		// this.initAt = init.initAt || dayjs();
		this.mode = init.mode || "work";
		// this.swapAt = this.initAt.add(this.config.duration[this.mode], "minutes");
		this.remaining = "wl:cm";
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
			this.swapAt = this.swapAt?.add(secondsDiff, "seconds");
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
		this.initAt = dayjs();
		this.swapAt = this.initAt.add(this.config.duration[this.mode], "minutes");

		this.remaining = dayjs(this.swapAt.valueOf() - dayjs().valueOf()).format(
			"mm:ss",
		);
		// console.log(this.remaining, dayjs().valueOf(), this.swapAt.valueOf());
		this.interval = setInterval(() => {
			// console.log(this.remaining, dayjs().valueOf(), this.swapAt.valueOf());
			const now = dayjs();
			if (now.valueOf() >= this.swapAt.valueOf()) {
				this.switch();
				return;
			}
			this.remaining = dayjs(this.swapAt.valueOf() - now.valueOf()).format(
				"mm:ss",
			);
		}, 1000);
	}
}
