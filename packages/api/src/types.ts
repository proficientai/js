import type { Agent } from './resources/Agent';
import type { AgentConfig } from './resources/AgentConfig';
import type { Interaction } from './resources/Interaction';
import type { Message } from './resources/Message';

export type ResourceType = (Agent | AgentConfig | Interaction | Message)['object'];
