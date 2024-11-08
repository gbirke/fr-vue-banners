import { nextTick } from 'vue';
import { Timer } from '@src/utils/Timer';

export class TimerSpy implements Timer {
	public clearAllCalls: number = 0;
	public clearIntervalIds: number[] = [];
	public clearTimeoutIds: number[] = [];
	public nextTickCalls: number = 0;
	public setIntervalCalls: number[] = [];
	public setTimeoutCalls: number[] = [];

	private _interval: () => void;

	public clearAll(): void {
		this.clearAllCalls++;
	}

	public clearInterval( id: number ): void {
		this.clearIntervalIds.push( id );
	}

	public clearTimeout( id: number ): void {
		this.clearTimeoutIds.push( id );
	}

	public nextTick( fn: () => void ): void {
		this.nextTickCalls++;
		fn();
	}

	public setInterval( fn: () => void, after: number ): number {
		this.setIntervalCalls.push( after );
		this._interval = fn;
		return 0;
	}

	public setTimeout( fn: () => void, after: number ): number {
		this.setTimeoutCalls.push( after );
		fn();
		return 0;
	}

	public async advanceInterval(): Promise<void> {
		this._interval();
		return await nextTick();
	}
}
