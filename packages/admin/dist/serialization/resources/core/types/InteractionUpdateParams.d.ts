/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../../..";
import { Proficient } from "../../../..";
import * as core from "../../../../core";
export declare const InteractionUpdateParams: core.serialization.ObjectSchema<serializers.InteractionUpdateParams.Raw, Proficient.InteractionUpdateParams>;
export declare namespace InteractionUpdateParams {
    interface Raw {
        name?: serializers.InteractionName.Raw | null;
    }
}
