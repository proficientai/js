import { type Proficient, ProficientClient, ProficientEnvironment } from '@proficient/client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { USER_EXTERNAL_ID } from '../context';
import { getHmac } from '../util/hmac';

export default function ExampleClient() {
  const [activeAgents, setActiveAgents] = useState<Proficient.Agent[]>([]);
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
    const apiKey = process.env.NEXT_PUBLIC_PROFICIENT_KEY;
    if (userHmac !== null && apiKey) {
      (async () => {
        const proficient = new ProficientClient({
          environment: ProficientEnvironment.Development,
          xProficientApiKey: apiKey,
          xProficientUserExternalId: USER_EXTERNAL_ID,
          xProficientUserHmac: userHmac,
        });
        const { data: agents } = await proficient.agents.list();
        console.log('RECEIVED AGENTS:', agents);
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
