/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../../..";
import * as ProficientAiApi from "../../../../api";
import * as core from "../../../../core";
export declare const MessagesList: core.serialization.ObjectSchema<serializers.MessagesList.Raw, ProficientAiApi.MessagesList>;
export declare namespace MessagesList {
    interface Raw {
        data: serializers.Message.Raw[];
        has_more: serializers.PaginationHasMore.Raw;
    }
}
