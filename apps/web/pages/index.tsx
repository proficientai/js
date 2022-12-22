import { InteractionView } from "@proficient/react-sdk";

export default function Web() {
  return (
    <div>
      <h1>Web</h1>
      <InteractionView apiKey="abc" userId="user123" />
    </div>
  );
}
