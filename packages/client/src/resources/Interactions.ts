import type { ClientApi, InteractionCreateParams } from '@proficient/api';

import type { RequestSender } from '../RequestSender';

export class Interactions {
  public constructor(private readonly rs: RequestSender) {}

  public async list(params: ClientApi.QueryParams<'GetInteractions'>) {
    const response = await this.rs.get<
      ClientApi.ResponseBody<'GetInteractions'>,
      ClientApi.QueryParams<'GetInteractions'>
    >(`/interactions`, params);
    return response;
  }

  public async get(interactionId: string) {
    const resource = await this.rs.get<ClientApi.ResponseBody<'GetInteractionsInteraction'>>(
      `/interactions/${interactionId}`
    );
    return resource;
  }

  public async create(params: InteractionCreateParams) {
    return await this.rs.post<ClientApi.ResponseBody<'PostInteractions'>>(`/interactions`, params);
  }

  public async delete(interactionId: string) {
    const resource = await this.rs.delete<ClientApi.ResponseBody<'DeleteInteractionsInteraction'>>(
      `/interactions/${interactionId}`
    );
    return resource;
  }
}
