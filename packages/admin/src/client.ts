import { ProficientClient as _ProficientClient } from '../core';

export interface ProficientClientConfig {
  secretKey: string;
}

export function createProficientClient(config: ProficientClientConfig) {
  return new _ProficientClient({
    secretKey: config.secretKey,
  });
}
