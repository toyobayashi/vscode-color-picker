import { Component } from 'vue'
import { Color } from '../vscode-color-picker'

declare interface PropsDef {
  color: {
    type: [StringConstructor, typeof Color];
    default: string;
  };
  pixelRatio: {
    type: NumberConstructor;
    default: number;
  };
}

declare const component: Component<{}, {}, {}, PropsDef>;

export default component;
