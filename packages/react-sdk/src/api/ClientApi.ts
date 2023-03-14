import type { ClientApi, InteractionCreateParams, MessageCreateParams } from '@proficient/api';
import axios, { type AxiosInstance } from 'axios';

import { APIService } from './APIService';
import type { Credentials } from './types';

export class ClientApiService extends APIService {
  protected readonly baseAxiosInstance: AxiosInstance;

  public constructor(credentials: Credentials) {
    super();
    this.baseAxiosInstance = axios.create({
      baseURL: 'http://localhost:8080/client', // TODO: Update
      headers: {
        'Content-Type': 'application/json',
        'X-PROFICIENT-API-KEY': credentials.apiKey,
        'X-PROFICIENT-USER-EXTERNAL-ID': credentials.userExternalId,
        ...(credentials.userHmac ? { 'X-PROFICIENT-USER-HMAC': credentials.userHmac } : {}),
      },
    });
  }

  public async getAgents() {
    const { data: resources } = await this.get<ClientApi.ResponseBody<'GetAgents'>>(`/agents`);
    return resources;
  }

  public async getAgent(agentId: string) {
    const resource = await this.get<ClientApi.ResponseBody<'GetAgentsAgent'>>(`/agents/${agentId}`);
    return resource;
  }

  public async getInteractions() {
    const response = await this.get<ClientApi.ResponseBody<'GetInteractions'>>(`/interactions`);
    return response;
  }

  public async getInteraction(interactionId: string) {
    const resource = await this.get<ClientApi.ResponseBody<'GetInteractionsInteraction'>>(
      `/interactions/${interactionId}`
    );
    return resource;
  }

  public async createInteraction(params: InteractionCreateParams) {
    const resource = await this.post<ClientApi.ResponseBody<'PostInteractions'>>(`/interactions`, params);
    return resource;
  }

  public async deleteInteraction(interactionId: string) {
    const resource = await this.delete<ClientApi.ResponseBody<'DeleteInteractionsInteraction'>>(
      `/interactions/${interactionId}`
    );
    return resource;
  }

  public async getMessages(params: ClientApi.QueryParams<'GetMessages'>) {
    const response = await this.get<ClientApi.ResponseBody<'GetMessages'>, ClientApi.QueryParams<'GetMessages'>>(
      `/messages`,
      params
    );
    return response;
  }

  public async getMessage(messageId: string) {
    const resource = await this.get<ClientApi.ResponseBody<'GetMessagesMessage'>>(`/messages/${messageId}`);
    return resource;
  }

  public async createMessage(params: MessageCreateParams) {
    const resource = await this.post<ClientApi.ResponseBody<'PostMessages'>>(`/messages`, params);
    return resource;
  }
}
