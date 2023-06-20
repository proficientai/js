import { InteractionView, createTheme } from '@proficient/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { USER_EXTERNAL_ID } from '../../context';
import { getHmac } from '../../util/hmac';

const lightTheme = createTheme({
  colors: {
    background: '#fefefe',
    primary: '#5f9822',
    text: '#333',
  },
});

const darkTheme = createTheme({
  colors: {
    // background: '#221e2b',
    // primary: '#6467F2',
    // text: '#fff',
  },
});

export default function AgentPage() {
  const router = useRouter();
  const agentId = router.query.agentId as string | undefined;
  const userId = USER_EXTERNAL_ID; // Retrieve dynamically
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isCasualLayout, setIsCasualLayout] = useState(true);

  if (!process.env.NEXT_PUBLIC_PROFICIENT_KEY) {
    return <div>Missing Proficient API key</div>;
  }

  if (!agentId) {
    return <div>Missing agent ID</div>;
  }

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Example Client Application</h1>
      <div style={{ marginBottom: 10 }}>
        <div>
          <input type="checkbox" checked={isDarkTheme} onChange={() => setIsDarkTheme((prev) => !prev)} />
          <label>
            <span>Dark</span>
          </label>
        </div>
        <div>
          <input type="checkbox" checked={isCasualLayout} onChange={() => setIsCasualLayout((prev) => !prev)} />
          <label>
            <span>Natural</span>
          </label>
        </div>
      </div>

      <InteractionView
        apiKey={process.env.NEXT_PUBLIC_PROFICIENT_KEY}
        agentId={agentId}
        userExternalId={userId}
        userHmac={() => getHmac(userId)}
        layout={isCasualLayout ? 'casual' : 'formal'}
        theme={isDarkTheme ? darkTheme : lightTheme}
      />
    </div>
  );
}
