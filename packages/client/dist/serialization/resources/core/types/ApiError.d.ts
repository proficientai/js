/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../../..";
import { Proficient } from "../../../..";
import * as core from "../../../../core";
export declare const ApiError: core.serialization.ObjectSchema<serializers.ApiError.Raw, Proficient.ApiError>;
export declare namespace ApiError {
    interface Raw {
        error: serializers.ApiErrorBody.Raw;
    }
}
