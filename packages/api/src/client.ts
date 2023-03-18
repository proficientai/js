import type { Agent } from './resources/Agent';
import type { Interaction, InteractionCreateParams } from './resources/Interaction';
import type { Message, MessageCreateParams, MessageResendParams, MessageSendResponse } from './resources/Message';

export namespace ClientApi {
  export type Operations = {
    GetAgents: {
      responseBody: {
        data: Agent[];
      };
    };
    GetAgentsAgent: {
      pathParams: {
        agent_id: string;
      };
      responseBody: Agent;
    };
    GetInteractions: {
      queryParams: {
        agent_id?: string;
        limit?: number;
        starting_after?: string;
      };
      responseBody: {
        data: Interaction[];
        has_more: boolean;
      };
    };
    PostInteractions: {
      requestBody: InteractionCreateParams;
      responseBody: {
        interaction: Interaction;
        /**
         * Initial messages.
         */
        messages: Message[];
      };
    };
    GetInteractionsInteraction: {
      pathParams: {
        interaction_id: string;
      };
      responseBody: Interaction;
    };
    DeleteInteractionsInteraction: {
      pathParams: {
        interaction_id: string;
      };
      responseBody: Interaction;
    };
    GetMessages: {
      queryParams: {
        interaction_id: string;
        limit?: number;
        starting_after?: string;
      };
      responseBody: {
        data: Message[];
        has_more: boolean;
      };
    };
    PostMessages: {
      requestBody: MessageCreateParams;
      responseBody: MessageSendResponse;
    };
    GetMessagesMessage: {
      pathParams: {
        message_id: string;
      };
      responseBody: Message;
    };
    PostMessagesMessage: {
      pathParams: {
        message_id: string;
      };
      requestBody: MessageResendParams;
      responseBody: MessageSendResponse;
    };
  };

  export type OperationId = keyof Operations;

  export type PathParams<T extends OperationId> = 'pathParams' extends keyof Operations[T]
    ? Operations[T]['pathParams'] extends Record<string, string>
      ? Operations[T]['pathParams']
      : Record<string, string>
    : Record<string, string>;

  export type QueryParams<T extends OperationId> = 'queryParams' extends keyof Operations[T]
    ? Operations[T]['queryParams'] extends Record<string, string | number>
      ? Operations[T]['queryParams']
      : Record<string, string | number>
    : Record<string, string | number>;

  export type RequestBody<T extends OperationId> = 'requestBody' extends keyof Operations[T]
    ? Operations[T]['requestBody']
    : undefined;

  export type ResponseBody<T extends OperationId> = Operations[T]['responseBody'];
}
