import type { MessageGroupInfo } from '../types';

export interface ChatSectionProps {
  agentName: string;
  autoRequestReply: boolean;
  hasMore?: boolean;
  messageGroups: MessageGroupInfo[];
  next?: () => Promise<void>;
  onClickRequestAnswer: () => Promise<void>;
  writingStatus: 'nil' | 'writing' | 'error';
}
