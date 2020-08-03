import { ColorPickerWidget } from 'vs/editor/contrib/colorPicker/colorPickerWidget'
import { ColorPickerModel } from 'vs/editor/contrib/colorPicker/ColorPickerModel'
import { Color, RGBA, HSLA, HSVA } from 'vs/base/common/color'
import { CharCode } from 'vs/base/common/charCode'
import { IDisposable } from 'vs/base/common/lifecycle'
import { Emitter, Event } from 'vs/base/common/event'

declare const __PKG_VERSION__: string

function ThrowInvalidColor (color: unknown): never {
  throw new TypeError(`Invalid color: ${color}`)
}

export interface ColorPickerProps {
  color?: string | Color
  presentation?: string
  pixelRatio?: number
}

class ColorPicker implements IDisposable {
  private _model: ColorPickerModel
  private _widget: ColorPickerWidget

  private _onResize: (e: UIEvent) => void

  public static toColor (color: string | Color): Color {
    if (color instanceof Color) {
      return color
    }

    if (typeof color !== 'string') {
      ThrowInvalidColor(color)
    }
    const c = color.trim()

    let matches
    if (c.charCodeAt(0) === CharCode.Hash) {
      return Color.fromHex(c)
    } else if (matches = c.match(/^rgb\(\s*([0-9]|[1-9][0-9]|[12][0-9][0-9])\s*,\s*([0-9]|[1-9][0-9]|[12][0-9][0-9])\s*,\s*([0-9]|[1-9][0-9]|[12][0-9][0-9])\s*\)$/)) {
      return new Color(new RGBA(Number(matches[1]), Number(matches[2]), Number(matches[3])))
    } else if (matches = c.match(/^rgba\(\s*([0-9]|[1-9][0-9]|[12][0-9][0-9])\s*,\s*([0-9]|[1-9][0-9]|[12][0-9][0-9])\s*,\s*([0-9]|[1-9][0-9]|[12][0-9][0-9])\s*,\s*([01](\.[0-9]+)?)\s*\)$/)) {
      return new Color(new RGBA(Number(matches[1]), Number(matches[2]), Number(matches[3]), Number(matches[4])))
    } else if (matches = c.match(/^hsl\(\s*([0-9]|[1-9][0-9]|[123][0-9][0-9])\s*,\s*([01](\.[0-9]+)?)\s*,\s*([01](\.[0-9]+)?)\s*\)$/)) {
      return new Color(new HSLA(Number(matches[1]), Number(matches[2]), Number(matches[3]), 1))
    } else if (matches = c.match(/^hsla\(\s*([0-9]|[1-9][0-9]|[123][0-9][0-9])\s*,\s*([01](\.[0-9]+)?)\s*,\s*([01](\.[0-9]+)?)\s*,\s*([01](\.[0-9]+)?)\s*\)$/)) {
      return new Color(new HSLA(Number(matches[1]), Number(matches[2]), Number(matches[3]), Number(matches[4])))
    } else {
      ThrowInvalidColor(color)
    }
  }

  public static formatColor (color: string | Color, type: ColorPicker.ColorType = ColorPicker.ColorType.DEFAULT): string {
    if (!(color instanceof Color)) {
      try {
        color = ColorPicker.toColor(color)
      } catch (err) {
        throw err
      }
    }
    switch (type) {
      case ColorPicker.ColorType.DEFAULT: return color.toString()
      case ColorPicker.ColorType.RGB: return color.isOpaque() ? Color.Format.CSS.formatRGB(color) : Color.Format.CSS.formatRGBA(color)
      case ColorPicker.ColorType.HEX: return color.isOpaque() ? Color.Format.CSS.formatHex(color) : Color.Format.CSS.formatHexA(color)
      case ColorPicker.ColorType.HSL: return color.isOpaque() ? Color.Format.CSS.formatHSL(color) : Color.Format.CSS.formatHSLA(color)
      default: return ''
    }
  }

  public constructor (container: Node, props?: ColorPickerProps) {
    const _props: ColorPickerProps = props ?? {}
    const color = _props.color ?? '#0000'
    const presentation = _props.presentation ?? ''
    const presentations = [{ label: presentation }]
    const presentationIndex = 0
    const pixelRatio = _props.pixelRatio ?? 1

    const colorInstance = ColorPicker.toColor(color)

    this._model = new ColorPickerModel(colorInstance, [], presentationIndex)
    this._model.colorPresentations = presentations

    this._model.onDidChangeColor((e) => {
      this._onDidChangeColor.fire(e)
    })
    this._model.onColorFlushed((e) => {
      this._onColorFlushed.fire(e)
      this._widget.body.layout()
    })
    this._model.onDidChangePresentation((e) => {
      this._onDidChangePresentation.fire((e && e.label) ?? '')
    })

    this._widget = new ColorPickerWidget(container, this._model, pixelRatio)

    if (presentations[presentationIndex] && presentations[presentationIndex].label) {
      this._model.guessColorPresentation(colorInstance, presentations[presentationIndex].label)
      this._widget.body.layout()
    }

    this._onResize = (_e: UIEvent) => {
      this._widget.body.layout()
    }
    window.addEventListener('resize', this._onResize)
  }

  public getColor (): Color {
    return this._model.color
  }

  public setColor (color: string | Color): void {
    this._model.color = ColorPicker.toColor(color)
    this._widget.body.layout()
  }

  public getPresentation (): string {
    return this._model.presentation.label
  }

  public setPresentation (presentation: string): void {
    this._model.colorPresentations[0].label = presentation
    const pickedColorNode = document.getElementsByClassName('picked-color')[0]
    if (pickedColorNode) {
      pickedColorNode.textContent = this._model.presentation ? this._model.presentation.label : ''
    }
  }

  public getPixelRatio (): number {
    return (this._widget.body as any).saturationBox.pixelRatio
  }

  public setPixelRatio (ratio: number): void {
    if (ratio === (this._widget as any).body.saturationBox.pixelRatio) return
    if (ratio < 0) {
      throw new TypeError('Ratio must be a positive number.')
    }
    (this._widget as any).pixelRatio = ratio;
    (this._widget as any).body.pixelRatio = ratio;
    (this._widget as any).body.saturationBox.pixelRatio = ratio
    this._widget.body.layout()
  }

  public getOriginalColor (): Color {
    return this._model.originalColor
  }

  public setOriginalColor (color: string | Color): void {
    const colorBox: Element | undefined = document.getElementsByClassName('original-color')[0]
    if (colorBox === undefined) {
      return
    }
    (this._model as any).originalColor = ColorPicker.toColor(color);
    (colorBox as HTMLDivElement).style.backgroundColor = Color.Format.CSS.format((this._model as any).originalColor) || ''
  }

  private readonly _onColorFlushed = new Emitter<Color>();
	public readonly onColorFlushed: Event<Color> = this._onColorFlushed.event;

	private readonly _onDidChangeColor = new Emitter<Color>();
	public readonly onColorChanged: Event<Color> = this._onDidChangeColor.event;

	private readonly _onDidChangePresentation = new Emitter<string>();
	public readonly onPresentationChanged: Event<string> = this._onDidChangePresentation.event;

  public dispose (): void {
    this._onDidChangeColor.dispose()
    this._onColorFlushed.dispose()
    this._onDidChangePresentation.dispose()
    window.removeEventListener('resize', this._onResize)
    this._widget.dispose()
  }

  public static get version (): string {
    return __PKG_VERSION__
  }
}

namespace ColorPicker {
  export enum ColorType {
    DEFAULT,
    RGB,
    HEX,
    HSL
  }
}

export { Color, ColorPicker, HSLA, HSVA, RGBA }
