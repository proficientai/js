/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

import { useStyles, useTheme } from '../../../hooks';
import { TertiaryButton } from '../../TertiaryButton';
import { InteractionIcon } from '../../icons/InteractionIcon';
import { TrashIcon } from '../../icons/TrashIcon';
import type { HeaderSectionProps } from './types';

export function HeaderSection({ onClickDelete, onTitleBlur, title: titleInitial }: HeaderSectionProps) {
  const theme = useTheme();
  const { boxCss, inputCss } = useStyles();
  const [title, setTitle] = useState(titleInitial);

  useEffect(() => {
    setTitle(titleInitial);
  }, [titleInitial]);

  const containerCss = css`
    ${boxCss}
    background-color: ${theme.colors.backgroundPrimary};
    border-bottom: 1px solid ${theme.colors.border};
    align-items: center;
    color: ${theme.colors.textPrimary};
  `;

  const titleInputCss = css`
    ${inputCss}
    margin-left: 8px;
    border: 1px solid ${theme.colors.border};
    border-radius: 8px;

    &:focus {
      border-color: ${theme.colors.borderActive};
    }
  `;

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

      <TertiaryButton onClick={onClickDelete} style={{ marginLeft: 'auto' }}>
        <TrashIcon />
      </TertiaryButton>
    </div>
  );
}
