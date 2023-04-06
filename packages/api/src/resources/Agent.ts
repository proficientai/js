import type { InteractionParticipant, ProviderId } from '../types';

export interface Agent {
  id: string;
  object: 'agent';
  active: boolean;
  name: string;
  description: string;
  created_at: number;
  updated_at: number;
}

export interface AgentCreateParams {
  name: string;
  description: string;
  provider: ProviderId;
  system_message?: string;
  initial_turn?: InteractionParticipant;
  greeting?: string;
}

export interface AgentUpdateParams {
  name?: string;
  description?: string;
}
