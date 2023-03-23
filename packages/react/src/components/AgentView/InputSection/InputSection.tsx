/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import TextareaAutosize from 'react-textarea-autosize';

import { colors } from '../../../styles';
import type { InputSectionProps } from './types';

export function InputSection({ onClickSend, onInputChange, placeholder, textAreaRef }: InputSectionProps) {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        border-top: 1px solid ${colors.gray[700]};
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 12px;
        padding-bottom: 12px;
        background-color: ${colors.gray[900]};
      `}>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          border: 1px solid gray;
          border-radius: 12px;
          overflow: hidden;
          border-color: ${colors.gray[700]};

          &:focus-within {
            border-color: ${colors.gray[500]};
          }
        `}>
        <TextareaAutosize
          ref={textAreaRef}
          placeholder={placeholder}
          css={css`
            background-color: transparent;
            resize: none;
            border: none;
            padding-top: 8px;
            padding-bottom: 8px;
            padding-left: 12px;
            padding-right: 12px;
            outline: 2px solid transparent;
            outline-offset: 2px;
            color: ${colors.gray[100]};
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
