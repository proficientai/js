export interface InputSectionProps {
  height: number;
  onClickSend: () => Promise<void>;
  sendDisabled?: boolean;
  onInputChange: (text: string) => void;
  placeholder: string;
  sendOnEnter: boolean;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}
