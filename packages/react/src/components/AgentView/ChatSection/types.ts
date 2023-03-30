import type { Message } from '@proficient/client';

export interface ChatSectionProps {
  agentName: string;
  autoRequestReply: boolean;
  hasMore: boolean;
  messages: Message[];
  next: () => Promise<void>;
  onClickRequestAnswer: () => Promise<void>;
  writingStatus: 'nil' | 'writing' | 'error';
}
