/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../../..";
import * as ProficientAiApi from "../../../../api";
import * as core from "../../../../core";
export declare const MessageAskParams: core.serialization.ObjectSchema<serializers.MessageAskParams.Raw, ProficientAiApi.MessageAskParams>;
export declare namespace MessageAskParams {
    interface Raw {
        interaction_id: serializers.InteractionId.Raw;
    }
}
