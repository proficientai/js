/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as environments from "../../../../environments";
import * as core from "../../../../core";
import * as Proficient from "../../..";
export declare namespace Interactions {
    interface Options {
        environment: core.Supplier<environments.ProficientEnvironment | string>;
        secretKey?: core.Supplier<string | undefined>;
        apiKey?: core.Supplier<string | undefined>;
        userExternalId?: core.Supplier<string | undefined>;
        userHmac?: core.Supplier<string | undefined>;
    }
}
export declare class Interactions {
    protected readonly options: Interactions.Options;
    constructor(options: Interactions.Options);
    /**
     * Returns a list of interactions associated with the user. The interactions are returned sorted by creation date, with the most recently created interactions appearing first.
     * @throws {@link Proficient.ForbiddenError}
     * @throws {@link Proficient.ResourceNotFoundError}
     * @throws {@link Proficient.InternalError}
     */
    list(request?: Proficient.ListInteractionsRequest): Promise<Proficient.InteractionsList>;
    /**
     * Retrieves the interaction with the given ID.
     * @throws {@link Proficient.ForbiddenError}
     * @throws {@link Proficient.ResourceNotFoundError}
     * @throws {@link Proficient.InternalError}
     */
    get(interactionId: Proficient.InteractionId): Promise<Proficient.Interaction>;
    /**
     * Creates a new `Interaction` with an agent.
     * @throws {@link Proficient.ForbiddenError}
     * @throws {@link Proficient.ResourceNotFoundError}
     * @throws {@link Proficient.InternalError}
     */
    create(request: Proficient.InteractionCreateParams): Promise<Proficient.InteractionCreateResponse>;
    /**
     * Updates the properties of the specified interaction. Only the provided properties will be updated. Any properties not provided will be left unchanged.
     * @throws {@link Proficient.ForbiddenError}
     * @throws {@link Proficient.ResourceNotFoundError}
     * @throws {@link Proficient.InternalError}
     */
    update(interactionId: Proficient.InteractionId, request: Proficient.InteractionUpdateParams): Promise<Proficient.Interaction>;
    /**
     * Permanently deletes the specified interaction and all the messages within it. This cannot be undone.
     * @throws {@link Proficient.ForbiddenError}
     * @throws {@link Proficient.ResourceNotFoundError}
     * @throws {@link Proficient.InternalError}
     * @throws {@link Proficient.ServiceUnavailableError}
     */
    delete(interactionId: Proficient.InteractionId): Promise<Proficient.Interaction>;
    protected _getAuthorizationHeader(): Promise<string | undefined>;
}
