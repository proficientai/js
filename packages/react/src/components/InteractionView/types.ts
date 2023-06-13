import type { Proficient } from '@proficient/client-internal';

import type { ProficientTheme } from '../../context';

export type AgentState =
  | {
      status: 'nil';
    }
  | {
      status: 'loading';
    }
  | {
      status: 'success';
      agent: Proficient.Agent;
    }
  | {
      status: 'error';
      code: 'not-found' | 'invalid-auth' | 'unknown';
    };

export type InteractionState =
  | {
      status: 'loading';
      interaction?: Proficient.Interaction;
    }
  | {
      status: 'success';
      interaction: Proficient.Interaction;
    }
  | {
      status: 'error';
      errorCode: 'not-found' | 'unknown';
    };

export type MessagesState =
  | {
      status: 'loading' | 'success';
      messageMap: Map<string, Proficient.Message>;
    }
  | {
      status: 'error';
      errorCode: 'unknown';
      messageMap: Map<string, Proficient.Message>;
    };

export type WritingState =
  | {
      status: 'nil' | 'writing';
    }
  | {
      status: 'error';
      errorCode: 'not-found' | 'unknown';
    };

export type MessageGroupInfo = {
  id: string;
  /**
   * The index of the currently active message within the group.
   */
  currentIndex: number;
  current: Proficient.Message;
  size: number;
  depth: number;
};

export interface InteractionViewProps {
  apiKey: string;
  agentId: string;
  userExternalId: string;
  userHmac?: string | (() => Promise<string>);
  /**
   * @defaultValue 'casual'
   */
  layout?: 'casual' | 'formal';

  /**
   * Chat section height in pixels. Must be greater than or equal to 240.
   *
   * @defaultValue 320
   */
  chatSectionHeight?: number;

  /**
   * Header section height in pixels. Must be greater than or equal to 54.
   *
   * @defaultValue 54
   */
  headerSectionHeight?: number;

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

  /**
   * Proficient theme.
   */
  theme?: ProficientTheme;
}
