import '../lib/vscode-color-picker.css'
// import React from 'react'
// import ReactDOM from 'react-dom'
import { ColorPicker } from '..'
import VscodeColorPicker from '../lib/react/index'

declare const React: typeof import('react')
declare const ReactDOM: typeof import('react-dom')

class App extends React.Component<{}, { show: boolean; color: string; originalColor: string; }> {
  constructor (props) {
    super(props)

    let initialColor = '#aaa'

    this.state = {
      show: true,
      color: initialColor,
      originalColor: initialColor
    }

    this.onChange = this.onChange.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onClickSet = this.onClickSet.bind(this)
  }

  render () {
    return (
      <div id="test">
        {this.state.show ? <VscodeColorPicker color={this.state.color} onChange={this.onChange} /> : undefined}
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
      color: ColorPicker.formatColor(e, ColorPicker.ColorType.RGB)
    })
  }
}

ReactDOM.render(<App />, document.getElementById('test'))

if ((module as any).hot) {
  (module as any).hot.accept()
}
