declare module 'react-native-pie' {
  import { Component } from 'react';
  import { ViewProps } from 'react-native';

  export interface PieSection {
    percentage: number;
    color: string;
  }

  export interface PieProps extends ViewProps {
    radius?: number;
    innerRadius?: number;
    series?: number[];
    colors?: string[];
    backgroundColor?: string;
    stroke?: string;
    sections?: PieSection[];
    strokeWidth?: number;
    strokeCap?: 'butt' | 'round' | 'square';
    startAngle?: number;
    endAngle?: number;
    animate?: boolean;
    animationDuration?: number;
    animateFill?: boolean;
    dividerSize?: number;
    onAnimationComplete?: () => void;
  }

  export default class Pie extends Component<PieProps> {}
}
