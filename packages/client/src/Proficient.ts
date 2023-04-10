import { ProficientAiApiClient } from '../core';
import { RequestSender } from './RequestSender';
import { Agents } from './resources/Agents';
import { Interactions } from './resources/Interactions';
import { Messages } from './resources/Messages';
import type { ApiCredentials } from './types';

export class Proficient {
  private readonly client: ProficientAiApiClient;
  private readonly requestSender: RequestSender;

  public constructor(credentials: ApiCredentials) {
    this.client = new ProficientAiApiClient({
      environment: 'dev', // TODO: Make dynamic
      xProficientApiKey: credentials.apiKey,
      xProficientUserExternalId: credentials.userExternalId,
      xProficientUserHmac: credentials.userHmac,
    });
    this.requestSender = new RequestSender(credentials);
  }

  public get agents() {
    return new Agents(this.requestSender);
  }

  public get interactions() {
    return new Interactions(this.requestSender);
  }

  public get messages() {
    return new Messages(this.requestSender);
  }
}
