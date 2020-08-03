var VscodeColorPickerReact = (function () {
  var __extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

  function VscodeColorPicker (props) {
    React.Component.call(this, props);

    if (this.props.color !== undefined && typeof this.props.color !== 'string' && !(this.props.color instanceof vscodeColorPicker.Color)) {
      throw new TypeError('[VscodeColorPicker] Props: color must be string or Color instance.');
    }

    if (this.props.presentation !== undefined && typeof this.props.presentation !== 'string') {
      throw new TypeError('[VscodeColorPicker] Props: presentation must be string.');
    }

    if (this.props.pixelRatio !== undefined && typeof this.props.pixelRatio !== 'number') {
      throw new TypeError('[VscodeColorPicker] Props: pixelRatio must be number.');
    }

    this.$pickerInstance = null;

    if (typeof this.props.onCreate === 'function') {
      this.props.onCreate(this);
    }
  }

  __extendStatics(VscodeColorPicker, React.Component);

  function _ () { this.constructor = VscodeColorPicker; }
  _.prototype = React.Component.prototype;

  VscodeColorPicker.prototype = new _();

  VscodeColorPicker.prototype.render = function render () {
    return React.createElement('div', { className: 'vscode-color-picker' }, []);
  };

  VscodeColorPicker.prototype.componentDidUpdate = function componentDidMount (prevProps) {
    if (prevProps.color !== this.props.color) {
      if (!this.$pickerInstance) return;
      if (this.$pickerInstance.getColor().toString() !== vscodeColorPicker.ColorPicker.toColor(this.props.color).toString()) {
        this.$pickerInstance.setColor(this.props.color);
      }
    }

    if (prevProps.presentation !== this.props.presentation) {
      if (!this.$pickerInstance) return;
      this.$pickerInstance.setPresentation(this.props.presentation);
    }

    if (prevProps.pixelRatio !== this.props.pixelRatio) {
      if (!this.$pickerInstance) return;
      this.$pickerInstance.setPixelRatio(this.props.pixelRatio);
    }
  };

  VscodeColorPicker.prototype.getOriginalColor = function getOriginalColor () {
    if (!this.$pickerInstance) return;
    return this.$pickerInstance.getOriginalColor();
  };
  VscodeColorPicker.prototype.setOriginalColor = function setOriginalColor (color) {
    if (!this.$pickerInstance) return;
    this.$pickerInstance.setOriginalColor(color);
  };

  VscodeColorPicker.prototype.componentDidMount = function componentDidMount () {
    var _this = this;
    var root = document.getElementsByClassName('vscode-color-picker')[0];

    if (_this.$pickerInstance) {
      _this.$pickerInstance.dispose();
    }

    while (root.childNodes.length !== 0) {
      root.removeChild(root.childNodes[0]);
    }

    var _color = _this.props.color === undefined ? '#0000' : _this.props.color;
    var _presentation = _this.props.presentation === undefined ? '' : _this.props.presentation;
    var _pixelRatio = _this.props.pixelRatio === undefined ? 1 : _this.props.pixelRatio;

    _this.$pickerInstance = new vscodeColorPicker.ColorPicker(
      root,
      {
        color: _color,
        presentation: _presentation,
        pixelRatio: _pixelRatio,
      }
    );
    _this.$pickerInstance.onColorChanged(function (e) {
      if (typeof _this.props.onChange === 'function') {
        _this.props.onChange(e);
      }
    });
    _this.$pickerInstance.onColorFlushed(function (e) {
      if (typeof _this.props.onFlush === 'function') {
        _this.props.onFlush(e);
      }
    });
    _this.$pickerInstance.onPresentationChanged(function (e) {
      if (typeof _this.props.onPresentation === 'function') {
        _this.props.onPresentation(e);
      }
    });
  };

  VscodeColorPicker.prototype.componentWillUnmount = function componentWillUnmount () {
    if (this.$pickerInstance) {
      this.$pickerInstance.dispose();
    }
  };

  return VscodeColorPicker;
})();
