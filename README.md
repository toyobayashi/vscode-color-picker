# vscode-color-picker

Demo: [https://toyobayashi.github.io/vscode-color-picker](https://toyobayashi.github.io/vscode-color-picker)

## Usage

### CDN

Pure JavaScript:

``` html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/toyobayashi/vscode-color-picker/lib/vscode-color-picker.css">

<div id="container"></div>

<script src="https://cdn.jsdelivr.net/gh/toyobayashi/vscode-color-picker/lib/vscode-color-picker.js"></script>
<script>
  (function () {
    var ColorPicker = vscodeColorPicker.ColorPicker;
    var initialColor = '#aaa';
    var color = ColorPicker.toColor(initialColor);
    var presentations = [
      { label: ColorPicker.formatColor(color, ColorPicker.ColorType.RGB) },
      { label: ColorPicker.formatColor(color, ColorPicker.ColorType.HEX) },
      { label: ColorPicker.formatColor(color, ColorPicker.ColorType.HSL) },
    ];
    var picker = new ColorPicker(document.getElementById('container'), {
      color: initialColor,
      presentations: presentations
    });
    picker.onColorChanged(function (color) {
      var pickerPresentations = picker.getPresentations();
      pickerPresentations[0].label = ColorPicker.formatColor(color, ColorPicker.ColorType.RGB);
      pickerPresentations[1].label = ColorPicker.formatColor(color, ColorPicker.ColorType.HEX);
      pickerPresentations[2].label = ColorPicker.formatColor(color, ColorPicker.ColorType.HSL);
    });
  })();
</script>
```

Vue:

``` html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/toyobayashi/vscode-color-picker/lib/vscode-color-picker.css">

<div id="app"></div>

<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/toyobayashi/vscode-color-picker/lib/vscode-color-picker.js"></script>
<script src="https://cdn.jsdelivr.net/gh/toyobayashi/vscode-color-picker/lib/vue/global.js"></script>
<script>
  (function () {
    // Vue.component('VscodeColorPicker', VscodeColorPickerVue);
    new Vue({
      components: {
        VscodeColorPicker: VscodeColorPickerVue
      }
    }).$mount('#app');
  })();
</script>
```

### Webpack

Pure JavaScript:

``` js
import '@tybys/vscode-color-picker/lib/vscode-color-picker.css'
import { ColorPicker } from '@tybys/vscode-color-picker'
```

Vue:

``` vue
<template>
  <div id="app">
    <VscodeColorPicker :color="color" @change="onColorChange" :presentations="presentations" />
    {{color}}
  </div>
</template>

<script>
import '@tybys/vscode-color-picker/lib/vscode-color-picker.css'
import { ColorPicker } from '@tybys/vscode-color-picker'
import VscodeColorPicker from '@tybys/vscode-color-picker/lib/vue/index.js'

export default {
  components: {
    VscodeColorPicker
  },
  data () {
    const initialColor = '#aaa'
    const color = ColorPicker.toColor(initialColor)
    return {
      color: initialColor,
      presentations: [
        { label: ColorPicker.formatColor(color, ColorPicker.ColorType.RGB) },
        { label: ColorPicker.formatColor(color, ColorPicker.ColorType.HEX) },
        { label: ColorPicker.formatColor(color, ColorPicker.ColorType.HSL) },
      ]
    }
  },
  methods: {
    onColorChange (color) {
      this.color = color
      this.presentations[0].label = ColorPicker.formatColor(color, ColorPicker.ColorType.RGB)
      this.presentations[1].label = ColorPicker.formatColor(color, ColorPicker.ColorType.HEX)
      this.presentations[2].label = ColorPicker.formatColor(color, ColorPicker.ColorType.HSL)
    }
  }
}
</script>
```

React:

``` jsx
import '@tybys/vscode-color-picker/lib/vscode-color-picker.css'
import { ColorPicker } from '@tybys/vscode-color-picker'
import VscodeColorPicker from '@tybys/vscode-color-picker/lib/react/index.js'
import React from 'react'
import ReactDOM from 'react-dom'

class App extends React.Component {
  constructor (props) {
    super(props)

    const initialColor = '#aaa'
    const color = ColorPicker.toColor(initialColor)
    this.state = {
      color: initialColor,
      presentations: [
        { label: ColorPicker.formatColor(color, ColorPicker.ColorType.RGB) },
        { label: ColorPicker.formatColor(color, ColorPicker.ColorType.HEX) },
        { label: ColorPicker.formatColor(color, ColorPicker.ColorType.HSL) },
      ]
    }
    this.onColorChange = this.onColorChange.bind(this)
  }

  render () {
    return (
      <div id='app'>
        <VscodeColorPicker color={this.state.color} presentations={this.state.presentations} onChange={this.onColorChange} />
        {this.state.color}
      </div>
    )
  }

  onColorChange (color) {
    this.state.presentations[0].label = ColorPicker.formatColor(e, ColorPicker.ColorType.RGB)
    this.state.presentations[1].label = ColorPicker.formatColor(e, ColorPicker.ColorType.HEX)
    this.state.presentations[2].label = ColorPicker.formatColor(e, ColorPicker.ColorType.HSL)
    this.setState({
      color
    })
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
```
