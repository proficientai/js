export interface InteractionViewProps {
  apiKey: string;
  agentId: string;
  userExternalId: string;
  userHmac?: string;
  inputPlaceholder?: string;
  contentMaxLength?: number;
}
