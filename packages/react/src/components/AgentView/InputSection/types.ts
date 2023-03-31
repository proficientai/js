export interface InputSectionProps {
  onClickSend: () => Promise<void>;
  onInputChange: (text: string) => void;
  placeholder: string;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}
