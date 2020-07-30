import React from 'react'
import { Color } from '../vscode-color-picker'

declare interface VscodeColorPickerProps {
  color?: string | Color;
  pixelRatio?: number;
  onChange?: (e: Color) => any;
  onFlush?: (e: Color) => any;
  onPresentation?: (e: string) => any;
}

declare class VscodeColorPicker extends React.Component<VscodeColorPickerProps> {
  constructor(props: VscodeColorPickerProps, context?: any);
  render (): React.ReactNode;
  componentDidUpdate (prevProps: Readonly<VscodeColorPickerProps>): void;
  componentDidMount (): void;
  componentWillUnmount (): void;
}

export default VscodeColorPicker;
