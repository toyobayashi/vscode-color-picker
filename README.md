# vscode-color-picker

Demo: [https://toyobayashi.github.io/vscode-color-picker](https://toyobayashi.github.io/vscode-color-picker)

## Usage

### CDN

Pure JavaScript:

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

Vue:

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

Pure JavaScript:

``` js
import '@tybys/vscode-color-picker/lib/vscode-color-picker.css'
import { ColorPicker } from '@tybys/vscode-color-picker'

const initialColor = '#aaa'
const picker = new ColorPicker(document.getElementById('container'), initialColor)
```

Vue:

``` vue
<template>
  <VscodeColorPicker v-model="initialColor" />
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
  }
}
</script>
```
