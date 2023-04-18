import type { Proficient } from '@proficient/client';
import type { MouseEventHandler } from 'react';

export interface SidebarSectionProps {
  description: string;
  header: string;
  interactions: Proficient.Interaction[];
  isSelectedInteraction: (i: Proficient.Interaction) => boolean;
  onClickInteraction: (i: Proficient.Interaction) => void;
  onClickNewInteraction: MouseEventHandler<HTMLButtonElement>;
}
