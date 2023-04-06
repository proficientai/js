import { AgentView } from '@proficient/react';

import { USER_EXTERNAL_ID } from '../../context';

export default function AgentPage() {
  const userId = USER_EXTERNAL_ID; // Retrieve dynamically

  if (!process.env.NEXT_PUBLIC_PROFICIENT_KEY) {
    return <div>Missing Proficient API key</div>;
  }

  return (
    <AgentView
      apiKey={process.env.NEXT_PUBLIC_PROFICIENT_KEY}
      agentId="ag_T7fDbhEtbhw4HJdV0rYY1mXg"
      userExternalId={userId}
    />
  );
}
