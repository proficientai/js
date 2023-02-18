import type { ResourceType } from './types';

const resourceNamesByType: Record<ResourceType, string> = {
  agent: 'agent',
  agent_config: 'agent configuration',
  interaction: 'interaction',
  message: 'message',
};

export function nameOf(resourceType: ResourceType) {
  return resourceNamesByType[resourceType];
}

export function isPublicResourceType(t: string): t is ResourceType {
  return !!resourceNamesByType[t as ResourceType];
}
