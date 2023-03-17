import type { Agent } from './resources/Agent';
import type { AgentConfig } from './resources/AgentConfig';
import type { Interaction } from './resources/Interaction';
import type { Message } from './resources/Message';

export type ProviderId = 'openai.gpt-4' | 'openai.gpt-3.5-turbo';

export type InteractionParticipant = 'user' | 'agent';

export type ResourceType = (Agent | AgentConfig | Interaction | Message)['object'];
