import type { ClientApi, MessageCreateParams, MessageReplyParams, MessageResetParams } from '@proficient/api';

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
    const response = await this.rs.get<ClientApi.ResponseBody<'GetMessagesMessage'>>(`/messages/${messageId}`);
    return response;
  }

  public async create(params: MessageCreateParams) {
    const response = await this.rs.post<ClientApi.ResponseBody<'PostMessages'>>(`/messages`, params);
    return response;
  }

  public async reset(messageId: string, params: MessageResetParams) {
    const response = await this.rs.post<ClientApi.ResponseBody<'PostMessagesMessage'>>(
      `/messages/${messageId}`,
      params
    );
    return response;
  }

  public async reply(messageId: string, params: MessageReplyParams) {
    const response = await this.rs.post<ClientApi.ResponseBody<'PostMessagesMessageReply'>>(
      `/messages/${messageId}/reply`,
      params
    );
    return response;
  }
}
