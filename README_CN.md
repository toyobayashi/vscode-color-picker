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
```

Vue：

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

## API

[TypeScript 声明](./lib/vscode-color-picker.d.ts)

### 组件参数

#### 属性

* color: `string | vscodeColorPicker.Color`

    可以是 RGB / HEX / HSL。

* presentation: `string`

    颜色栏中显示的字符串。

* pixelRatio: `number`

    颜色画布的像素缩放比例。

#### 事件

* change: `(e: vscodeColorPicker.Color) => any`

    当前选中的颜色发生变化时触发。参数是变化后的颜色。

* flush: `(e: vscodeColorPicker.Color) => any`

    当鼠标放开时或还原颜色后触发。参数是最终确定的颜色。

* presentation: `(e: string) => any`

    当点击最上方左侧的当前选中颜色栏时触发。参数是颜色栏中显示的字符串。

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
    return <VscodeColorPicker onCreate={(instance) => { this.picker = instance }} />
  }

  onSomeEvent () {
    this.picker.setOriginalColor('#987')
  }
}
```
