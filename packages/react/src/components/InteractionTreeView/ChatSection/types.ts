import type { MessageGroupInfo } from '../types';

export interface ChatSectionProps {
  agentName: string;
  autoRequestReply: boolean;
  hasMore?: boolean;
  layout: 'bubbles' | 'boxes';
  messageGroups: MessageGroupInfo[];
  next?: () => Promise<void>;
  onClickNext?: (currentIndex: number) => void | Promise<void>;
  onClickPrevious?: (currentIndex: number) => void | Promise<void>;
  onClickRequestAnswer: () => Promise<void>;
  writingStatus: 'nil' | 'writing' | 'error';
}
