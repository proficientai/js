import type { Proficient } from '@proficient/client';

export type MessageGroup = {
  id: string;
  activeIndex: number;
  messages: [Proficient.Message, ...Proficient.Message[]];
};

export interface InteractionViewProps {
  apiKey: string;
  agentId: string;
  userExternalId: string;
  userHmac?: string | (() => Promise<string>);
  /**
   * @defaultValue true
   */
  autoRequestReply?: boolean;
  /**
   * @defaultValue true
   */
  sendOnEnter?: boolean;
  /**
   * @defaultValue "Type something..."
   */
  inputPlaceholder?: string;
}
