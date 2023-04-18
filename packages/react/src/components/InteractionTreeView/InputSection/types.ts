export interface InputSectionProps {
  onClickSend: () => Promise<void>;
  onInputChange: (text: string) => void;
  placeholder: string;
  sendOnEnter: boolean;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}
