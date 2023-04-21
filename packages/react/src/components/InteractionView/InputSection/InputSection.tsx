/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useCallback } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { useKeyboardEnterEvent, useStyles, useTheme } from '../../../hooks';
import { darken } from '../../../styles';
import { SendMessageIcon } from '../../icons/SendMessageIcon';
import type { InputSectionProps } from './types';

export function InputSection({ onClickSend, onInputChange, placeholder, sendOnEnter, textAreaRef }: InputSectionProps) {
  const theme = useTheme();
  const { boxCss, inputCss } = useStyles();

  const handleSendClick = useCallback(async () => {
    if (document.activeElement === textAreaRef.current) {
      await onClickSend();
    }
  }, [textAreaRef, onClickSend]);

  useKeyboardEnterEvent(handleSendClick, !sendOnEnter);

  const textAreaCss = css`
    ${inputCss}
    resize: none;
    border: none;
  `;

  const containerCss = css`
    ${boxCss}
    background-color: ${darken(theme.colors.primaryBackground, 2)};
    border-top: 1px solid ${theme.colors.border};
    display: flex;
    flex-direction: column;
    color: ${theme.colors.primaryText};
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
          border-color: ${theme.colors.primaryBackground};

          &:focus-within {
            border-color: ${theme.colors.border};
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
              color: ${theme.colors.primaryText};
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
                background-color: ${darken(theme.colors.primary, 1)};
              }
              &:active {
                background-color: ${darken(theme.colors.primary, 2)};
              }
            `}>
            <SendMessageIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
