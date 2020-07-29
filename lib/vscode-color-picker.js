!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.vscodeColorPicker=e():t.vscodeColorPicker=e()}(window,(function(){return function(t){var e={};function o(n){if(e[n])return e[n].exports;var r=e[n]={i:n,l:!1,exports:{}};return t[n].call(r.exports,r,r.exports,o),r.l=!0,r.exports}return o.m=t,o.c=e,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)o.d(n,r,function(e){return t[e]}.bind(null,r));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="",o(o.s=0)}([function(t,e,o){t.exports=o(2)},function(t,e,o){},function(t,e,o){"use strict";o.r(e),o.d(e,"Color",(function(){return nt})),o.d(e,"ColorPicker",(function(){return Ct})),o.d(e,"HSLA",(function(){return et})),o.d(e,"HSVA",(function(){return ot})),o.d(e,"RGBA",(function(){return tt}));o(1);var n=function(){function t(){this._toDispose=new Set,this._isDisposed=!1}return t.prototype.dispose=function(){this._isDisposed||(this._isDisposed=!0,this.clear())},t.prototype.clear=function(){this._toDispose.forEach((function(t){return t.dispose()})),this._toDispose.clear()},t.prototype.add=function(e){if(!e)return e;if(e===this)throw new Error("Cannot register a disposable on itself!");return this._isDisposed?t.DISABLE_DISPOSED_WARNING||console.warn(new Error("Trying to add a disposable to a DisposableStore that has already been disposed of. The added object will be leaked!").stack):this._toDispose.add(e),e},t.DISABLE_DISPOSED_WARNING=!1,t}(),r=function(){function t(){this._store=new n}return t.prototype.dispose=function(){this._store.dispose()},t.prototype._register=function(t){if(t===this)throw new Error("Cannot register a disposable on itself!");return this._store.add(t)},t.None=Object.freeze({dispose:function(){}}),t}(),i=navigator.userAgent,a=i.indexOf("Edge/")>=0,s=(i.indexOf("Opera"),i.indexOf("Firefox"),i.indexOf("AppleWebKit"),i.indexOf("Chrome")>=0),u=!s&&i.indexOf("Safari")>=0,l=(i.indexOf("iPad")>=0||u&&navigator.maxTouchPoints,a&&i.indexOf("WebView/"),window.matchMedia&&window.matchMedia("(display-mode: standalone)").matches,function(){function t(t,e){this._token=-1,"function"==typeof t&&"number"==typeof e&&this.setIfNotSet(t,e)}return t.prototype.dispose=function(){this.cancel()},t.prototype.cancel=function(){-1!==this._token&&(clearTimeout(this._token),this._token=-1)},t.prototype.cancelAndSet=function(t,e){var o=this;this.cancel(),this._token=setTimeout((function(){o._token=-1,t()}),e)},t.prototype.setIfNotSet=function(t,e){var o=this;-1===this._token&&(this._token=setTimeout((function(){o._token=-1,t()}),e))},t}()),h=navigator.userAgent,c=(h.indexOf("Macintosh")>=0||h.indexOf("iPad")>=0||h.indexOf("iPhone")>=0)&&!!navigator.maxTouchPoints&&navigator.maxTouchPoints>0,f=window.PointerEvent&&("ontouchstart"in window||window.navigator.maxTouchPoints>0||navigator.maxTouchPoints>0||window.navigator.msMaxTouchPoints>0);function d(t){return t.filter((function(t){return!!t}))}var p,g=(p=function(t,e){return(p=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o])})(t,e)},function(t,e){function o(){this.constructor=t}p(t,e),t.prototype=null===e?Object.create(e):(o.prototype=e.prototype,new o)}),m=function(){return(m=Object.assign||function(t){for(var e,o=1,n=arguments.length;o<n;o++)for(var r in e=arguments[o])Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t}).apply(this,arguments)},y=function(t,e){var o="function"==typeof Symbol&&t[Symbol.iterator];if(!o)return t;var n,r,i=o.call(t),a=[];try{for(;(void 0===e||e-- >0)&&!(n=i.next()).done;)a.push(n.value)}catch(t){r={error:t}}finally{try{n&&!n.done&&(o=i.return)&&o.call(i)}finally{if(r)throw r.error}}return a},v=function(){for(var t=[],e=0;e<arguments.length;e++)t=t.concat(y(arguments[e]));return t};function b(t){for(var e=[],o=1;o<arguments.length;o++)e[o-1]=arguments[o];return e.forEach((function(e){return t.appendChild(e)})),e[e.length-1]}var _=function(){function t(t,e,o,n){this._node=t,this._type=e,this._handler=o,this._options=n||!1,this._node.addEventListener(this._type,this._handler,this._options)}return t.prototype.dispose=function(){this._handler&&(this._node.removeEventListener(this._type,this._handler,this._options),this._node=null,this._handler=null)},t}();function w(t,e,o,n){return new _(t,e,o,n)}function C(t,e,o){t.classList&&t.classList.toggle(e,o)}function x(t,e){e&&t.classList&&t.classList.add(e)}var S="click",D="mouseup",M="mousedown",k="pointerup",P="pointerdown",A=function(t,e){return e},N=function(t){function e(e,o,n,r,i){void 0===r&&(r=A),void 0===i&&(i=16);var a=t.call(this)||this,s=null,u=0,h=a._register(new l),c=function(){u=(new Date).getTime(),n(s),s=null};return a._register(w(e,o,(function(t){s=r(s,t);var e=(new Date).getTime()-u;e>=i?(h.cancel(),c()):h.setIfNotSet(c,i-e)}))),a}return g(e,t),e}(r);function O(t,e,o){return w(t,c&&f?P:M,e,o)}function L(t,e,o){return w(t,c&&f?k:D,e,o)}function E(t){var e=t.getBoundingClientRect();return{left:e.left+F.scrollX,top:e.top+F.scrollY,width:e.width,height:e.height}}var T,F=new(function(){function t(){}return Object.defineProperty(t.prototype,"scrollX",{get:function(){return"number"==typeof window.scrollX?window.scrollX:document.body.scrollLeft+document.documentElement.scrollLeft},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"scrollY",{get:function(){return"number"==typeof window.scrollY?window.scrollY:document.body.scrollTop+document.documentElement.scrollTop},enumerable:!1,configurable:!0}),t}()),R=/([\w\-]+)?(#([\w\-]+))?((.([\w\-]+))*)/;function B(t,e,o){for(var n=[],r=3;r<arguments.length;r++)n[r-3]=arguments[r];var i=R.exec(e);if(!i)throw new Error("Bad use of emmet");o=m({},o||{});var a,s=i[1]||"div";return a=t!==T.HTML?document.createElementNS(t,s):document.createElement(s),i[3]&&(a.id=i[3]),i[4]&&(a.className=i[4].replace(/\./g," ").trim()),Object.keys(o).forEach((function(t){var e=o[t];void 0!==e&&(/^on\w+$/.test(t)?a[t]=e:"selected"===t?e&&a.setAttribute(t,"true"):a.setAttribute(t,e))})),d(n).forEach((function(t){t instanceof Node?a.appendChild(t):a.appendChild(document.createTextNode(t))})),a}function H(t,e){for(var o=[],n=2;n<arguments.length;n++)o[n-2]=arguments[n];return B.apply(void 0,v([T.HTML,t,e],o))}!function(t){t.HTML="http://www.w3.org/1999/xhtml",t.SVG="http://www.w3.org/2000/svg"}(T||(T={})),H.SVG=function(t,e){for(var o=[],n=2;n<arguments.length;n++)o[n-2]=arguments[n];return B.apply(void 0,v([T.SVG,t,e],o))};var j=function(t){var e="function"==typeof Symbol&&Symbol.iterator,o=e&&t[e],n=0;if(o)return o.call(t);if(t&&"number"==typeof t.length)return{next:function(){return t&&n>=t.length&&(t=void 0),{value:t&&t[n++],done:!t}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")},I=!1,U=null;function G(t){if(!t.parent||t.parent===t)return null;try{var e=t.location,o=t.parent.location;if(e.protocol!==o.protocol||e.hostname!==o.hostname||e.port!==o.port)return I=!0,null}catch(t){return I=!0,null}return t.parent}function q(t,e){for(var o,n=t.document.getElementsByTagName("iframe"),r=0,i=n.length;r<i;r++)if((o=n[r]).contentWindow===e)return o;return null}var W=function(){function t(){}return t.getSameOriginWindowChain=function(){if(!U){U=[];var t=window,e=void 0;do{(e=G(t))?U.push({window:t,iframeElement:q(e,t)}):U.push({window:t,iframeElement:null}),t=e}while(t)}return U.slice(0)},t.hasDifferentOriginAncestor=function(){return U||this.getSameOriginWindowChain(),I},t.getPositionOfChildWindowRelativeToAncestorWindow=function(t,e){var o,n;if(!e||t===e)return{top:0,left:0};var r=0,i=0,a=this.getSameOriginWindowChain();try{for(var s=j(a),u=s.next();!u.done;u=s.next()){var l=u.value;if(l.window===e)break;if(!l.iframeElement)break;var h=l.iframeElement.getBoundingClientRect();r+=h.top,i+=h.left}}catch(t){o={error:t}}finally{try{u&&!u.done&&(n=s.return)&&n.call(s)}finally{if(o)throw o.error}}return{top:r,left:i}},t}(),z=function(){function t(t){this.timestamp=Date.now(),this.browserEvent=t,this.leftButton=0===t.button,this.middleButton=1===t.button,this.rightButton=2===t.button,this.buttons=t.buttons,this.target=t.target,this.detail=t.detail||1,"dblclick"===t.type&&(this.detail=2),this.ctrlKey=t.ctrlKey,this.shiftKey=t.shiftKey,this.altKey=t.altKey,this.metaKey=t.metaKey,"number"==typeof t.pageX?(this.posx=t.pageX,this.posy=t.pageY):(this.posx=t.clientX+document.body.scrollLeft+document.documentElement.scrollLeft,this.posy=t.clientY+document.body.scrollTop+document.documentElement.scrollTop);var e=W.getPositionOfChildWindowRelativeToAncestorWindow(self,t.view);this.posx-=e.left,this.posy-=e.top}return t.prototype.preventDefault=function(){this.browserEvent.preventDefault()},t.prototype.stopPropagation=function(){this.browserEvent.stopPropagation()},t}(),X=function(t){var e="function"==typeof Symbol&&Symbol.iterator,o=e&&t[e],n=0;if(o)return o.call(t);if(t&&"number"==typeof t.length)return{next:function(){return t&&n>=t.length&&(t=void 0),{value:t&&t[n++],done:!t}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")};function V(t,e){var o=new z(e);return o.preventDefault(),{leftButton:o.leftButton,buttons:o.buttons,posx:o.posx,posy:o.posy}}var K,Y=function(){function t(){this._hooks=new n,this._mouseMoveEventMerger=null,this._mouseMoveCallback=null,this._onStopCallback=null}return t.prototype.dispose=function(){this.stopMonitoring(!1),this._hooks.dispose()},t.prototype.stopMonitoring=function(t){if(this.isMonitoring()){this._hooks.clear(),this._mouseMoveEventMerger=null,this._mouseMoveCallback=null;var e=this._onStopCallback;this._onStopCallback=null,t&&e&&e()}},t.prototype.isMonitoring=function(){return!!this._mouseMoveEventMerger},t.prototype.startMonitoring=function(t,e,o,n,r){var i,a,s=this;if(!this.isMonitoring()){this._mouseMoveEventMerger=o,this._mouseMoveCallback=n,this._onStopCallback=r;var u=W.getSameOriginWindowChain(),l=c&&f?"pointermove":"mousemove",h=c&&f?"pointerup":"mouseup",d=u.map((function(t){return t.window.document})),p=function(t){for(;t.parentNode;){if(t===document.body)return null;t=t.parentNode}return(e=t)&&e.host&&e.mode?t:null;var e}(t);p&&d.unshift(p);try{for(var g=X(d),m=g.next();!m.done;m=g.next()){var y=m.value;this._hooks.add(new N(y,l,(function(t){t.buttons===e?s._mouseMoveCallback(t):s.stopMonitoring(!0)}),(function(t,e){return s._mouseMoveEventMerger(t,e)}),void 0)),this._hooks.add(w(y,h,(function(t){return s.stopMonitoring(!0)})))}}catch(t){i={error:t}}finally{try{m&&!m.done&&(a=g.return)&&a.call(g)}finally{if(i)throw i.error}}if(W.hasDifferentOriginAncestor()){var v=u[u.length-1];this._hooks.add(w(v.window.document,"mouseout",(function(t){"html"===new z(t).target.tagName.toLowerCase()&&s.stopMonitoring(!0)}))),this._hooks.add(w(v.window.document,"mouseover",(function(t){"html"===new z(t).target.tagName.toLowerCase()&&s.stopMonitoring(!0)}))),this._hooks.add(w(v.window.document.body,"mouseleave",(function(t){s.stopMonitoring(!0)})))}}},t}();!function(t){t[t.Hash=35]="Hash",t[t.Digit0=48]="Digit0",t[t.Digit1=49]="Digit1",t[t.Digit2=50]="Digit2",t[t.Digit3=51]="Digit3",t[t.Digit4=52]="Digit4",t[t.Digit5=53]="Digit5",t[t.Digit6=54]="Digit6",t[t.Digit7=55]="Digit7",t[t.Digit8=56]="Digit8",t[t.Digit9=57]="Digit9",t[t.A=65]="A",t[t.B=66]="B",t[t.C=67]="C",t[t.D=68]="D",t[t.E=69]="E",t[t.F=70]="F",t[t.a=97]="a",t[t.b=98]="b",t[t.c=99]="c",t[t.d=100]="d",t[t.e=101]="e",t[t.f=102]="f"}(K||(K={}));var Q=function(t,e){var o="function"==typeof Symbol&&t[Symbol.iterator];if(!o)return t;var n,r,i=o.call(t),a=[];try{for(;(void 0===e||e-- >0)&&!(n=i.next()).done;)a.push(n.value)}catch(t){r={error:t}}finally{try{n&&!n.done&&(o=i.return)&&o.call(i)}finally{if(r)throw r.error}}return a};function $(t,e){var o=Math.pow(10,e);return Math.round(t*o)/o}var J,Z,tt=function(){function t(t,e,o,n){void 0===n&&(n=1),this.r=0|Math.min(255,Math.max(0,t)),this.g=0|Math.min(255,Math.max(0,e)),this.b=0|Math.min(255,Math.max(0,o)),this.a=$(Math.max(Math.min(1,n),0),3)}return t.equals=function(t,e){return t.r===e.r&&t.g===e.g&&t.b===e.b&&t.a===e.a},t}(),et=function(){function t(t,e,o,n){this.h=0|Math.max(Math.min(360,t),0),this.s=$(Math.max(Math.min(1,e),0),3),this.l=$(Math.max(Math.min(1,o),0),3),this.a=$(Math.max(Math.min(1,n),0),3)}return t.equals=function(t,e){return t.h===e.h&&t.s===e.s&&t.l===e.l&&t.a===e.a},t.fromRGBA=function(e){var o=e.r/255,n=e.g/255,r=e.b/255,i=e.a,a=Math.max(o,n,r),s=Math.min(o,n,r),u=0,l=0,h=(s+a)/2,c=a-s;if(c>0){switch(l=Math.min(h<=.5?c/(2*h):c/(2-2*h),1),a){case o:u=(n-r)/c+(n<r?6:0);break;case n:u=(r-o)/c+2;break;case r:u=(o-n)/c+4}u*=60,u=Math.round(u)}return new t(u,l,h,i)},t._hue2rgb=function(t,e,o){return o<0&&(o+=1),o>1&&(o-=1),o<1/6?t+6*(e-t)*o:o<.5?e:o<2/3?t+(e-t)*(2/3-o)*6:t},t.toRGBA=function(e){var o,n,r,i=e.h/360,a=e.s,s=e.l,u=e.a;if(0===a)o=n=r=s;else{var l=s<.5?s*(1+a):s+a-s*a,h=2*s-l;o=t._hue2rgb(h,l,i+1/3),n=t._hue2rgb(h,l,i),r=t._hue2rgb(h,l,i-1/3)}return new tt(Math.round(255*o),Math.round(255*n),Math.round(255*r),u)},t}(),ot=function(){function t(t,e,o,n){this.h=0|Math.max(Math.min(360,t),0),this.s=$(Math.max(Math.min(1,e),0),3),this.v=$(Math.max(Math.min(1,o),0),3),this.a=$(Math.max(Math.min(1,n),0),3)}return t.equals=function(t,e){return t.h===e.h&&t.s===e.s&&t.v===e.v&&t.a===e.a},t.fromRGBA=function(e){var o,n=e.r/255,r=e.g/255,i=e.b/255,a=Math.max(n,r,i),s=a-Math.min(n,r,i),u=0===a?0:s/a;return o=0===s?0:a===n?((r-i)/s%6+6)%6:a===r?(i-n)/s+2:(n-r)/s+4,new t(Math.round(60*o),u,a,e.a)},t.toRGBA=function(t){var e=t.h,o=t.s,n=t.v,r=t.a,i=n*o,a=i*(1-Math.abs(e/60%2-1)),s=n-i,u=Q([0,0,0],3),l=u[0],h=u[1],c=u[2];return e<60?(l=i,h=a):e<120?(l=a,h=i):e<180?(h=i,c=a):e<240?(h=a,c=i):e<300?(l=a,c=i):e<360&&(l=i,c=a),l=Math.round(255*(l+s)),h=Math.round(255*(h+s)),c=Math.round(255*(c+s)),new tt(l,h,c,r)},t}(),nt=function(){function t(t){if(!t)throw new Error("Color needs a value");if(t instanceof tt)this.rgba=t;else if(t instanceof et)this._hsla=t,this.rgba=et.toRGBA(t);else{if(!(t instanceof ot))throw new Error("Invalid color ctor argument");this._hsva=t,this.rgba=ot.toRGBA(t)}}return t.fromHex=function(e){return t.Format.CSS.parseHex(e)||t.red},Object.defineProperty(t.prototype,"hsla",{get:function(){return this._hsla?this._hsla:et.fromRGBA(this.rgba)},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"hsva",{get:function(){return this._hsva?this._hsva:ot.fromRGBA(this.rgba)},enumerable:!1,configurable:!0}),t.prototype.equals=function(t){return!!t&&tt.equals(this.rgba,t.rgba)&&et.equals(this.hsla,t.hsla)&&ot.equals(this.hsva,t.hsva)},t.prototype.getRelativeLuminance=function(){return $(.2126*t._relativeLuminanceForComponent(this.rgba.r)+.7152*t._relativeLuminanceForComponent(this.rgba.g)+.0722*t._relativeLuminanceForComponent(this.rgba.b),4)},t._relativeLuminanceForComponent=function(t){var e=t/255;return e<=.03928?e/12.92:Math.pow((e+.055)/1.055,2.4)},t.prototype.getContrastRatio=function(t){var e=this.getRelativeLuminance(),o=t.getRelativeLuminance();return e>o?(e+.05)/(o+.05):(o+.05)/(e+.05)},t.prototype.isDarker=function(){return(299*this.rgba.r+587*this.rgba.g+114*this.rgba.b)/1e3<128},t.prototype.isLighter=function(){return(299*this.rgba.r+587*this.rgba.g+114*this.rgba.b)/1e3>=128},t.prototype.isLighterThan=function(t){return this.getRelativeLuminance()>t.getRelativeLuminance()},t.prototype.isDarkerThan=function(t){return this.getRelativeLuminance()<t.getRelativeLuminance()},t.prototype.lighten=function(e){return new t(new et(this.hsla.h,this.hsla.s,this.hsla.l+this.hsla.l*e,this.hsla.a))},t.prototype.darken=function(e){return new t(new et(this.hsla.h,this.hsla.s,this.hsla.l-this.hsla.l*e,this.hsla.a))},t.prototype.transparent=function(e){var o=this.rgba,n=o.r,r=o.g,i=o.b,a=o.a;return new t(new tt(n,r,i,a*e))},t.prototype.isTransparent=function(){return 0===this.rgba.a},t.prototype.isOpaque=function(){return 1===this.rgba.a},t.prototype.opposite=function(){return new t(new tt(255-this.rgba.r,255-this.rgba.g,255-this.rgba.b,this.rgba.a))},t.prototype.blend=function(e){var o=e.rgba,n=this.rgba.a,r=o.a,i=n+r*(1-n);if(i<1e-6)return t.transparent;var a=this.rgba.r*n/i+o.r*r*(1-n)/i,s=this.rgba.g*n/i+o.g*r*(1-n)/i,u=this.rgba.b*n/i+o.b*r*(1-n)/i;return new t(new tt(a,s,u,i))},t.prototype.makeOpaque=function(e){if(this.isOpaque()||1!==e.rgba.a)return this;var o=this.rgba,n=o.r,r=o.g,i=o.b,a=o.a;return new t(new tt(e.rgba.r-a*(e.rgba.r-n),e.rgba.g-a*(e.rgba.g-r),e.rgba.b-a*(e.rgba.b-i),1))},t.prototype.flatten=function(){for(var e=[],o=0;o<arguments.length;o++)e[o]=arguments[o];var n=e.reduceRight((function(e,o){return t._flatten(o,e)}));return t._flatten(this,n)},t._flatten=function(e,o){var n=1-e.rgba.a;return new t(new tt(n*o.rgba.r+e.rgba.a*e.rgba.r,n*o.rgba.g+e.rgba.a*e.rgba.g,n*o.rgba.b+e.rgba.a*e.rgba.b))},t.prototype.toString=function(){return""+t.Format.CSS.format(this)},t.getLighterColor=function(t,e,o){if(t.isLighterThan(e))return t;o=o||.5;var n=t.getRelativeLuminance(),r=e.getRelativeLuminance();return o=o*(r-n)/r,t.lighten(o)},t.getDarkerColor=function(t,e,o){if(t.isDarkerThan(e))return t;o=o||.5;var n=t.getRelativeLuminance();return o=o*(n-e.getRelativeLuminance())/n,t.darken(o)},t.white=new t(new tt(255,255,255,1)),t.black=new t(new tt(0,0,0,1)),t.red=new t(new tt(255,0,0,1)),t.blue=new t(new tt(0,0,255,1)),t.green=new t(new tt(0,255,0,1)),t.cyan=new t(new tt(0,255,255,1)),t.lightgrey=new t(new tt(211,211,211,1)),t.transparent=new t(new tt(0,0,0,0)),t}();Z=nt||(nt={}),function(t){function e(t){var e=t.toString(16);return 2!==e.length?"0"+e:e}function o(t){switch(t){case K.Digit0:return 0;case K.Digit1:return 1;case K.Digit2:return 2;case K.Digit3:return 3;case K.Digit4:return 4;case K.Digit5:return 5;case K.Digit6:return 6;case K.Digit7:return 7;case K.Digit8:return 8;case K.Digit9:return 9;case K.a:case K.A:return 10;case K.b:case K.B:return 11;case K.c:case K.C:return 12;case K.d:case K.D:return 13;case K.e:case K.E:return 14;case K.f:case K.F:return 15}return 0}t.formatRGB=function(t){return 1===t.rgba.a?"rgb("+t.rgba.r+", "+t.rgba.g+", "+t.rgba.b+")":Z.Format.CSS.formatRGBA(t)},t.formatRGBA=function(t){return"rgba("+t.rgba.r+", "+t.rgba.g+", "+t.rgba.b+", "+ +t.rgba.a.toFixed(2)+")"},t.formatHSL=function(t){return 1===t.hsla.a?"hsl("+t.hsla.h+", "+(100*t.hsla.s).toFixed(2)+"%, "+(100*t.hsla.l).toFixed(2)+"%)":Z.Format.CSS.formatHSLA(t)},t.formatHSLA=function(t){return"hsla("+t.hsla.h+", "+(100*t.hsla.s).toFixed(2)+"%, "+(100*t.hsla.l).toFixed(2)+"%, "+t.hsla.a.toFixed(2)+")"},t.formatHex=function(t){return"#"+e(t.rgba.r)+e(t.rgba.g)+e(t.rgba.b)},t.formatHexA=function(t,o){return void 0===o&&(o=!1),o&&1===t.rgba.a?Z.Format.CSS.formatHex(t):"#"+e(t.rgba.r)+e(t.rgba.g)+e(t.rgba.b)+e(Math.round(255*t.rgba.a))},t.format=function(t){return t.isOpaque()?Z.Format.CSS.formatHex(t):Z.Format.CSS.formatRGBA(t)},t.parseHex=function(t){var e=t.length;if(0===e)return null;if(t.charCodeAt(0)!==K.Hash)return null;if(7===e){var n=16*o(t.charCodeAt(1))+o(t.charCodeAt(2)),r=16*o(t.charCodeAt(3))+o(t.charCodeAt(4)),i=16*o(t.charCodeAt(5))+o(t.charCodeAt(6));return new Z(new tt(n,r,i,1))}if(9===e){n=16*o(t.charCodeAt(1))+o(t.charCodeAt(2)),r=16*o(t.charCodeAt(3))+o(t.charCodeAt(4)),i=16*o(t.charCodeAt(5))+o(t.charCodeAt(6));var a=16*o(t.charCodeAt(7))+o(t.charCodeAt(8));return new Z(new tt(n,r,i,a/255))}return 4===e?(n=o(t.charCodeAt(1)),r=o(t.charCodeAt(2)),i=o(t.charCodeAt(3)),new Z(new tt(16*n+n,16*r+r,16*i+i))):5===e?(n=o(t.charCodeAt(1)),r=o(t.charCodeAt(2)),i=o(t.charCodeAt(3)),a=o(t.charCodeAt(4)),new Z(new tt(16*n+n,16*r+r,16*i+i,(16*a+a)/255))):null}}((J=Z.Format||(Z.Format={})).CSS||(J.CSS={}));var rt,it,at=function(t,e){var o,n,r,i,a={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function s(i){return function(s){return function(i){if(o)throw new TypeError("Generator is already executing.");for(;a;)try{if(o=1,n&&(r=2&i[0]?n.return:i[0]?n.throw||((r=n.return)&&r.call(n),0):n.next)&&!(r=r.call(n,i[1])).done)return r;switch(n=0,r&&(i=[2&i[0],r.value]),i[0]){case 0:case 1:r=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,n=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!(r=a.trys,(r=r.length>0&&r[r.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!r||i[1]>r[0]&&i[1]<r[3])){a.label=i[1];break}if(6===i[0]&&a.label<r[1]){a.label=r[1],r=i;break}if(r&&a.label<r[2]){a.label=r[2],a.ops.push(i);break}r[2]&&a.ops.pop(),a.trys.pop();continue}i=e.call(t,a)}catch(t){i=[6,t],n=0}finally{o=r=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}},st=function(){function t(e){this.element=e,this.next=t.Undefined,this.prev=t.Undefined}return t.Undefined=new t(void 0),t}(),ut=function(){function t(){this._first=st.Undefined,this._last=st.Undefined,this._size=0}return Object.defineProperty(t.prototype,"size",{get:function(){return this._size},enumerable:!1,configurable:!0}),t.prototype.isEmpty=function(){return this._first===st.Undefined},t.prototype.clear=function(){this._first=st.Undefined,this._last=st.Undefined,this._size=0},t.prototype.unshift=function(t){return this._insert(t,!1)},t.prototype.push=function(t){return this._insert(t,!0)},t.prototype._insert=function(t,e){var o=this,n=new st(t);if(this._first===st.Undefined)this._first=n,this._last=n;else if(e){var r=this._last;this._last=n,n.prev=r,r.next=n}else{var i=this._first;this._first=n,n.next=i,i.prev=n}this._size+=1;var a=!1;return function(){a||(a=!0,o._remove(n))}},t.prototype.shift=function(){if(this._first!==st.Undefined){var t=this._first.element;return this._remove(this._first),t}},t.prototype.pop=function(){if(this._last!==st.Undefined){var t=this._last.element;return this._remove(this._last),t}},t.prototype._remove=function(t){if(t.prev!==st.Undefined&&t.next!==st.Undefined){var e=t.prev;e.next=t.next,t.next.prev=e}else t.prev===st.Undefined&&t.next===st.Undefined?(this._first=st.Undefined,this._last=st.Undefined):t.next===st.Undefined?(this._last=this._last.prev,this._last.next=st.Undefined):t.prev===st.Undefined&&(this._first=this._first.next,this._first.prev=st.Undefined);this._size-=1},t.prototype[Symbol.iterator]=function(){var t;return at(this,(function(e){switch(e.label){case 0:t=this._first,e.label=1;case 1:return t===st.Undefined?[3,3]:[4,t.element];case 2:return e.sent(),t=t.next,[3,1];case 3:return[2]}}))},t.prototype.toArray=function(){for(var t=[],e=this._first;e!==st.Undefined;e=e.next)t.push(e.element);return t},t}(),lt=function(t){var e="function"==typeof Symbol&&Symbol.iterator,o=e&&t[e],n=0;if(o)return o.call(t);if(t&&"number"==typeof t.length)return{next:function(){return t&&n>=t.length&&(t=void 0),{value:t&&t[n++],done:!t}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")},ht=function(t,e){var o="function"==typeof Symbol&&t[Symbol.iterator];if(!o)return t;var n,r,i=o.call(t),a=[];try{for(;(void 0===e||e-- >0)&&!(n=i.next()).done;)a.push(n.value)}catch(t){r={error:t}}finally{try{n&&!n.done&&(o=i.return)&&o.call(i)}finally{if(r)throw r.error}}return a},ct=function(){function t(){this._disposed=!1}return Object.defineProperty(t.prototype,"event",{get:function(){var e=this;return this._event||(this._event=function(o,r,i){e._listeners||(e._listeners=new ut);var a,s=e._listeners.push(r?[o,r]:o);return a={dispose:function(){a.dispose=t._noop,e._disposed||s()}},i instanceof n?i.add(a):Array.isArray(i)&&i.push(a),a}),this._event},enumerable:!1,configurable:!0}),t.prototype.fire=function(t){var e,o;if(this._listeners){this._deliveryQueue||(this._deliveryQueue=new ut);try{for(var n=lt(this._listeners),r=n.next();!r.done;r=n.next()){var i=r.value;this._deliveryQueue.push([i,t])}}catch(t){e={error:t}}finally{try{r&&!r.done&&(o=n.return)&&o.call(n)}finally{if(e)throw e.error}}for(;this._deliveryQueue.size>0;){var a=ht(this._deliveryQueue.shift(),2),s=(i=a[0],a[1]);try{"function"==typeof i?i.call(void 0,s):i[0].call(i[1],s)}catch(t){setTimeout((function(){if(t.stack)throw new Error(t.message+"\n\n"+t.stack);throw t}),0)}}}},t.prototype.dispose=function(){this._listeners&&this._listeners.clear(),this._deliveryQueue&&this._deliveryQueue.clear(),this._disposed=!0},t._noop=function(){},t}(),ft=function(){var t=function(e,o){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o])})(e,o)};return function(e,o){function n(){this.constructor=e}t(e,o),e.prototype=null===o?Object.create(o):(n.prototype=o.prototype,new n)}}(),dt=H,pt=function(t){function e(e,o){var n=t.call(this)||this;n.model=o,n.domNode=dt(".colorpicker-header"),b(e,n.domNode),n.pickedColorNode=b(n.domNode,dt(".picked-color"));var r=b(n.domNode,dt(".original-color"));return r.style.backgroundColor=nt.Format.CSS.format(n.model.originalColor)||"",n.backgroundColor=nt.white,n._register(w(n.pickedColorNode,S,(function(){return n.model.selectNextColorPresentation()}))),n._register(w(r,S,(function(){n.model.color=n.model.originalColor,n.model.flushColor()}))),n._register(o.onDidChangeColor(n.onDidChangeColor,n)),n._register(o.onDidChangePresentation(n.onDidChangePresentation,n)),n.pickedColorNode.style.backgroundColor=nt.Format.CSS.format(o.color)||"",C(n.pickedColorNode,"light",o.color.rgba.a<.5?n.backgroundColor.isLighter():o.color.isLighter()),n}return ft(e,t),e.prototype.onDidChangeColor=function(t){this.pickedColorNode.style.backgroundColor=nt.Format.CSS.format(t)||"",C(this.pickedColorNode,"light",t.rgba.a<.5?this.backgroundColor.isLighter():t.isLighter()),this.onDidChangePresentation()},e.prototype.onDidChangePresentation=function(){this.pickedColorNode.textContent=this.model.presentation?this.model.presentation.label:""},e}(r),gt=function(t){function e(e,o,n){var r=t.call(this)||this;return r.model=o,r.pixelRatio=n,r.domNode=dt(".colorpicker-body"),b(e,r.domNode),r.saturationBox=new mt(r.domNode,r.model,r.pixelRatio),r._register(r.saturationBox),r._register(r.saturationBox.onDidChange(r.onDidSaturationValueChange,r)),r._register(r.saturationBox.onColorFlushed(r.flushColor,r)),r.opacityStrip=new vt(r.domNode,r.model),r._register(r.opacityStrip),r._register(r.opacityStrip.onDidChange(r.onDidOpacityChange,r)),r._register(r.opacityStrip.onColorFlushed(r.flushColor,r)),r.hueStrip=new bt(r.domNode,r.model),r._register(r.hueStrip),r._register(r.hueStrip.onDidChange(r.onDidHueChange,r)),r._register(r.hueStrip.onColorFlushed(r.flushColor,r)),r}return ft(e,t),e.prototype.flushColor=function(){this.model.flushColor()},e.prototype.onDidSaturationValueChange=function(t){var e=t.s,o=t.v,n=this.model.color.hsva;this.model.color=new nt(new ot(n.h,e,o,n.a))},e.prototype.onDidOpacityChange=function(t){var e=this.model.color.hsva;this.model.color=new nt(new ot(e.h,e.s,e.v,t))},e.prototype.onDidHueChange=function(t){var e=this.model.color.hsva,o=360*(1-t);this.model.color=new nt(new ot(360===o?0:o,e.s,e.v,e.a))},e.prototype.layout=function(){this.saturationBox.layout(),this.opacityStrip.layout(),this.hueStrip.layout()},e}(r),mt=function(t){function e(e,o,n){var r=t.call(this)||this;return r.model=o,r.pixelRatio=n,r._onDidChange=new ct,r.onDidChange=r._onDidChange.event,r._onColorFlushed=new ct,r.onColorFlushed=r._onColorFlushed.event,r.domNode=dt(".saturation-wrap"),b(e,r.domNode),r.canvas=document.createElement("canvas"),r.canvas.className="saturation-box",b(r.domNode,r.canvas),r.selection=dt(".saturation-selection"),b(r.domNode,r.selection),r.layout(),r._register(O(r.domNode,(function(t){return r.onMouseDown(t)}))),r._register(r.model.onDidChangeColor(r.onDidChangeColor,r)),r.monitor=null,r}return ft(e,t),e.prototype.onMouseDown=function(t){var e=this;this.monitor=this._register(new Y);var o=E(this.domNode);t.target!==this.selection&&this.onDidChangePosition(t.offsetX,t.offsetY),this.monitor.startMonitoring(t.target,t.buttons,V,(function(t){return e.onDidChangePosition(t.posx-o.left,t.posy-o.top)}),(function(){return null}));var n=L(document,(function(){e._onColorFlushed.fire(),n.dispose(),e.monitor&&(e.monitor.stopMonitoring(!0),e.monitor=null)}),!0)},e.prototype.onDidChangePosition=function(t,e){var o=Math.max(0,Math.min(1,t/this.width)),n=Math.max(0,Math.min(1,1-e/this.height));this.paintSelection(o,n),this._onDidChange.fire({s:o,v:n})},e.prototype.layout=function(){this.width=this.domNode.offsetWidth,this.height=this.domNode.offsetHeight,this.canvas.width=this.width*this.pixelRatio,this.canvas.height=this.height*this.pixelRatio,this.paint();var t=this.model.color.hsva;this.paintSelection(t.s,t.v)},e.prototype.paint=function(){var t=this.model.color.hsva,e=new nt(new ot(t.h,1,1,1)),o=this.canvas.getContext("2d"),n=o.createLinearGradient(0,0,this.canvas.width,0);n.addColorStop(0,"rgba(255, 255, 255, 1)"),n.addColorStop(.5,"rgba(255, 255, 255, 0.5)"),n.addColorStop(1,"rgba(255, 255, 255, 0)");var r=o.createLinearGradient(0,0,0,this.canvas.height);r.addColorStop(0,"rgba(0, 0, 0, 0)"),r.addColorStop(1,"rgba(0, 0, 0, 1)"),o.rect(0,0,this.canvas.width,this.canvas.height),o.fillStyle=nt.Format.CSS.format(e),o.fill(),o.fillStyle=n,o.fill(),o.fillStyle=r,o.fill()},e.prototype.paintSelection=function(t,e){this.selection.style.left=t*this.width+"px",this.selection.style.top=this.height-e*this.height+"px"},e.prototype.onDidChangeColor=function(){this.monitor&&this.monitor.isMonitoring()||this.paint()},e}(r),yt=function(t){function e(e,o){var n=t.call(this)||this;return n.model=o,n._onDidChange=new ct,n.onDidChange=n._onDidChange.event,n._onColorFlushed=new ct,n.onColorFlushed=n._onColorFlushed.event,n.domNode=b(e,dt(".strip")),n.overlay=b(n.domNode,dt(".overlay")),n.slider=b(n.domNode,dt(".slider")),n.slider.style.top="0px",n._register(O(n.domNode,(function(t){return n.onMouseDown(t)}))),n.layout(),n}return ft(e,t),e.prototype.layout=function(){this.height=this.domNode.offsetHeight-this.slider.offsetHeight;var t=this.getValue(this.model.color);this.updateSliderPosition(t)},e.prototype.onMouseDown=function(t){var e=this,o=this._register(new Y),n=E(this.domNode);x(this.domNode,"grabbing"),t.target!==this.slider&&this.onDidChangeTop(t.offsetY),o.startMonitoring(t.target,t.buttons,V,(function(t){return e.onDidChangeTop(t.posy-n.top)}),(function(){return null}));var r=L(document,(function(){var t,n;e._onColorFlushed.fire(),r.dispose(),o.stopMonitoring(!0),t=e.domNode,(n="grabbing")&&t.classList&&t.classList.remove(n)}),!0)},e.prototype.onDidChangeTop=function(t){var e=Math.max(0,Math.min(1,1-t/this.height));this.updateSliderPosition(e),this._onDidChange.fire(e)},e.prototype.updateSliderPosition=function(t){this.slider.style.top=(1-t)*this.height+"px"},e}(r),vt=function(t){function e(e,o){var n=t.call(this,e,o)||this;return x(n.domNode,"opacity-strip"),n._register(o.onDidChangeColor(n.onDidChangeColor,n)),n.onDidChangeColor(n.model.color),n}return ft(e,t),e.prototype.onDidChangeColor=function(t){var e=t.rgba,o=e.r,n=e.g,r=e.b,i=new nt(new tt(o,n,r,1)),a=new nt(new tt(o,n,r,0));this.overlay.style.background="linear-gradient(to bottom, "+i+" 0%, "+a+" 100%)"},e.prototype.getValue=function(t){return t.hsva.a},e}(yt),bt=function(t){function e(e,o){var n=t.call(this,e,o)||this;return x(n.domNode,"hue-strip"),n}return ft(e,t),e.prototype.getValue=function(t){return 1-t.hsva.h/360},e}(yt),_t=function(t){function e(e,o,n){var r=t.call(this)||this;r.model=o,r.pixelRatio=n;var i=dt(".colorpicker-widget");e.appendChild(i);var a=new pt(i,r.model);return r.body=new gt(i,r.model,r.pixelRatio),r._register(a),r._register(r.body),r}return ft(e,t),e.prototype.getId=function(){return e.ID},e.prototype.layout=function(){this.body.layout()},e.ID="editor.contrib.colorPickerWidget",e}(r),wt=function(){function t(t,e,o){this.presentationIndex=o,this._onColorFlushed=new ct,this.onColorFlushed=this._onColorFlushed.event,this._onDidChangeColor=new ct,this.onDidChangeColor=this._onDidChangeColor.event,this._onDidChangePresentation=new ct,this.onDidChangePresentation=this._onDidChangePresentation.event,this.originalColor=t,this._color=t,this._colorPresentations=e}return Object.defineProperty(t.prototype,"color",{get:function(){return this._color},set:function(t){this._color.equals(t)||(this._color=t,this._onDidChangeColor.fire(t))},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"presentation",{get:function(){return this.colorPresentations[this.presentationIndex]},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"colorPresentations",{get:function(){return this._colorPresentations},set:function(t){this._colorPresentations=t,this.presentationIndex>t.length-1&&(this.presentationIndex=0),this._onDidChangePresentation.fire(this.presentation)},enumerable:!1,configurable:!0}),t.prototype.selectNextColorPresentation=function(){this.presentationIndex=(this.presentationIndex+1)%this.colorPresentations.length,this.flushColor(),this._onDidChangePresentation.fire(this.presentation)},t.prototype.guessColorPresentation=function(t,e){for(var o=0;o<this.colorPresentations.length;o++)if(e.toLowerCase()===this.colorPresentations[o].label){this.presentationIndex=o,this._onDidChangePresentation.fire(this.presentation);break}},t.prototype.flushColor=function(){this._onColorFlushed.fire(this._color)},t}(),Ct=function(){function t(e,o,n){var r=this;void 0===o&&(o="#0000"),void 0===n&&(n=1),this._formatTypes=[1,2,3],this._formatIndex=this._formatTypes.length-1,"string"==typeof o&&(o=o.trim());var i=t.toColor(o),a=t.formatColor(i,this._formatTypes[this._formatIndex]);this._model=new wt(i,[{label:a}],0),this._model.onDidChangeColor((function(e){r._model.presentation.label=t.formatColor(e,r._formatTypes[r._formatIndex])})),this._model.onColorFlushed((function(){r._widget.body.layout()})),this._model.onDidChangePresentation((function(){r._formatIndex=(r._formatIndex+1)%r._formatTypes.length,r._model.presentation.label=t.formatColor(r._model.color,r._formatTypes[r._formatIndex])})),this._widget=new _t(e,this._model,n),this._model.guessColorPresentation(i,a),this._widget.body.layout(),this._onResize=function(t){r._widget.body.layout()},window.addEventListener("resize",this._onResize)}return t.toColor=function(t){if(t instanceof nt)return t;var e;if(t.charCodeAt(0)===K.Hash)return nt.fromHex(t);if(e=t.match(/^rgb\(\s*([1-9]|[1-9][0-9]|[12][0-9][0-9])\s*,\s*([1-9]|[1-9][0-9]|[12][0-9][0-9])\s*,\s*([1-9]|[1-9][0-9]|[12][0-9][0-9])\s*\)$/))return new nt(new tt(Number(e[1]),Number(e[2]),Number(e[3])));if(e=t.match(/^rgba\(\s*([1-9]|[1-9][0-9]|[12][0-9][0-9])\s*,\s*([1-9]|[1-9][0-9]|[12][0-9][0-9])\s*,\s*([1-9]|[1-9][0-9]|[12][0-9][0-9])\s*,\s*([01](\.[0-9]+)?)\s*\)$/))return new nt(new tt(Number(e[1]),Number(e[2]),Number(e[3]),Number(e[4])));if(e=t.match(/^hsl\(\s*([1-9]|[1-9][0-9]|[123][0-9][0-9])\s*,\s*([01](\.[0-9]+)?)\s*,\s*([01](\.[0-9]+)?)\s*\)$/))return new nt(new et(Number(e[1]),Number(e[2]),Number(e[3]),1));if(e=t.match(/^hsla\(\s*([1-9]|[1-9][0-9]|[123][0-9][0-9])\s*,\s*([01](\.[0-9]+)?)\s*,\s*([01](\.[0-9]+)?)\s*,\s*([01](\.[0-9]+)?)\s*\)$/))return new nt(new et(Number(e[1]),Number(e[2]),Number(e[3]),Number(e[4])));throw new TypeError("Invalid color.")},t.formatColor=function(e,o){switch(void 0===o&&(o=t.ColorType.DEFAULT),o){case t.ColorType.DEFAULT:return e.toString();case t.ColorType.RGB:return e.isOpaque()?nt.Format.CSS.formatRGB(e):nt.Format.CSS.formatRGBA(e);case t.ColorType.HEX:return e.isOpaque()?nt.Format.CSS.formatHex(e):nt.Format.CSS.formatHexA(e);case t.ColorType.HSL:return e.isOpaque()?nt.Format.CSS.formatHSL(e):nt.Format.CSS.formatHSLA(e);default:return""}},t.prototype.getColor=function(){return this._model.color},t.prototype.setColor=function(e){this._model.color=t.toColor(e),this._widget.body.layout()},t.prototype.onColorChanged=function(t,e){this._model.onDidChangeColor(t,e)},t.prototype.onColorFlushed=function(t,e){this._model.onColorFlushed(t,e)},t.prototype.onPresentationChanged=function(t,e){this._model.onDidChangePresentation((function(o){return t.call(e,o.label)}))},t.prototype.dispose=function(){window.removeEventListener("resize",this._onResize),this._widget.dispose()},t}();it=Ct||(Ct={}),(rt=it.ColorType||(it.ColorType={}))[rt.DEFAULT=0]="DEFAULT",rt[rt.RGB=1]="RGB",rt[rt.HEX=2]="HEX",rt[rt.HSL=3]="HSL"}])}));