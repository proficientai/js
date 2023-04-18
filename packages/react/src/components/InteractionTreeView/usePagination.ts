import { useRef, useState } from 'react';

export function usePagination() {
  const oldestItemId = useRef<string | null>(null);
  const lastAttemptedBatchId = useRef<null | string>(null);
  const [hasMore, setHasMore] = useState(true);

  function markAttempt() {
    lastAttemptedBatchId.current = oldestItemId.current;
  }

  function updateOldestItem(id: string | null, hasMoreItems: boolean) {
    oldestItemId.current = id;
    setHasMore(hasMoreItems);
  }

  return {
    markAttempt,
    lastAttemptId: lastAttemptedBatchId.current,
    oldestItemId: oldestItemId.current,
    updateOldestItem,
    hasMore,
  };
}
