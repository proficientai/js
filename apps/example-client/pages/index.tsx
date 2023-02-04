import { InteractionView } from '@proficient/react-sdk';

const proficientApiKey = 'pk_USjnILHKBxXeJtiJ5WtAquoRb4IXjQTz1ScvRWTV6XduKxQ4at0YYxRpY28Ce0Qug6fkhm5R';
const agentId = 'ag_T2SW501k1RGk8ZUv2Kaz11Kh';
const userExternalId = 'user123';

export default function ExampleClient() {
  return (
    <div>
      <h1>Example Client</h1>
      <InteractionView apiKey={proficientApiKey} agentId={agentId} userExternalId={userExternalId} />
    </div>
  );
}
