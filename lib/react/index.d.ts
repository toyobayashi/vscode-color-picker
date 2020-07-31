import React from 'react';
import { Color, ColorPickerPresentation } from '../vscode-color-picker';

declare interface VscodeColorPickerProps {
  color?: string | Color;
  pixelRatio?: number;
  presentations?: ColorPickerPresentation[];
  presentationIndex?: number;
  onChange?: (e: Color) => any;
  onFlush?: (e: Color) => any;
  onPresentation?: (e: ColorPickerPresentation, index: number) => any;
  onCreate?: (e: VscodeColorPicker) => void;
}

declare class VscodeColorPicker extends React.Component<VscodeColorPickerProps> {
  constructor(props: VscodeColorPickerProps, context?: any);
  render (): React.ReactNode;
  componentDidUpdate (prevProps: Readonly<VscodeColorPickerProps>): void;
  componentDidMount (): void;
  componentWillUnmount (): void;

  getOriginalColor (): Color;
  setOriginalColor (color: string | Color): void;
}

export default VscodeColorPicker;
