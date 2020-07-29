/**
 * Browser feature we can support in current platform, browser and environment.
 */
export const BrowserFeatures = {
	pointerEvents: window.PointerEvent && ('ontouchstart' in window || (window as Window).navigator.maxTouchPoints > 0 || navigator.maxTouchPoints > 0 || (window as Window).navigator.msMaxTouchPoints > 0)
};
