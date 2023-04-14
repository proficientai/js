/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../../..";
import { Proficient } from "../../../..";
import * as core from "../../../../core";
export declare const InteractionCreateResponse: core.serialization.ObjectSchema<serializers.InteractionCreateResponse.Raw, Proficient.InteractionCreateResponse>;
export declare namespace InteractionCreateResponse {
    interface Raw {
        interaction: serializers.Interaction.Raw;
        messages: serializers.Message.Raw[];
    }
}
