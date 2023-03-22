import type { MouseEventHandler } from 'react';

export interface HeaderSectionProps {
  onClickDelete: MouseEventHandler<HTMLButtonElement>;
  title: string;
}
