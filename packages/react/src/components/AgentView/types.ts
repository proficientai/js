export interface AgentViewProps {
  apiKey: string;
  agentId: string;
  userExternalId: string;
  userHmac?: string | (() => Promise<string>);
  inputPlaceholder?: string;
}
