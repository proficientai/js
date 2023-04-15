/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as environments from "../../../../environments";
import * as core from "../../../../core";
import { Proficient } from "../../../..";
export declare namespace Agents {
    interface Options {
        environment: environments.ProficientEnvironment | string;
        authorization?: core.Supplier<string | undefined>;
        xProficientApiKey?: core.Supplier<string | undefined>;
        xProficientUserExternalId?: core.Supplier<string | undefined>;
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
    /**
     * Updates the properties of the specified agent. Only the provided properties will be updated. Any properties not provided will be left unchanged.
     * @throws {Proficient.InvalidRequestError}
     * @throws {Proficient.ForbiddenError}
     * @throws {Proficient.ResourceNotFoundError}
     * @throws {Proficient.InternalError}
     * @throws {Proficient.ServiceUnavailableError}
     */
    update(agentId: Proficient.AgentId, request: Proficient.AgentUpdateParams): Promise<Proficient.Agent>;
    /**
     * Retrieves the current configuration of the specified agent.
     * @throws {Proficient.ResourceNotFoundError}
     * @throws {Proficient.InternalError}
     */
    getConfig(agentId: Proficient.AgentId): Promise<Proficient.AgentConfig>;
    /**
     * Updates the configuration of the specified agent. Only the provided properties will be updated. Any properties not provided will be left unchanged.
     * @throws {Proficient.ResourceNotFoundError}
     * @throws {Proficient.InternalError}
     * @throws {Proficient.ServiceUnavailableError}
     */
    updateConfig(agentId: Proficient.AgentId, request: Proficient.AgentConfigUpdateParams): Promise<Proficient.AgentConfig>;
    /**
     * Activates the specified agent. New message or interaction requests sent to this agent will not be blocked while the agent is active. This request does not fail if the agent is already active.
     * @throws {Proficient.ResourceNotFoundError}
     * @throws {Proficient.InternalError}
     * @throws {Proficient.ServiceUnavailableError}
     */
    activate(agentId: Proficient.AgentId): Promise<Proficient.Agent>;
    /**
     * Deactivates the specified agent. Any new message or interaction requests sent to this agent will be blocked while the agent is disabled. This request does not fail if the agent is already deactivated.
     * @throws {Proficient.ResourceNotFoundError}
     * @throws {Proficient.InternalError}
     * @throws {Proficient.ServiceUnavailableError}
     */
    deactivate(agentId: Proficient.AgentId): Promise<Proficient.Agent>;
    /**
     * Permanently deletes the specified agent and all the interactions associated with it. This cannot be undone.
     * @throws {Proficient.ResourceNotFoundError}
     * @throws {Proficient.InternalError}
     * @throws {Proficient.ServiceUnavailableError}
     */
    delete(agentId: Proficient.AgentId): Promise<Proficient.Agent>;
    private _getAuthorizationHeader;
}
