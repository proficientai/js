/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../../..";
import { Proficient } from "../../../..";
import * as core from "../../../../core";
export declare const Provider: core.serialization.Schema<serializers.Provider.Raw, Proficient.Provider>;
export declare namespace Provider {
    type Raw = "openai.gpt-4" | "openai.gpt-3.5-turbo";
}