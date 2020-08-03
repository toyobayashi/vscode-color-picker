export declare class RGBA {
	/**
	 * Red: integer in [0-255]
	 */
	readonly r: number;

	/**
	 * Green: integer in [0-255]
	 */
	readonly g: number;

	/**
	 * Blue: integer in [0-255]
	 */
	readonly b: number;

	/**
	 * Alpha: float in [0-1]
	 */
	readonly a: number;

	constructor(r: number, g: number, b: number, a?: number);

	static equals(a: RGBA, b: RGBA): boolean;
}

export declare class HSLA {
	/**
	 * Hue: integer in [0, 360]
	 */
	readonly h: number;

	/**
	 * Saturation: float in [0, 1]
	 */
	readonly s: number;

	/**
	 * Luminosity: float in [0, 1]
	 */
	readonly l: number;

	/**
	 * Alpha: float in [0, 1]
	 */
	readonly a: number;

	constructor(h: number, s: number, l: number, a: number);

	static equals(a: HSLA, b: HSLA): boolean;

	/**
	 * Converts an RGB color value to HSL. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	 * Assumes r, g, and b are contained in the set [0, 255] and
	 * returns h in the set [0, 360], s, and l in the set [0, 1].
	 */
	static fromRGBA(rgba: RGBA): HSLA;

	/**
	 * Converts an HSL color value to RGB. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	 * Assumes h in the set [0, 360] s, and l are contained in the set [0, 1] and
	 * returns r, g, and b in the set [0, 255].
	 */
	static toRGBA(hsla: HSLA): RGBA;
}

export declare class HSVA {
	/**
	 * Hue: integer in [0, 360]
	 */
	readonly h: number;

	/**
	 * Saturation: float in [0, 1]
	 */
	readonly s: number;

	/**
	 * Value: float in [0, 1]
	 */
	readonly v: number;

	/**
	 * Alpha: float in [0, 1]
	 */
	readonly a: number;

	constructor(h: number, s: number, v: number, a: number);

	static equals(a: HSVA, b: HSVA): boolean;

	// from http://www.rapidtables.com/convert/color/rgb-to-hsv.htm
	static fromRGBA(rgba: RGBA): HSVA;

	// from http://www.rapidtables.com/convert/color/hsv-to-rgb.htm
	static toRGBA(hsva: HSVA): RGBA;
}

export declare class Color {

	static fromHex(hex: string): Color;

	readonly rgba: RGBA;
	private _hsla?: HSLA;
	get hsla(): HSLA;

	get hsva(): HSVA;

	constructor(arg: RGBA | HSLA | HSVA);

	equals(other: Color | null): boolean;

	/**
	 * http://www.w3.org/TR/WCAG20/#relativeluminancedef
	 * Returns the number in the set [0, 1]. O => Darkest Black. 1 => Lightest white.
	 */
	getRelativeLuminance(): number;

	/**
	 * http://www.w3.org/TR/WCAG20/#contrast-ratiodef
	 * Returns the contrast ration number in the set [1, 21].
	 */
	getContrastRatio(another: Color): number;

	/**
	 *	http://24ways.org/2010/calculating-color-contrast
	 *  Return 'true' if darker color otherwise 'false'
	 */
	isDarker(): boolean;

	/**
	 *	http://24ways.org/2010/calculating-color-contrast
	 *  Return 'true' if lighter color otherwise 'false'
	 */
	isLighter(): boolean;

	isLighterThan(another: Color): boolean;

	isDarkerThan(another: Color): boolean;

	lighten(factor: number): Color;

	darken(factor: number): Color;

	transparent(factor: number): Color;

	isTransparent(): boolean;

	isOpaque(): boolean;

	opposite(): Color;

	blend(c: Color): Color;

	makeOpaque(opaqueBackground: Color): Color;

	flatten(...backgrounds: Color[]): Color;

	toString(): string;

	static getLighterColor(of: Color, relative: Color, factor?: number): Color;

	static getDarkerColor(of: Color, relative: Color, factor?: number): Color;

	static readonly white: Color;
	static readonly black: Color;
	static readonly red: Color;
	static readonly blue: Color;
	static readonly green: Color;
	static readonly cyan: Color;
	static readonly lightgrey: Color;
	static readonly transparent: Color;
}

export declare interface ColorPickerProps {
  color?: string | Color
  presentation?: string
  pixelRatio?: number
}

export declare namespace ColorPicker {
  export enum ColorType {
    DEFAULT,
    RGB,
    HEX,
    HSL
  }
}

export declare interface IDisposable {
	dispose(): void;
}

export interface Event<T> {
	(listener: (e: T) => any, thisArgs?: any): IDisposable;
}

export declare class ColorPicker {
  static toColor (color: string | Color): Color;

	static formatColor (color: string | Color, type?: ColorPicker.ColorType): string;
	
	static get version(): string;

  constructor (container: HTMLElement, props?: ColorPickerProps);

  getColor (): Color;

	setColor (color: string | Color): void;
	
	getPresentation (): string;

  setPresentation (presentation: string): void;

  getPixelRatio (): number;

  setPixelRatio (ratio: number): void;

  getOriginalColor (): Color;

  setOriginalColor (color: string | Color): void;

  readonly onColorChanged: Event<Color>;

  readonly onColorFlushed: Event<Color>;

  readonly onPresentationChanged: Event<string>;

  dispose (): void;
}

export as namespace vscodeColorPicker;
