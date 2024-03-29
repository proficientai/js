import { useEffect } from 'react';

/**
 * Detects whether the 'Enter' key (without Shift) is pressed.
 */
export function useKeyboardEnterEvent(callback: () => void | Promise<void>, ignore?: boolean) {
  useEffect(() => {
    const handlePressEnter = (event: KeyboardEvent) => {
      if (!ignore && event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', handlePressEnter, false);

    return () => {
      document.removeEventListener('keydown', handlePressEnter, false);
    };
  }, [ignore, callback]);
}
