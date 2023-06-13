export interface InputSectionProps {
  askButtonType: 'ask' | 'ask-again' | 'retry' | null;
  askButtonSpacing: number;
  height: number;
  onClickAsk: () => Promise<void>;
  onClickSend: () => Promise<void>;
  sendDisabled?: boolean;
  onInputChange: (text: string) => void;
  placeholder: string;
  sendOnEnter: boolean;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}
