import type { MessageGroupInfo } from '../types';

export interface ChatSectionProps {
  height: number;
  agentName: string;
  agentInactive: boolean;
  hasMore?: boolean;
  layout: 'casual' | 'formal';
  messageGroups: MessageGroupInfo[];
  next?: () => Promise<void>;
  onClickNext?: (depth: number, currentIndex: number) => void | Promise<void>;
  onClickPrevious?: (depth: number, currentIndex: number) => void | Promise<void>;
  writingStatus: 'nil' | 'writing' | 'error';
}
