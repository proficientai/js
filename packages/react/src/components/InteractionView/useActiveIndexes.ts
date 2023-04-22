import { useState } from 'react';

export function useActiveIndexes() {
  const [mapsByInteractionId, setMapsByInteractionId] = useState<Record<string, Map<number, number>>>({});

  function getActiveIndex(interactionId: string, depth: number) {
    const map = mapsByInteractionId[interactionId];
    return map?.get(depth) ?? 0;
  }

  function setActiveIndex(interactionId: string, depth: number, index: number) {
    setMapsByInteractionId((prev) => {
      const { [interactionId]: prevMap, ...rest } = prev;
      const next = prevMap ? new Map(prevMap) : new Map();
      next.set(depth, index);
      return { ...rest, [interactionId]: next };
    });
  }

  return { getActiveIndex, setActiveIndex };
}
