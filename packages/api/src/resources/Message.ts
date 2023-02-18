export interface Message {
  [key: string]: any;

  id: string;
  object: 'message';
  interaction_id: string;
  created_at: number;
  content: string;
  sent_by: 'user' | 'agent';
}
