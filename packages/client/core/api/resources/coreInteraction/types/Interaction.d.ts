/**
 * This file was auto-generated by Fern from our API Definition.
 */
import { Proficient } from "../../../..";
/**
 * <p>Users communicate with agents via <i>interactions</i>. You can think of each interaction as a conversation between an agent and user.</p>
 *
 * @example
 *     {
 *         id: "int_53mfKtX0Da6zaJCp5bNnzxDaEg1xptWvQDr2",
 *         object: Proficient.InteractionObjectType.Interaction,
 *         agentId: "ag_Lad8YCGGiDLiqIZPWRXmc2ix",
 *         archived: false,
 *         createdAt: 1671631795145,
 *         name: "interaction",
 *         totalMessageCount: 23,
 *         updatedAt: 1671631799692,
 *         userId: "u_1eRoyubdUqWifFiTREaLcvh6"
 *     }
 */
export interface Interaction {
    id: Proficient.InteractionId;
    object: Proficient.InteractionObjectType;
    agentId: Proficient.AgentId;
    archived: Proficient.InteractionArchived;
    createdAt: Proficient.CreatedAt;
    name: Proficient.InteractionName;
    totalMessageCount: Proficient.InteractionTotalMessageCount;
    updatedAt: Proficient.UpdatedAt;
    userId: Proficient.UserId;
}
