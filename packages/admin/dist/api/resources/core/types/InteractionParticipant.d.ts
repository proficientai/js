/**
 * This file was auto-generated by Fern from our API Definition.
 */
/**
 * Represents the type of the participant in a given `Interaction`. As an example, `Message`s are created by interaction participants so the `sent_by` property of a `Message` must be an `InteractionParticipant`.
 *
 * @example
 *     Proficient.InteractionParticipant.User
 */
export declare type InteractionParticipant = "user" | "agent";
export declare const InteractionParticipant: {
    readonly User: "user";
    readonly Agent: "agent";
};