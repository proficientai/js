import type { Agent } from './resources/Agent';
import type { Interaction, InteractionCreateParams } from './resources/Interaction';
import type { Message, MessageCreateParams, MessageResendParams, MessageSendResponse } from './resources/Message';

export namespace ClientApi {
  export type Operations = {
    GetAgents: {
      pathParams: {};
      queryParams: {};
      requestBody: undefined;
      responseBody: {
        data: Agent[];
      };
    };
    GetAgentsAgent: {
      pathParams: {
        agent_id: string;
      };
      queryParams: {};
      requestBody: undefined;
      responseBody: Agent;
    };
    GetInteractions: {
      pathParams: {};
      queryParams: {
        agent_id?: string;
        limit?: number;
        starting_after?: string;
      };
      requestBody: undefined;
      responseBody: {
        data: Interaction[];
        has_more: boolean;
      };
    };
    PostInteractions: {
      pathParams: {};
      queryParams: {};
      requestBody: InteractionCreateParams;
      responseBody: Interaction;
    };
    GetInteractionsInteraction: {
      pathParams: {
        interaction_id: string;
      };
      queryParams: {};
      requestBody: undefined;
      responseBody: Interaction;
    };
    DeleteInteractionsInteraction: {
      pathParams: {
        interaction_id: string;
      };
      queryParams: {};
      requestBody: undefined;
      responseBody: Interaction;
    };
    GetMessages: {
      pathParams: {};
      queryParams: {
        interaction_id: string;
        limit?: number;
        starting_after?: string;
      };
      requestBody: undefined;
      responseBody: {
        data: Message[];
        has_more: boolean;
      };
    };
    PostMessages: {
      pathParams: {};
      queryParams: {};
      requestBody: MessageCreateParams;
      responseBody: MessageSendResponse;
    };
    GetMessagesMessage: {
      pathParams: {
        message_id: string;
      };
      queryParams: {};
      requestBody: undefined;
      responseBody: Message;
    };
    PostMessagesMessage: {
      pathParams: {
        message_id: string;
      };
      queryParams: {};
      requestBody: MessageResendParams;
      responseBody: MessageSendResponse;
    };
  };

  export type OperationId = keyof Operations;
  export type PathParams<T extends OperationId> = Operations[T]['pathParams'];
  export type QueryParams<T extends OperationId> = Operations[T]['queryParams'];
  export type RequestBody<T extends OperationId> = Operations[T]['requestBody'];
  export type ResponseBody<T extends OperationId> = Operations[T]['responseBody'];
}
