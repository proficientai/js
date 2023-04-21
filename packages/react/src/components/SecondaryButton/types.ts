import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';

export interface SecondaryButtonProps {
  children?: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  style?: CSSProperties;
}
