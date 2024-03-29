/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as core from "./core";
import { Agents } from "./api/resources/agents/client/Client";
import { Users } from "./api/resources/users/client/Client";
export declare namespace ProficientClient {
    interface Options {
        secretKey?: core.Supplier<string | undefined>;
        apiKey?: core.Supplier<string | undefined>;
        userExternalId?: core.Supplier<string | undefined>;
        userHmac?: core.Supplier<string | undefined>;
    }
}
export declare class ProficientClient {
    protected readonly options: ProficientClient.Options;
    constructor(options: ProficientClient.Options);
    protected _agents: Agents | undefined;
    get agents(): Agents;
    protected _users: Users | undefined;
    get users(): Users;
}
