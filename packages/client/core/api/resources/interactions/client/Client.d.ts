/**
 * This file was auto-generated by Fern from our API Definition.
 */
import { ProficientAiApi } from "../../../..";
export declare namespace Interactions {
    interface Options {
        environment: string;
        xProficientApiKey: string;
        xProficientUserExternalId: string;
        xProficientUserHmac?: string;
    }
}
export declare class Interactions {
    private readonly options;
    constructor(options: Interactions.Options);
    /**
     * Returns a list of interactions associated with the user. The interactions are returned sorted by creation date, with the most recently created interactions appearing first.
     */
    getAll(request?: ProficientAiApi.GetAllInteractionsRequest): Promise<ProficientAiApi.InteractionsList>;
    /**
     * Retrieves the interaction with the given ID.
     */
    get(interactionId: ProficientAiApi.InteractionId): Promise<ProficientAiApi.Interaction>;
    /**
     * Create a new `Interaction` with an agent.
     */
    create(request: ProficientAiApi.InteractionCreateParams): Promise<ProficientAiApi.InteractionCreateResponse>;
}
