import { type Agent, Proficient } from '@proficient/client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { USER_EXTERNAL_ID } from '../context';
import { getHmac } from '../util/hmac';

export default function ExampleClient() {
  const [activeAgents, setActiveAgents] = useState<Agent[]>([]);
  const [userHmac, setUserHmac] = useState<string | null>(null);

  // Get hmac
  useEffect(() => {
    (async () => {
      try {
        const hmac = await getHmac(USER_EXTERNAL_ID);
        setUserHmac(hmac);
      } catch {}
    })();
  }, []);

  // Load agents
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_PROFICIENT_API_KEY;
    if (userHmac !== null && apiKey) {
      (async () => {
        const proficient = new Proficient({
          apiKey,
          userExternalId: USER_EXTERNAL_ID,
          userHmac,
        });
        const agents = await proficient.agents.list();
        setActiveAgents(agents);
      })();
    }
  }, [userHmac]);

  if (userHmac === null) {
    return <div>Waiting for HMAC...</div>;
  }

  return (
    <div>
      <h1>Active Agents</h1>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {activeAgents.map((agent) => (
          <Link key={agent.id} href={`/agent/${agent.id}`}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 20,
                borderWidth: 1,
                borderColor: 'gray',
                padding: 10,
                backgroundColor: 'lightgray',
              }}>
              <span>{agent.name}</span>
              <span>{agent.id}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
