/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as Proficient from "../../../..";
export interface ListMessagesRequest {
    interactionId: Proficient.InteractionId;
    limit?: Proficient.PaginationLimit;
    startingAfter?: Proficient.PaginationStartingAfter;
}
