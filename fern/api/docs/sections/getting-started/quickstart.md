# Quickstart

Welcome to Proficient AI, a platform designed to streamline the integration of conversational AI agents into your applications. Our APIs and SDKs enable developers to add powerful AI-driven chatbot features to their apps with ease, saving both time and effort.

## React SDK

Install the React SDK.

```
npm install @proficient/react
```

Add the UI component to your code.

```tsx
import { InteractionView } from '@proficient/react';

function MyPageComponent() {
  const agentId = 'ag_123';
  const userExternalId = 'user123'; // Get dynamically
  return (
    <div>
      <InteractionView
        apiKey={process.env.PROFICIENT_AI_PUBLISHABLE_KEY}
        agentId={agentId}
        userExternalId={userExternalId}
      />
      ;
    </div>
  );
}
```

Manage your agents from privileged environments.

```ts
import { ProficientClient } from '@proficient/admin';

const proficient = new ProficientClient({
  secretKey: 'sk_123', // Your secret key
});

const agentId = 'ag_123';

await proficient.agents.updateConfig(agentId, {
  model: 'anthropic.claude-v1-100k',
});
```
