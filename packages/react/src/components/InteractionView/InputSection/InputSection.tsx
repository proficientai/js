/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useCallback } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { useTheme } from '../../../context';
import { useKeyboardEnterEvent } from '../../../hooks';
import { boxCss, colors, darken, inputCss } from '../../../styles';
import { SendMessageIcon } from '../../icons/SendMessageIcon';
import type { InputSectionProps } from './types';

const textAreaCss = css`
  ${inputCss}
  resize: none;
  border: none;
`;

export function InputSection({ onClickSend, onInputChange, placeholder, sendOnEnter, textAreaRef }: InputSectionProps) {
  const theme = useTheme();

  const handleSendClick = useCallback(async () => {
    if (document.activeElement === textAreaRef.current) {
      await onClickSend();
    }
  }, [textAreaRef, onClickSend]);

  useKeyboardEnterEvent(handleSendClick, !sendOnEnter);

  const containerCss = css`
    ${boxCss}
    background-color: ${darken(theme.colors.background, 2)};
    border-top: 1px solid ${colors.gray[700]};
    display: flex;
    flex-direction: column;
    color: ${colors.gray[100]};
  `;

  return (
    <div css={containerCss}>
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
          css={textAreaCss}
          ref={textAreaRef}
          placeholder={placeholder}
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
          <button
            onClick={onClickSend}
            css={css`
              display: flex;
              justify-content: center;
              align-items: center;
              color: ${colors.gray[100]};
              background-color: ${theme.colors.primary};
              outline: none;
              border: none;
              cursor: pointer;
              padding-top: 6px;
              padding-bottom: 6px;
              padding-left: 8px;
              padding-right: 8px;
              border-radius: 6px;
              &:hover {
                background-color: ${colors.indigo[600]};
              }
              &:active {
                background-color: ${colors.indigo[700]};
              }
            `}>
            <SendMessageIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
