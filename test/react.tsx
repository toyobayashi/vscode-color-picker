import '../lib/vscode-color-picker.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { ColorPicker } from '..'
import VscodeColorPicker from '../lib/react/index'

// declare const React: typeof import('react')
// declare const ReactDOM: typeof import('react-dom')

class App extends React.Component<{}, {
  show: boolean;
  color: string;
  originalColor: string;
  presentation: string;
  pixelRatio: number;
}> {
  private picker: VscodeColorPicker | null = null
  private colorTypes: ColorPicker.ColorType[] = [ColorPicker.ColorType.RGB, ColorPicker.ColorType.HEX, ColorPicker.ColorType.HSL]
  private activeType: number = 0
  constructor (props) {
    super(props)

    let initialColor = '#187'
    const color = ColorPicker.toColor(initialColor)

    this.state = {
      show: true,
      color: initialColor,
      originalColor: initialColor,
      presentation: ColorPicker.formatColor(color, this.colorTypes[this.activeType]),
      pixelRatio: 1
    }

    this.onChange = this.onChange.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onClickSet = this.onClickSet.bind(this)
  }

  render () {
    return (
      <div id="test">
        {this.state.show ? <VscodeColorPicker
          onCreate={(instance) => { this.picker = instance }}
          color={this.state.color}
          presentation={this.state.presentation}
          pixelRatio={this.state.pixelRatio}
          onChange={this.onChange}
          onPresentation={(p) => {
            console.log(p)
            this.activeType = (this.activeType + 1) % this.colorTypes.length
            this.setState({
              presentation: ColorPicker.formatColor(this.state.color, this.colorTypes[this.activeType]),
            })
          }}
        /> : undefined}
        <button onClick={this.onClick}>{this.state.show ? 'confirm' : 'pick'}</button>
        <button onClick={this.onClickSet}>set</button>
        <p>picked: {this.state.color.toString()}</p>
        <p>original: {this.state.originalColor.toString()}</p>
      </div>
    )
  }

  onClickSet () {
    const color = '#89a'
    this.setState((prevState) => {
      return {
        color,
        ...(prevState.show ? {} as any : { originalColor: color }),
        presentation: ColorPicker.formatColor(color, this.colorTypes[this.activeType])
      }
    })
    // this.picker.setOriginalColor('#987')
  }

  onClick () {
    this.setState((prev) => {
      return {
        show: !prev.show,
        originalColor: this.state.color
      }
    })
  }

  onChange (e) {
    this.setState({
      color: ColorPicker.formatColor(e, ColorPicker.ColorType.RGB),
      presentation: ColorPicker.formatColor(e, this.colorTypes[this.activeType])
    })
  }
}

ReactDOM.render(<App />, document.getElementById('test'))

if ((module as any).hot) {
  (module as any).hot.accept()
}
