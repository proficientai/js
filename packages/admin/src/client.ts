import { ProficientClient as _ProficientClient } from '../core';

export interface ProficientClientConfig {
  environment: string;
  secretKey: string;
}

export class ProficientClient extends _ProficientClient {
  public constructor(config: ProficientClientConfig) {
    super({
      environment: config.environment,
      authorization: `Bearer ${config.secretKey}`,
    });
  }
}
