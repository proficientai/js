import { ProficientClient as _ProficientClient } from '../core';
export interface ProficientClientConfig {
    environment: string;
    apiKey: string;
    userExternalId: string;
    userHmac?: string;
}
export declare function createProficientClient(config: ProficientClientConfig): _ProficientClient;
//# sourceMappingURL=client.d.ts.map