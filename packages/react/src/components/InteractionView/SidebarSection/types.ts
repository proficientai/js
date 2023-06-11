import type { Proficient } from '@proficient/client-internal';
import type { MouseEventHandler } from 'react';

export interface SidebarSectionProps {
  height: number;
  description: string;
  header: string;
  interactions: Proficient.Interaction[];
  isSelectedInteraction: (i: Proficient.Interaction) => boolean;
  onClickInteraction: (i: Proficient.Interaction) => void;
  onClickNewInteraction: MouseEventHandler<HTMLButtonElement>;
}
