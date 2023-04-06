import { AgentView } from '@proficient/react';

import { USER_EXTERNAL_ID } from '../../context';

export default function AgentPage() {
  const userId = USER_EXTERNAL_ID; // Retrieve dynamically

  if (!process.env.NEXT_PUBLIC_PROFICIENT_KEY) {
    return <div>Missing Proficient API key</div>;
  }

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Example Client Application</h1>
      <AgentView
        apiKey={process.env.NEXT_PUBLIC_PROFICIENT_KEY}
        agentId="ag_BPH01G6Ser6FMGy0EhpvlEg3"
        userExternalId={userId}
      />
    </div>
  );
}
