import { ProficientClient, ProficientEnvironment } from '@proficient/client-internal';
import { useCallback, useRef } from 'react';

type Params = {
  apiKey: string;
  userExternalId: string;
  userHmac?: string | (() => Promise<string>);
  environment?: string;
};

export function useApi(params: Params) {
  const { apiKey, userExternalId, userHmac, environment = ProficientEnvironment.Production } = params;
  const cachedHmacRef = useRef<undefined | string>(undefined);

  const getApi = useCallback(async () => {
    if (!cachedHmacRef.current) {
      cachedHmacRef.current = typeof userHmac === 'function' ? await userHmac() : userHmac;
    }
    return new ProficientClient({
      environment,
      apiKey,
      userExternalId,
      userHmac: cachedHmacRef.current,
    });
  }, [apiKey, userExternalId, userHmac, environment]);

  return { getApi };
}
