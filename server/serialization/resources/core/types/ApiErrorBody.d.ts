/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../../..";
import * as ProficientAiApi from "../../../../api";
import * as core from "../../../../core";
export declare const ApiErrorBody: core.serialization.ObjectSchema<serializers.ApiErrorBody.Raw, ProficientAiApi.ApiErrorBody>;
export declare namespace ApiErrorBody {
    interface Raw {
        code: serializers.ApiErrorCode.Raw;
        message: string;
    }
}
