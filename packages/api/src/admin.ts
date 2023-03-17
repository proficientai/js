import type { Agent, AgentCreateParams, AgentUpdateParams } from './resources/Agent';
import type { AgentConfig, AgentConfigUpdateParams } from './resources/AgentConfig';

export namespace AdminApi {
  export type Operations = {
    DeleteAgentsAgent: {
      pathParams: {
        agent_id: string;
      };
      responseBody: Agent;
    };
    GetAgents: {
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
      responseBody: Agent;
    };
    GetAgentsAgentConfig: {
      pathParams: {
        agent_id: string;
      };
      responseBody: AgentConfig;
    };
    PostAgents: {
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
      responseBody: Agent;
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
