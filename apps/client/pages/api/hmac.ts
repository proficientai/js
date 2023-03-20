import { createHmac } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';

const HMAC_SECRET = 'hsec_SVqkgDsWjVZzR3RnciwVAzyJuvhYAb6dBNENS1QvXAnuxrg0yfnxbuCfN2CnIWRsYLFRLJmD';

export type ResponseBody =
  | {
      success: true;
      data: {
        hmac: string;
      };
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
      };
    };

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseBody>) {
  if (req.method !== 'POST') {
    res.status(405).json({
      success: false,
      error: {
        code: 'bad-request',
        message: 'Only POST requests are accepted.',
      },
    });
    return;
  }
  const { userId } = req.body;
  if (typeof userId !== 'string') {
    res.status(400).json({
      success: false,
      error: {
        code: 'bad-request',
        message: `Must provide a valid user ID. Received ${userId}`,
      },
    });
    return;
  }
  const hmac = createHmac('sha256', HMAC_SECRET).update(userId).digest('base64');
  res.status(200).json({ success: true, data: { hmac } });
}