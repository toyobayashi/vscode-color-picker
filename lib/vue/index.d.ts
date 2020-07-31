import { Component } from 'vue'
import { Color } from '../vscode-color-picker'

declare interface PropsDef {
  color: {
    type: [StringConstructor, typeof Color];
    default: string;
  };
  presentations: {
    type: ArrayConstructor;
    default: any[];
  };
  presentationIndex: {
    type: NumberConstructor;
    default: number;
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
