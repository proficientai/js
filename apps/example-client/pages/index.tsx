import { InteractionView } from '@proficient/react-sdk';
import axios from 'axios';
import { useCallback, useEffect } from 'react';

import type { ResponseBody } from './api/hmac';

const proficientApiKey = 'pk_XxB15Vucudjk72Z3EVqX8D6bj08WkWbHHQk7u1x4tibRdzFmWdkrdlDQTmAgXlOrisV4R1Vq';
const agentId = 'ag_IweXPEZsmL2tK1Z1WiIfmZoF';
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
