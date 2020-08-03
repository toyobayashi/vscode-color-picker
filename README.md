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
    var picker = new ColorPicker(document.getElementById('container'), {
      color: initialColor,
      presentation: ColorPicker.formatColor(color, ColorPicker.ColorType.RGB)
    });
    picker.onColorChanged(function (color) {
      picker.setPresentation(ColorPicker.formatColor(color, ColorPicker.ColorType.RGB));
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
    <VscodeColorPicker :color="color" @change="onColorChange" :presentation="presentation" />
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
    return {
      color: '#aaa'
    }
  },
  computed: {
    presentation () {
      return ColorPicker.formatColor(this.color, ColorPicker.ColorType.RGB)
    }
  },
  methods: {
    onColorChange (color) {
      this.color = color
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
      presentation: ColorPicker.formatColor(color, ColorPicker.ColorType.RGB)
    }
    this.onColorChange = this.onColorChange.bind(this)
  }

  render () {
    return (
      <div id='app'>
        <VscodeColorPicker color={this.state.color} presentation={this.state.presentation} onChange={this.onColorChange} />
        {this.state.color}
      </div>
    )
  }

  onColorChange (color) {
    this.setState({
      color,
      presentation: ColorPicker.formatColor(color, ColorPicker.ColorType.RGB)
    })
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
```
