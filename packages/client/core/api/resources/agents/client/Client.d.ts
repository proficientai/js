/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as environments from "../../../../environments";
import * as core from "../../../../core";
import * as Proficient from "../../..";
export declare namespace Agents {
    interface Options {
        environment: core.Supplier<environments.ProficientEnvironment | string>;
        secretKey?: core.Supplier<string | undefined>;
        apiKey?: core.Supplier<string | undefined>;
        userExternalId?: core.Supplier<string | undefined>;
        userHmac?: core.Supplier<string | undefined>;
    }
}
export declare class Agents {
    protected readonly options: Agents.Options;
    constructor(options: Agents.Options);
    /**
     * Returns a list of agents that belong to the current project. The agents are returned sorted by creation date, with the most recently created agents appearing first.
     * @throws {@link Proficient.InternalError}
     */
    list(): Promise<Proficient.AgentsList>;
    /**
     * Retrieves the agent with the given ID.
     * @throws {@link Proficient.ResourceNotFoundError}
     * @throws {@link Proficient.InternalError}
     */
    get(agentId: Proficient.AgentId): Promise<Proficient.Agent>;
    protected _getAuthorizationHeader(): Promise<string | undefined>;
}
