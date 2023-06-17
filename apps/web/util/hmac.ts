import axios from 'axios';

import type { ResponseBody } from '../pages/api/hmac';

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getHmac(userExternalId: string) {
  const { data: resBody } = await axiosInstance.post<ResponseBody>('/hmac', { userExternalId });
  if (!resBody.success) throw new Error(resBody.error.message);
  return resBody.data.hmac;
}
