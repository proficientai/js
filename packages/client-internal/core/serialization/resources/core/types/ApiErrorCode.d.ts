/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../../..";
import * as Proficient from "../../../../api";
import * as core from "../../../../core";
export declare const ApiErrorCode: core.serialization.Schema<serializers.ApiErrorCode.Raw, Proficient.ApiErrorCode>;
export declare namespace ApiErrorCode {
    type Raw = "invalid_request" | "invalid_credentials" | "forbidden" | "resource_not_found" | "conflict" | "unavailable" | "unknown";
}
