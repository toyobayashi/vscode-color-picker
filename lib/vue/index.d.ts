import { Component } from 'vue'
import { Color } from '../vscode-color-picker'

declare interface PropsDef {
  color: {
    type: [StringConstructor, typeof Color];
    default: string;
  };
  presentation: {
    type: StringConstructor;
    default: string;
  };
  pixelRatio: {
    type: NumberConstructor;
    default: number;
  };
}

declare interface Methods {
  getOriginalColor (): Color;
  setOriginalColor (color: string | Color): void;
}

declare const component: Component<{}, Methods, {}, PropsDef>;

export default component;
