import '../lib/vscode-color-picker.css'
import VscodeColorPicker from '../lib/vue/index.js'

new Vue({
  data: {
    show: true,
    color: '#aaa'
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
      h('span', this.color.toString())
    ])
  },
  methods: {
    onClickSet () {
      this.color = '#89a'
    },
    onClick () {
      this.show = !this.show
    },
    onChange (e) {
      this.color = e
      // console.log(e.toString())
    }
  }
}).$mount('#test')

if (module.hot) {
  module.hot.accept()
}
