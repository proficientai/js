---
title: Introduction
description: Add a conversational AI agent to your app in 3 minutes
---

## What is Proficient AI?

Proficient AI is a platform that enables developers to add conversational AI agents to their apps
in minutes. Our interaction APIs and SDKs coupled with our powerful web dashboard are the simplest
way teams can add and operate <Tooltip tip="Large Language Model">LLM</Tooltip>-powered agents for their end-user applications.

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

## How it works

Here is a simple overview of the steps to get started:

1. Go to the [web dashboard](https://proficientai.com) and create an agent with the specified model
2. Customize the agent to your application's needs by editing its configuration
3. Add the prebuilt UI component to your app to connect it to the agent (3-5 lines of code)

Done! The agent appears in a chat window with a persistent conversation history and your users
are ready to interact with it, once you deploy.

<Frame type="simple">
  <img
    src="/images/interactionview-frame.png"
    style={{ width: "100%", padding: 10 }}
  />
</Frame>

<br />

<Tip>
  For more advanced features, you need to use the [API](#proficient-apis), which
  lets you connect your agents to all parts of your application.
</Tip>

## Demo

Here is a short demo video (2 min, 28 sec) that shows how you can add an AI agent to your React application.

<Note>
  This demo is from 7 Apr 2023. We've built a lot features since then and will
  add a new demo soon.
</Note>

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/tPFDtd_C5vI"
  title="Proficent AI Demo"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>

## What can I build with it?

Proficient agents are abstract virtual robots that can be used for various purposes. In your
application, you can present your agents in many forms such as:

- chatbots that know your business and respond to customer queries
- virtual tutors that teach your users a variety of subjects
- AI assistants that engage with your product's users

Basically, all types of applications that require an abstract AI entity to interact with their users can use a Proficient AI agent.

<Note>
  Reach out to us via [Discord](https://discord.gg/DVbwTM8erb) or
  [email](mailto:anar@proficientai.com) if you're not sure whether you can use a
  Proficient agent for your project. We'd be more than happy to help you.
</Note>

## Architecture

We can visualize the architecture of a typical application powered by Proficient AI with the following diagram.

<Frame type="simple" caption="System architecture visualization">
  <img src="/images/architecture.png" />
</Frame>

### Key takeaways

There are a few key things to note here:

<CardGroup cols={2}>

<Card title="Agents live in the Proficient cloud" icon="cloud" iconType="solid">
  Agents are virtual entitites that you operate through the Proficient AI
  platform.
</Card>

<Card
  title="Proficient connects to all parts of your application"
  icon="rectangle-terminal"
  iconType="solid"
>
  Although simple use cases may not even need a custom backend.
</Card>

<Card
  title="Agents can connect to various LLMs"
  icon="microchip"
  iconType="solid"
>
  Proficient is connected to many different models so you don't have to write
  your own integration.
</Card>

<Card
  title="Proficient stores interactions and user data"
  icon="database"
  iconType="solid"
>
  You can access your data at any time using the API or admin dashboard.
</Card>

</CardGroup>

## Proficient APIs

All operations on the Proficient platform are divided into two categories each of which is represented by
a standalone API.

### 1. Client API

The [Client API](/client-api) is designed for client applications that are allowed to access only
a subset of all available operations. For example, agents can't be configured from a client application. On
the other hand, an authenticated user sending a message to an agent can be implemented with the Client API.

<Card title="Client API Reference" icon="rectangle-terminal" href="/client-api">
  View all Client API endpoints and operations that you can carry out from your
  client applications.
</Card>

### 2. Admin API

The [Admin API](/admin-api) is used by backend applications. With admin-level
access, you can use this API to create, configure and delete agents, monitor interactions, update user data
and more.

<Card title="Admin API Reference" icon="rectangle-terminal" href="/client-api">
  View all Admin API endpoints and operations that you can carry out from
  privileged environments.
</Card>
