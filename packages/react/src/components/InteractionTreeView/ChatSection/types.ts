import type { MessageGroupInfo } from '../types';

export interface ChatSectionProps {
  agentName: string;
  hasMore?: boolean;
  layout: 'bubbles' | 'boxes';
  messageGroups: MessageGroupInfo[];
  next?: () => Promise<void>;
  onClickNext?: (depth: number, currentIndex: number) => void | Promise<void>;
  onClickPrevious?: (depth: number, currentIndex: number) => void | Promise<void>;
  writingStatus: 'nil' | 'writing' | 'error';
}
