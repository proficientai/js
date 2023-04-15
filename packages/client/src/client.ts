import { ProficientClient as _ProficientClient } from '../core';

export interface ProficientClientConfig {
  environment: string;
  apiKey: string;
  userExternalId: string;
  userHmac?: string;
}

export class ProficientClient extends _ProficientClient {
  public constructor(config: ProficientClientConfig) {
    super({
      environment: config.environment,
      xProficientApiKey: config.apiKey,
      xProficientUserExternalId: config.userExternalId,
      xProficientUserHmac: config.userHmac,
    });
  }
}
