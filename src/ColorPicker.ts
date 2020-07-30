import { ColorPickerWidget } from 'vs/editor/contrib/colorPicker/colorPickerWidget'
import { ColorPickerModel } from 'vs/editor/contrib/colorPicker/ColorPickerModel'
import { Color, RGBA, HSLA, HSVA } from 'vs/base/common/color'
import { CharCode } from 'vs/base/common/charCode'
import { IDisposable } from 'vs/base/common/lifecycle'

function ThrowInvalidColor (color: unknown): never {
  throw new TypeError(`Invalid color: ${color}`)
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

  public static formatColor (color: Color, type: ColorPicker.ColorType = ColorPicker.ColorType.DEFAULT): string {
    if (!(color instanceof Color)) {
      ThrowInvalidColor(color)
    }
    switch (type) {
      case ColorPicker.ColorType.DEFAULT: return color.toString()
      case ColorPicker.ColorType.RGB: return color.isOpaque() ? Color.Format.CSS.formatRGB(color) : Color.Format.CSS.formatRGBA(color)
      case ColorPicker.ColorType.HEX: return color.isOpaque() ? Color.Format.CSS.formatHex(color) : Color.Format.CSS.formatHexA(color)
      case ColorPicker.ColorType.HSL: return color.isOpaque() ? Color.Format.CSS.formatHSL(color) : Color.Format.CSS.formatHSLA(color)
      default: return ''
    }
  }

  public constructor (container: Node, color: string | Color = '#0000', pixelRatio: number = 1) {
    const colorInstance = ColorPicker.toColor(color)
    const label = ColorPicker.formatColor(colorInstance, ColorPicker.ColorType.RGB)

    this._model = new ColorPickerModel(colorInstance, [], 0)
    this._model.colorPresentations = [
      { label },
      { label: ColorPicker.formatColor(colorInstance, ColorPicker.ColorType.HEX) },
      { label: ColorPicker.formatColor(colorInstance, ColorPicker.ColorType.HSL) },
    ]
    
    this._model.onDidChangeColor((e) => {
      for (let i = 0; i < this._model.colorPresentations.length; i++) {
        this._model.colorPresentations[i].label = ColorPicker.formatColor(e, i + 1)
      }
    })
    this._model.onColorFlushed(() => {
      this._widget.body.layout()
    })

    this._widget = new ColorPickerWidget(container, this._model, pixelRatio/* , {
      getColorTheme () {
        return {
          getColor () {
            return undefined
          }
        }
      }
    } as any */)
    this._model.guessColorPresentation(colorInstance, label)
    this._widget.body.layout()

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

  public onColorChanged (listener: (color: Color) => any, thisArg?: any): void {
    this._model.onDidChangeColor(listener, thisArg)
  }

  public onColorFlushed (listener: (color: Color) => any, thisArg?: any): void {
    this._model.onColorFlushed(listener, thisArg)
  }

  public onPresentationChanged (listener: (label: string) => any, thisArg?: any): void {
    this._model.onDidChangePresentation((e) => {
      return listener.call(thisArg, e.label)
    })
  }

  public dispose (): void {
    window.removeEventListener('resize', this._onResize)
    this._widget.dispose()
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
