import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';

export interface PrimaryButtonProps {
  children?: ReactNode;
  disabled?: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
  style?: CSSProperties;
}
