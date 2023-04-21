/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

import { boxCss, colors, inputCss, secondaryButtonCss } from '../../../styles';
import { InteractionIcon } from '../../icons/InteractionIcon';
import { TrashIcon } from '../../icons/TrashIcon';
import type { HeaderSectionProps } from './types';

const containerCss = css`
  ${boxCss}
  background-color: ${colors.gray[800]};
  border-bottom: 1px solid ${colors.gray[700]};
  align-items: center;
  color: ${colors.gray[100]};
`;

const trashButtonCss = css`
  ${secondaryButtonCss}
  margin-left: auto;
`;

const titleInputCss = css`
  ${inputCss}
  margin-left: 8px;
  border: 1px solid transparent;
  border-radius: 8px;
  &:focus {
    border-color: ${colors.gray[500]};
  }
`;

export function HeaderSection({ onClickDelete, onTitleBlur, title: titleInitial }: HeaderSectionProps) {
  const [title, setTitle] = useState(titleInitial);

  useEffect(() => {
    setTitle(titleInitial);
  }, [titleInitial]);

  return (
    <div css={containerCss}>
      <InteractionIcon />
      <input
        type="text"
        css={titleInputCss}
        placeholder="New interaction"
        onBlur={(e) => onTitleBlur(e.currentTarget.value)}
        onChange={(e) => setTitle(e.currentTarget.value)}
        value={title}
        maxLength={50} // TODO: Make dynamic
      />

      <button onClick={onClickDelete} css={trashButtonCss}>
        <TrashIcon />
      </button>
    </div>
  );
}
