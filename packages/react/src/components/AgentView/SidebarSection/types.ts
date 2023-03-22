import type { Interaction } from '@proficient/client';
import type { MouseEventHandler } from 'react';

export interface SidebarSectionProps {
  header: string;
  interactions: Interaction[];
  isSelectedInteraction: (i: Interaction) => boolean;
  onClickInteraction: (i: Interaction) => void;
  onClickNewInteraction: MouseEventHandler<HTMLButtonElement>;
}
