import type { ProficientAiApi } from '@proficient/client';
import type { MouseEventHandler } from 'react';

export interface SidebarSectionProps {
  description: string;
  header: string;
  interactions: ProficientAiApi.Interaction[];
  isSelectedInteraction: (i: ProficientAiApi.Interaction) => boolean;
  onClickInteraction: (i: ProficientAiApi.Interaction) => void;
  onClickNewInteraction: MouseEventHandler<HTMLButtonElement>;
}
