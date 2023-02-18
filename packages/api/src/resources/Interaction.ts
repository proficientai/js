export interface Interaction {
  [key: string]: any;

  id: string;
  object: 'interaction';
  agent_id: string;
  user_id: string;
  created_at: number;
  updated_at: number;
  message_count: number;
}
