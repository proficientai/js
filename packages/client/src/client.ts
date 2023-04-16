import { ProficientClient as _ProficientClient } from '../core';

export interface ProficientClientConfig {
  environment: string;
  apiKey: string;
  userExternalId: string;
  userHmac?: string;
}

export function createProficientClient(config: ProficientClientConfig) {
  return new _ProficientClient({
    environment: config.environment,
    xProficientApiKey: config.apiKey,
    xProficientUserExternalId: config.userExternalId,
    xProficientUserHmac: config.userHmac,
  });
}
