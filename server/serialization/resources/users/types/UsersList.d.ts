/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../../..";
import * as ProficientAiApi from "../../../../api";
import * as core from "../../../../core";
export declare const UsersList: core.serialization.ObjectSchema<serializers.UsersList.Raw, ProficientAiApi.UsersList>;
export declare namespace UsersList {
    interface Raw {
        data: serializers.User.Raw[];
    }
}
