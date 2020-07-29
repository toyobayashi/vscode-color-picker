var VscodeColorPickerVue = {
  name: 'VscodeColorPicker',
  render: function (h) {
    return h('div', { staticClass: 'vscode-color-picker' }, []);
  },
  props: {
    color: {
      type: [String, vscodeColorPicker.Color],
      default: '#0000'
    },
    pixelRatio: {
      type: Number,
      default: 1
    }
  },
  model: {
    prop: 'color',
    event: 'change'
  },
  watch: {
    color: {
      handler: function (newColor) {
        if (this.$pickerInstance.getColor().toString() !== vscodeColorPicker.ColorPicker.toColor(newColor).toString()) {
          this.$pickerInstance.setColor(newColor);
        }
      }
    }
  },
  mounted: function () {
    var _this = this;
    this.$nextTick(function () {
      var root = document.getElementsByClassName('vscode-color-picker')[0];

      if (_this.$pickerInstance) {
        _this.$pickerInstance.dispose();
      }

      while (root.childNodes.length !== 0) {
        root.removeChild(root.childNodes[0]);
      }

      _this.$pickerInstance = new vscodeColorPicker.ColorPicker(
        root,
        _this.color,
        _this.pixelRatio
      );
      _this.$pickerInstance.onColorChanged(function (e) {
        _this.$emit('change', e)
      });
      _this.$pickerInstance.onColorFlushed(function (e) {
        _this.$emit('flush', e)
      });
      _this.$pickerInstance.onPresentationChanged(function (e) {
        _this.$emit('presentation', e)
      });
    });
  },
  beforeDestroy: function () {
    this.$pickerInstance.dispose();
  }
};
