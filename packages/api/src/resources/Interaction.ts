import type { InteractionParticipant } from '../types';

export interface Interaction {
  [key: string]: any;

  id: string;
  object: 'interaction';
  agent_id: string;
  archived: boolean;
  user_id: string;
  created_at: number;
  updated_at: number;
  total_message_count: number;
  turn: InteractionParticipant;
}

export interface InteractionCreateParams {
  [key: string]: any;

  agent_id: string;
}
