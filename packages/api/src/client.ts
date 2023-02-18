import type { Agent } from './resources/Agent';
import type { Interaction } from './resources/Interaction';
import type { Message } from './resources/Message';

export namespace ClientApi {
  export type Operations = {
    GetAgents: {
      pathParams: {};
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
      requestBody: undefined;
      responseBody: Agent;
    };
    GetAgentsAgentInteractions: {
      pathParams: {
        agent_id: string;
      };
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
      requestBody: undefined;
      responseBody: Message;
    };
    GetInteractionsInteraction: {
      pathParams: {
        interaction_id: string;
      };
      requestBody: undefined;
      responseBody: Interaction;
    };
    DeleteInteractionsInteraction: {
      pathParams: {
        interaction_id: string;
      };
      requestBody: undefined;
      responseBody: Interaction;
    };
  };

  export type OperationId = keyof Operations;
  export type PathParams<T extends OperationId> = Operations[T]['pathParams'];
  export type RequestBody<T extends OperationId> = Operations[T]['requestBody'];
  export type ResponseBody<T extends OperationId> = Operations[T]['responseBody'];
}
