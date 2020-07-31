# vscode-color-picker

演示: [https://toyobayashi.gitee.io/vscode-color-picker/](https://toyobayashi.gitee.io/vscode-color-picker/)

## 用法

### CDN

纯 JS：

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

Vue：

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

纯 JS：

``` js
import '@tybys/vscode-color-picker/lib/vscode-color-picker.css'
import { ColorPicker } from '@tybys/vscode-color-picker'

const initialColor = '#aaa'
const picker = new ColorPicker(document.getElementById('container'), initialColor)
```

Vue：

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

React：

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

## API

[TypeScript 声明](./lib/vscode-color-picker.d.ts)

### 组件参数

#### 属性

* color: `string | vscodeColorPicker.Color`

    可以是 RGB / HEX / HSL。

* presentations: `vscodeColorPicker.ColorPickerPresentation[]`

    颜色栏中显示的字符串，点击后可循环数组切换显示。

* presentationIndex: `number`

    最开始要显示的 presentation 在 presentations 中的索引。

* pixelRatio: `number`

    颜色画布的像素缩放比例。

#### 事件

* change: `(e: vscodeColorPicker.Color) => any`

    当前选中的颜色发生变化时触发。参数是变化后的颜色。

* flush: `(e: vscodeColorPicker.Color) => any`

    当鼠标放开时或还原颜色后触发。参数是最终确定的颜色。

* presentation: `(e: vscodeColorPicker.ColorPickerPresentation, index: number) => any`

    当点击最上方左侧的当前选中颜色栏时触发。参数是颜色栏中显示的字符串和它在数组中的索引。

`v-model="color"` 等价于 `:color="color" @change="color = $event"`

如果要设置右上角的原始颜色，Vue 通过 `ref` 直接调用组件的 `setOriginalColor(color: string | vscodeColorPicker.Color): void` 方法。

``` vue
<template>
<VscodeColorPicker ref="picker" />
</template>

<script>
export default {
  methods: {
    onSomeEvent () {
      this.$refs.picker.setOriginalColor('#987')
    }
  }
}
</script>
```

React 在父组件通过 `onCreate` 事件获取组件实例后再调用实例方法 `setOriginalColor(color: string | vscodeColorPicker.Color): void`。

``` jsx
class App extends React.Component {
  constructor (props) { /* ... */ }

  render () {
    return <VscodeColorPicker onCreate={(instance) => { this.picker = instance }}>
  }

  onSomeEvent () {
    this.picker.setOriginalColor('#987')
  }
}
```
