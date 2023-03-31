export interface AgentViewProps {
  apiKey: string;
  agentId: string;
  userExternalId: string;
  userHmac?: string | (() => Promise<string>);
  /**
   * @defaultValue true
   */
  autoRequestReply?: boolean;
  /**
   * @defaultValue true
   */
  sendOnEnter?: boolean;
  /**
   * @defaultValue "Type something..."
   */
  inputPlaceholder?: string;
}
