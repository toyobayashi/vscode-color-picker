# vscode-color-picker

演示: [https://toyobayashi.gitee.io/vscode-color-picker/](https://toyobayashi.gitee.io/vscode-color-picker/)

## 用法

### CDN

纯 JS：

``` html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VscodeColorPicker</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/toyobayashi/vscode-color-picker/lib/vscode-color-picker.css">
</head>
<body>
  <div id="container"></div>
  <script src="https://cdn.jsdelivr.net/gh/toyobayashi/vscode-color-picker/lib/vscode-color-picker.js"></script>
  <script>
    (function () {
      var initialColor = '#aaa';
      var picker = new vscodeColorPicker.ColorPicker(document.getElementById('container'), initialColor);
    })();
  </script>
</body>
</html>
```

Vue：

``` html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VscodeColorPickerVue</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/toyobayashi/vscode-color-picker/lib/vscode-color-picker.css">
</head>
<body>
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
        },
        data: {
          color: '#aaa'
        },
        template: '<div><vscode-color-picker v-model="color"></vscode-color-picker><p>{{color}}</p></div>'
      }).$mount('#app');
    })();
  </script>
</body>
</html>
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
    <VscodeColorPicker v-model="color" />
    <!-- 相当于 -->
    <VscodeColorPicker :color="color" @change="onColorChange" />
    {{color}}
  </div>
</template>

<script>
import '@tybys/vscode-color-picker/lib/vscode-color-picker.css'
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
import VscodeColorPicker from '@tybys/vscode-color-picker/lib/react/index.js'
import React from 'react'
import ReactDOM from 'react-dom'

class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      color: '#aaa'
    }
    this.onColorChange = this.onColorChange.bind(this)
  }

  render () {
    return (
      <div id='app'>
        <VscodeColorPicker color={this.state.color} onChange={this.onColorChange} />
        {this.state.color}
      </div>
    )
  }

  onColorChange (color) {
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

* pixelRatio: `number`

    颜色画布的像素缩放比例。

#### 事件

* change: `(e: vscodeColorPicker.Color) => any`

    当前选中的颜色发生变化时触发。参数是变化后的颜色。

* flush: `(e: vscodeColorPicker.Color) => any`

    当鼠标放开时或还原颜色后触发。参数是最终确定的颜色。

* presentation: `(e: string) => any`

    当点击最上方左侧的当前选中颜色栏时触发。参数是颜色栏中显示的字符串。

#### Vue 组件双向绑定使用的属性和事件

`v-model="color"` 等价于 `:color="color" @change="color = $event"`

注意：原始颜色无法设置，必须销毁组件后重新挂载组件（Vue 可通过切换 `v-if`），组件创建时传进去的 `color` 属性为原始颜色。
