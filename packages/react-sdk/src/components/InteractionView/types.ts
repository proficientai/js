export interface InteractionViewProps {
  apiKey: string;
  agentId: string;
  interactionId: string;
  userExternalId: string;
  userHmac?: string | (() => Promise<string>);
  inputPlaceholder?: string;
  contentMaxLength?: number;
}
