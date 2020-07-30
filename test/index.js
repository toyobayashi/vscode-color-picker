import '../lib/vscode-color-picker.css'
import VscodeColorPicker from '../lib/vue/index.js'
import { ColorPicker } from '..'

new Vue({
  data () {
    let initialColor = '#aaa'
    return {
      show: true,
      color: initialColor,
      originalColor: initialColor
    }
  },
  render (h) {
    return h('div', { id: 'test' }, [
      ...(this.show ? [h(VscodeColorPicker, {
        props: {
          color: this.color
        },
        on: {
          change: this.onChange
        }
      })] : []),
      h('button', {
        on: {
          click: this.onClick
        }
      }, this.show ? 'confirm' : 'pick'),
      h('button', {
        on: {
          click: this.onClickSet
        }
      }, 'set'),
      h('p', 'picked: ' + this.color.toString()),
      h('p', 'original: ' + this.originalColor.toString())
    ])
  },
  methods: {
    onClickSet () {
      this.color = '#89a'
      this.originalColor = this.color
    },
    onClick () {
      this.show = !this.show
      this.originalColor = this.color
      // if (this.show) {
      //   this.originalColor = this.color
      //   this.show = !this.show
      //   this.$nextTick(() => {
      //     this.show = !this.show
      //   })
      // } else {
      //   this.show = !this.show
      // }
    },
    onChange (e) {
      this.color = ColorPicker.formatColor(e, ColorPicker.ColorType.RGB)
      // console.log(e.toString())
    }
  }
}).$mount('#test')

if (module.hot) {
  module.hot.accept()
}
