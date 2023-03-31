export interface Interaction {
  id: string;
  object: 'interaction';
  agent_id: string;
  archived: boolean;
  user_id: string;
  created_at: number;
  updated_at: number;
  total_message_count: number;
  name: string;
}

export interface InteractionCreateParams {
  agent_id: string;
}
