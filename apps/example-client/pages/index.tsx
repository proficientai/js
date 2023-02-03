import { InteractionView } from '@proficient/react-sdk';

export default function ExampleClient() {
  return (
    <div>
      <h1>Example Client</h1>
      <InteractionView apiKey="abc" userId="user123" />
    </div>
  );
}
