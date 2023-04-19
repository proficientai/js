import type { Proficient } from '@proficient/client';

export type MessageGroupInfo = {
  id: string;
  /**
   * The index of the currently active message within the group.
   */
  activeIndex: number;
  depth: number;
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
