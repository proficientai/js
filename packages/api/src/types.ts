import type { Agent } from './resources/Agent';
import type { AgentConfig } from './resources/AgentConfig';

export type ResourceType = (Agent | AgentConfig)['object'];
