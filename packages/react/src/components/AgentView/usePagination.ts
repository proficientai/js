import { useRef } from 'react';

export function usePagination() {
  const oldestItemId = useRef<string | null>(null);
  const lastAttemptedBatchId = useRef<null | string>(null);

  function markAttempt() {
    lastAttemptedBatchId.current = oldestItemId.current;
  }

  function updateOldestItem(id: string | null) {
    oldestItemId.current = id;
  }

  return {
    markAttempt,
    lastAttemptId: lastAttemptedBatchId.current,
    oldestItemId: oldestItemId.current,
    updateOldestItem,
  };
}
