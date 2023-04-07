import { InteractionView } from '@proficient/react';

export default function AgentPage() {
  const userId = 'user123'; // Get dynamically

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Example Client Application</h1>
      <InteractionView
        apiKey="pk_CDJpojdyGEvsSMIv7Itn39ehEWRJBXuqZ0yK01T1epKfQtmm2bYg7bEbEsBAwJSKX7eFXa8D"
        agentId="ag_1euRNd9lkTujoROhgpAf6G4X"
        userExternalId={userId}
      />
    </div>
  );
}
