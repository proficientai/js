/**
 * This file was auto-generated by Fern from our API Definition.
 */
import { Proficient } from "../../../..";
/**
 * <p>An _agent_ is an AI entity that exists to serve your project's users. Agents are intelligent, configurable and context-aware and can interact with your users via a messaging system enabled by the Proficient API.</p>
 *
 * @example
 *     {
 *         id: "ag_Lad8YCGGiDLiqIZPWRXmc2ix",
 *         object: Proficient.AgentObjectType.Agent,
 *         active: true,
 *         description: "Job application assistant",
 *         displayDescription: "An AI assistant that helps job seekers with their job applications.",
 *         displayName: "Taya",
 *         name: "Taya",
 *         createdAt: 1671631795145,
 *         updatedAt: 1671631799692
 *     }
 */
export interface Agent {
    id: Proficient.AgentId;
    object: Proficient.AgentObjectType;
    active: Proficient.AgentActiveStatus;
    description: Proficient.AgentDescription;
    displayDescription: Proficient.AgentDisplayDescription;
    displayName: Proficient.AgentDisplayName;
    name: Proficient.AgentName;
    createdAt: Proficient.CreatedAt;
    updatedAt: Proficient.UpdatedAt;
}
