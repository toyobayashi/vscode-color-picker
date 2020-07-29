import { LinkedList } from 'vs/base/common/linkedList'
import { IDisposable, DisposableStore } from 'vs/base/common/lifecycle'

export interface Event<T> {
	(listener: (e: T) => any, thisArgs?: any, disposables?: IDisposable[] | DisposableStore): IDisposable;
}

type Listener<T> = [(e: T) => void, any] | ((e: T) => void);

export class Emitter<T> {

	private static readonly _noop = function () { };

	private _disposed: boolean = false;
	private _event?: Event<T>;
	private _deliveryQueue?: LinkedList<[Listener<T>, T]>;
	protected _listeners?: LinkedList<Listener<T>>;

	/**
	 * For the public to allow to subscribe
	 * to events from this Emitter
	 */
	get event(): Event<T> {
		if (!this._event) {
			this._event = (listener: (e: T) => any, thisArgs?: any, disposables?: IDisposable[] | DisposableStore) => {
				if (!this._listeners) {
					this._listeners = new LinkedList();
				}

				const remove = this._listeners.push(!thisArgs ? listener : [listener, thisArgs]);

				let result: IDisposable;
				result = {
					dispose: () => {
						result.dispose = Emitter._noop;
						if (!this._disposed) {
							remove();
						}
					}
        };
        if (disposables instanceof DisposableStore) {
          disposables.add(result)
        } else if (Array.isArray(disposables)) {
					disposables.push(result);
				}

				return result;
			};
		}
		return this._event;
	}

	/**
	 * To be kept private to fire an event to
	 * subscribers
	 */
	fire(event: T): void {
		if (this._listeners) {
			// put all [listener,event]-pairs into delivery queue
			// then emit all event. an inner/nested event might be
			// the driver of this

			if (!this._deliveryQueue) {
				this._deliveryQueue = new LinkedList();
			}

			for (let listener of this._listeners) {
				this._deliveryQueue.push([listener, event]);
			}

			while (this._deliveryQueue.size > 0) {
				const [listener, event] = this._deliveryQueue.shift()!;
				try {
					if (typeof listener === 'function') {
						listener.call(undefined, event);
					} else {
						listener[0].call(listener[1], event);
					}
				} catch (e) {
					setTimeout(() => {
						if (e.stack) {
							throw new Error(e.message + '\n\n' + e.stack);
						}
		
						throw e;
					}, 0);
				}
			}
		}
	}

	dispose() {
		if (this._listeners) {
			this._listeners.clear();
		}
		if (this._deliveryQueue) {
			this._deliveryQueue.clear();
		}
		this._disposed = true;
	}
}