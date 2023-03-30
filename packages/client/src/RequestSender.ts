import axios, { type AxiosInstance } from 'axios';

import type { ApiCredentials } from './types';

export class RequestSender {
  private readonly axiosInstance: AxiosInstance;

  public constructor(credentials: ApiCredentials) {
    this.axiosInstance = axios.create({
      // TODO: Update
      baseURL: 'http://localhost:8080/client',
      headers: {
        'Content-Type': 'application/json',
        'X-PROFICIENT-API-KEY': credentials.apiKey,
        'X-PROFICIENT-USER-EXTERNAL-ID': credentials.userExternalId,
        ...(credentials.userHmac ? { 'X-PROFICIENT-USER-HMAC': credentials.userHmac } : {}),
      },
    });
  }

  public async get<Res, P = undefined>(endpoint: string, params?: P) {
    return this.request<Res>('GET', endpoint, undefined, params);
  }

  public async post<Res>(endpoint: string, body?: any) {
    return this.request<Res>('POST', endpoint, body);
  }

  public async delete<Res>(endpoint: string) {
    return this.request<Res>('DELETE', endpoint);
  }

  private async request<Response>(method: 'GET' | 'POST' | 'DELETE', endpoint: string, body?: any, params?: any) {
    const { data: resource } = await this.axiosInstance.request<Response>({
      method,
      data: body,
      url: endpoint,
      params,
    });
    return resource;
  }
}
