import '../lib/vscode-color-picker.css'
import VscodeColorPicker from '../lib/vue/index.js'
import { ColorPicker } from '..'

new Vue({
  data () {
    let initialColor = '#187'
    const color = ColorPicker.toColor(initialColor)
    return {
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
  },
  render (h) {
    return h('div', { id: 'test' }, [
      ...(this.show ? [h(VscodeColorPicker, {
        props: {
          color: this.color,
          presentations: this.presentations,
          presentationIndex: this.presentationIndex,
          pixelRatio: this.pixelRatio
        },
        on: {
          change: this.onChange,
          presentation: (p, i) => console.log(p, i)
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
    updatePresentations () {
      this.presentations[0].label = ColorPicker.formatColor(this.color, ColorPicker.ColorType.RGB)
      this.presentations[1].label = ColorPicker.formatColor(this.color, ColorPicker.ColorType.HEX)
      this.presentations[2].label = ColorPicker.formatColor(this.color, ColorPicker.ColorType.HSL)
    },
    onClickSet () {
      this.color = '#89a'
      this.originalColor = this.color
      this.updatePresentations()
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
      this.updatePresentations()
    }
  }
}).$mount('#test')

if (module.hot) {
  module.hot.accept()
}
