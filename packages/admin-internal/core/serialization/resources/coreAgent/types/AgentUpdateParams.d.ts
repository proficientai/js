/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../../..";
import * as Proficient from "../../../../api";
import * as core from "../../../../core";
export declare const AgentUpdateParams: core.serialization.ObjectSchema<serializers.AgentUpdateParams.Raw, Proficient.AgentUpdateParams>;
export declare namespace AgentUpdateParams {
    interface Raw {
        description?: serializers.AgentDescription.Raw | null;
        display_description?: serializers.AgentDisplayDescription.Raw | null;
        display_name?: serializers.AgentDisplayName.Raw | null;
        name?: serializers.AgentName.Raw | null;
    }
}
