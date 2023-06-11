/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../../..";
import * as ProficientAiApi from "../../../../api";
import * as core from "../../../../core";
export declare const UserCreateParams: core.serialization.ObjectSchema<serializers.UserCreateParams.Raw, ProficientAiApi.UserCreateParams>;
export declare namespace UserCreateParams {
    interface Raw {
        external_id: serializers.UserExternalId.Raw;
        first_name?: serializers.UserFirstName.Raw | null;
        last_name?: serializers.UserLastName.Raw | null;
    }
}
