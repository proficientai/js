import { InteractionView } from '@proficient/react-sdk';
import axios from 'axios';
import { useCallback, useEffect } from 'react';

import type { ResponseBody } from './api/hmac';

const proficientApiKey = 'pk_USjnILHKBxXeJtiJ5WtAquoRb4IXjQTz1ScvRWTV6XduKxQ4at0YYxRpY28Ce0Qug6fkhm5R';
const agentId = 'ag_T2SW501k1RGk8ZUv2Kaz11Kh';
const userExternalId = 'user123';

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default function ExampleClient() {
  const getUserHmac = useCallback(async () => {
    const { data: resBody } = await axiosInstance.post<ResponseBody>('/hmac', { userId: userExternalId });
    if (!resBody.success) throw new Error(resBody.error.message);
    return resBody.data.hmac;
  }, []);

  useEffect(() => {
    getUserHmac().then((hmac) => console.log(`hmac:`, hmac));
  }, [getUserHmac]);

  return (
    <div>
      <h1>Example Client</h1>
      <InteractionView apiKey={proficientApiKey} agentId={agentId} userExternalId={userExternalId} />
    </div>
  );
}
