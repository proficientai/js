import type { MouseEventHandler } from 'react';

export interface InputSectionProps {
  onClickSend: MouseEventHandler<HTMLButtonElement>;
  onInputChange: (text: string) => void;
  placeholder: string;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}
