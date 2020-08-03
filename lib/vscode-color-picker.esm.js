/**
 * Enables logging of potentially leaked disposables.
 *
 * A disposable is considered leaked if it is not disposed or not registered as the child of
 * another disposable. This tracking is very simple an only works for classes that either
 * extend Disposable or use a DisposableStore. This means there are a lot of false positives.
 */
var DisposableStore = /** @class */ (function () {
    function DisposableStore() {
        this._toDispose = new Set();
        this._isDisposed = false;
    }
    /**
     * Dispose of all registered disposables and mark this object as disposed.
     *
     * Any future disposables added to this object will be disposed of on `add`.
     */
    DisposableStore.prototype.dispose = function () {
        if (this._isDisposed) {
            return;
        }
        this._isDisposed = true;
        this.clear();
    };
    /**
     * Dispose of all registered disposables but do not mark this object as disposed.
     */
    DisposableStore.prototype.clear = function () {
        this._toDispose.forEach(function (item) { return item.dispose(); });
        this._toDispose.clear();
    };
    DisposableStore.prototype.add = function (t) {
        if (!t) {
            return t;
        }
        if (t === this) {
            throw new Error('Cannot register a disposable on itself!');
        }
        if (this._isDisposed) {
            if (!DisposableStore.DISABLE_DISPOSED_WARNING) {
                console.warn(new Error('Trying to add a disposable to a DisposableStore that has already been disposed of. The added object will be leaked!').stack);
            }
        }
        else {
            this._toDispose.add(t);
        }
        return t;
    };
    DisposableStore.DISABLE_DISPOSED_WARNING = false;
    return DisposableStore;
}());
var Disposable = /** @class */ (function () {
    function Disposable() {
        this._store = new DisposableStore();
    }
    Disposable.prototype.dispose = function () {
        this._store.dispose();
    };
    Disposable.prototype._register = function (t) {
        if (t === this) {
            throw new Error('Cannot register a disposable on itself!');
        }
        return this._store.add(t);
    };
    Disposable.None = Object.freeze({ dispose: function () { } });
    return Disposable;
}());

var TimeoutTimer = /** @class */ (function () {
    function TimeoutTimer(runner, timeout) {
        this._token = -1;
        if (typeof runner === 'function' && typeof timeout === 'number') {
            this.setIfNotSet(runner, timeout);
        }
    }
    TimeoutTimer.prototype.dispose = function () {
        this.cancel();
    };
    TimeoutTimer.prototype.cancel = function () {
        if (this._token !== -1) {
            clearTimeout(this._token);
            this._token = -1;
        }
    };
    TimeoutTimer.prototype.cancelAndSet = function (runner, timeout) {
        var _this = this;
        this.cancel();
        this._token = setTimeout(function () {
            _this._token = -1;
            runner();
        }, timeout);
    };
    TimeoutTimer.prototype.setIfNotSet = function (runner, timeout) {
        var _this = this;
        if (this._token !== -1) {
            // timer is already set
            return;
        }
        this._token = setTimeout(function () {
            _this._token = -1;
            runner();
        }, timeout);
    };
    return TimeoutTimer;
}());

var _userAgent = navigator.userAgent;
var isIOS = (_userAgent.indexOf('Macintosh') >= 0 || _userAgent.indexOf('iPad') >= 0 || _userAgent.indexOf('iPhone') >= 0) && !!navigator.maxTouchPoints && navigator.maxTouchPoints > 0;

/**
 * Browser feature we can support in current platform, browser and environment.
 */
var BrowserFeatures = {
    pointerEvents: window.PointerEvent && ('ontouchstart' in window || window.navigator.maxTouchPoints > 0 || navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0)
};

/**
 * @returns New array with all falsy values removed. The original array IS NOT modified.
 */
function coalesce(array) {
    return array.filter(function (e) { return !!e; });
}

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
function append(parent) {
    var children = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        children[_i - 1] = arguments[_i];
    }
    children.forEach(function (child) { return parent.appendChild(child); });
    return children[children.length - 1];
}
var DomListener = /** @class */ (function () {
    function DomListener(node, type, handler, options) {
        this._node = node;
        this._type = type;
        this._handler = handler;
        this._options = (options || false);
        this._node.addEventListener(this._type, this._handler, this._options);
    }
    DomListener.prototype.dispose = function () {
        if (!this._handler) {
            // Already disposed
            return;
        }
        this._node.removeEventListener(this._type, this._handler, this._options);
        // Prevent leakers from holding on to the dom or handler func
        this._node = null;
        this._handler = null;
    };
    return DomListener;
}());
function addDisposableListener(node, type, handler, useCaptureOrOptions) {
    return new DomListener(node, type, handler, useCaptureOrOptions);
}
function toggleClass(node, className, shouldHaveIt) {
    if (node.classList) {
        node.classList.toggle(className, shouldHaveIt);
    }
}
function addClass(node, className) {
    if (className && node.classList) {
        node.classList.add(className);
    }
}
function removeClass(node, className) {
    if (className && node.classList) {
        node.classList.remove(className);
    }
}
var EventType = {
    // Mouse
    CLICK: 'click',
    // AUXCLICK: 'auxclick',
    // DBLCLICK: 'dblclick',
    MOUSE_UP: 'mouseup',
    MOUSE_DOWN: 'mousedown',
    // MOUSE_OVER: 'mouseover',
    // MOUSE_MOVE: 'mousemove',
    // MOUSE_OUT: 'mouseout',
    // MOUSE_ENTER: 'mouseenter',
    // MOUSE_LEAVE: 'mouseleave',
    // MOUSE_WHEEL: browser.isEdge ? 'mousewheel' : 'wheel',
    POINTER_UP: 'pointerup',
    POINTER_DOWN: 'pointerdown'
    // POINTER_MOVE: 'pointermove',
    // CONTEXT_MENU: 'contextmenu',
    // WHEEL: 'wheel',
    // Keyboard
    // KEY_DOWN: 'keydown',
    // KEY_PRESS: 'keypress',
    // KEY_UP: 'keyup',
    // HTML Document
    // LOAD: 'load',
    // BEFORE_UNLOAD: 'beforeunload',
    // UNLOAD: 'unload',
    // ABORT: 'abort',
    // ERROR: 'error',
    // RESIZE: 'resize',
    // SCROLL: 'scroll',
    // FULLSCREEN_CHANGE: 'fullscreenchange',
    // WK_FULLSCREEN_CHANGE: 'webkitfullscreenchange',
    // Form
    // SELECT: 'select',
    // CHANGE: 'change',
    // SUBMIT: 'submit',
    // RESET: 'reset',
    // FOCUS: 'focus',
    // FOCUS_IN: 'focusin',
    // FOCUS_OUT: 'focusout',
    // BLUR: 'blur',
    // INPUT: 'input',
    // Local Storage
    // STORAGE: 'storage',
    // Drag
    // DRAG_START: 'dragstart',
    // DRAG: 'drag',
    // DRAG_ENTER: 'dragenter',
    // DRAG_LEAVE: 'dragleave',
    // DRAG_OVER: 'dragover',
    // DROP: 'drop',
    // DRAG_END: 'dragend',
    // Animation
    // ANIMATION_START: browser.isWebKit ? 'webkitAnimationStart' : 'animationstart',
    // ANIMATION_END: browser.isWebKit ? 'webkitAnimationEnd' : 'animationend',
    // ANIMATION_ITERATION: browser.isWebKit ? 'webkitAnimationIteration' : 'animationiteration'
};
var MINIMUM_TIME_MS = 16;
var DEFAULT_EVENT_MERGER = function (lastEvent, currentEvent) {
    return currentEvent;
};
var TimeoutThrottledDomListener = /** @class */ (function (_super) {
    __extends(TimeoutThrottledDomListener, _super);
    function TimeoutThrottledDomListener(node, type, handler, eventMerger, minimumTimeMs) {
        if (eventMerger === void 0) { eventMerger = DEFAULT_EVENT_MERGER; }
        if (minimumTimeMs === void 0) { minimumTimeMs = MINIMUM_TIME_MS; }
        var _this = _super.call(this) || this;
        var lastEvent = null;
        var lastHandlerTime = 0;
        var timeout = _this._register(new TimeoutTimer());
        var invokeHandler = function () {
            lastHandlerTime = (new Date()).getTime();
            handler(lastEvent);
            lastEvent = null;
        };
        _this._register(addDisposableListener(node, type, function (e) {
            lastEvent = eventMerger(lastEvent, e);
            var elapsedTime = (new Date()).getTime() - lastHandlerTime;
            if (elapsedTime >= minimumTimeMs) {
                timeout.cancel();
                invokeHandler();
            }
            else {
                timeout.setIfNotSet(invokeHandler, minimumTimeMs - elapsedTime);
            }
        }));
        return _this;
    }
    return TimeoutThrottledDomListener;
}(Disposable));
function addDisposableThrottledListener(node, type, handler, eventMerger, minimumTimeMs) {
    return new TimeoutThrottledDomListener(node, type, handler, eventMerger, minimumTimeMs);
}
function isShadowRoot(node) {
    return (node && !!node.host && !!node.mode);
}
function getShadowRoot(domNode) {
    while (domNode.parentNode) {
        if (domNode === document.body) {
            // reached the body
            return null;
        }
        domNode = domNode.parentNode;
    }
    return isShadowRoot(domNode) ? domNode : null;
}
function addDisposableGenericMouseDownListner(node, handler, useCapture) {
    return addDisposableListener(node, isIOS && BrowserFeatures.pointerEvents ? EventType.POINTER_DOWN : EventType.MOUSE_DOWN, handler, useCapture);
}
function addDisposableGenericMouseUpListner(node, handler, useCapture) {
    return addDisposableListener(node, isIOS && BrowserFeatures.pointerEvents ? EventType.POINTER_UP : EventType.MOUSE_UP, handler, useCapture);
}
/**
 * Returns the position of a dom node relative to the entire page.
 */
function getDomNodePagePosition(domNode) {
    var bb = domNode.getBoundingClientRect();
    return {
        left: bb.left + StandardWindow.scrollX,
        top: bb.top + StandardWindow.scrollY,
        width: bb.width,
        height: bb.height
    };
}
var StandardWindow = new /** @class */ (function () {
    function class_1() {
    }
    Object.defineProperty(class_1.prototype, "scrollX", {
        get: function () {
            if (typeof window.scrollX === 'number') {
                // modern browsers
                return window.scrollX;
            }
            else {
                return document.body.scrollLeft + document.documentElement.scrollLeft;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(class_1.prototype, "scrollY", {
        get: function () {
            if (typeof window.scrollY === 'number') {
                // modern browsers
                return window.scrollY;
            }
            else {
                return document.body.scrollTop + document.documentElement.scrollTop;
            }
        },
        enumerable: false,
        configurable: true
    });
    return class_1;
}());
var SELECTOR_REGEX = /([\w\-]+)?(#([\w\-]+))?((.([\w\-]+))*)/;
var Namespace;
(function (Namespace) {
    Namespace["HTML"] = "http://www.w3.org/1999/xhtml";
    Namespace["SVG"] = "http://www.w3.org/2000/svg";
})(Namespace || (Namespace = {}));
function _$(namespace, description, attrs) {
    var children = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        children[_i - 3] = arguments[_i];
    }
    var match = SELECTOR_REGEX.exec(description);
    if (!match) {
        throw new Error('Bad use of emmet');
    }
    attrs = __assign({}, (attrs || {}));
    var tagName = match[1] || 'div';
    var result;
    if (namespace !== Namespace.HTML) {
        result = document.createElementNS(namespace, tagName);
    }
    else {
        result = document.createElement(tagName);
    }
    if (match[3]) {
        result.id = match[3];
    }
    if (match[4]) {
        result.className = match[4].replace(/\./g, ' ').trim();
    }
    Object.keys(attrs).forEach(function (name) {
        var value = attrs[name];
        if (typeof value === 'undefined') {
            return;
        }
        if (/^on\w+$/.test(name)) {
            result[name] = value;
        }
        else if (name === 'selected') {
            if (value) {
                result.setAttribute(name, 'true');
            }
        }
        else {
            result.setAttribute(name, value);
        }
    });
    coalesce(children)
        .forEach(function (child) {
        if (child instanceof Node) {
            result.appendChild(child);
        }
        else {
            result.appendChild(document.createTextNode(child));
        }
    });
    return result;
}
function $(description, attrs) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    return _$.apply(void 0, __spread([Namespace.HTML, description, attrs], children));
}
$.SVG = function (description, attrs) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    return _$.apply(void 0, __spread([Namespace.SVG, description, attrs], children));
};
// export function $(selector): Node {
// 	const node = document.createElement('div');
// 	node.className = selector.substring(1);
// 	return node;
// }

var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var hasDifferentOriginAncestorFlag = false;
var sameOriginWindowChainCache = null;
function getParentWindowIfSameOrigin(w) {
    if (!w.parent || w.parent === w) {
        return null;
    }
    // Cannot really tell if we have access to the parent window unless we try to access something in it
    try {
        var location_1 = w.location;
        var parentLocation = w.parent.location;
        if (location_1.protocol !== parentLocation.protocol || location_1.hostname !== parentLocation.hostname || location_1.port !== parentLocation.port) {
            hasDifferentOriginAncestorFlag = true;
            return null;
        }
    }
    catch (e) {
        hasDifferentOriginAncestorFlag = true;
        return null;
    }
    return w.parent;
}
function findIframeElementInParentWindow(parentWindow, childWindow) {
    var parentWindowIframes = parentWindow.document.getElementsByTagName('iframe');
    var iframe;
    for (var i = 0, len = parentWindowIframes.length; i < len; i++) {
        iframe = parentWindowIframes[i];
        if (iframe.contentWindow === childWindow) {
            return iframe;
        }
    }
    return null;
}
var IframeUtils = /** @class */ (function () {
    function IframeUtils() {
    }
    /**
     * Returns a chain of embedded windows with the same origin (which can be accessed programmatically).
     * Having a chain of length 1 might mean that the current execution environment is running outside of an iframe or inside an iframe embedded in a window with a different origin.
     * To distinguish if at one point the current execution environment is running inside a window with a different origin, see hasDifferentOriginAncestor()
     */
    IframeUtils.getSameOriginWindowChain = function () {
        if (!sameOriginWindowChainCache) {
            sameOriginWindowChainCache = [];
            var w = window;
            var parent_1;
            do {
                parent_1 = getParentWindowIfSameOrigin(w);
                if (parent_1) {
                    sameOriginWindowChainCache.push({
                        window: w,
                        iframeElement: findIframeElementInParentWindow(parent_1, w)
                    });
                }
                else {
                    sameOriginWindowChainCache.push({
                        window: w,
                        iframeElement: null
                    });
                }
                w = parent_1;
            } while (w);
        }
        return sameOriginWindowChainCache.slice(0);
    };
    /**
       * Returns true if the current execution environment is chained in a list of iframes which at one point ends in a window with a different origin.
       * Returns false if the current execution environment is not running inside an iframe or if the entire chain of iframes have the same origin.
       */
    IframeUtils.hasDifferentOriginAncestor = function () {
        if (!sameOriginWindowChainCache) {
            this.getSameOriginWindowChain();
        }
        return hasDifferentOriginAncestorFlag;
    };
    /**
     * Returns the position of `childWindow` relative to `ancestorWindow`
     */
    IframeUtils.getPositionOfChildWindowRelativeToAncestorWindow = function (childWindow, ancestorWindow) {
        var e_1, _a;
        if (!ancestorWindow || childWindow === ancestorWindow) {
            return {
                top: 0,
                left: 0
            };
        }
        var top = 0, left = 0;
        var windowChain = this.getSameOriginWindowChain();
        try {
            for (var windowChain_1 = __values(windowChain), windowChain_1_1 = windowChain_1.next(); !windowChain_1_1.done; windowChain_1_1 = windowChain_1.next()) {
                var windowChainEl = windowChain_1_1.value;
                if (windowChainEl.window === ancestorWindow) {
                    break;
                }
                if (!windowChainEl.iframeElement) {
                    break;
                }
                var boundingRect = windowChainEl.iframeElement.getBoundingClientRect();
                top += boundingRect.top;
                left += boundingRect.left;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (windowChain_1_1 && !windowChain_1_1.done && (_a = windowChain_1.return)) _a.call(windowChain_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return {
            top: top,
            left: left
        };
    };
    return IframeUtils;
}());

var StandardMouseEvent = /** @class */ (function () {
    function StandardMouseEvent(e) {
        this.timestamp = Date.now();
        this.browserEvent = e;
        this.leftButton = e.button === 0;
        this.middleButton = e.button === 1;
        this.rightButton = e.button === 2;
        this.buttons = e.buttons;
        this.target = e.target;
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
        }
        else {
            // Probably hit by MSGestureEvent
            this.posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            this.posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        // Find the position of the iframe this code is executing in relative to the iframe where the event was captured.
        var iframeOffsets = IframeUtils.getPositionOfChildWindowRelativeToAncestorWindow(self, e.view);
        this.posx -= iframeOffsets.left;
        this.posy -= iframeOffsets.top;
    }
    StandardMouseEvent.prototype.preventDefault = function () {
        this.browserEvent.preventDefault();
    };
    StandardMouseEvent.prototype.stopPropagation = function () {
        this.browserEvent.stopPropagation();
    };
    return StandardMouseEvent;
}());

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __values$1 = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
function standardMouseMoveMerger(lastEvent, currentEvent) {
    var ev = new StandardMouseEvent(currentEvent);
    ev.preventDefault();
    return {
        leftButton: ev.leftButton,
        buttons: ev.buttons,
        posx: ev.posx,
        posy: ev.posy
    };
}
var GlobalMouseMoveMonitor = /** @class */ (function () {
    function GlobalMouseMoveMonitor() {
        this._hooks = new DisposableStore();
        this._mouseMoveEventMerger = null;
        this._mouseMoveCallback = null;
        this._onStopCallback = null;
    }
    GlobalMouseMoveMonitor.prototype.dispose = function () {
        this.stopMonitoring(false);
        this._hooks.dispose();
    };
    GlobalMouseMoveMonitor.prototype.stopMonitoring = function (invokeStopCallback) {
        if (!this.isMonitoring()) {
            // Not monitoring
            return;
        }
        // Unhook
        this._hooks.clear();
        this._mouseMoveEventMerger = null;
        this._mouseMoveCallback = null;
        var onStopCallback = this._onStopCallback;
        this._onStopCallback = null;
        if (invokeStopCallback && onStopCallback) {
            onStopCallback();
        }
    };
    GlobalMouseMoveMonitor.prototype.isMonitoring = function () {
        return !!this._mouseMoveEventMerger;
    };
    GlobalMouseMoveMonitor.prototype.startMonitoring = function (initialElement, initialButtons, mouseMoveEventMerger, mouseMoveCallback, onStopCallback) {
        var e_1, _a;
        var _this = this;
        if (this.isMonitoring()) {
            // I am already hooked
            return;
        }
        this._mouseMoveEventMerger = mouseMoveEventMerger;
        this._mouseMoveCallback = mouseMoveCallback;
        this._onStopCallback = onStopCallback;
        var windowChain = IframeUtils.getSameOriginWindowChain();
        var mouseMove = isIOS && BrowserFeatures.pointerEvents ? 'pointermove' : 'mousemove';
        var mouseUp = isIOS && BrowserFeatures.pointerEvents ? 'pointerup' : 'mouseup';
        var listenTo = windowChain.map(function (element) { return element.window.document; });
        var shadowRoot = getShadowRoot(initialElement);
        if (shadowRoot) {
            listenTo.unshift(shadowRoot);
        }
        try {
            for (var listenTo_1 = __values$1(listenTo), listenTo_1_1 = listenTo_1.next(); !listenTo_1_1.done; listenTo_1_1 = listenTo_1.next()) {
                var element = listenTo_1_1.value;
                this._hooks.add(addDisposableThrottledListener(element, mouseMove, function (data) {
                    if (data.buttons !== initialButtons) {
                        // Buttons state has changed in the meantime
                        _this.stopMonitoring(true);
                        return;
                    }
                    _this._mouseMoveCallback(data);
                }, function (lastEvent, currentEvent) { return _this._mouseMoveEventMerger(lastEvent, currentEvent); }));
                this._hooks.add(addDisposableListener(element, mouseUp, function (e) { return _this.stopMonitoring(true); }));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (listenTo_1_1 && !listenTo_1_1.done && (_a = listenTo_1.return)) _a.call(listenTo_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (IframeUtils.hasDifferentOriginAncestor()) {
            var lastSameOriginAncestor = windowChain[windowChain.length - 1];
            // We might miss a mouse up if it happens outside the iframe
            // This one is for Chrome
            this._hooks.add(addDisposableListener(lastSameOriginAncestor.window.document, 'mouseout', function (browserEvent) {
                var e = new StandardMouseEvent(browserEvent);
                if (e.target.tagName.toLowerCase() === 'html') {
                    _this.stopMonitoring(true);
                }
            }));
            // This one is for FF
            this._hooks.add(addDisposableListener(lastSameOriginAncestor.window.document, 'mouseover', function (browserEvent) {
                var e = new StandardMouseEvent(browserEvent);
                if (e.target.tagName.toLowerCase() === 'html') {
                    _this.stopMonitoring(true);
                }
            }));
            // This one is for IE
            this._hooks.add(addDisposableListener(lastSameOriginAncestor.window.document.body, 'mouseleave', function (browserEvent) {
                _this.stopMonitoring(true);
            }));
        }
    };
    return GlobalMouseMoveMonitor;
}());

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __read$1 = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
function roundFloat(number, decimalPoints) {
    var decimal = Math.pow(10, decimalPoints);
    return Math.round(number * decimal) / decimal;
}
var RGBA = /** @class */ (function () {
    function RGBA(r, g, b, a) {
        if (a === void 0) { a = 1; }
        this.r = Math.min(255, Math.max(0, r)) | 0;
        this.g = Math.min(255, Math.max(0, g)) | 0;
        this.b = Math.min(255, Math.max(0, b)) | 0;
        this.a = roundFloat(Math.max(Math.min(1, a), 0), 3);
    }
    RGBA.equals = function (a, b) {
        return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;
    };
    return RGBA;
}());
var HSLA = /** @class */ (function () {
    function HSLA(h, s, l, a) {
        this.h = Math.max(Math.min(360, h), 0) | 0;
        this.s = roundFloat(Math.max(Math.min(1, s), 0), 3);
        this.l = roundFloat(Math.max(Math.min(1, l), 0), 3);
        this.a = roundFloat(Math.max(Math.min(1, a), 0), 3);
    }
    HSLA.equals = function (a, b) {
        return a.h === b.h && a.s === b.s && a.l === b.l && a.a === b.a;
    };
    /**
     * Converts an RGB color value to HSL. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes r, g, and b are contained in the set [0, 255] and
     * returns h in the set [0, 360], s, and l in the set [0, 1].
     */
    HSLA.fromRGBA = function (rgba) {
        var r = rgba.r / 255;
        var g = rgba.g / 255;
        var b = rgba.b / 255;
        var a = rgba.a;
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var h = 0;
        var s = 0;
        var l = (min + max) / 2;
        var chroma = max - min;
        if (chroma > 0) {
            s = Math.min((l <= 0.5 ? chroma / (2 * l) : chroma / (2 - (2 * l))), 1);
            switch (max) {
                case r:
                    h = (g - b) / chroma + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / chroma + 2;
                    break;
                case b:
                    h = (r - g) / chroma + 4;
                    break;
            }
            h *= 60;
            h = Math.round(h);
        }
        return new HSLA(h, s, l, a);
    };
    HSLA._hue2rgb = function (p, q, t) {
        if (t < 0) {
            t += 1;
        }
        if (t > 1) {
            t -= 1;
        }
        if (t < 1 / 6) {
            return p + (q - p) * 6 * t;
        }
        if (t < 1 / 2) {
            return q;
        }
        if (t < 2 / 3) {
            return p + (q - p) * (2 / 3 - t) * 6;
        }
        return p;
    };
    /**
     * Converts an HSL color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes h in the set [0, 360] s, and l are contained in the set [0, 1] and
     * returns r, g, and b in the set [0, 255].
     */
    HSLA.toRGBA = function (hsla) {
        var h = hsla.h / 360;
        var s = hsla.s, l = hsla.l, a = hsla.a;
        var r, g, b;
        if (s === 0) {
            r = g = b = l; // achromatic
        }
        else {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = HSLA._hue2rgb(p, q, h + 1 / 3);
            g = HSLA._hue2rgb(p, q, h);
            b = HSLA._hue2rgb(p, q, h - 1 / 3);
        }
        return new RGBA(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a);
    };
    return HSLA;
}());
var HSVA = /** @class */ (function () {
    function HSVA(h, s, v, a) {
        this.h = Math.max(Math.min(360, h), 0) | 0;
        this.s = roundFloat(Math.max(Math.min(1, s), 0), 3);
        this.v = roundFloat(Math.max(Math.min(1, v), 0), 3);
        this.a = roundFloat(Math.max(Math.min(1, a), 0), 3);
    }
    HSVA.equals = function (a, b) {
        return a.h === b.h && a.s === b.s && a.v === b.v && a.a === b.a;
    };
    // from http://www.rapidtables.com/convert/color/rgb-to-hsv.htm
    HSVA.fromRGBA = function (rgba) {
        var r = rgba.r / 255;
        var g = rgba.g / 255;
        var b = rgba.b / 255;
        var cmax = Math.max(r, g, b);
        var cmin = Math.min(r, g, b);
        var delta = cmax - cmin;
        var s = cmax === 0 ? 0 : (delta / cmax);
        var m;
        if (delta === 0) {
            m = 0;
        }
        else if (cmax === r) {
            m = ((((g - b) / delta) % 6) + 6) % 6;
        }
        else if (cmax === g) {
            m = ((b - r) / delta) + 2;
        }
        else {
            m = ((r - g) / delta) + 4;
        }
        return new HSVA(Math.round(m * 60), s, cmax, rgba.a);
    };
    // from http://www.rapidtables.com/convert/color/hsv-to-rgb.htm
    HSVA.toRGBA = function (hsva) {
        var h = hsva.h, s = hsva.s, v = hsva.v, a = hsva.a;
        var c = v * s;
        var x = c * (1 - Math.abs((h / 60) % 2 - 1));
        var m = v - c;
        var _a = __read$1([0, 0, 0], 3), r = _a[0], g = _a[1], b = _a[2];
        if (h < 60) {
            r = c;
            g = x;
        }
        else if (h < 120) {
            r = x;
            g = c;
        }
        else if (h < 180) {
            g = c;
            b = x;
        }
        else if (h < 240) {
            g = x;
            b = c;
        }
        else if (h < 300) {
            r = x;
            b = c;
        }
        else if (h < 360) {
            r = c;
            b = x;
        }
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);
        return new RGBA(r, g, b, a);
    };
    return HSVA;
}());
var Color = /** @class */ (function () {
    function Color(arg) {
        if (!arg) {
            throw new Error('Color needs a value');
        }
        else if (arg instanceof RGBA) {
            this.rgba = arg;
        }
        else if (arg instanceof HSLA) {
            this._hsla = arg;
            this.rgba = HSLA.toRGBA(arg);
        }
        else if (arg instanceof HSVA) {
            this._hsva = arg;
            this.rgba = HSVA.toRGBA(arg);
        }
        else {
            throw new Error('Invalid color ctor argument');
        }
    }
    Color.fromHex = function (hex) {
        return Color.Format.CSS.parseHex(hex) || Color.red;
    };
    Object.defineProperty(Color.prototype, "hsla", {
        get: function () {
            if (this._hsla) {
                return this._hsla;
            }
            else {
                return HSLA.fromRGBA(this.rgba);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "hsva", {
        get: function () {
            if (this._hsva) {
                return this._hsva;
            }
            return HSVA.fromRGBA(this.rgba);
        },
        enumerable: false,
        configurable: true
    });
    Color.prototype.equals = function (other) {
        return !!other && RGBA.equals(this.rgba, other.rgba) && HSLA.equals(this.hsla, other.hsla) && HSVA.equals(this.hsva, other.hsva);
    };
    /**
     * http://www.w3.org/TR/WCAG20/#relativeluminancedef
     * Returns the number in the set [0, 1]. O => Darkest Black. 1 => Lightest white.
     */
    Color.prototype.getRelativeLuminance = function () {
        var R = Color._relativeLuminanceForComponent(this.rgba.r);
        var G = Color._relativeLuminanceForComponent(this.rgba.g);
        var B = Color._relativeLuminanceForComponent(this.rgba.b);
        var luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;
        return roundFloat(luminance, 4);
    };
    Color._relativeLuminanceForComponent = function (color) {
        var c = color / 255;
        return (c <= 0.03928) ? c / 12.92 : Math.pow(((c + 0.055) / 1.055), 2.4);
    };
    /**
     * http://www.w3.org/TR/WCAG20/#contrast-ratiodef
     * Returns the contrast ration number in the set [1, 21].
     */
    Color.prototype.getContrastRatio = function (another) {
        var lum1 = this.getRelativeLuminance();
        var lum2 = another.getRelativeLuminance();
        return lum1 > lum2 ? (lum1 + 0.05) / (lum2 + 0.05) : (lum2 + 0.05) / (lum1 + 0.05);
    };
    /**
     *	http://24ways.org/2010/calculating-color-contrast
     *  Return 'true' if darker color otherwise 'false'
     */
    Color.prototype.isDarker = function () {
        var yiq = (this.rgba.r * 299 + this.rgba.g * 587 + this.rgba.b * 114) / 1000;
        return yiq < 128;
    };
    /**
     *	http://24ways.org/2010/calculating-color-contrast
     *  Return 'true' if lighter color otherwise 'false'
     */
    Color.prototype.isLighter = function () {
        var yiq = (this.rgba.r * 299 + this.rgba.g * 587 + this.rgba.b * 114) / 1000;
        return yiq >= 128;
    };
    Color.prototype.isLighterThan = function (another) {
        var lum1 = this.getRelativeLuminance();
        var lum2 = another.getRelativeLuminance();
        return lum1 > lum2;
    };
    Color.prototype.isDarkerThan = function (another) {
        var lum1 = this.getRelativeLuminance();
        var lum2 = another.getRelativeLuminance();
        return lum1 < lum2;
    };
    Color.prototype.lighten = function (factor) {
        return new Color(new HSLA(this.hsla.h, this.hsla.s, this.hsla.l + this.hsla.l * factor, this.hsla.a));
    };
    Color.prototype.darken = function (factor) {
        return new Color(new HSLA(this.hsla.h, this.hsla.s, this.hsla.l - this.hsla.l * factor, this.hsla.a));
    };
    Color.prototype.transparent = function (factor) {
        var _a = this.rgba, r = _a.r, g = _a.g, b = _a.b, a = _a.a;
        return new Color(new RGBA(r, g, b, a * factor));
    };
    Color.prototype.isTransparent = function () {
        return this.rgba.a === 0;
    };
    Color.prototype.isOpaque = function () {
        return this.rgba.a === 1;
    };
    Color.prototype.opposite = function () {
        return new Color(new RGBA(255 - this.rgba.r, 255 - this.rgba.g, 255 - this.rgba.b, this.rgba.a));
    };
    Color.prototype.blend = function (c) {
        var rgba = c.rgba;
        // Convert to 0..1 opacity
        var thisA = this.rgba.a;
        var colorA = rgba.a;
        var a = thisA + colorA * (1 - thisA);
        if (a < 1e-6) {
            return Color.transparent;
        }
        var r = this.rgba.r * thisA / a + rgba.r * colorA * (1 - thisA) / a;
        var g = this.rgba.g * thisA / a + rgba.g * colorA * (1 - thisA) / a;
        var b = this.rgba.b * thisA / a + rgba.b * colorA * (1 - thisA) / a;
        return new Color(new RGBA(r, g, b, a));
    };
    Color.prototype.makeOpaque = function (opaqueBackground) {
        if (this.isOpaque() || opaqueBackground.rgba.a !== 1) {
            // only allow to blend onto a non-opaque color onto a opaque color
            return this;
        }
        var _a = this.rgba, r = _a.r, g = _a.g, b = _a.b, a = _a.a;
        // https://stackoverflow.com/questions/12228548/finding-equivalent-color-with-opacity
        return new Color(new RGBA(opaqueBackground.rgba.r - a * (opaqueBackground.rgba.r - r), opaqueBackground.rgba.g - a * (opaqueBackground.rgba.g - g), opaqueBackground.rgba.b - a * (opaqueBackground.rgba.b - b), 1));
    };
    Color.prototype.flatten = function () {
        var backgrounds = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            backgrounds[_i] = arguments[_i];
        }
        var background = backgrounds.reduceRight(function (accumulator, color) {
            return Color._flatten(color, accumulator);
        });
        return Color._flatten(this, background);
    };
    Color._flatten = function (foreground, background) {
        var backgroundAlpha = 1 - foreground.rgba.a;
        return new Color(new RGBA(backgroundAlpha * background.rgba.r + foreground.rgba.a * foreground.rgba.r, backgroundAlpha * background.rgba.g + foreground.rgba.a * foreground.rgba.g, backgroundAlpha * background.rgba.b + foreground.rgba.a * foreground.rgba.b));
    };
    Color.prototype.toString = function () {
        return '' + Color.Format.CSS.format(this);
    };
    Color.getLighterColor = function (of, relative, factor) {
        if (of.isLighterThan(relative)) {
            return of;
        }
        factor = factor ? factor : 0.5;
        var lum1 = of.getRelativeLuminance();
        var lum2 = relative.getRelativeLuminance();
        factor = factor * (lum2 - lum1) / lum2;
        return of.lighten(factor);
    };
    Color.getDarkerColor = function (of, relative, factor) {
        if (of.isDarkerThan(relative)) {
            return of;
        }
        factor = factor ? factor : 0.5;
        var lum1 = of.getRelativeLuminance();
        var lum2 = relative.getRelativeLuminance();
        factor = factor * (lum1 - lum2) / lum1;
        return of.darken(factor);
    };
    Color.white = new Color(new RGBA(255, 255, 255, 1));
    Color.black = new Color(new RGBA(0, 0, 0, 1));
    Color.red = new Color(new RGBA(255, 0, 0, 1));
    Color.blue = new Color(new RGBA(0, 0, 255, 1));
    Color.green = new Color(new RGBA(0, 255, 0, 1));
    Color.cyan = new Color(new RGBA(0, 255, 255, 1));
    Color.lightgrey = new Color(new RGBA(211, 211, 211, 1));
    Color.transparent = new Color(new RGBA(0, 0, 0, 0));
    return Color;
}());
(function (Color) {
    var Format;
    (function (Format) {
        var CSS;
        (function (CSS) {
            function formatRGB(color) {
                if (color.rgba.a === 1) {
                    return "rgb(" + color.rgba.r + ", " + color.rgba.g + ", " + color.rgba.b + ")";
                }
                return Color.Format.CSS.formatRGBA(color);
            }
            CSS.formatRGB = formatRGB;
            function formatRGBA(color) {
                return "rgba(" + color.rgba.r + ", " + color.rgba.g + ", " + color.rgba.b + ", " + +(color.rgba.a).toFixed(2) + ")";
            }
            CSS.formatRGBA = formatRGBA;
            function formatHSL(color) {
                if (color.hsla.a === 1) {
                    return "hsl(" + color.hsla.h + ", " + (color.hsla.s * 100).toFixed(2) + "%, " + (color.hsla.l * 100).toFixed(2) + "%)";
                }
                return Color.Format.CSS.formatHSLA(color);
            }
            CSS.formatHSL = formatHSL;
            function formatHSLA(color) {
                return "hsla(" + color.hsla.h + ", " + (color.hsla.s * 100).toFixed(2) + "%, " + (color.hsla.l * 100).toFixed(2) + "%, " + color.hsla.a.toFixed(2) + ")";
            }
            CSS.formatHSLA = formatHSLA;
            function _toTwoDigitHex(n) {
                var r = n.toString(16);
                return r.length !== 2 ? '0' + r : r;
            }
            /**
             * Formats the color as #RRGGBB
             */
            function formatHex(color) {
                return "#" + _toTwoDigitHex(color.rgba.r) + _toTwoDigitHex(color.rgba.g) + _toTwoDigitHex(color.rgba.b);
            }
            CSS.formatHex = formatHex;
            /**
             * Formats the color as #RRGGBBAA
             * If 'compact' is set, colors without transparancy will be printed as #RRGGBB
             */
            function formatHexA(color, compact) {
                if (compact === void 0) { compact = false; }
                if (compact && color.rgba.a === 1) {
                    return Color.Format.CSS.formatHex(color);
                }
                return "#" + _toTwoDigitHex(color.rgba.r) + _toTwoDigitHex(color.rgba.g) + _toTwoDigitHex(color.rgba.b) + _toTwoDigitHex(Math.round(color.rgba.a * 255));
            }
            CSS.formatHexA = formatHexA;
            /**
             * The default format will use HEX if opaque and RGBA otherwise.
             */
            function format(color) {
                if (color.isOpaque()) {
                    return Color.Format.CSS.formatHex(color);
                }
                return Color.Format.CSS.formatRGBA(color);
            }
            CSS.format = format;
            /**
             * Converts an Hex color value to a Color.
             * returns r, g, and b are contained in the set [0, 255]
             * @param hex string (#RGB, #RGBA, #RRGGBB or #RRGGBBAA).
             */
            function parseHex(hex) {
                var length = hex.length;
                if (length === 0) {
                    // Invalid color
                    return null;
                }
                if (hex.charCodeAt(0) !== 35 /* Hash */) {
                    // Does not begin with a #
                    return null;
                }
                if (length === 7) {
                    // #RRGGBB format
                    var r = 16 * _parseHexDigit(hex.charCodeAt(1)) + _parseHexDigit(hex.charCodeAt(2));
                    var g = 16 * _parseHexDigit(hex.charCodeAt(3)) + _parseHexDigit(hex.charCodeAt(4));
                    var b = 16 * _parseHexDigit(hex.charCodeAt(5)) + _parseHexDigit(hex.charCodeAt(6));
                    return new Color(new RGBA(r, g, b, 1));
                }
                if (length === 9) {
                    // #RRGGBBAA format
                    var r = 16 * _parseHexDigit(hex.charCodeAt(1)) + _parseHexDigit(hex.charCodeAt(2));
                    var g = 16 * _parseHexDigit(hex.charCodeAt(3)) + _parseHexDigit(hex.charCodeAt(4));
                    var b = 16 * _parseHexDigit(hex.charCodeAt(5)) + _parseHexDigit(hex.charCodeAt(6));
                    var a = 16 * _parseHexDigit(hex.charCodeAt(7)) + _parseHexDigit(hex.charCodeAt(8));
                    return new Color(new RGBA(r, g, b, a / 255));
                }
                if (length === 4) {
                    // #RGB format
                    var r = _parseHexDigit(hex.charCodeAt(1));
                    var g = _parseHexDigit(hex.charCodeAt(2));
                    var b = _parseHexDigit(hex.charCodeAt(3));
                    return new Color(new RGBA(16 * r + r, 16 * g + g, 16 * b + b));
                }
                if (length === 5) {
                    // #RGBA format
                    var r = _parseHexDigit(hex.charCodeAt(1));
                    var g = _parseHexDigit(hex.charCodeAt(2));
                    var b = _parseHexDigit(hex.charCodeAt(3));
                    var a = _parseHexDigit(hex.charCodeAt(4));
                    return new Color(new RGBA(16 * r + r, 16 * g + g, 16 * b + b, (16 * a + a) / 255));
                }
                // Invalid color
                return null;
            }
            CSS.parseHex = parseHex;
            function _parseHexDigit(charCode) {
                switch (charCode) {
                    case 48 /* Digit0 */: return 0;
                    case 49 /* Digit1 */: return 1;
                    case 50 /* Digit2 */: return 2;
                    case 51 /* Digit3 */: return 3;
                    case 52 /* Digit4 */: return 4;
                    case 53 /* Digit5 */: return 5;
                    case 54 /* Digit6 */: return 6;
                    case 55 /* Digit7 */: return 7;
                    case 56 /* Digit8 */: return 8;
                    case 57 /* Digit9 */: return 9;
                    case 97 /* a */: return 10;
                    case 65 /* A */: return 10;
                    case 98 /* b */: return 11;
                    case 66 /* B */: return 11;
                    case 99 /* c */: return 12;
                    case 67 /* C */: return 12;
                    case 100 /* d */: return 13;
                    case 68 /* D */: return 13;
                    case 101 /* e */: return 14;
                    case 69 /* E */: return 14;
                    case 102 /* f */: return 15;
                    case 70 /* F */: return 15;
                }
                return 0;
            }
        })(CSS = Format.CSS || (Format.CSS = {}));
    })(Format = Color.Format || (Color.Format = {}));
})(Color || (Color = {}));

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Node$1 = /** @class */ (function () {
    function Node(element) {
        this.element = element;
        this.next = Node.Undefined;
        this.prev = Node.Undefined;
    }
    Node.Undefined = new Node(undefined);
    return Node;
}());
var LinkedList = /** @class */ (function () {
    function LinkedList() {
        this._first = Node$1.Undefined;
        this._last = Node$1.Undefined;
        this._size = 0;
    }
    Object.defineProperty(LinkedList.prototype, "size", {
        get: function () {
            return this._size;
        },
        enumerable: false,
        configurable: true
    });
    LinkedList.prototype.isEmpty = function () {
        return this._first === Node$1.Undefined;
    };
    LinkedList.prototype.clear = function () {
        this._first = Node$1.Undefined;
        this._last = Node$1.Undefined;
        this._size = 0;
    };
    LinkedList.prototype.unshift = function (element) {
        return this._insert(element, false);
    };
    LinkedList.prototype.push = function (element) {
        return this._insert(element, true);
    };
    LinkedList.prototype._insert = function (element, atTheEnd) {
        var _this = this;
        var newNode = new Node$1(element);
        if (this._first === Node$1.Undefined) {
            this._first = newNode;
            this._last = newNode;
        }
        else if (atTheEnd) {
            // push
            var oldLast = this._last;
            this._last = newNode;
            newNode.prev = oldLast;
            oldLast.next = newNode;
        }
        else {
            // unshift
            var oldFirst = this._first;
            this._first = newNode;
            newNode.next = oldFirst;
            oldFirst.prev = newNode;
        }
        this._size += 1;
        var didRemove = false;
        return function () {
            if (!didRemove) {
                didRemove = true;
                _this._remove(newNode);
            }
        };
    };
    LinkedList.prototype.shift = function () {
        if (this._first === Node$1.Undefined) {
            return undefined;
        }
        else {
            var res = this._first.element;
            this._remove(this._first);
            return res;
        }
    };
    LinkedList.prototype.pop = function () {
        if (this._last === Node$1.Undefined) {
            return undefined;
        }
        else {
            var res = this._last.element;
            this._remove(this._last);
            return res;
        }
    };
    LinkedList.prototype._remove = function (node) {
        if (node.prev !== Node$1.Undefined && node.next !== Node$1.Undefined) {
            // middle
            var anchor = node.prev;
            anchor.next = node.next;
            node.next.prev = anchor;
        }
        else if (node.prev === Node$1.Undefined && node.next === Node$1.Undefined) {
            // only node
            this._first = Node$1.Undefined;
            this._last = Node$1.Undefined;
        }
        else if (node.next === Node$1.Undefined) {
            // last
            this._last = this._last.prev;
            this._last.next = Node$1.Undefined;
        }
        else if (node.prev === Node$1.Undefined) {
            // first
            this._first = this._first.next;
            this._first.prev = Node$1.Undefined;
        }
        // done
        this._size -= 1;
    };
    LinkedList.prototype[Symbol.iterator] = function () {
        var node;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    node = this._first;
                    _a.label = 1;
                case 1:
                    if (!(node !== Node$1.Undefined)) return [3 /*break*/, 3];
                    return [4 /*yield*/, node.element];
                case 2:
                    _a.sent();
                    node = node.next;
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    };
    LinkedList.prototype.toArray = function () {
        var result = [];
        for (var node = this._first; node !== Node$1.Undefined; node = node.next) {
            result.push(node.element);
        }
        return result;
    };
    return LinkedList;
}());

var __values$2 = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read$2 = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var Emitter = /** @class */ (function () {
    function Emitter() {
        this._disposed = false;
    }
    Object.defineProperty(Emitter.prototype, "event", {
        /**
         * For the public to allow to subscribe
         * to events from this Emitter
         */
        get: function () {
            var _this = this;
            if (!this._event) {
                this._event = function (listener, thisArgs, disposables) {
                    if (!_this._listeners) {
                        _this._listeners = new LinkedList();
                    }
                    var remove = _this._listeners.push(!thisArgs ? listener : [listener, thisArgs]);
                    var result;
                    result = {
                        dispose: function () {
                            result.dispose = Emitter._noop;
                            if (!_this._disposed) {
                                remove();
                            }
                        }
                    };
                    if (disposables instanceof DisposableStore) {
                        disposables.add(result);
                    }
                    else if (Array.isArray(disposables)) {
                        disposables.push(result);
                    }
                    return result;
                };
            }
            return this._event;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * To be kept private to fire an event to
     * subscribers
     */
    Emitter.prototype.fire = function (event) {
        var e_1, _a;
        if (this._listeners) {
            // put all [listener,event]-pairs into delivery queue
            // then emit all event. an inner/nested event might be
            // the driver of this
            if (!this._deliveryQueue) {
                this._deliveryQueue = new LinkedList();
            }
            try {
                for (var _b = __values$2(this._listeners), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var listener = _c.value;
                    this._deliveryQueue.push([listener, event]);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            while (this._deliveryQueue.size > 0) {
                var _d = __read$2(this._deliveryQueue.shift(), 2), listener = _d[0], event_1 = _d[1];
                try {
                    if (typeof listener === 'function') {
                        listener.call(undefined, event_1);
                    }
                    else {
                        listener[0].call(listener[1], event_1);
                    }
                }
                catch (e) {
                    setTimeout(function () {
                        if (e.stack) {
                            throw new Error(e.message + '\n\n' + e.stack);
                        }
                        throw e;
                    }, 0);
                }
            }
        }
    };
    Emitter.prototype.dispose = function () {
        if (this._listeners) {
            this._listeners.clear();
        }
        if (this._deliveryQueue) {
            this._deliveryQueue.clear();
        }
        this._disposed = true;
    };
    Emitter._noop = function () { };
    return Emitter;
}());

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends$1 = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var $$1 = $;
var ColorPickerHeader = /** @class */ (function (_super) {
    __extends$1(ColorPickerHeader, _super);
    function ColorPickerHeader(container, model) {
        var _this = _super.call(this) || this;
        _this.model = model;
        _this.domNode = $$1('.colorpicker-header');
        append(container, _this.domNode);
        _this.pickedColorNode = append(_this.domNode, $$1('.picked-color'));
        var colorBox = append(_this.domNode, $$1('.original-color'));
        colorBox.style.backgroundColor = Color.Format.CSS.format(_this.model.originalColor) || '';
        _this.backgroundColor = Color.white;
        _this._register(addDisposableListener(_this.pickedColorNode, EventType.CLICK, function () { return _this.model.selectNextColorPresentation(); }));
        _this._register(addDisposableListener(colorBox, EventType.CLICK, function () {
            _this.model.color = _this.model.originalColor;
            _this.model.flushColor();
        }));
        _this._register(model.onDidChangeColor(_this.onDidChangeColor, _this));
        _this._register(model.onDidChangePresentation(_this.onDidChangePresentation, _this));
        _this.pickedColorNode.style.backgroundColor = Color.Format.CSS.format(model.color) || '';
        toggleClass(_this.pickedColorNode, 'light', model.color.rgba.a < 0.5 ? _this.backgroundColor.isLighter() : model.color.isLighter());
        return _this;
    }
    ColorPickerHeader.prototype.onDidChangeColor = function (color) {
        this.pickedColorNode.style.backgroundColor = Color.Format.CSS.format(color) || '';
        toggleClass(this.pickedColorNode, 'light', color.rgba.a < 0.5 ? this.backgroundColor.isLighter() : color.isLighter());
        this.onDidChangePresentation();
    };
    ColorPickerHeader.prototype.onDidChangePresentation = function () {
        this.pickedColorNode.textContent = this.model.presentation ? this.model.presentation.label : '';
    };
    return ColorPickerHeader;
}(Disposable));
var ColorPickerBody = /** @class */ (function (_super) {
    __extends$1(ColorPickerBody, _super);
    function ColorPickerBody(container, model, pixelRatio) {
        var _this = _super.call(this) || this;
        _this.model = model;
        _this.pixelRatio = pixelRatio;
        _this.domNode = $$1('.colorpicker-body');
        append(container, _this.domNode);
        _this.saturationBox = new SaturationBox(_this.domNode, _this.model, _this.pixelRatio);
        _this._register(_this.saturationBox);
        _this._register(_this.saturationBox.onDidChange(_this.onDidSaturationValueChange, _this));
        _this._register(_this.saturationBox.onColorFlushed(_this.flushColor, _this));
        _this.opacityStrip = new OpacityStrip(_this.domNode, _this.model);
        _this._register(_this.opacityStrip);
        _this._register(_this.opacityStrip.onDidChange(_this.onDidOpacityChange, _this));
        _this._register(_this.opacityStrip.onColorFlushed(_this.flushColor, _this));
        _this.hueStrip = new HueStrip(_this.domNode, _this.model);
        _this._register(_this.hueStrip);
        _this._register(_this.hueStrip.onDidChange(_this.onDidHueChange, _this));
        _this._register(_this.hueStrip.onColorFlushed(_this.flushColor, _this));
        return _this;
    }
    ColorPickerBody.prototype.flushColor = function () {
        this.model.flushColor();
    };
    ColorPickerBody.prototype.onDidSaturationValueChange = function (_a) {
        var s = _a.s, v = _a.v;
        var hsva = this.model.color.hsva;
        this.model.color = new Color(new HSVA(hsva.h, s, v, hsva.a));
    };
    ColorPickerBody.prototype.onDidOpacityChange = function (a) {
        var hsva = this.model.color.hsva;
        this.model.color = new Color(new HSVA(hsva.h, hsva.s, hsva.v, a));
    };
    ColorPickerBody.prototype.onDidHueChange = function (value) {
        var hsva = this.model.color.hsva;
        var h = (1 - value) * 360;
        this.model.color = new Color(new HSVA(h === 360 ? 0 : h, hsva.s, hsva.v, hsva.a));
    };
    ColorPickerBody.prototype.layout = function () {
        this.saturationBox.layout();
        this.opacityStrip.layout();
        this.hueStrip.layout();
    };
    return ColorPickerBody;
}(Disposable));
var SaturationBox = /** @class */ (function (_super) {
    __extends$1(SaturationBox, _super);
    function SaturationBox(container, model, pixelRatio) {
        var _this = _super.call(this) || this;
        _this.model = model;
        _this.pixelRatio = pixelRatio;
        _this._onDidChange = new Emitter();
        _this.onDidChange = _this._onDidChange.event;
        _this._onColorFlushed = new Emitter();
        _this.onColorFlushed = _this._onColorFlushed.event;
        _this.domNode = $$1('.saturation-wrap');
        append(container, _this.domNode);
        // Create canvas, draw selected color
        _this.canvas = document.createElement('canvas');
        _this.canvas.className = 'saturation-box';
        append(_this.domNode, _this.canvas);
        // Add selection circle
        _this.selection = $$1('.saturation-selection');
        append(_this.domNode, _this.selection);
        _this.layout();
        _this._register(addDisposableGenericMouseDownListner(_this.domNode, function (e) { return _this.onMouseDown(e); }));
        _this._register(_this.model.onDidChangeColor(_this.onDidChangeColor, _this));
        _this.monitor = null;
        return _this;
    }
    SaturationBox.prototype.onMouseDown = function (e) {
        var _this = this;
        this.monitor = this._register(new GlobalMouseMoveMonitor());
        var origin = getDomNodePagePosition(this.domNode);
        if (e.target !== this.selection) {
            this.onDidChangePosition(e.offsetX, e.offsetY);
        }
        this.monitor.startMonitoring(e.target, e.buttons, standardMouseMoveMerger, function (event) { return _this.onDidChangePosition(event.posx - origin.left, event.posy - origin.top); }, function () { return null; });
        var mouseUpListener = addDisposableGenericMouseUpListner(document, function () {
            _this._onColorFlushed.fire();
            mouseUpListener.dispose();
            if (_this.monitor) {
                _this.monitor.stopMonitoring(true);
                _this.monitor = null;
            }
        }, true);
    };
    SaturationBox.prototype.onDidChangePosition = function (left, top) {
        var s = Math.max(0, Math.min(1, left / this.width));
        var v = Math.max(0, Math.min(1, 1 - (top / this.height)));
        this.paintSelection(s, v);
        this._onDidChange.fire({ s: s, v: v });
    };
    SaturationBox.prototype.layout = function () {
        this.width = this.domNode.offsetWidth;
        this.height = this.domNode.offsetHeight;
        this.canvas.width = this.width * this.pixelRatio;
        this.canvas.height = this.height * this.pixelRatio;
        this.paint();
        var hsva = this.model.color.hsva;
        this.paintSelection(hsva.s, hsva.v);
    };
    SaturationBox.prototype.paint = function () {
        var hsva = this.model.color.hsva;
        var saturatedColor = new Color(new HSVA(hsva.h, 1, 1, 1));
        var ctx = this.canvas.getContext('2d');
        var whiteGradient = ctx.createLinearGradient(0, 0, this.canvas.width, 0);
        whiteGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        whiteGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
        whiteGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        var blackGradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        blackGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        blackGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
        ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        ctx.fillStyle = Color.Format.CSS.format(saturatedColor);
        ctx.fill();
        ctx.fillStyle = whiteGradient;
        ctx.fill();
        ctx.fillStyle = blackGradient;
        ctx.fill();
    };
    SaturationBox.prototype.paintSelection = function (s, v) {
        this.selection.style.left = s * this.width + "px";
        this.selection.style.top = this.height - v * this.height + "px";
    };
    SaturationBox.prototype.onDidChangeColor = function () {
        if (this.monitor && this.monitor.isMonitoring()) {
            return;
        }
        this.paint();
    };
    return SaturationBox;
}(Disposable));
var Strip = /** @class */ (function (_super) {
    __extends$1(Strip, _super);
    function Strip(container, model) {
        var _this = _super.call(this) || this;
        _this.model = model;
        _this._onDidChange = new Emitter();
        _this.onDidChange = _this._onDidChange.event;
        _this._onColorFlushed = new Emitter();
        _this.onColorFlushed = _this._onColorFlushed.event;
        _this.domNode = append(container, $$1('.strip'));
        _this.overlay = append(_this.domNode, $$1('.overlay'));
        _this.slider = append(_this.domNode, $$1('.slider'));
        _this.slider.style.top = "0px";
        _this._register(addDisposableGenericMouseDownListner(_this.domNode, function (e) { return _this.onMouseDown(e); }));
        _this.layout();
        return _this;
    }
    Strip.prototype.layout = function () {
        this.height = this.domNode.offsetHeight - this.slider.offsetHeight;
        var value = this.getValue(this.model.color);
        this.updateSliderPosition(value);
    };
    Strip.prototype.onMouseDown = function (e) {
        var _this = this;
        var monitor = this._register(new GlobalMouseMoveMonitor());
        var origin = getDomNodePagePosition(this.domNode);
        addClass(this.domNode, 'grabbing');
        if (e.target !== this.slider) {
            this.onDidChangeTop(e.offsetY);
        }
        monitor.startMonitoring(e.target, e.buttons, standardMouseMoveMerger, function (event) { return _this.onDidChangeTop(event.posy - origin.top); }, function () { return null; });
        var mouseUpListener = addDisposableGenericMouseUpListner(document, function () {
            _this._onColorFlushed.fire();
            mouseUpListener.dispose();
            monitor.stopMonitoring(true);
            removeClass(_this.domNode, 'grabbing');
        }, true);
    };
    Strip.prototype.onDidChangeTop = function (top) {
        var value = Math.max(0, Math.min(1, 1 - (top / this.height)));
        this.updateSliderPosition(value);
        this._onDidChange.fire(value);
    };
    Strip.prototype.updateSliderPosition = function (value) {
        this.slider.style.top = (1 - value) * this.height + "px";
    };
    return Strip;
}(Disposable));
var OpacityStrip = /** @class */ (function (_super) {
    __extends$1(OpacityStrip, _super);
    function OpacityStrip(container, model) {
        var _this = _super.call(this, container, model) || this;
        addClass(_this.domNode, 'opacity-strip');
        _this._register(model.onDidChangeColor(_this.onDidChangeColor, _this));
        _this.onDidChangeColor(_this.model.color);
        return _this;
    }
    OpacityStrip.prototype.onDidChangeColor = function (color) {
        var _a = color.rgba, r = _a.r, g = _a.g, b = _a.b;
        var opaque = new Color(new RGBA(r, g, b, 1));
        var transparent = new Color(new RGBA(r, g, b, 0));
        this.overlay.style.background = "linear-gradient(to bottom, " + opaque + " 0%, " + transparent + " 100%)";
    };
    OpacityStrip.prototype.getValue = function (color) {
        return color.hsva.a;
    };
    return OpacityStrip;
}(Strip));
var HueStrip = /** @class */ (function (_super) {
    __extends$1(HueStrip, _super);
    function HueStrip(container, model) {
        var _this = _super.call(this, container, model) || this;
        addClass(_this.domNode, 'hue-strip');
        return _this;
    }
    HueStrip.prototype.getValue = function (color) {
        return 1 - (color.hsva.h / 360);
    };
    return HueStrip;
}(Strip));
var ColorPickerWidget = /** @class */ (function (_super) {
    __extends$1(ColorPickerWidget, _super);
    function ColorPickerWidget(container, model, pixelRatio) {
        var _this = _super.call(this) || this;
        _this.model = model;
        _this.pixelRatio = pixelRatio;
        var element = $$1('.colorpicker-widget');
        container.appendChild(element);
        var header = new ColorPickerHeader(element, _this.model);
        _this.body = new ColorPickerBody(element, _this.model, _this.pixelRatio);
        _this._register(header);
        _this._register(_this.body);
        return _this;
    }
    ColorPickerWidget.prototype.getId = function () {
        return ColorPickerWidget.ID;
    };
    ColorPickerWidget.prototype.layout = function () {
        this.body.layout();
    };
    ColorPickerWidget.ID = 'editor.contrib.colorPickerWidget';
    return ColorPickerWidget;
}(Disposable));

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var ColorPickerModel = /** @class */ (function () {
    function ColorPickerModel(color, availableColorPresentations, presentationIndex) {
        this.presentationIndex = presentationIndex;
        this._onColorFlushed = new Emitter();
        this.onColorFlushed = this._onColorFlushed.event;
        this._onDidChangeColor = new Emitter();
        this.onDidChangeColor = this._onDidChangeColor.event;
        this._onDidChangePresentation = new Emitter();
        this.onDidChangePresentation = this._onDidChangePresentation.event;
        this.originalColor = color;
        this._color = color;
        this._colorPresentations = availableColorPresentations;
    }
    Object.defineProperty(ColorPickerModel.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (color) {
            if (this._color.equals(color)) {
                return;
            }
            this._color = color;
            this._onDidChangeColor.fire(color);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorPickerModel.prototype, "presentation", {
        get: function () { return this.colorPresentations[this.presentationIndex]; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorPickerModel.prototype, "colorPresentations", {
        get: function () {
            return this._colorPresentations;
        },
        set: function (colorPresentations) {
            this._colorPresentations = colorPresentations;
            if (this.presentationIndex > colorPresentations.length - 1) {
                this.presentationIndex = 0;
            }
            this._onDidChangePresentation.fire(this.presentation);
        },
        enumerable: false,
        configurable: true
    });
    ColorPickerModel.prototype.selectNextColorPresentation = function () {
        this.presentationIndex = (this.presentationIndex + 1) % this.colorPresentations.length;
        this.flushColor();
        this._onDidChangePresentation.fire(this.presentation);
    };
    ColorPickerModel.prototype.guessColorPresentation = function (color, originalText) {
        for (var i = 0; i < this.colorPresentations.length; i++) {
            if (originalText.toLowerCase() === this.colorPresentations[i].label) {
                this.presentationIndex = i;
                this._onDidChangePresentation.fire(this.presentation);
                break;
            }
        }
    };
    ColorPickerModel.prototype.flushColor = function () {
        this._onColorFlushed.fire(this._color);
    };
    return ColorPickerModel;
}());

function ThrowInvalidColor(color) {
    throw new TypeError("Invalid color: " + color);
}
var ColorPicker = /** @class */ (function () {
    function ColorPicker(container, props) {
        var _this = this;
        var _a, _b, _c;
        this.container = container;
        this._onColorFlushed = new Emitter();
        this.onColorFlushed = this._onColorFlushed.event;
        this._onDidChangeColor = new Emitter();
        this.onColorChanged = this._onDidChangeColor.event;
        this._onDidChangePresentation = new Emitter();
        this.onPresentationChanged = this._onDidChangePresentation.event;
        var _props = props !== null && props !== void 0 ? props : {};
        var color = (_a = _props.color) !== null && _a !== void 0 ? _a : '#0000';
        var presentation = (_b = _props.presentation) !== null && _b !== void 0 ? _b : '';
        var presentations = [{ label: presentation }];
        var presentationIndex = 0;
        var pixelRatio = (_c = _props.pixelRatio) !== null && _c !== void 0 ? _c : 1;
        var colorInstance = ColorPicker.toColor(color);
        this._model = new ColorPickerModel(colorInstance, [], presentationIndex);
        this._model.colorPresentations = presentations;
        this._model.onDidChangeColor(function (e) {
            _this._onDidChangeColor.fire(e);
        });
        this._model.onColorFlushed(function (e) {
            _this._onColorFlushed.fire(e);
            _this._widget.body.layout();
        });
        this._model.onDidChangePresentation(function (e) {
            var _a;
            _this._onDidChangePresentation.fire((_a = (e && e.label)) !== null && _a !== void 0 ? _a : '');
        });
        this._widget = new ColorPickerWidget(this.container, this._model, pixelRatio);
        if (presentations[presentationIndex] && presentations[presentationIndex].label) {
            this._model.guessColorPresentation(colorInstance, presentations[presentationIndex].label);
            this._widget.body.layout();
        }
        this._onResize = function (_e) {
            _this._widget.body.layout();
        };
        window.addEventListener('resize', this._onResize);
    }
    ColorPicker.toColor = function (color) {
        if (color instanceof Color) {
            return color;
        }
        if (typeof color !== 'string') {
            ThrowInvalidColor(color);
        }
        var c = color.trim();
        var matches;
        if (c.charCodeAt(0) === 35 /* Hash */) {
            return Color.fromHex(c);
        }
        else if (matches = c.match(/^rgb\(\s*([0-9]|[1-9][0-9]|[12][0-9][0-9])\s*,\s*([0-9]|[1-9][0-9]|[12][0-9][0-9])\s*,\s*([0-9]|[1-9][0-9]|[12][0-9][0-9])\s*\)$/)) {
            return new Color(new RGBA(Number(matches[1]), Number(matches[2]), Number(matches[3])));
        }
        else if (matches = c.match(/^rgba\(\s*([0-9]|[1-9][0-9]|[12][0-9][0-9])\s*,\s*([0-9]|[1-9][0-9]|[12][0-9][0-9])\s*,\s*([0-9]|[1-9][0-9]|[12][0-9][0-9])\s*,\s*([01](\.[0-9]+)?)\s*\)$/)) {
            return new Color(new RGBA(Number(matches[1]), Number(matches[2]), Number(matches[3]), Number(matches[4])));
        }
        else if (matches = c.match(/^hsl\(\s*([0-9]|[1-9][0-9]|[123][0-9][0-9])\s*,\s*([01](\.[0-9]+)?)\s*,\s*([01](\.[0-9]+)?)\s*\)$/)) {
            return new Color(new HSLA(Number(matches[1]), Number(matches[2]), Number(matches[3]), 1));
        }
        else if (matches = c.match(/^hsla\(\s*([0-9]|[1-9][0-9]|[123][0-9][0-9])\s*,\s*([01](\.[0-9]+)?)\s*,\s*([01](\.[0-9]+)?)\s*,\s*([01](\.[0-9]+)?)\s*\)$/)) {
            return new Color(new HSLA(Number(matches[1]), Number(matches[2]), Number(matches[3]), Number(matches[4])));
        }
        else {
            ThrowInvalidColor(color);
        }
    };
    ColorPicker.formatColor = function (color, type) {
        if (type === void 0) { type = ColorPicker.ColorType.DEFAULT; }
        if (!(color instanceof Color)) {
            try {
                color = ColorPicker.toColor(color);
            }
            catch (err) {
                throw err;
            }
        }
        switch (type) {
            case ColorPicker.ColorType.DEFAULT: return color.toString();
            case ColorPicker.ColorType.RGB: return color.isOpaque() ? Color.Format.CSS.formatRGB(color) : Color.Format.CSS.formatRGBA(color);
            case ColorPicker.ColorType.HEX: return color.isOpaque() ? Color.Format.CSS.formatHex(color) : Color.Format.CSS.formatHexA(color);
            case ColorPicker.ColorType.HSL: return color.isOpaque() ? Color.Format.CSS.formatHSL(color) : Color.Format.CSS.formatHSLA(color);
            default: return '';
        }
    };
    ColorPicker.prototype.getColor = function () {
        return this._model.color;
    };
    ColorPicker.prototype.setColor = function (color) {
        this._model.color = ColorPicker.toColor(color);
        this._widget.body.layout();
    };
    ColorPicker.prototype.getPresentation = function () {
        return this._model.presentation.label;
    };
    ColorPicker.prototype.setPresentation = function (presentation) {
        this._model.colorPresentations[0].label = presentation;
        var pickedColorNode = this.container.getElementsByClassName('picked-color')[0];
        if (pickedColorNode !== undefined) {
            pickedColorNode.textContent = this._model.presentation ? this._model.presentation.label : '';
        }
    };
    ColorPicker.prototype.getPixelRatio = function () {
        return this._widget.body.saturationBox.pixelRatio;
    };
    ColorPicker.prototype.setPixelRatio = function (ratio) {
        if (ratio === this._widget.body.saturationBox.pixelRatio)
            return;
        if (ratio < 0) {
            throw new TypeError('Ratio must be a positive number.');
        }
        this._widget.pixelRatio = ratio;
        this._widget.body.pixelRatio = ratio;
        this._widget.body.saturationBox.pixelRatio = ratio;
        this._widget.body.layout();
    };
    ColorPicker.prototype.getOriginalColor = function () {
        return this._model.originalColor;
    };
    ColorPicker.prototype.setOriginalColor = function (color) {
        var colorBox = this.container.getElementsByClassName('original-color')[0];
        if (colorBox === undefined) {
            return;
        }
        this._model.originalColor = ColorPicker.toColor(color);
        colorBox.style.backgroundColor = Color.Format.CSS.format(this._model.originalColor) || '';
    };
    ColorPicker.prototype.dispose = function () {
        this._onDidChangeColor.dispose();
        this._onColorFlushed.dispose();
        this._onDidChangePresentation.dispose();
        window.removeEventListener('resize', this._onResize);
        this._widget.dispose();
    };
    Object.defineProperty(ColorPicker, "version", {
        get: function () {
            return "1.0.0";
        },
        enumerable: false,
        configurable: true
    });
    return ColorPicker;
}());
(function (ColorPicker) {
    var ColorType;
    (function (ColorType) {
        ColorType[ColorType["DEFAULT"] = 0] = "DEFAULT";
        ColorType[ColorType["RGB"] = 1] = "RGB";
        ColorType[ColorType["HEX"] = 2] = "HEX";
        ColorType[ColorType["HSL"] = 3] = "HSL";
    })(ColorType = ColorPicker.ColorType || (ColorPicker.ColorType = {}));
})(ColorPicker || (ColorPicker = {}));

export { Color, ColorPicker, HSLA, HSVA, RGBA };
