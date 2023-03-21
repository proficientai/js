import { Proficient } from '@proficient/client';
import { useCallback, useRef } from 'react';

type Params = {
  apiKey: string;
  userExternalId: string;
  userHmac?: string | (() => Promise<string>);
};

export function useApi(params: Params) {
  const { apiKey, userExternalId, userHmac } = params;
  const cachedHmacRef = useRef<undefined | string>(undefined);

  const getApi = useCallback(async () => {
    if (!cachedHmacRef.current) {
      cachedHmacRef.current = typeof userHmac === 'function' ? await userHmac() : userHmac;
    }
    return new Proficient({ apiKey, userExternalId, userHmac: cachedHmacRef.current });
  }, [apiKey, userExternalId, userHmac]);

  return { getApi };
}