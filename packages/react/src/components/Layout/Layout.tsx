/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import useSize from '@react-hook/size';
import { type FC, type MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';

import { useTheme } from '../../hooks';
import { TertiaryButton } from '../TertiaryButton';
import { MenuIcon } from '../icons/MenuIcon';
import type { LayoutProps } from './types';

export const Layout: FC<LayoutProps> = (props: LayoutProps) => {
  const theme = useTheme();
  const {
    version,
    height,
    children,
    headerContent = null,
    headerHeight = 54,
    sidebarContent,
    sidebarInitialWidth = 250,
    sidebarMinWidth = 200,
    sidebarMaxWidth = 400,
    sidebarSmallVersionWidth = 300,
    sidebarResizerWidth = 16,
    onSidebarResize,
    onSidebarResizeComplete = async () => {},
  } = props;
  const [sidebarWidth, setSidebarWidth] = useState(sidebarInitialWidth);
  const sidebarContainerRef = useRef<HTMLDivElement>(null);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const childrenContainerRef = useRef(null);
  const [childrenContainerWidth, childrenContainerHeight] = useSize(childrenContainerRef);
  const x0Ref = useRef<null | number>(null);
  const s0Ref = useRef<null | number>(null);
  const isLargeVersion = version === 'lg';
  const isSmallVersion = !isLargeVersion;
  const isResizingDisabled = isSmallVersion;
  const [showSidebar, setShowSidebar] = useState(isLargeVersion);

  const startResizingSidebar: MouseEventHandler<HTMLDivElement> = useCallback((mouseMoveEvent) => {
    if (!sidebarContainerRef.current) return;
    setIsResizingSidebar(true);
    x0Ref.current = mouseMoveEvent.clientX;
    s0Ref.current = sidebarContainerRef.current.getBoundingClientRect().right;
  }, []);

  const stopResizingSidebar = useCallback(async () => {
    if (!isResizingSidebar) return;
    setIsResizingSidebar(false);
    x0Ref.current = null;
    s0Ref.current = null;
    await onSidebarResizeComplete?.(sidebarWidth);
  }, [isResizingSidebar, onSidebarResizeComplete, sidebarWidth]);

  const resizeSidebar = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (sidebarContainerRef.current && x0Ref.current && s0Ref.current) {
        const x0 = x0Ref.current;
        const s0 = s0Ref.current;
        const x1 = mouseMoveEvent.clientX;
        const delta = x1 - x0;
        const cl = sidebarContainerRef.current.getBoundingClientRect().left;
        let w1 = s0 + delta - cl;
        if (w1 < sidebarMinWidth) {
          w1 = sidebarMinWidth;
        } else if (w1 > sidebarMaxWidth) {
          w1 = sidebarMaxWidth;
        }
        onSidebarResize?.(w1);
        setSidebarWidth(w1);
      }
    },
    [onSidebarResize, sidebarMinWidth, sidebarMaxWidth]
  );

  useEffect(() => {
    window.addEventListener('mousemove', resizeSidebar);
    window.addEventListener('mouseup', stopResizingSidebar);
    return () => {
      window.removeEventListener('mousemove', resizeSidebar);
      window.removeEventListener('mouseup', stopResizingSidebar);
    };
  }, [resizeSidebar, stopResizingSidebar]);

  const sidebarContainer = (
    <aside
      css={css`
        display: flex;
        position: relative;
        border-right: 1px solid ${theme.colors.border};
        background-color: ${theme.colors.backgroundSecondary};
        height: fit-content;
        width: fit-content;
        box-shadow: ${isSmallVersion ? `0 -10px 40px -12px ${theme.colors.shadow}` : undefined};
      `}
      aria-label="Sidebar">
      <div
        ref={sidebarContainerRef}
        css={css`
          display: flex;
          flex-direction: column;
          height: 100vh;
        `}
        style={{
          width: isSmallVersion ? sidebarSmallVersionWidth : sidebarWidth,
          minWidth: sidebarMinWidth,
          maxWidth: sidebarMaxWidth,
        }}>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            min-height: 0;
            flex-grow: 1;
          `}
          onMouseDown={(e) => e.preventDefault()}>
          <div
            css={css`
              min-height: 0;
              flex-grow: 1;
              overflow: auto;
            `}
            style={{ paddingRight: sidebarResizerWidth }}>
            {sidebarContent}
          </div>
        </div>
      </div>

      {/* Resizer */}
      <div
        css={css`
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          flex-grow: 1;
          cursor: ${!isResizingDisabled ? 'col-resize' : undefined};
        `}
        onMouseDown={(e) => {
          if (!isResizingDisabled) {
            startResizingSidebar(e);
          }
        }}
        style={{ width: sidebarResizerWidth }}
      />
    </aside>
  );

  const headerContainer = (
    <header
      css={css`
        background-color: ${theme.colors.backgroundPrimary};
        border-bottom: 1px solid ${theme.colors.border};
      `}>
      <div
        css={css`
          display: flex;
          width: 100%;
          align-items: center;
        `}
        style={{ height: headerHeight }}>
        {isSmallVersion && (
          <TertiaryButton
            onClick={(e) => {
              e.stopPropagation();
              setShowSidebar(true);
            }}
            style={{ marginLeft: 12 }}>
            <MenuIcon />
          </TertiaryButton>
        )}
        {headerContent}
      </div>
    </header>
  );

  const childrenContainer = (
    <div
      ref={childrenContainerRef}
      css={css`
        position: relative;
        min-height: 0;
        flex-grow: 1;
        overflow: hidden;
      `}>
      {typeof children === 'function'
        ? children({
            container: {
              width: childrenContainerWidth,
              height: childrenContainerHeight,
            },
          })
        : children}
    </div>
  );

  return (
    <div
      css={css`
        display: flex;
        position: relative;
        overflow: hidden;
        height: ${height}px;
        background-color: ${theme.colors.backgroundSecondary};
        pointer-events: ${isResizingSidebar ? 'none' : undefined};
      `}>
      {isSmallVersion ? (
        <div
          css={css`
            position: absolute;
            top: 0;
            left: 0;
            z-index: 10;
            height: 100%;
            transition-duration: 300ms;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transform: ${showSidebar ? 'translateX(0px)' : 'translateX(-100%)'};
          `}>
          {sidebarContainer}
        </div>
      ) : (
        sidebarContainer
      )}
      <div
        css={css`
          display: flex;
          flex-direction: column;
          width: 100%;
          height: ${isSmallVersion ? '100vh' : undefined};
        `}
        onClick={isSmallVersion ? () => setShowSidebar(false) : undefined}>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            min-height: 0;
            flex-grow: 1;
            pointer-events: ${isSmallVersion && showSidebar ? 'none' : undefined};
          `}>
          {headerContainer}
          {childrenContainer}
        </div>
      </div>
    </div>
  );
};
