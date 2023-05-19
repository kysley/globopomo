import dayjs, { Dayjs } from "dayjs";
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

interface PomodoroTimerOptions {
	workDuration: number; // in minutes
	breakDuration: number; // in minutes
	startedAt?: Date; // optional startedAt date
	mode?: 'work' | 'break'
}

class Globopomo {
	private workDuration: number;
	private breakDuration: number;
	private startedAt: Dayjs;
	private pausedAt: Dayjs | null;
	private isPaused: boolean;
	private isWorkMode: boolean;
	private timerId: NodeJS.Timeout | null;

	constructor({
		workDuration,
		breakDuration,
		startedAt,
		mode = 'work'
	}: PomodoroTimerOptions) {
		this.workDuration = workDuration * 60; // convert minutes to seconds
		this.breakDuration = breakDuration * 60; // convert minutes to seconds
		this.startedAt = dayjs(startedAt || new Date()).utc();
		this.pausedAt = null;
		this.isPaused = false;
		this.isWorkMode = mode === 'work';
		this.timerId = null;
	}

	public get mode() {
		return this.isWorkMode ? "work" : "break";
	}

	public get paused() {
		return this.isPaused;
	}

	public get info():PomodoroTimerOptions {
		return {
			startedAt: this.startedAt.toDate(),
			workDuration: this.workDuration / 60,
			breakDuration: this.breakDuration / 60,
			mode: this.mode
		};
	}

	private calculateTimeRemaining(): number {
		const duration = this.isWorkMode ? this.workDuration : this.breakDuration;
		const elapsedTime = this.pausedAt
			? this.pausedAt.diff(this.startedAt, "second")
			: dayjs().utc().diff(this.startedAt, "second");
		const timeRemaining = duration - elapsedTime;
		return Math.max(timeRemaining, 0);
	}

	private formatTime(duration: number): string {
		const minutes = Math.floor(duration / 60);
		const seconds = duration % 60;
		return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
			2,
			"0",
		)}`;
	}

	public getTimeRemaining(): string {
		if (this.isPaused) {
			return this.formatTime(this.calculateTimeRemaining());
		} else {
			const timeRemaining = this.calculateTimeRemaining();
			if (timeRemaining === 0) {
				this.toggleMode();
			}
			return this.formatTime(timeRemaining);
		}
	}

	public toggleMode(): void {
		this.isWorkMode = !this.isWorkMode;
		this.startedAt = dayjs().utc();
	}

	public pause(): void {
		if (!this.isPaused) {
			this.pausedAt = dayjs().utc();
			this.isPaused = true;
		}
	}

	public unpause(): void {
		if (this.isPaused) {
			const elapsedTime = dayjs().utc().diff(this.pausedAt, "second");
			this.startedAt = this.startedAt.add(elapsedTime, "second");
			this.pausedAt = null;
			this.isPaused = false;
		}
	}

	public skipMode(): void {
		this.toggleMode();
	}

  public run(): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }

    const remainingTime = this.calculateTimeRemaining();
    if (remainingTime === 0) {
      this.toggleMode();
      this.run();
      return;
    }

    this.timerId = setTimeout(() => {
      this.run();
    }, remainingTime * 1000);
  }
}
export { Globopomo };
