/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../../..";
import { Proficient } from "../../../..";
import * as core from "../../../../core";
export declare const Message: core.serialization.ObjectSchema<serializers.Message.Raw, Proficient.Message>;
export declare namespace Message {
    interface Raw {
        id: serializers.MessageId.Raw;
        object: serializers.MessageObjectType.Raw;
        index: number;
        interaction_id: serializers.InteractionId.Raw;
        created_at: serializers.CreatedAt.Raw;
        content: serializers.MessageContent.Raw;
        sent_by: serializers.InteractionParticipant.Raw;
    }
}