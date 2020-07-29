const userAgent = navigator.userAgent;

export const isEdge = (userAgent.indexOf('Edge/') >= 0);
export const isOpera = (userAgent.indexOf('Opera') >= 0);
export const isFirefox = (userAgent.indexOf('Firefox') >= 0);
export const isWebKit = (userAgent.indexOf('AppleWebKit') >= 0);
export const isChrome = (userAgent.indexOf('Chrome') >= 0);
export const isSafari = (!isChrome && (userAgent.indexOf('Safari') >= 0));
export const isWebkitWebView = (!isChrome && !isSafari && isWebKit);
export const isIPad = (userAgent.indexOf('iPad') >= 0 || (isSafari && navigator.maxTouchPoints > 0));
export const isEdgeWebView = isEdge && (userAgent.indexOf('WebView/') >= 0);
export const isStandalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
