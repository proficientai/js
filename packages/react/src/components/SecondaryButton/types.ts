import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';

export interface SecondaryButtonProps {
  children?: ReactNode;
  disabled?: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
  style?: CSSProperties;
}
