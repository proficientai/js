/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../../..";
import { Proficient } from "../../../..";
import * as core from "../../../../core";
export declare const Error: core.serialization.ObjectSchema<serializers.Error.Raw, Proficient.Error>;
export declare namespace Error {
    interface Raw {
        code: serializers.ErrorCode.Raw;
        message: string;
    }
}