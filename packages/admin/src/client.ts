import { ProficientClient as _ProficientClient } from '../core';

export interface ProficientClientConfig {
  environment: string;
  secretKey: string;
}

export function createProficientClient(config: ProficientClientConfig) {
  return new _ProficientClient({
    environment: config.environment,
    authorization: `Bearer ${config.secretKey}`,
  });
}
