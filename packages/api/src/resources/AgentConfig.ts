export interface AgentConfig {
  [key: string]: any;

  object: 'agent_config';
  agent_id: string;
  provider: 'openai';
  prompt: string;
}

export interface AgentConfigUpdateParams {
  [key: string]: any;

  provider?: 'openai';
  prompt?: string;
}
