/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import TextareaAutosize from 'react-textarea-autosize';

import type { InputSectionProps } from './types';

export function InputSection({ onClickSend, onInputChange, placeholder, textAreaRef }: InputSectionProps) {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        border-top: 1px solid gray;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 12px;
        padding-bottom: 12px;
      `}>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          border: 1px solid gray;
          border-radius: 6px;
          overflow: hidden;

          &:focus-within {
            border-color: blue;
          }
        `}>
        <TextareaAutosize
          ref={textAreaRef}
          placeholder={placeholder}
          css={css`
            resize: none;
            border: none;
            padding-top: 8px;
            padding-bottom: 8px;
            padding-left: 12px;
            padding-right: 12px;
            outline: 2px solid transparent;
            outline-offset: 2px;
          `}
          minRows={4}
          onChange={(e) => {
            const text = e.target.value;
            onInputChange(text);
          }}
        />
        <div
          css={css`
            display: flex;
            justify-content: end;
            padding-top: 8px;
            padding-bottom: 8px;
            padding-left: 12px;
            padding-right: 12px;
            cursor: text;
          `}
          onClick={() => {
            textAreaRef.current?.focus();
          }}>
          <button onClick={onClickSend}>{'> Send'}</button>
        </div>
      </div>
    </div>
  );
}
