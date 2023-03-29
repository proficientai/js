import type { Message } from '@proficient/client';

export interface ChatSectionProps {
  agentName: string;
  hasMore: boolean;
  messages: Message[];
  next: () => Promise<void>;
  retry: () => Promise<void>;
  writingStatus: 'nil' | 'writing' | 'error';
}
