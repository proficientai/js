import { ProficientClient as _ProficientClient } from '../core';
export interface ProficientClientConfig {
    environment: string;
    apiKey: string;
    userExternalId: string;
    userHmac?: string;
}
export declare class ProficientClient extends _ProficientClient {
    constructor(config: ProficientClientConfig);
}
//# sourceMappingURL=client.d.ts.map