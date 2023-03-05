import type { InteractionParticipant, ProviderId } from '../types';

export interface AgentConfig {
  [key: string]: any;

  object: 'agent_config';
  agent_id: string;
  provider: ProviderId;
  system_prompt: string;
  initial_turn: InteractionParticipant;
  greeting: string;
}

export interface AgentConfigUpdateParams {
  [key: string]: any;

  provider?: ProviderId;
  system_prompt?: string;
  initial_turn?: InteractionParticipant;
  greeting?: string;
}
