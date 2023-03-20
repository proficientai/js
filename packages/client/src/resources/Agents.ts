import type { ClientApi } from '@proficient/api';

import type { RequestSender } from '../RequestSender';

export class Agents {
  public constructor(private readonly rs: RequestSender) {}

  public async list() {
    const { data: resources } = await this.rs.get<ClientApi.ResponseBody<'GetAgents'>>(`/agents`);
    return resources;
  }

  public async get(agentId: string) {
    const resource = await this.rs.get<ClientApi.ResponseBody<'GetAgentsAgent'>>(`/agents/${agentId}`);
    return resource;
  }
}
