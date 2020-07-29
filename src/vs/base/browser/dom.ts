import { IDisposable, Disposable } from 'vs/base/common/lifecycle';
import * as browser from 'vs/base/browser/browser';
import { TimeoutTimer } from 'vs/base/common/async';
import * as platform from 'vs/base/common/platform';
import { BrowserFeatures } from 'vs/base/browser/canIUse';
import { coalesce } from 'vs/base/common/arrays';

export function append<T extends Node>(parent: HTMLElement, ...children: T[]): T {
	children.forEach(child => parent.appendChild(child));
	return children[children.length - 1];
}

class DomListener implements IDisposable {

	private _handler: (e: any) => void;
	private _node: EventTarget;
	private readonly _type: string;
	private readonly _options: boolean | AddEventListenerOptions;

	constructor(node: EventTarget, type: string, handler: (e: any) => void, options?: boolean | AddEventListenerOptions) {
		this._node = node;
		this._type = type;
		this._handler = handler;
		this._options = (options || false);
		this._node.addEventListener(this._type, this._handler, this._options);
	}

	public dispose(): void {
		if (!this._handler) {
			// Already disposed
			return;
		}

		this._node.removeEventListener(this._type, this._handler, this._options);

		// Prevent leakers from holding on to the dom or handler func
		this._node = null!;
		this._handler = null!;
	}
}

export function addDisposableListener<K extends keyof GlobalEventHandlersEventMap>(node: EventTarget, type: K, handler: (event: GlobalEventHandlersEventMap[K]) => void, useCapture?: boolean): IDisposable;
export function addDisposableListener(node: EventTarget, type: string, handler: (event: any) => void, useCapture?: boolean): IDisposable;
export function addDisposableListener(node: EventTarget, type: string, handler: (event: any) => void, options: AddEventListenerOptions): IDisposable;
export function addDisposableListener(node: EventTarget, type: string, handler: (event: any) => void, useCaptureOrOptions?: boolean | AddEventListenerOptions): IDisposable {
	return new DomListener(node, type, handler, useCaptureOrOptions);
}

export function toggleClass(node: HTMLElement, className: string, shouldHaveIt?: boolean): void {
  if (node.classList) {
    node.classList.toggle(className, shouldHaveIt);
  }
}

export function addClass(node: HTMLElement, className: string): void {
  if (className && node.classList) {
    node.classList.add(className);
  }
}

export function removeClass(node: HTMLElement, className: string): void {
  if (className && node.classList) {
    node.classList.remove(className);
  }
}

export const EventType = {
	// Mouse
	CLICK: 'click',
	AUXCLICK: 'auxclick',
	DBLCLICK: 'dblclick',
	MOUSE_UP: 'mouseup',
	MOUSE_DOWN: 'mousedown',
	MOUSE_OVER: 'mouseover',
	MOUSE_MOVE: 'mousemove',
	MOUSE_OUT: 'mouseout',
	MOUSE_ENTER: 'mouseenter',
	MOUSE_LEAVE: 'mouseleave',
	MOUSE_WHEEL: browser.isEdge ? 'mousewheel' : 'wheel',
	POINTER_UP: 'pointerup',
	POINTER_DOWN: 'pointerdown',
	POINTER_MOVE: 'pointermove',
	CONTEXT_MENU: 'contextmenu',
	WHEEL: 'wheel',
	// Keyboard
	KEY_DOWN: 'keydown',
	KEY_PRESS: 'keypress',
	KEY_UP: 'keyup',
	// HTML Document
	LOAD: 'load',
	BEFORE_UNLOAD: 'beforeunload',
	UNLOAD: 'unload',
	ABORT: 'abort',
	ERROR: 'error',
	RESIZE: 'resize',
	SCROLL: 'scroll',
	FULLSCREEN_CHANGE: 'fullscreenchange',
	WK_FULLSCREEN_CHANGE: 'webkitfullscreenchange',
	// Form
	SELECT: 'select',
	CHANGE: 'change',
	SUBMIT: 'submit',
	RESET: 'reset',
	FOCUS: 'focus',
	FOCUS_IN: 'focusin',
	FOCUS_OUT: 'focusout',
	BLUR: 'blur',
	INPUT: 'input',
	// Local Storage
	STORAGE: 'storage',
	// Drag
	DRAG_START: 'dragstart',
	DRAG: 'drag',
	DRAG_ENTER: 'dragenter',
	DRAG_LEAVE: 'dragleave',
	DRAG_OVER: 'dragover',
	DROP: 'drop',
	DRAG_END: 'dragend',
	// Animation
	ANIMATION_START: browser.isWebKit ? 'webkitAnimationStart' : 'animationstart',
	ANIMATION_END: browser.isWebKit ? 'webkitAnimationEnd' : 'animationend',
	ANIMATION_ITERATION: browser.isWebKit ? 'webkitAnimationIteration' : 'animationiteration'
} as const;

export interface DOMEvent {
	preventDefault(): void;
	stopPropagation(): void;
}

/**
 * Add a throttled listener. `handler` is fired at most every 16ms or with the next animation frame (if browser supports it).
 */
export interface IEventMerger<R, E> {
	(lastEvent: R | null, currentEvent: E): R;
}

const MINIMUM_TIME_MS = 16;
const DEFAULT_EVENT_MERGER: IEventMerger<DOMEvent, DOMEvent> = function (lastEvent: DOMEvent | null, currentEvent: DOMEvent) {
	return currentEvent;
};

class TimeoutThrottledDomListener<R, E extends DOMEvent> extends Disposable {

	constructor(node: any, type: string, handler: (event: R) => void, eventMerger: IEventMerger<R, E> = <any>DEFAULT_EVENT_MERGER, minimumTimeMs: number = MINIMUM_TIME_MS) {
		super();

		let lastEvent: R | null = null;
		let lastHandlerTime = 0;
		let timeout = this._register(new TimeoutTimer());

		let invokeHandler = () => {
			lastHandlerTime = (new Date()).getTime();
			handler(<R>lastEvent);
			lastEvent = null;
		};

		this._register(addDisposableListener(node, type, (e) => {

			lastEvent = eventMerger(lastEvent, e);
			let elapsedTime = (new Date()).getTime() - lastHandlerTime;

			if (elapsedTime >= minimumTimeMs) {
				timeout.cancel();
				invokeHandler();
			} else {
				timeout.setIfNotSet(invokeHandler, minimumTimeMs - elapsedTime);
			}
		}));
	}
}

export function addDisposableThrottledListener<R, E extends DOMEvent = DOMEvent>(node: any, type: string, handler: (event: R) => void, eventMerger?: IEventMerger<R, E>, minimumTimeMs?: number): IDisposable {
	return new TimeoutThrottledDomListener<R, E>(node, type, handler, eventMerger, minimumTimeMs);
}

export function isShadowRoot(node: Node): node is ShadowRoot {
	return (
		node && !!(<ShadowRoot>node).host && !!(<ShadowRoot>node).mode
	);
}
export function getShadowRoot(domNode: Node): ShadowRoot | null {
	while (domNode.parentNode) {
		if (domNode === document.body) {
			// reached the body
			return null;
		}
		domNode = domNode.parentNode;
	}
	return isShadowRoot(domNode) ? domNode : null;
}

export function addDisposableGenericMouseDownListner(node: EventTarget, handler: (event: any) => void, useCapture?: boolean): IDisposable {
	return addDisposableListener(node, platform.isIOS && BrowserFeatures.pointerEvents ? EventType.POINTER_DOWN : EventType.MOUSE_DOWN, handler, useCapture);
}
export function addDisposableGenericMouseUpListner(node: EventTarget, handler: (event: any) => void, useCapture?: boolean): IDisposable {
	return addDisposableListener(node, platform.isIOS && BrowserFeatures.pointerEvents ? EventType.POINTER_UP : EventType.MOUSE_UP, handler, useCapture);
}

export interface IDomNodePagePosition {
	left: number;
	top: number;
	width: number;
	height: number;
}

/**
 * Returns the position of a dom node relative to the entire page.
 */
export function getDomNodePagePosition(domNode: HTMLElement): IDomNodePagePosition {
	let bb = domNode.getBoundingClientRect();
	return {
		left: bb.left + StandardWindow.scrollX,
		top: bb.top + StandardWindow.scrollY,
		width: bb.width,
		height: bb.height
	};
}

export interface IStandardWindow {
	readonly scrollX: number;
	readonly scrollY: number;
}

export const StandardWindow: IStandardWindow = new class implements IStandardWindow {
	get scrollX(): number {
		if (typeof window.scrollX === 'number') {
			// modern browsers
			return window.scrollX;
		} else {
			return document.body.scrollLeft + document.documentElement!.scrollLeft;
		}
	}

	get scrollY(): number {
		if (typeof window.scrollY === 'number') {
			// modern browsers
			return window.scrollY;
		} else {
			return document.body.scrollTop + document.documentElement!.scrollTop;
		}
	}
};

const SELECTOR_REGEX = /([\w\-]+)?(#([\w\-]+))?((.([\w\-]+))*)/;

export enum Namespace {
	HTML = 'http://www.w3.org/1999/xhtml',
	SVG = 'http://www.w3.org/2000/svg'
}

function _$<T extends Element>(namespace: Namespace, description: string, attrs?: { [key: string]: any; }, ...children: Array<Node | string>): T {
	let match = SELECTOR_REGEX.exec(description);

	if (!match) {
		throw new Error('Bad use of emmet');
	}

	attrs = { ...(attrs || {}) };

	let tagName = match[1] || 'div';
	let result: T;

	if (namespace !== Namespace.HTML) {
		result = document.createElementNS(namespace as string, tagName) as T;
	} else {
		result = document.createElement(tagName) as unknown as T;
	}

	if (match[3]) {
		result.id = match[3];
	}
	if (match[4]) {
		result.className = match[4].replace(/\./g, ' ').trim();
	}

	Object.keys(attrs).forEach(name => {
		const value = attrs![name];

		if (typeof value === 'undefined') {
			return;
		}

		if (/^on\w+$/.test(name)) {
			(<any>result)[name] = value;
		} else if (name === 'selected') {
			if (value) {
				result.setAttribute(name, 'true');
			}

		} else {
			result.setAttribute(name, value);
		}
	});

	coalesce(children)
		.forEach(child => {
			if (child instanceof Node) {
				result.appendChild(child);
			} else {
				result.appendChild(document.createTextNode(child as string));
			}
		});

	return result as T;
}

export function $<T extends HTMLElement>(description: string, attrs?: { [key: string]: any; }, ...children: Array<Node | string>): T {
	return _$(Namespace.HTML, description, attrs, ...children);
}

$.SVG = function <T extends SVGElement>(description: string, attrs?: { [key: string]: any; }, ...children: Array<Node | string>): T {
	return _$(Namespace.SVG, description, attrs, ...children);
};

// export function $(selector): Node {
// 	const node = document.createElement('div');
// 	node.className = selector.substring(1);
// 	return node;
// }
