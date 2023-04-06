import type { InteractionParticipant, ProviderId } from '../types';

export interface AgentConfig {
  object: 'agent_config';
  agent_id: string;
  provider: ProviderId;
  system_message: string;
  initial_turn: InteractionParticipant;
  greeting: string;
}

export interface AgentConfigUpdateParams {
  system_message?: string;
  initial_turn?: InteractionParticipant;
  greeting?: string;
}
