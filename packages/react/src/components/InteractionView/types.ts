import type { Proficient } from '@proficient/client';

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
      code: 'not-found' | 'unknown';
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
   * @defaultValue 'natural'
   */
  layout?: 'natural' | 'tree';

  /**
   * Height in pixels. Must be greater than 300.
   *
   * @defaultValue 600
   */
  height?: number;
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
