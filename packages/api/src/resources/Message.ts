export interface Message {
  [key: string]: any;

  id: string;
  object: 'message';
  interaction_id: string;
  created_at: number;
  content: string;
  sent_by: 'user' | 'agent';
}

export interface MessageCreateParams {
  [key: string]: any;

  interaction_id: string;
  content: string;
  reply_to: string;
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
