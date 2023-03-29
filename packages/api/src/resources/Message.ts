import type { InteractionParticipant } from '../types';

export interface Message {
  id: string;
  object: 'message';
  index: number;
  interaction_id: string;
  created_at: number;
  content: string;
  sent_by: InteractionParticipant;
}

export interface MessageCreateParams {
  interaction_id: string;
  content: string;
  /**
   * Must be set to the ID of the last message by the agent in the interaction.
   */
  parent_id: string | null;
}

export interface MessageResendParams {
  interaction_id: string;
  content: string;
}

export interface MessageSendResponse {
  sent: Message;
  received: Message;
}
