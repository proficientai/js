import type { ClientApi, MessageCreateParams } from '@proficient/api';

import type { RequestSender } from '../RequestSender';

export class Messages {
  public constructor(private readonly rs: RequestSender) {}

  public async list(params: ClientApi.QueryParams<'GetMessages'>) {
    const response = await this.rs.get<ClientApi.ResponseBody<'GetMessages'>, ClientApi.QueryParams<'GetMessages'>>(
      `/messages`,
      params
    );
    return response;
  }

  public async get(messageId: string) {
    const resource = await this.rs.get<ClientApi.ResponseBody<'GetMessagesMessage'>>(`/messages/${messageId}`);
    return resource;
  }

  public async create(params: MessageCreateParams) {
    const resource = await this.rs.post<ClientApi.ResponseBody<'PostMessages'>>(`/messages`, params);
    return resource;
  }
}
