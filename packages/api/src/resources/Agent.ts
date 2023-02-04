export interface Agent {
  [key: string]: any;

  id: string;
  object: 'agent';
  active: boolean;
  name: string | null;
  description: string;
  created_at: number;
  updated_at: number;
}

export interface AgentCreateParams {
  [key: string]: any;

  name: string | null;
  description: string;
  provider: 'openai';
}

export interface AgentUpdateParams {
  [key: string]: any;

  name?: string | null | undefined;
  description?: string | undefined;
}
