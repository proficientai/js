import type { InteractionParticipant } from '../types';

export interface Message {
  [key: string]: any;

  id: string;
  object: 'message';
  interaction_id: string;
  created_at: number;
  content: string;
  sent_by: InteractionParticipant;
}

export interface MessageCreateParams {
  [key: string]: any;

  interaction_id: string;
  content: string;
  /**
   * Must be set to the ID of the last message by the agent in the interaction.
   */
  parent_id: string | null;
}

export interface MessageResendParams {
  [key: string]: any;

  content: string;
}

export interface MessageSendResponse {
  [key: string]: any;

  sent: Message;
  received: Message;
}
