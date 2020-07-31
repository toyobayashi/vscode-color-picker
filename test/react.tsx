import '../lib/vscode-color-picker.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { ColorPicker, ColorPickerPresentation } from '..'
import VscodeColorPicker from '../lib/react/index'

// declare const React: typeof import('react')
// declare const ReactDOM: typeof import('react-dom')

class App extends React.Component<{}, {
  show: boolean;
  color: string;
  originalColor: string;
  presentationIndex: number;
  pixelRatio: number;
  presentations: ColorPickerPresentation[];
}> {
  private picker: VscodeColorPicker | null = null
  constructor (props) {
    super(props)

    let initialColor = '#187'
    const color = ColorPicker.toColor(initialColor)

    this.state = {
      show: true,
      color: initialColor,
      originalColor: initialColor,
      presentationIndex: 0,
      pixelRatio: 1,
      presentations: [
        { label: ColorPicker.formatColor(color, ColorPicker.ColorType.RGB) },
        { label: ColorPicker.formatColor(color, ColorPicker.ColorType.HEX) },
        { label: ColorPicker.formatColor(color, ColorPicker.ColorType.HSL) },
      ]
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
          presentations={this.state.presentations}
          presentationIndex={this.state.presentationIndex}
          pixelRatio={this.state.pixelRatio}
          onChange={this.onChange}
          onPresentation={(p, i) => console.log(p, i)}
        /> : undefined}
        <button onClick={this.onClick}>{this.state.show ? 'confirm' : 'pick'}</button>
        <button onClick={this.onClickSet}>set</button>
        <p>picked: {this.state.color.toString()}</p>
        <p>original: {this.state.originalColor.toString()}</p>
      </div>
    )
  }
  onClickSet () {
    this.setState(() => {
      return {
        color: '#89a',
        originalColor: '#89a'
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
    this.state.presentations[0].label = ColorPicker.formatColor(e, ColorPicker.ColorType.RGB)
    this.state.presentations[1].label = ColorPicker.formatColor(e, ColorPicker.ColorType.HEX)
    this.state.presentations[2].label = ColorPicker.formatColor(e, ColorPicker.ColorType.HSL)
    this.setState({
      color: ColorPicker.formatColor(e, ColorPicker.ColorType.RGB)
    })
  }
}

ReactDOM.render(<App />, document.getElementById('test'))

if ((module as any).hot) {
  (module as any).hot.accept()
}
