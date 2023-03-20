import { AgentView } from '@proficient/react-sdk';
import axios from 'axios';

import type { ResponseBody } from './api/hmac';

const proficientApiKey = 'pk_7WLSTtyhR2owYkV1h9cbjEnINRBm5E3zGMtD3fJrZvC12mmOZlWnmN79I6OTx3QvNqiHKAfo';
const agentId = 'ag_z9bj5zBhycdUUbXuHLwTQJjt';
const interactionId = 'int_WWEIc43nFNdQ5V1C6IaXKucoA7UNgKaqyig9';
const userExternalId = 'gtLIK8ELsHTr0Fajg28Ud9eFpJJ3';

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default function ExampleClient() {
  return (
    <AgentView
      apiKey={proficientApiKey}
      agentId={agentId}
      userExternalId={userExternalId}
      userHmac={async () => {
        const { data: resBody } = await axiosInstance.post<ResponseBody>('/hmac', { userId: userExternalId });
        if (!resBody.success) throw new Error(resBody.error.message);
        return resBody.data.hmac;
      }}
    />
  );
}
