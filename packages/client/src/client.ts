import { ProficientClient as _ProficientClient } from '../core';

export interface ProficientClientConfig {
  apiKey: string;
  userExternalId: string;
  userHmac?: string;
}

export function createProficientClient(config: ProficientClientConfig) {
  return new _ProficientClient({
    apiKey: config.apiKey,
    userExternalId: config.userExternalId,
    userHmac: config.userHmac,
  });
}
