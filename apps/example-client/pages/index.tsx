import { InteractionView } from '@proficient/react-sdk';
import axios from 'axios';

import type { ResponseBody } from './api/hmac';

const proficientApiKey = 'pk_7WLSTtyhR2owYkV1h9cbjEnINRBm5E3zGMtD3fJrZvC12mmOZlWnmN79I6OTx3QvNqiHKAfo';
const agentId = 'ag_z9bj5zBhycdUUbXuHLwTQJjt';
const userExternalId = 'user123';

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default function ExampleClient() {
  return (
    <div>
      <h1>Example Client</h1>
      <InteractionView
        apiKey={proficientApiKey}
        agentId={agentId}
        userExternalId={userExternalId}
        userHmac={async () => {
          const { data: resBody } = await axiosInstance.post<ResponseBody>('/hmac', { userId: userExternalId });
          console.log('Called hmac', Date.now());
          if (!resBody.success) throw new Error(resBody.error.message);
          return resBody.data.hmac;
        }}
      />
    </div>
  );
}
