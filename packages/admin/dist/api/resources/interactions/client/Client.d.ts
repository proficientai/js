/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as environments from "../../../../environments";
import * as core from "../../../../core";
import { Proficient } from "../../../..";
export declare namespace Interactions {
    interface Options {
        environment: environments.ProficientEnvironment | string;
        xProficientApiKey: core.Supplier<string>;
        xProficientUserExternalId: core.Supplier<string>;
        xProficientUserHmac?: core.Supplier<string | undefined>;
    }
}
export declare class Interactions {
    private readonly options;
    constructor(options: Interactions.Options);
    /**
     * Returns a list of interactions associated with the user. The interactions are returned sorted by creation date, with the most recently created interactions appearing first.
     * @throws {Proficient.ResourceNotFoundError}
     */
    list(request?: Proficient.ListInteractionsRequest): Promise<Proficient.InteractionsList>;
    /**
     * Retrieves the interaction with the given ID.
     */
    get(interactionId: Proficient.InteractionId): Promise<Proficient.Interaction>;
    /**
     * Creates a new `Interaction` with an agent.
     * @throws {Proficient.ResourceNotFoundError}
     */
    create(request: Proficient.InteractionCreateParams): Promise<Proficient.InteractionCreateResponse>;
    /**
     * Updates the properties of the specified interaction. Only the provided properties will be updated. Any properties not provided will be left unchanged.
     */
    update(interactionId: Proficient.InteractionId, request: Proficient.InteractionUpdateParams): Promise<Proficient.Interaction>;
    /**
     * Permanently deletes the specified interaction and all the messages within it. This cannot be undone.
     */
    delete(interactionId: Proficient.InteractionId): Promise<Proficient.Interaction>;
}