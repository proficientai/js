import type { MessageGroup } from '../types';

export interface ChatSectionProps {
  agentName: string;
  autoRequestReply: boolean;
  hasMore: boolean;
  messageGroups: MessageGroup[];
  next?: () => Promise<void>;
  onClickRequestAnswer: () => Promise<void>;
  writingStatus: 'nil' | 'writing' | 'error';
}
