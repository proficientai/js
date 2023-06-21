export interface InputSectionProps {
  agentInactive: boolean;
  askButtonType: 'ask' | 'ask-again' | 'retry' | null;
  onClickAsk: () => Promise<void>;
  onClickSend: () => Promise<void>;
  onChangeHeight?: (height: number) => void;
  sendDisabled?: boolean;
  onInputChange: (text: string) => void;
  placeholder: string;
  sendOnEnter: boolean;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}
