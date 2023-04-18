/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

import { colors } from '../../../styles';
import { InteractionIcon } from '../../icons/InteractionIcon';
import { TrashIcon } from '../../icons/TrashIcon';
import type { HeaderSectionProps } from './types';

export function HeaderSection({ onClickDelete, onTitleBlur, title: titleInitial }: HeaderSectionProps) {
  const [title, setTitle] = useState(titleInitial);

  useEffect(() => {
    setTitle(titleInitial);
  }, [titleInitial]);

  return (
    <div
      css={css`
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid ${colors.gray[700]};
        background-color: ${colors.gray[800]};
        color: ${colors.gray[100]};
      `}>
      <InteractionIcon />
      <input
        type="text"
        css={css`
          background-color: transparent;
          margin-left: 8px;
          border: 1px solid transparent;
          border-radius: 8px;
          padding-top: 8px;
          padding-bottom: 8px;
          padding-left: 12px;
          padding-right: 12px;
          outline: 2px solid transparent;
          outline-offset: 2px;
          font-family: Inter, sans-serif;
          font-size: 14px;
          color: ${colors.gray[100]};

          &:focus {
            border-color: ${colors.gray[500]};
          }
        `}
        placeholder="New interaction"
        onBlur={(e) => onTitleBlur(e.currentTarget.value)}
        onChange={(e) => setTitle(e.currentTarget.value)}
        value={title}
        maxLength={50} // TODO: Make dynamic
      />

      <button
        onClick={onClickDelete}
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: auto;
          color: ${colors.gray[100]};
          background-color: ${colors.gray[800]};
          outline: none;
          border: none;
          cursor: pointer;
          padding-top: 6px;
          padding-bottom: 6px;
          padding-left: 8px;
          padding-right: 8px;
          border-radius: 6px;
          &:hover {
            background-color: ${colors.gray[700]};
          }
        `}>
        <TrashIcon />
      </button>
    </div>
  );
}
