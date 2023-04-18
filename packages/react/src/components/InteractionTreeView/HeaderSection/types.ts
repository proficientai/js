import type { MouseEventHandler } from 'react';

export interface HeaderSectionProps {
  onClickDelete: MouseEventHandler<HTMLButtonElement>;
  onTitleBlur: (text: string) => void | Promise<void>;
  title: string;
}
