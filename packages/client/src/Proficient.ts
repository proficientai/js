import { RequestSender } from './RequestSender';
import { Agents } from './resources/Agents';
import { Interactions } from './resources/Interactions';
import { Messages } from './resources/Messages';
import type { ApiCredentials } from './types';

export class Proficient {
  private readonly requestSender: RequestSender;

  public constructor(credentials: ApiCredentials) {
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
