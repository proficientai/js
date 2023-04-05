import { AgentView } from '@proficient/react';
import { useRouter } from 'next/router';

import { USER_EXTERNAL_ID } from '../../context';
import { getHmac } from '../../util/hmac';

export default function AgentPage() {
  const router = useRouter();
  const agentId = router.query.agentId as string | undefined;

  if (!agentId) {
    return <div>Waiting for agent ID...</div>;
  }

  if (!process.env.NEXT_PUBLIC_PROFICIENT_API_KEY) {
    return <div>Missing Proficient API key</div>;
  }

  return (
    <AgentView
      apiKey={process.env.NEXT_PUBLIC_PROFICIENT_API_KEY}
      agentId={agentId}
      userExternalId={USER_EXTERNAL_ID}
      userHmac={() => getHmac(USER_EXTERNAL_ID)}
      autoRequestReply
      sendOnEnter
    />
  );
}
