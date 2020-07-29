import { IDisposable } from 'vs/base/common/lifecycle'

export class TimeoutTimer implements IDisposable {
	private _token: any;

	constructor();
	constructor(runner: () => void, timeout: number);
	constructor(runner?: () => void, timeout?: number) {
		this._token = -1;

		if (typeof runner === 'function' && typeof timeout === 'number') {
			this.setIfNotSet(runner, timeout);
		}
	}

	dispose(): void {
		this.cancel();
	}

	cancel(): void {
		if (this._token !== -1) {
			clearTimeout(this._token);
			this._token = -1;
		}
	}

	cancelAndSet(runner: () => void, timeout: number): void {
		this.cancel();
		this._token = setTimeout(() => {
			this._token = -1;
			runner();
		}, timeout);
	}

	setIfNotSet(runner: () => void, timeout: number): void {
		if (this._token !== -1) {
			// timer is already set
			return;
		}
		this._token = setTimeout(() => {
			this._token = -1;
			runner();
		}, timeout);
	}
}
