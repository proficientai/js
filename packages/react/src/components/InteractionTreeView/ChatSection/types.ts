import type { Proficient } from '@proficient/client';

export interface ChatSectionProps {
  agentName: string;
  autoRequestReply: boolean;
  hasMore: boolean;
  messages: Proficient.Message[];
  next: () => Promise<void>;
  onClickRequestAnswer: () => Promise<void>;
  writingStatus: 'nil' | 'writing' | 'error';
}
