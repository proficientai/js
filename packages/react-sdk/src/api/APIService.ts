import { type AxiosInstance } from 'axios';

export abstract class APIService {
  protected abstract readonly baseAxiosInstance: AxiosInstance;

  protected constructor() {}

  protected async get<Res, P = undefined>(endpoint: string, params?: P) {
    return this.request<Res>('GET', endpoint, undefined, params);
  }

  protected async post<Res>(endpoint: string, body?: any) {
    return this.request<Res>('POST', endpoint, body);
  }

  protected async delete<Res>(endpoint: string) {
    return this.request<Res>('DELETE', endpoint);
  }

  private async request<Response>(method: 'GET' | 'POST' | 'DELETE', endpoint: string, body?: any, params?: any) {
    const { data: resource } = await this.baseAxiosInstance.request<Response>({
      method,
      data: body,
      url: endpoint,
      params,
    });
    return resource;
  }
}
