import type { Agent } from './resources/Agent';
import type { Interaction } from './resources/Interaction';
import type { Message, MessageCreateParams } from './resources/Message';

export namespace ClientApi {
  export type Operations = {
    GetAgents: {
      pathParams: {};
      queryParams: {};
      requestBody: undefined;
      responseBody: {
        // TODO: Should be an object of a known type
        data: Agent[];
        has_more: boolean;
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
    GetAgentsAgentInteractions: {
      pathParams: {
        agent_id: string;
      };
      queryParams: {};
      requestBody: undefined;
      responseBody: {
        // TODO: Should be an object of a known type
        data: Interaction[];
        has_more: boolean;
      };
    };
    PostAgentsAgentInteractionsMessage: {
      pathParams: {
        agent_id: string;
      };
      queryParams: {};
      requestBody: MessageCreateParams;
      responseBody: Message;
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
    GetInteractionsInteractionMessages: {
      pathParams: {
        interaction_id: string;
      };
      queryParams: {
        limit?: number;
        starting_after?: string;
      };
      requestBody: undefined;
      responseBody: {
        // TODO: Should be an object of a known type
        data: Message[];
        has_more: boolean;
      };
    };
    GetInteractions: {
      pathParams: {};
      queryParams: {};
      requestBody: undefined;
      responseBody: {
        // TODO: Should be an object of a known type
        data: Interaction[];
        has_more: boolean;
      };
    };
    GetMessagesMessage: {
      pathParams: {
        message_id: string;
      };
      queryParams: {};
      requestBody: undefined;
      responseBody: Message;
    };
    PostMessagesMessageReply: {
      pathParams: {
        message_id: string;
      };
      queryParams: {};
      requestBody: MessageCreateParams;
      responseBody: Message;
    };
  };

  export type OperationId = keyof Operations;
  export type PathParams<T extends OperationId> = Operations[T]['pathParams'];
  export type QueryParams<T extends OperationId> = Operations[T]['queryParams'];
  export type RequestBody<T extends OperationId> = Operations[T]['requestBody'];
  export type ResponseBody<T extends OperationId> = Operations[T]['responseBody'];
}
