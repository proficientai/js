import { InteractionTreeView } from '@proficient/react';
import { useRouter } from 'next/router';

import { USER_EXTERNAL_ID } from '../../context';
import { getHmac } from '../../util/hmac';

export default function AgentPage() {
  const router = useRouter();
  const agentId = router.query.agentId as string | undefined;
  const userId = USER_EXTERNAL_ID; // Retrieve dynamically

  if (!process.env.NEXT_PUBLIC_PROFICIENT_KEY) {
    return <div>Missing Proficient API key</div>;
  }

  if (!agentId) {
    return <div>Missing agent ID</div>;
  }

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Example Client Application</h1>
      <InteractionTreeView
        apiKey={process.env.NEXT_PUBLIC_PROFICIENT_KEY}
        agentId={agentId}
        userExternalId={userId}
        userHmac={() => getHmac(userId)}
      />
    </div>
  );
}
