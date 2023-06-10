/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../../..";
import * as Proficient from "../../../../api";
import * as core from "../../../../core";
export declare const AgentCreateParams: core.serialization.ObjectSchema<serializers.AgentCreateParams.Raw, Proficient.AgentCreateParams>;
export declare namespace AgentCreateParams {
    interface Raw {
        description?: serializers.AgentDescription.Raw | null;
        display_description?: serializers.AgentDisplayDescription.Raw | null;
        display_name?: serializers.AgentDisplayName.Raw | null;
        greeting_message?: serializers.GreetingMessage.Raw | null;
        initial_turn?: serializers.InitialTurn.Raw | null;
        model: serializers.Model.Raw;
        name?: serializers.AgentName.Raw | null;
        openai?: serializers.OpenAiConfig.Raw | null;
        system_message?: serializers.SystemMessage.Raw | null;
    }
}
