import type { Message } from '@proficient/client';

export interface ChatSectionProps {
  hasMore: boolean;
  messages: Message[];
  next: () => Promise<void>;
}
