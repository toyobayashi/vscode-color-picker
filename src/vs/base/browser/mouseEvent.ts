import { IframeUtils } from 'vs/base/browser/iframe'

export interface IMouseEvent {
	readonly browserEvent: MouseEvent;
	readonly leftButton: boolean;
	readonly middleButton: boolean;
	readonly rightButton: boolean;
	readonly buttons: number;
	readonly target: HTMLElement;
	readonly detail: number;
	readonly posx: number;
	readonly posy: number;
	readonly ctrlKey: boolean;
	readonly shiftKey: boolean;
	readonly altKey: boolean;
	readonly metaKey: boolean;
	readonly timestamp: number;

	preventDefault(): void;
	stopPropagation(): void;
}

export class StandardMouseEvent implements IMouseEvent {

	public readonly browserEvent: MouseEvent;

	public readonly leftButton: boolean;
	public readonly middleButton: boolean;
	public readonly rightButton: boolean;
	public readonly buttons: number;
	public readonly target: HTMLElement;
	public detail: number;
	public readonly posx: number;
	public readonly posy: number;
	public readonly ctrlKey: boolean;
	public readonly shiftKey: boolean;
	public readonly altKey: boolean;
	public readonly metaKey: boolean;
	public readonly timestamp: number;

	constructor(e: MouseEvent) {
		this.timestamp = Date.now();
		this.browserEvent = e;
		this.leftButton = e.button === 0;
		this.middleButton = e.button === 1;
		this.rightButton = e.button === 2;
		this.buttons = e.buttons;

		this.target = <HTMLElement>e.target;

		this.detail = e.detail || 1;
		if (e.type === 'dblclick') {
			this.detail = 2;
		}
		this.ctrlKey = e.ctrlKey;
		this.shiftKey = e.shiftKey;
		this.altKey = e.altKey;
		this.metaKey = e.metaKey;

		if (typeof e.pageX === 'number') {
			this.posx = e.pageX;
			this.posy = e.pageY;
		} else {
			// Probably hit by MSGestureEvent
			this.posx = e.clientX + document.body.scrollLeft + document.documentElement!.scrollLeft;
			this.posy = e.clientY + document.body.scrollTop + document.documentElement!.scrollTop;
		}

		// Find the position of the iframe this code is executing in relative to the iframe where the event was captured.
		let iframeOffsets = IframeUtils.getPositionOfChildWindowRelativeToAncestorWindow(self, e.view);
		this.posx -= iframeOffsets.left;
		this.posy -= iframeOffsets.top;
	}

	public preventDefault(): void {
		this.browserEvent.preventDefault();
	}

	public stopPropagation(): void {
		this.browserEvent.stopPropagation();
	}
}
