import { useRef } from 'react';

export function useTextInputMap() {
  const map = useRef(new Map<string, string>());

  function get(id: string) {
    return map.current.get(id) ?? '';
  }

  function set(id: string, text: string) {
    if (text) {
      map.current.set(id, text);
    } else {
      map.current.delete(id);
    }
  }

  return { get, set };
}
