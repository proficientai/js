export interface InputSectionProps {
  generateButtonType: 'generate' | 'retry' | 'regenerate' | null;
  askButtonSpacing: number;
  height: number;
  onClickGenerate: () => Promise<void>;
  onClickSend: () => Promise<void>;
  sendDisabled?: boolean;
  onInputChange: (text: string) => void;
  placeholder: string;
  sendOnEnter: boolean;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}
