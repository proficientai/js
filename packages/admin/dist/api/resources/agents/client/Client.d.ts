/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as environments from "../../../../environments";
import * as core from "../../../../core";
import { Proficient } from "../../../..";
export declare namespace Agents {
    interface Options {
        environment: environments.ProficientEnvironment | string;
        xProficientApiKey: core.Supplier<string>;
        xProficientUserExternalId: core.Supplier<string>;
        xProficientUserHmac?: core.Supplier<string | undefined>;
    }
}
export declare class Agents {
    private readonly options;
    constructor(options: Agents.Options);
    /**
     * Returns a list of agents that belong to the current organization. The agents are returned sorted by creation date, with the most recently created agents appearing first.
     * @throws {Proficient.InternalError}
     */
    list(): Promise<Proficient.AgentsList>;
    /**
     * Retrieves the agent with the given ID.
     * @throws {Proficient.ResourceNotFoundError}
     * @throws {Proficient.InternalError}
     */
    get(agentId: Proficient.AgentId): Promise<Proficient.Agent>;
    /**
     * Creates a new agent with the given properties.
     * @throws {Proficient.InvalidRequestError}
     * @throws {Proficient.ForbiddenError}
     * @throws {Proficient.InternalError}
     */
    create(request: Proficient.AgentCreateParams): Promise<Proficient.Agent>;
}
