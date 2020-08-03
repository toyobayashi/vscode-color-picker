import '../lib/vscode-color-picker.css'
import VscodeColorPicker from '../lib/vue/index.js'
import { ColorPicker } from '..'

new Vue({
  data () {
    let initialColor = '#187'
    const colorTypes = [ColorPicker.ColorType.RGB, ColorPicker.ColorType.HEX, ColorPicker.ColorType.HSL]
    const activeType = 0
    return {
      show: true,
      color: initialColor,
      originalColor: initialColor,
      colorTypes,
      activeType,
      pixelRatio: 1
    }
  },
  computed: {
    presentation () {
      return ColorPicker.formatColor(this.color, this.colorTypes[this.activeType])
    }
  },
  render (h) {
    return h('div', { id: 'test' }, [
      ...(this.show ? [h(VscodeColorPicker, {
        props: {
          color: this.color,
          presentation: this.presentation,
          pixelRatio: this.pixelRatio
        },
        on: {
          change: this.onChange,
          presentation: (p) => {
            console.log(p)
            this.activeType = (this.activeType + 1) % this.colorTypes.length
          }
        },
        ref: 'picker'
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
      if (!this.show) {
        this.originalColor = this.color
      }
      // this.$refs.picker.setOriginalColor('#987')
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
    }
  }
}).$mount('#test')

if (module.hot) {
  module.hot.accept()
}
