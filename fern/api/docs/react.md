---
title: "React SDK"
icon: "react"
---

The React SDK for Proficient AI provides you with ready-to-use and customizable interfaces where your users
can interact with your agents. Internally, it uses the [JS Client SDK](/sdks/js-client) to connect to your
agents. The React SDK currently comes with one component named `InteractionView`, which can be themed
and customized to your application's needs.

<Frame type="simple">
  <img
    src="/images/interactionview-code.png"
    style={{
      width: "100%",
      maxWidth: 600,
      marginLeft: "auto",
      marginRight: "auto",
    }}
  />
</Frame>

## Installation

You can install the React SDK via [npm](https://www.npmjs.com/package/@proficient/react) or [Yarn](https://yarnpkg.com/package/@proficient/react).

<CodeGroup>

```bash npm
npm i -E @proficient/react
```

```bash yarn
yarn add -E @proficient/react
```

</CodeGroup>

<br />

<Snippet file="exact-version.mdx" />

## Quickstart

You can connect your application to Proficient AI in just a few minutes.

<Info>
  **Prerequisite:** Make sure you've created and activated an agent before
  proceeding further. See [creating my first agent](/#create-agent) for more
  details.
</Info>

<Tabs>
  <Tab title="Next.js">
Copy the publishable API key associated with your project from [Project Settings](https://proficientai.com/project-settings).
Add it as a `NEXT_PUBLIC_PROFICIENT_API_KEY` environment variable to your app.

<Tip>
  For details on how to add an environment variable to your Next.js app see the
  [official
  docs](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables).
</Tip>

Now add the `InteractionView` component to the page where you want your users to interact
with your agent.

```tsx
import { InteractionView } from "@proficient/react";

export default function App() {
  // Agent ID can be hardcoded or retrieved from the API
  const agentId = "ag_Lad8YCGGiDLiqIZPWRXmc2ix";
  // User external ID should be accessed dynamically
  const userExternalId = "gtLIK8ELsHTr0Fajg28Ud9eFpJJ3";
  return (
    <div>
      <InteractionView
        // Your publishable API key that starts with `pk_`
        apiKey={process.env.NEXT_PUBLIC_PROFICIENT_API_KEY}
        agentId={agentId}
        userExternalId={userExternalId}
      />
    </div>
  );
}
```

  </Tab>
  <Tab title="Other React">
Copy the publishable API key associated with your project from [Project Settings](https://proficientai.com/project-settings).
Add it as a `PROFICIENT_API_KEY` environment variable to your app.

<Tip>
  If you're not sure how to add an environment variable to your React app, check
  out [this
  page](https://www.architect.io/blog/2022-08-16/react-environment-variables-developers-guide/).
</Tip>

Now add the `InteractionView` component to the page where you want your users to interact
with your agent.

```tsx
import React from "react";
import { InteractionView } from "@proficient/react";

export default function App() {
  // Agent ID can be hardcoded or retrieved from the API
  const agentId = "ag_Lad8YCGGiDLiqIZPWRXmc2ix";
  // User external ID should be accessed dynamically
  const userExternalId = "gtLIK8ELsHTr0Fajg28Ud9eFpJJ3";
  return (
    <div>
      <InteractionView
        // Your publishable API key that starts with `pk_`
        apiKey={process.env.PROFICIENT_API_KEY}
        agentId={agentId}
        userExternalId={userExternalId}
      />
    </div>
  );
}
```

  </Tab>
</Tabs>

The `userExternalId` variable above simply refers to the unique ID of your user. For
more details see [User External ID](/concepts#external-id).

## `InteractionView`

A chat interface component that allows your users to interact with your Proficient AI agent.

<Frame type="simple">
  <img
    src="/images/interactionview-frame.png"
    style={{ width: "100%", padding: 10 }}
  />
</Frame>

<br />

<Note>
  This is currently the only component that the React SDK offers. [Let us
  know](https://discord.gg/DVbwTM8erb) if you need other types of components.
  We'd love to support your use case!
</Note>

### Props

<ResponseField name="apiKey" type="string" required>
  The publishable API key associated with your project. This can be found in the
  admin dashboard.
</ResponseField>

<ResponseField name="agentId" type="string" required>
  The unique ID of the agent. This can be found in the admin dashboard.
</ResponseField>

<ResponseField name="userExternalId" type="string" required>
  The unique ID of the user within your system. See [User External
  ID](/concepts/external-id) for more details.
</ResponseField>

<ResponseField name="userHmac" type="string | () => Promise<string>">
  Either the HMAC hash for the given user or a function that returns a Promise
  resolving to the HMAC hash. This is required if the project has HMAC
  authentication enabled. Internally, the component caches the HMAC hash so that
  it is not computed on every render. See [HMAC
  Authentication](/client-api/auth#hmac-authentication) for more details.
</ResponseField>

<ResponseField name="layout" type={`"casual" | "formal"`} default="casual">
  The type of the chat interface layout.

- `"casual"`: looks like iMessage/WhatsApp.
- `"formal"`: looks like ChatGPT.

</ResponseField>

<ResponseField name="chatSectionHeight" type="number" default={320}>
  Chat section height in pixels. Must be greater than or equal to 240.
</ResponseField>

<ResponseField name="headerSectionHeight" type="number" default={54}>
  Header section height in pixels. Must be greater than or equal to 54.
</ResponseField>

<ResponseField name="autoAsk" type="boolean" default={true}>
  If set to `true`, sending a message to the agent will automatically trigger an
  [Ask](/client-api/messages/ask) request and the agent will reply to the
  message. This is the intuitive option but if you disable it, users will be
  able to send multiple messages before asking for a reply.
</ResponseField>

<ResponseField name="sendOnEnter" type="boolean" default={true}>
  If set to `true`, pressing Enter will send the current text input as message.
</ResponseField>

<ResponseField
  name="inputPlaceholder"
  type="string"
  default="Type something..."
>
  The placeholder for the text area.
</ResponseField>

<ResponseField name="theme" type="ProficientTheme">
  The theme object including your brand colors. Can be created with the
  `createTheme(params)` factory function. See [custom themes](/#custom-themes)
  for more details.
</ResponseField>

## Custom themes

You can use a custom theme to preserve your brand identity and ensure that the component
interface matches the rest of your application.

Custom themes can be created with the `createTheme(params)` factory function which currently
takes three colors as parameters. We then dynamically compute the rest of the colors that
the component uses based on these three values.

```ts
import { createTheme } from "@proficient/react";

const theme = createTheme({
  colors: {
    background: "#1d1822",
    primary: "#9c0588",
    text: "#fff",
  },
});
```

Simply pass the theme object to the component as the `theme` prop.

```tsx
<InteractionView
  // ... other props
  theme={theme}
/>
```

<Tip>
  If you're not happy with the dynamically computed theme, you can create it
  yourself instead of using `createTheme(params)`. A theme is just a plain
  object that conforms to the
  [ProficientTheme](https://github.com/proficientai/js/blob/main/packages/react/src/context/theme.ts)
  interface so you can create it any way you want.
</Tip>

{/* TODO: Link to hmac auth. */}
