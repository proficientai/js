/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../../..";
import { Proficient } from "../../../..";
import * as core from "../../../../core";
export declare const UsersList: core.serialization.ObjectSchema<serializers.UsersList.Raw, Proficient.UsersList>;
export declare namespace UsersList {
    interface Raw {
        data: serializers.User.Raw[];
    }
}
