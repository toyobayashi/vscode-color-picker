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
    presentations: {
      type: Array,
      default: []
    },
    presentationIndex: {
      type: Number,
      default: 0
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
        if (!this.$pickerInstance) return;
        if (this.$pickerInstance.getColor().toString() !== vscodeColorPicker.ColorPicker.toColor(newColor).toString()) {
          this.$pickerInstance.setColor(newColor);
        }
      }
    },
    presentations: {
      handler: function (newPresentations) {
        if (!this.$pickerInstance) return;
        this.$pickerInstance.setPresentations(newPresentations);
      }
    },
    presentationIndex: {
      handler: function (newPresentationIndex) {
        if (!this.$pickerInstance) return;
        this.$pickerInstance.setPresentationIndex(newPresentationIndex);
      }
    },
    pixelRatio: {
      handler: function (newPixelRatio) {
        if (!this.$pickerInstance) return;
        this.$pickerInstance.setPixelRatio(newPixelRatio);
      }
    }
  },
  methods: {
    getOriginalColor: function () {
      if (!this.$pickerInstance) return;
      return this.$pickerInstance.getOriginalColor();
    },
    setOriginalColor: function (color) {
      if (!this.$pickerInstance) return;
      return this.$pickerInstance.setOriginalColor(color);
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
        {
          color: _this.color,
          presentations: _this.presentations,
          presentationIndex: _this.presentationIndex,
          pixelRatio: _this.pixelRatio,
        }
      );
      _this.$pickerInstance.onColorChanged(function (e) {
        _this.$emit('change', e)
      });
      _this.$pickerInstance.onColorFlushed(function (e) {
        _this.$emit('flush', e)
      });
      _this.$pickerInstance.onPresentationChanged(function (e) {
        _this.$emit('presentation', e, _this.presentations.indexOf(e))
      });
    });
  },
  beforeDestroy: function () {
    this.$pickerInstance.dispose();
  }
};
