/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useCallback } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { useKeyboardEnterEvent, useStyles, useTheme } from '../../../hooks';
import { PrimaryButton } from '../../PrimaryButton';
import { SecondaryButton } from '../../SecondaryButton';
import { BoltIcon } from '../../icons/BoltIcon';
import { RetryIcon } from '../../icons/RetryIcon';
import { SendMessageIcon } from '../../icons/SendMessageIcon';
import type { InputSectionProps } from './types';

export function InputSection({
  height,
  generateButtonType,
  askButtonSpacing,
  onClickGenerate,
  onClickSend,
  sendDisabled,
  onInputChange,
  placeholder,
  sendOnEnter,
  textAreaRef,
}: InputSectionProps) {
  const theme = useTheme();
  const { inputCss } = useStyles();

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
    display: flex;
    position: relative;
    border-top: 1px solid ${theme.colors.border};
    display: flex;
    flex-direction: column;
    color: ${theme.colors.textPrimary};
    height: ${height}px;
  `;

  return (
    <div css={containerCss}>
      <div
        css={css`
          position: absolute;
          left: 24px;
          right: 24px;
          top: ${-askButtonSpacing}px;
        `}>
        {generateButtonType && (
          <SecondaryButton
            onClick={onClickGenerate}
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              marginBottom: 10,
              boxShadow: `0 0 80px -12px ${theme.colors.shadow}`,
            }}>
            {generateButtonType === 'generate' ? <BoltIcon /> : <RetryIcon />}
            <span
              css={css`
                margin-left: 10px;
                white-space: nowrap;
                font-family: Inter, sans-serif;
                font-size: 13px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              `}>
              {generateButtonType === 'generate'
                ? 'Ask for a reply'
                : generateButtonType === 'regenerate'
                ? 'Ask again'
                : 'Retry'}
            </span>
          </SecondaryButton>
        )}

        <div
          css={css`
            display: flex;
            z-index: 1;
            flex-direction: column;
            border: 1px solid ${theme.colors.border};
            border-radius: 12px;
            box-shadow: 0 -10px 40px -12px ${theme.colors.shadow};
            border-color: ${theme.colors.border};
            overflow: hidden;

            &:focus-within {
              border-color: ${theme.colors.borderActive};
            }
          `}>
          <TextareaAutosize
            css={textAreaCss}
            ref={textAreaRef}
            placeholder={placeholder}
            minRows={3}
            maxRows={10}
            onChange={(e) => {
              const text = e.target.value;
              onInputChange(text);
            }}
          />
          <div
            css={css`
              background-color: ${theme.colors.backgroundPrimary};
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
            <PrimaryButton onClick={onClickSend} disabled={sendDisabled}>
              <SendMessageIcon />
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
