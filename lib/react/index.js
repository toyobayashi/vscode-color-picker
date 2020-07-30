import React from 'react'
import { ColorPicker, Color } from '../..'

var __extendStatics = Object.setPrototypeOf ||
  ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
  function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function VscodeColorPicker (props) {
  React.Component.call(this, props);

  if (this.props.color !== undefined && typeof this.props.color !== 'string' && !(this.props.color instanceof Color)) {
    throw new TypeError('[VscodeColorPicker] Props: color must be string or Color instance.');
  }

  if (this.props.pixelRatio !== undefined && typeof this.props.pixelRatio !== 'number') {
    throw new TypeError('[VscodeColorPicker] Props: pixelRatio must be number.');
  }

  this.$pickerInstance = null;
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
    if (this.$pickerInstance.getColor().toString() !== ColorPicker.toColor(this.props.color).toString()) {
      this.$pickerInstance.setColor(this.props.color);
    }
  }
}

VscodeColorPicker.prototype.componentDidMount = function componentDidMount () {
  var _this = this;
  var root = document.getElementsByClassName('vscode-color-picker')[0];

  if (_this.$pickerInstance) {
    _this.$pickerInstance.dispose();
  }

  while (root.childNodes.length !== 0) {
    root.removeChild(root.childNodes[0]);
  }

  const { color, pixelRatio } = _this.props;
  const _color = color === undefined ? '#0000' : color;
  const _pixelRatio = pixelRatio === undefined ? 1 : pixelRatio;

  _this.$pickerInstance = new ColorPicker(
    root,
    _color,
    _pixelRatio
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
  this.$pickerInstance.dispose();
}

export default VscodeColorPicker;
