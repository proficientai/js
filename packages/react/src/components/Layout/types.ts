import type { ReactNode } from 'react';

export type LayoutVersion = 'sm' | 'lg';

export type LayoutChildrenArgs = {
  container: {
    width: number;
    height: number;
  };
};

export type LayoutChildren = (args: LayoutChildrenArgs) => ReactNode;

export interface LayoutProps {
  /**
   * Layout version
   */
  version: LayoutVersion;

  height: number;

  /**
   * Layout children
   */
  children: LayoutChildren | ReactNode;

  /**
   * Content for the header
   */
  headerContent?: JSX.Element | null;

  /**
   * Header height
   *
   * @defaultValue 54
   */
  headerHeight?: number;

  /**
   * Sidebar content
   */
  sidebarContent: JSX.Element;

  /**
   * The initial width of the sidebar
   *
   * @defaultValue 250
   */
  sidebarInitialWidth?: number;

  /**
   * The minimum width of the sidebar
   *
   * @defaultValue 200
   */
  sidebarMinWidth?: number;

  /**
   * The maximum width of the sidebar
   *
   * @defaultValue 350
   */
  sidebarMaxWidth?: number;

  /**
   * Since the sidebar cannot be resized in small mode, a fixed width is applied to the small version.
   *
   * @defaultValue 300
   */
  sidebarSmallVersionWidth?: number;

  /**
   * The width of the resizing area that contains the sidebar's right border
   *
   * @remarks
   * The larger this value the easier it is for the user to drag and resize the sidebar.
   *
   * @defaultValue 16
   */
  sidebarResizerWidth?: number;

  /**
   * Fires each time sidebar width changes.
   */
  onSidebarResize?: (newSidebarWidth: number) => void;

  /**
   * Fires each time sidebar width process finishes.
   */
  onSidebarResizeComplete?: (newSidebarWidth: number) => void | Promise<void>;
}
