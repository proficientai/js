import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';

export interface TertiaryButtonProps {
  children?: ReactNode;
  disabled?: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
  style?: CSSProperties;
}
