import type { Agent, AgentCreateParams, AgentUpdateParams } from './resources/Agent';
import type { AgentConfig, AgentConfigUpdateParams } from './resources/AgentConfig';

export namespace AdminApi {
  export type Operations = {
    DeleteAgentsAgent: {
      pathParams: {
        agent_id: string;
      };
      requestBody: undefined;
      responseBody: Agent;
    };
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
    GetAgentsAgentConfig: {
      pathParams: {
        agent_id: string;
      };
      requestBody: undefined;
      responseBody: AgentConfig;
    };
    PostAgents: {
      pathParams: {};
      requestBody: AgentCreateParams;
      responseBody: Agent;
    };
    PostAgentsAgent: {
      pathParams: {
        agent_id: string;
      };
      requestBody: AgentUpdateParams;
      responseBody: Agent;
    };
    PostAgentsAgentActivate: {
      pathParams: {
        agent_id: string;
      };
      requestBody: undefined;
      responseBody: Agent;
    };
    PostAgentsAgentConfig: {
      pathParams: {
        agent_id: string;
      };
      requestBody: AgentConfigUpdateParams;
      responseBody: AgentConfig;
    };
    PostAgentsAgentDeactivate: {
      pathParams: {
        agent_id: string;
      };
      requestBody: undefined;
      responseBody: Agent;
    };
  };

  export type OperationId = keyof Operations;
  export type PathParams<T extends OperationId> = Operations[T]['pathParams'];
  export type RequestBody<T extends OperationId> = Operations[T]['requestBody'];
  export type ResponseBody<T extends OperationId> = Operations[T]['responseBody'];
}
